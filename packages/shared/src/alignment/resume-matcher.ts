import type { ResumeData } from '../schemas/resume.schema';
import { extractNgrams, normalizeText } from './text-normalizer';
import { SKILL_DEFINITIONS } from './skill-dictionary';
import type {
  ExtractedSkill,
  MatchedSkill,
  MissingSkill,
  ResumeSectionKey,
  SectionCoverage,
} from './types';

interface SectionCorpus {
  sectionKey: ResumeSectionKey;
  label: string;
  rawText: string;
  ngrams: Set<string>;
}

const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: 'Professional Summary',
  skills: 'Technical Skills',
  work: 'Work Experience',
  projects: 'Engineering Projects',
  education: 'Education',
  certificates: 'Certifications',
};

/**
 * Deconstructs resume data into isolated, indexed sections for granular attribution.
 */
function buildResumeCorpora(resume: ResumeData): SectionCorpus[] {
  const corpora: SectionCorpus[] = [];

  // 1. Summary
  const summaryText = resume.basics.summary || '';
  corpora.push({
    sectionKey: 'summary',
    label: SECTION_LABELS.summary,
    rawText: summaryText,
    ngrams: extractNgrams(summaryText),
  });

  // 2. Technical Skills
  const skillsText = (resume.skills || [])
    .map((s) => `${s.name || ''} ${(s.keywords || []).join(' ')}`)
    .join(' ');
  corpora.push({
    sectionKey: 'skills',
    label: SECTION_LABELS.skills,
    rawText: skillsText,
    ngrams: extractNgrams(skillsText),
  });

  // 3. Work Experience
  const workText = (resume.work || [])
    .map((w) => `${w.position || ''} ${w.name || ''} ${w.summary || ''} ${(w.highlights || []).join(' ')}`)
    .join(' ');
  corpora.push({
    sectionKey: 'work',
    label: SECTION_LABELS.work,
    rawText: workText,
    ngrams: extractNgrams(workText),
  });

  // 4. Projects
  const projectsText = (resume.projects || [])
    .map((p) => `${p.name || ''} ${p.description || ''} ${(p.keywords || []).join(' ')} ${(p.highlights || []).join(' ')}`)
    .join(' ');
  corpora.push({
    sectionKey: 'projects',
    label: SECTION_LABELS.projects,
    rawText: projectsText,
    ngrams: extractNgrams(projectsText),
  });

  // 5. Education
  const educationText = (resume.education || [])
    .map((e) => `${e.institution || ''} ${e.area || ''} ${e.studyType || ''} ${(e.courses || []).join(' ')}`)
    .join(' ');
  corpora.push({
    sectionKey: 'education',
    label: SECTION_LABELS.education,
    rawText: educationText,
    ngrams: extractNgrams(educationText),
  });

  // 6. Certifications
  const certsText = (resume.certificates || [])
    .map((c) => `${c.name || ''} ${c.issuer || ''}`)
    .join(' ');
  corpora.push({
    sectionKey: 'certificates',
    label: SECTION_LABELS.certificates,
    rawText: certsText,
    ngrams: extractNgrams(certsText),
  });

  return corpora;
}

/**
 * Matches target JD skills against structured resume sections.
 */
export function matchSkillsAgainstResume(
  targetSkills: ExtractedSkill[],
  resume: ResumeData,
): {
  matched: MatchedSkill[];
  missing: MissingSkill[];
  sectionCoverage: SectionCoverage[];
} {
  const corpora = buildResumeCorpora(resume);
  const matched: MatchedSkill[] = [];
  const missing: MissingSkill[] = [];

  const sectionCoverageMap = new Map<ResumeSectionKey, { count: number; skills: Set<string> }>();
  for (const c of corpora) {
    sectionCoverageMap.set(c.sectionKey, { count: 0, skills: new Set() });
  }

  for (const target of targetSkills) {
    const skillDef = SKILL_DEFINITIONS.find((s) => s.canonical === target.canonical);
    const targetCanonical = target.canonical.toLowerCase();
    const targetNameNorm = normalizeText(target.name);

    const matchedSections: ResumeSectionKey[] = [];
    let isExactMatch = false;
    let matchedAlias: string | undefined = undefined;

    for (const corpus of corpora) {
      // 1. Check exact canonical or display name
      if (corpus.ngrams.has(targetCanonical) || corpus.ngrams.has(targetNameNorm)) {
        matchedSections.push(corpus.sectionKey);
        isExactMatch = true;
        sectionCoverageMap.get(corpus.sectionKey)?.skills.add(target.name);
        continue;
      }

      // 2. Check registered aliases/synonyms
      if (skillDef) {
        for (const alias of skillDef.aliases) {
          const aliasNorm = normalizeText(alias);
          if (corpus.ngrams.has(aliasNorm)) {
            matchedSections.push(corpus.sectionKey);
            if (!isExactMatch) {
              matchedAlias = alias;
            }
            sectionCoverageMap.get(corpus.sectionKey)?.skills.add(target.name);
            break;
          }
        }
      }
    }

    if (matchedSections.length > 0) {
      matched.push({
        skill: target.name,
        canonical: target.canonical,
        priority: target.priority,
        matchType: isExactMatch ? 'exact' : 'synonym',
        matchedInSections: Array.from(new Set(matchedSections)),
        aliasMatched: isExactMatch ? undefined : matchedAlias,
      });
    } else {
      missing.push({
        skill: target.name,
        canonical: target.canonical,
        priority: target.priority,
        category: target.category,
      });
    }
  }

  const sectionCoverage: SectionCoverage[] = corpora.map((c) => {
    const entry = sectionCoverageMap.get(c.sectionKey);
    return {
      section: c.sectionKey,
      label: c.label,
      matchCount: entry?.skills.size || 0,
      skills: Array.from(entry?.skills || []),
    };
  });

  return { matched, missing, sectionCoverage };
}
