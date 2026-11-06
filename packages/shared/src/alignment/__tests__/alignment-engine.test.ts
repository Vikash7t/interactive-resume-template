import { describe, it, expect } from 'vitest';
import type { ResumeData } from '../../schemas/resume.schema';
import { parseJobDescription } from '../jd-parser';
import { normalizeText, extractNgrams } from '../text-normalizer';
import { analyzeJobAlignment } from '../alignment-engine';

describe('Job Description Alignment Engine (Phase 5 Deterministic Engine)', () => {
  const sampleResume: ResumeData = {
    basics: {
      name: 'Vikash Singh',
      label: 'Staff Backend & Cloud Engineer',
      email: 'vikash@example.com',
      summary:
        'Experienced systems engineer specializing in high-throughput distributed systems and cloud infrastructure.',
    },
    skills: [
      {
        id: 's1',
        name: 'Backend & Languages',
        keywords: ['TypeScript', 'Go', 'SQL', 'Node.js'],
      },
      {
        id: 's2',
        name: 'Databases & Cloud',
        keywords: ['PostgreSQL', 'Redis', 'AWS', 'Docker'],
      },
    ],
    work: [
      {
        id: 'w1',
        name: 'ScaleCorp Inc.',
        position: 'Senior Backend Engineer',
        startDate: '2022-01',
        endDate: 'Present',
        summary: 'Architected event-driven microservices processing 25,000 events/sec.',
        highlights: [
          'Engineered PostgreSQL read-replicas reducing database query latency by 45%.',
          'Automated CI/CD deployment pipelines using Docker and AWS ECS.',
          'Migrated legacy monolithic systems into Go microservices with gRPC.',
        ],
      },
      {
        id: 'w2',
        name: 'DataFlow Systems',
        position: 'Software Engineer',
        startDate: '2019-06',
        endDate: '2021-12',
        highlights: [
          'Implemented distributed caching using Redis.',
          'Maintained high test coverage with automated unit testing and TDD principles.',
        ],
      },
    ],
    projects: [
      {
        id: 'p1',
        name: 'Distributed Lock Manager',
        description: 'A fault-tolerant distributed consensus library in Go.',
        keywords: ['Go', 'Distributed Systems'],
        highlights: ['Designed Raft consensus protocol implementation.'],
      },
    ],
    education: [
      {
        id: 'e1',
        institution: 'Indian Institute of Technology',
        area: 'Computer Science',
        studyType: 'B.Tech',
      },
    ],
    certificates: [],
    languages: [],
  };

  it('normalizes text while strictly preserving engineering tokens', () => {
    const raw = 'We need C++, C#, .NET, CI/CD, and Node.js with Next.js!';
    const normalized = normalizeText(raw);

    expect(normalized).toContain('c++');
    expect(normalized).toContain('c#');
    expect(normalized).toContain('.net');
    expect(normalized).toContain('ci/cd');
    expect(normalized).toContain('node.js');
    expect(normalized).toContain('next.js');
  });

  it('extracts multi-word n-grams for compound technical phrases', () => {
    const text = 'Expertise in Amazon Web Services and Distributed Systems required.';
    const ngrams = extractNgrams(text);

    expect(ngrams.has('amazon web services')).toBe(true);
    expect(ngrams.has('distributed systems')).toBe(true);
  });

  it('accurately parses and segments JD requirements vs preferred qualifications', () => {
    const jdText = `
Senior Platform Engineer

Basic Qualifications:
- 5+ years of experience with Go or TypeScript
- Strong background in PostgreSQL and Redis
- Solid understanding of Docker and CI/CD

Preferred Qualifications:
- Experience with Kubernetes (K8s)
- Hands-on knowledge of Apache Kafka and GraphQL
`;

    const parsed = parseJobDescription(jdText);

    expect(parsed.title).toBe('Senior Platform Engineer');
    expect(parsed.requiredSkills.map((s) => s.canonical)).toEqual(
      expect.arrayContaining(['go', 'typescript', 'postgresql', 'redis', 'docker', 'cicd']),
    );
    expect(parsed.preferredSkills.map((s) => s.canonical)).toEqual(
      expect.arrayContaining(['kubernetes', 'kafka', 'graphql']),
    );
  });

  it('computes deterministic alignment score and identifies exact vs synonym matches', () => {
    const jdText = `
Senior Backend Engineer

Minimum Qualifications:
- Experience with TypeScript
- Strong proficiency in PostgreSQL
- Containerization with Docker
- Experience with Kubernetes

Preferred Qualifications:
- Experience with GraphQL
- Familiarity with Redis
`;

    // Run analysis twice to verify determinism
    const run1 = analyzeJobAlignment(jdText, sampleResume);
    const run2 = analyzeJobAlignment(jdText, sampleResume);

    expect(run1.scoreBreakdown).toEqual(run2.scoreBreakdown);
    expect(run1.matchedSkills).toEqual(run2.matchedSkills);
    expect(run1.missingSkills).toEqual(run2.missingSkills);
    expect(run1.suggestions).toEqual(run2.suggestions);

    // Verify match status
    const matchedNames = run1.matchedSkills.map((m) => m.canonical);
    expect(matchedNames).toContain('typescript');
    expect(matchedNames).toContain('postgresql');
    expect(matchedNames).toContain('docker');
    expect(matchedNames).toContain('redis');

    // Sample resume does NOT contain Kubernetes or GraphQL
    const missingNames = run1.missingSkills.map((m) => m.canonical);
    expect(missingNames).toContain('kubernetes');
    expect(missingNames).toContain('graphql');

    // Required: 4 skills (TypeScript, PostgreSQL, Docker, Kubernetes). Matched 3 of 4 = 75%
    // Preferred: 2 skills (GraphQL, Redis). Matched 1 of 2 = 50%
    // Overall: (75 * 0.7) + (50 * 0.3) = 52.5 + 15 = 68%
    expect(run1.scoreBreakdown.matchedRequiredCount).toBe(3);
    expect(run1.scoreBreakdown.totalRequiredCount).toBe(4);
    expect(run1.scoreBreakdown.matchedPreferredCount).toBe(1);
    expect(run1.scoreBreakdown.totalPreferredCount).toBe(2);
    expect(run1.scoreBreakdown.score).toBe(68);
  });

  it('correctly maps synonyms and aliases without false positives', () => {
    const resumeWithK8s: ResumeData = {
      basics: { name: 'Test Candidate' },
      skills: [{ id: 's1', name: 'DevOps', keywords: ['k8s', 'AWS'] }],
      work: [],
      education: [],
    };

    const jdText = `
Requirements:
- Production experience with Kubernetes
`;

    const result = analyzeJobAlignment(jdText, resumeWithK8s);

    const k8sMatch = result.matchedSkills.find((s) => s.canonical === 'kubernetes');
    expect(k8sMatch).toBeDefined();
    expect(k8sMatch?.matchType).toBe('synonym');
    expect(k8sMatch?.aliasMatched).toBe('k8s');
    expect(k8sMatch?.matchedInSections).toContain('skills');
  });

  it('provides granular section coverage attribution', () => {
    const jdText = `
Requirements:
- TypeScript
- PostgreSQL
- Redis
- Go
`;

    const result = analyzeJobAlignment(jdText, sampleResume);

    const workCoverage = result.sectionCoverage.find((s) => s.section === 'work');
    const skillsCoverage = result.sectionCoverage.find((s) => s.section === 'skills');

    expect(workCoverage).toBeDefined();
    expect(workCoverage?.matchCount).toBeGreaterThanOrEqual(2); // PostgreSQL, Go, Redis are in work
    expect(skillsCoverage?.matchCount).toBe(4); // All 4 are in skills section
  });

  it('generates non-deceptive, actionable improvement suggestions', () => {
    const jdText = `
Minimum Qualifications:
- Experience with Kubernetes
- Experience with TypeScript
`;

    const result = analyzeJobAlignment(jdText, sampleResume);

    const missingK8sSuggestion = result.suggestions.find(
      (s) => s.type === 'missing_required' && s.skillName === 'Kubernetes',
    );
    expect(missingK8sSuggestion).toBeDefined();
    expect(missingK8sSuggestion?.message).toContain('If you possess this experience');
    expect(result.disclaimer).toContain('not an official or guaranteed ATS score');
  });

  it('handles empty or sparse inputs gracefully with 0 score and zero crashes', () => {
    const emptyResult = analyzeJobAlignment('', sampleResume);
    expect(emptyResult.scoreBreakdown.score).toBe(0);
    expect(emptyResult.matchedSkills).toHaveLength(0);
    expect(emptyResult.missingSkills).toHaveLength(0);

    const sparseResume: ResumeData = {
      basics: { name: 'Blank Profile' },
    };
    const sparseResult = analyzeJobAlignment('Requirements: Python, SQL', sparseResume);
    expect(sparseResult.scoreBreakdown.score).toBe(0);
    expect(sparseResult.missingSkills).toHaveLength(2);
  });
});
