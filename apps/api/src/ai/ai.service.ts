import { Injectable, Logger } from '@nestjs/common';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import type { EnhanceBulletDto } from './dto/enhance-bullet.dto';
import type { BulletEnhanceResponse, EnhancedBulletOption } from '@resucraft/shared';

const AI_OPTIONS_SCHEMA = z.object({
  options: z
    .array(
      z.object({
        text: z.string().describe('The rewritten, high-impact resume bullet point'),
        style: z
          .enum(['action_impact', 'technical_depth', 'concise'])
          .describe('The stylistic archetype of this variation'),
        rationale: z
          .string()
          .describe('Plain explanation of why this phrasing improves ATS and recruiter readability'),
        missingMetricPrompt: z
          .string()
          .optional()
          .describe('Prompt asking the user for actual metrics if a placeholder like [X%] was used'),
      }),
    )
    .min(1)
    .max(3),
});

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  /**
   * Enhances a single resume bullet point using Vercel AI SDK & Google Gemini,
   * falling back to a deterministic rule-based engine when no API key is present.
   */
  async enhanceBullet(dto: EnhanceBulletDto): Promise<BulletEnhanceResponse> {
    const effectiveApiKey = dto.apiKey || process.env.GEMINI_API_KEY;

    if (effectiveApiKey && effectiveApiKey.trim().length > 10) {
      try {
        return await this.callGeminiAssistant(dto, effectiveApiKey.trim());
      } catch (err: any) {
        this.logger.warn(
          `Gemini API call failed (${err.message}). Seamlessly engaging deterministic rule-based optimizer.`,
        );
        return this.generateDeterministicEnhancements(dto);
      }
    }

    // Deterministic fallback: works 100% offline with zero external API key
    return this.generateDeterministicEnhancements(dto);
  }

  /**
   * Real LLM execution via Vercel AI SDK with strict anti-hallucination guardrails.
   */
  private async callGeminiAssistant(
    dto: EnhanceBulletDto,
    apiKey: string,
  ): Promise<BulletEnhanceResponse> {
    const google = createGoogleGenerativeAI({ apiKey });
    // Use fast, cost-efficient Gemini flash model
    const model = google('gemini-1.5-flash');

    const systemPrompt = `You are an elite Principal Software Engineering Resume Coach and ATS Specialist.
Your mission is to upgrade candidate bullet points to executive-level standard.

CRITICAL ETHICAL & SAFETY RULES:
1. NEVER INVENT METRICS, NUMBERS, OR PERCENTAGES.
2. If the original bullet lacks a quantified metric, use a bracketed placeholder like "[X%]" or "[N ms]" and ask the user for the real number in "missingMetricPrompt".
3. NEVER INVENT TECHNOLOGIES OR RESPONSIBILITIES not mentioned in the candidate's input.
4. Begin every bullet with a strong past-tense action verb (e.g., "Architected", "Engineered", "Orchestrated", "Implemented", "Streamlined").
5. Provide exactly 3 distinct stylistic variations:
   - "action_impact": Emphasizes business or operational result.
   - "technical_depth": Highlights architecture, patterns, or tools mentioned.
   - "concise": Punchy, high-signal, direct ATS bullet.`;

    const userPrompt = `Candidate Role: ${dto.roleTitle || 'Software Engineer'}
Company: ${dto.company || 'Technology Company'}
Target Job Description: ${dto.targetJobDescription || 'N/A'}

Original Bullet:
"${dto.bullet}"

Rewrite this bullet into 3 high-impact variations complying strictly with the safety rules.`;

    const result: any = await (generateObject as any)({
      model,
      schema: AI_OPTIONS_SCHEMA,
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.2, // Low temperature for high factual precision
    });

    return {
      original: dto.bullet,
      options: result.object.options,
      provider: 'gemini-1.5-flash',
      disclaimer:
        'AI bullet enhancements are suggestions. Always verify all technical details and replace any placeholders with your genuine achievements.',
    };
  }

  /**
   * Deterministic Rule-Based Optimizer.
   * Runs locally with zero latency, upgrading passive verbs to active engineering verbs.
   */
  private generateDeterministicEnhancements(dto: EnhanceBulletDto): BulletEnhanceResponse {
    const raw = dto.bullet.trim();

    // Clean leading dashes or bullets
    const cleanBullet = raw.replace(/^[-•*]\s*/, '').trim();

    // Detect weak passive openers
    const weakVerbsMap: Record<string, string> = {
      'worked on': 'Engineered and optimized',
      'helped with': 'Collaborated on architecting',
      'helped to': 'Spearheaded the development of',
      'responsible for': 'Directed the delivery of',
      'managed to': 'Orchestrated the execution of',
      'assisted with': 'Contributed to engineering',
      'did': 'Implemented and tested',
      'handled': 'Architected and scaled',
    };

    let upgradedAction = cleanBullet;
    let foundWeakOpener = false;

    for (const [weak, strong] of Object.entries(weakVerbsMap)) {
      const regex = new RegExp(`^${weak}\\b`, 'i');
      if (regex.test(cleanBullet)) {
        upgradedAction = cleanBullet.replace(regex, strong);
        foundWeakOpener = true;
        break;
      }
    }

    if (!foundWeakOpener) {
      // If starts with another verb, ensure capitalized
      upgradedAction = cleanBullet.charAt(0).toUpperCase() + cleanBullet.slice(1);
    }

    // Check if bullet has existing numbers
    const hasNumbers = /\d+/.test(cleanBullet);
    const metricPlaceholder = hasNumbers ? '' : ' yielding a [X%] improvement in system performance';

    const options: EnhancedBulletOption[] = [
      {
        style: 'action_impact',
        text: `${upgradedAction}${hasNumbers ? '' : metricPlaceholder}.`,
        rationale:
          'Transforms passive phrasing into strong action verbs highlighting operational impact.',
        missingMetricPrompt: hasNumbers
          ? undefined
          : 'What measurable outcome or performance gain did this achieve? Replace [X%] with your real number.',
      },
      {
        style: 'technical_depth',
        text: `Engineered scalable solutions by executing: ${cleanBullet.toLowerCase()}${hasNumbers ? '' : ', sustaining high reliability and test coverage'}.`,
        rationale:
          'Emphasizes technical rigor, architectural reliability, and engineering discipline.',
      },
      {
        style: 'concise',
        text: `${upgradedAction.replace(/\b(in order to|with the goal of)\b/gi, 'to')}.`,
        rationale:
          'Removes filler phrasing to produce a high-signal, direct ATS-friendly bullet point.',
      },
    ];

    return {
      original: dto.bullet,
      options,
      provider: 'deterministic-rules-engine',
      disclaimer:
        'Generated via deterministic rule-based bullet optimizer. No external AI API key configured.',
    };
  }
}
