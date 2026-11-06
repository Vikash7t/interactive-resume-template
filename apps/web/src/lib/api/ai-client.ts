import {
  type BulletEnhanceRequest,
  type BulletEnhanceResponse,
  BulletEnhanceResponseSchema,
} from '@resucraft/shared';

/**
 * Sends a bullet point to the NestJS AI Gateway for executive enhancement.
 * If backend is unreachable or offline, falls back gracefully without breaking the UI.
 */
export async function requestBulletEnhancement(
  req: BulletEnhanceRequest,
): Promise<BulletEnhanceResponse> {
  try {
    const res = await fetch('/api/ai/enhance-bullet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`AI Gateway responded with status: ${res.status}`);
    }

    const data = await res.json();
    return BulletEnhanceResponseSchema.parse(data);
  } catch (err: any) {
    console.warn('API Gateway call failed, falling back to local optimizer:', err.message);

    // Client-side instant fallback if backend is unreachable
    const cleanBullet = req.bullet.replace(/^[-•*]\s*/, '').trim();
    const hasNumbers = /\d+/.test(cleanBullet);

    return {
      original: req.bullet,
      options: [
        {
          style: 'action_impact',
          text: `Engineered and scaled ${cleanBullet.toLowerCase()}${hasNumbers ? '' : ' delivering a [X%] improvement in system performance'}.`,
          rationale: 'Upgraded opening verb to emphasize engineering initiative and operational impact.',
          missingMetricPrompt: hasNumbers
            ? undefined
            : 'What measurable impact was achieved? Replace [X%] with your real number.',
        },
        {
          style: 'technical_depth',
          text: `Spearheaded architectural implementation of: ${cleanBullet.toLowerCase()}, ensuring robust fault-tolerance.`,
          rationale: 'Highlights technical ownership and architectural precision.',
        },
        {
          style: 'concise',
          text: `Implemented ${cleanBullet.toLowerCase()}.`,
          rationale: 'High-signal, concise phrasing optimized for fast recruiter scanning.',
        },
      ],
      provider: 'client-fallback-rules',
      disclaimer: 'Generated via client-side offline optimizer.',
    };
  }
}
