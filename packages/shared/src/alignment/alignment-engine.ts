import type { ResumeData } from '../schemas/resume.schema';
import { parseJobDescription } from './jd-parser';
import { matchSkillsAgainstResume } from './resume-matcher';
import type {
  AlignmentSuggestion,
  JobAlignmentResult,
  JobAlignmentScoreBreakdown,
  MatchedSkill,
  MissingSkill,
} from './types';

/**
 * Computes deterministic alignment score with full mathematical transparency.
 */
function calculateScoreBreakdown(
  matched: MatchedSkill[],
  missing: MissingSkill[],
  totalRequired: number,
  totalPreferred: number,
): JobAlignmentScoreBreakdown {
  const matchedRequired = matched.filter((m) => m.priority === 'required').length;
  const matchedPreferred = matched.filter((m) => m.priority === 'preferred').length;

  const requiredScore = totalRequired > 0 ? Math.round((matchedRequired / totalRequired) * 100) : 100;
  const preferredScore = totalPreferred > 0 ? Math.round((matchedPreferred / totalPreferred) * 100) : 100;

  let overallScore = 0;
  let formulaDescription = '';

  if (totalRequired > 0 && totalPreferred > 0) {
    overallScore = Math.round(requiredScore * 0.7 + preferredScore * 0.3);
    formulaDescription = `Weighted Formula: 70% Required (${requiredScore}%) + 30% Preferred (${preferredScore}%) = ${overallScore}%`;
  } else if (totalRequired > 0) {
    overallScore = requiredScore;
    formulaDescription = `Formula: 100% Required Qualifications (${matchedRequired}/${totalRequired} matched) = ${overallScore}%`;
  } else if (totalPreferred > 0) {
    overallScore = preferredScore;
    formulaDescription = `Formula: 100% Preferred Qualifications (${matchedPreferred}/${totalPreferred} matched) = ${overallScore}%`;
  } else {
    overallScore = 0;
    formulaDescription = 'No specific technical qualifications detected in the provided Job Description.';
  }

  return {
    score: Math.min(100, Math.max(0, overallScore)),
    requiredScore,
    preferredScore,
    matchedRequiredCount: matchedRequired,
    totalRequiredCount: totalRequired,
    matchedPreferredCount: matchedPreferred,
    totalPreferredCount: totalPreferred,
    formulaDescription,
  };
}

/**
 * Generates transparent, deterministic, and ethical improvement suggestions.
 * Strictly adheres to non-deceptive guidelines: Never encourages claiming skills not possessed.
 */
function generateSuggestions(
  matched: MatchedSkill[],
  missing: MissingSkill[],
): AlignmentSuggestion[] {
  const suggestions: AlignmentSuggestion[] = [];

  // 1. Missing Required Skills (Highest priority)
  for (const m of missing.filter((s) => s.priority === 'required')) {
    suggestions.push({
      id: `missing-req-${m.canonical}`,
      type: 'missing_required',
      title: `Missing Required Skill: ${m.skill}`,
      message: `The target role explicitly lists "${m.skill}" as a core requirement. If you possess this experience, consider adding it to your Technical Skills or mentioning its impact in a past role.`,
      skillName: m.skill,
      recommendedSection: 'skills',
    });
  }

  // 2. Experience Reinforcement (Skills listed in 'skills' section but missing from 'work' experience)
  const skillsOnlyInSkillsList = matched.filter(
    (m) =>
      m.matchedInSections.includes('skills') &&
      !m.matchedInSections.includes('work') &&
      !m.matchedInSections.includes('projects'),
  );

  for (const m of skillsOnlyInSkillsList.slice(0, 3)) {
    suggestions.push({
      id: `reinforce-${m.canonical}`,
      type: 'section_emphasis',
      title: `Demonstrate Practical Impact for "${m.skill}"`,
      message: `"${m.skill}" is listed in your Skills section, but not mentioned in your Work Experience or Projects. Adding a measurable bullet point showing how you applied "${m.skill}" will significantly strengthen your profile.`,
      skillName: m.skill,
      recommendedSection: 'work',
    });
  }

  // 3. Synonym / Alias Clarification
  const synonymMatches = matched.filter((m) => m.matchType === 'synonym' && m.aliasMatched);
  for (const s of synonymMatches.slice(0, 2)) {
    suggestions.push({
      id: `synonym-${s.canonical}`,
      type: 'alias_clarification',
      title: `Keyword Alignment: "${s.aliasMatched}" vs "${s.skill}"`,
      message: `Your resume mentions "${s.aliasMatched}", matching the target requirement "${s.skill}". While human recruiters recognize this equivalence, standard ATS keyword parsers may prefer the exact phrasing "${s.skill}".`,
      skillName: s.skill,
    });
  }

  // 4. Missing Preferred Skills
  for (const m of missing.filter((s) => s.priority === 'preferred').slice(0, 3)) {
    suggestions.push({
      id: `missing-pref-${m.canonical}`,
      type: 'missing_preferred',
      title: `Bonus Qualification: ${m.skill}`,
      message: `"${m.skill}" is listed as a preferred/bonus skill. If you have any relevant coursework, self-study, or minor projects involving "${m.skill}", highlighting them can give you a competitive edge.`,
      skillName: m.skill,
    });
  }

  return suggestions;
}

/**
 * Primary deterministic Job Description Alignment Engine.
 * Operates 100% locally with zero external network or AI API dependencies.
 */
export function analyzeJobAlignment(
  jobDescriptionText: string,
  resume: ResumeData,
): JobAlignmentResult {
  const parsedJd = parseJobDescription(jobDescriptionText);
  const allTargetSkills = [...parsedJd.requiredSkills, ...parsedJd.preferredSkills];

  const { matched, missing, sectionCoverage } = matchSkillsAgainstResume(allTargetSkills, resume);

  const scoreBreakdown = calculateScoreBreakdown(
    matched,
    missing,
    parsedJd.requiredSkills.length,
    parsedJd.preferredSkills.length,
  );

  const suggestions = generateSuggestions(matched, missing);

  return {
    scoreBreakdown,
    matchedSkills: matched,
    missingSkills: missing,
    sectionCoverage,
    suggestions,
    parsedJobDescription: parsedJd,
    analyzedAt: new Date().toISOString(),
    disclaimer:
      'Job Description Alignment is an explainable deterministic keyword and skills coverage measurement. It is not an official or guaranteed ATS score, as individual ATS platforms (Workday, Greenhouse, Taleo) employ varied filtering rules.',
  };
}
