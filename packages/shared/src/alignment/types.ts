/**
 * Job Description Alignment Engine Data Models
 */

export type RequirementPriority = 'required' | 'preferred';

export type MatchType = 'exact' | 'synonym';

export type ResumeSectionKey = 'summary' | 'skills' | 'work' | 'projects' | 'education' | 'certificates';

export interface ExtractedSkill {
  name: string;
  canonical: string;
  priority: RequirementPriority;
  category?: string;
}

export interface ParsedJobDescription {
  rawText: string;
  title?: string;
  requiredSkills: ExtractedSkill[];
  preferredSkills: ExtractedSkill[];
  totalRequirements: number;
}

export interface MatchedSkill {
  skill: string;
  canonical: string;
  priority: RequirementPriority;
  matchType: MatchType;
  matchedInSections: ResumeSectionKey[];
  aliasMatched?: string;
  contextSnippets?: string[];
}

export interface MissingSkill {
  skill: string;
  canonical: string;
  priority: RequirementPriority;
  category?: string;
}

export interface SectionCoverage {
  section: ResumeSectionKey;
  label: string;
  matchCount: number;
  skills: string[];
}

export interface AlignmentSuggestion {
  id: string;
  type: 'missing_required' | 'missing_preferred' | 'section_emphasis' | 'alias_clarification';
  title: string;
  message: string;
  skillName?: string;
  recommendedSection?: ResumeSectionKey;
}

export interface JobAlignmentScoreBreakdown {
  score: number; // 0 to 100
  requiredScore: number; // 0 to 100
  preferredScore: number; // 0 to 100
  matchedRequiredCount: number;
  totalRequiredCount: number;
  matchedPreferredCount: number;
  totalPreferredCount: number;
  formulaDescription: string;
}

export interface JobAlignmentResult {
  scoreBreakdown: JobAlignmentScoreBreakdown;
  matchedSkills: MatchedSkill[];
  missingSkills: MissingSkill[];
  sectionCoverage: SectionCoverage[];
  suggestions: AlignmentSuggestion[];
  parsedJobDescription: ParsedJobDescription;
  analyzedAt: string;
  disclaimer: string;
}
