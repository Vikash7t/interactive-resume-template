import { extractNgrams } from './text-normalizer';
import { ALIAS_LOOKUP_MAP } from './skill-dictionary';
import type { ExtractedSkill, ParsedJobDescription, RequirementPriority } from './types';

interface SectionSegment {
  priority: RequirementPriority;
  text: string;
}

const REQUIRED_HEADER_REGEX = /(?:requirements|minimum qualifications|basic qualifications|must have|what you(?:'ll)? need|what you bring|required experience|qualifications)\b/i;
const PREFERRED_HEADER_REGEX = /(?:preferred qualifications|nice to have|bonus points?|what sets you apart|desired skills|preferred experience|bonus)\b/i;

/**
 * Deterministically splits JD text into required vs preferred segments based on standard headers.
 */
function segmentJobDescription(rawText: string): SectionSegment[] {
  const lines = rawText.split(/\r?\n/);
  const segments: SectionSegment[] = [];

  let currentPriority: RequirementPriority = 'required'; // default section priority
  let currentBuffer: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line represents a section header (short line or bold/colon marker)
    const isShortHeader = trimmed.length < 80;

    if (isShortHeader && PREFERRED_HEADER_REGEX.test(trimmed)) {
      if (currentBuffer.length > 0) {
        segments.push({ priority: currentPriority, text: currentBuffer.join('\n') });
        currentBuffer = [];
      }
      currentPriority = 'preferred';
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1 && colonIdx < trimmed.length - 1) {
        const afterColon = trimmed.slice(colonIdx + 1).trim();
        if (afterColon) currentBuffer.push(afterColon);
      }
      continue;
    } else if (isShortHeader && REQUIRED_HEADER_REGEX.test(trimmed)) {
      if (currentBuffer.length > 0) {
        segments.push({ priority: currentPriority, text: currentBuffer.join('\n') });
        currentBuffer = [];
      }
      currentPriority = 'required';
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1 && colonIdx < trimmed.length - 1) {
        const afterColon = trimmed.slice(colonIdx + 1).trim();
        if (afterColon) currentBuffer.push(afterColon);
      }
      continue;
    }

    currentBuffer.push(trimmed);
  }

  if (currentBuffer.length > 0) {
    segments.push({ priority: currentPriority, text: currentBuffer.join('\n') });
  }

  return segments;
}

/**
 * Extracts candidate job title from early lines of JD if present.
 */
function extractJobTitle(rawText: string): string | undefined {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0 && lines[0].length < 70) {
    return lines[0];
  }
  return undefined;
}

/**
 * Parses and extracts skills from a target Job Description.
 * Classifies skills into required vs preferred without any external AI call.
 */
export function parseJobDescription(rawText: string): ParsedJobDescription {
  const segments = segmentJobDescription(rawText);
  const title = extractJobTitle(rawText);

  const requiredSkillMap = new Map<string, ExtractedSkill>();
  const preferredSkillMap = new Map<string, ExtractedSkill>();

  for (const segment of segments) {
    const ngrams = extractNgrams(segment.text);

    for (const ngram of ngrams) {
      const match = ALIAS_LOOKUP_MAP.get(ngram);
      if (match) {
        const canonicalKey = match.canonical;

        if (segment.priority === 'required') {
          // If already in preferred, elevate to required
          preferredSkillMap.delete(canonicalKey);
          if (!requiredSkillMap.has(canonicalKey)) {
            requiredSkillMap.set(canonicalKey, {
              name: match.name,
              canonical: match.canonical,
              priority: 'required',
              category: match.category,
            });
          }
        } else {
          // Only add to preferred if not already marked as required
          if (!requiredSkillMap.has(canonicalKey) && !preferredSkillMap.has(canonicalKey)) {
            preferredSkillMap.set(canonicalKey, {
              name: match.name,
              canonical: match.canonical,
              priority: 'preferred',
              category: match.category,
            });
          }
        }
      }
    }
  }

  const requiredSkills = Array.from(requiredSkillMap.values());
  const preferredSkills = Array.from(preferredSkillMap.values());

  return {
    rawText,
    title,
    requiredSkills,
    preferredSkills,
    totalRequirements: requiredSkills.length + preferredSkills.length,
  };
}
