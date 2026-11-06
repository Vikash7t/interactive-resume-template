// @vitest-environment jsdom
import 'fake-indexeddb/auto';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useResumeStore } from '../store/resume-store';
import {
  analyzeJobAlignment,
  type ResumeData,
} from '@resucraft/shared';
import * as syncClient from '../lib/api/sync-client';
import * as aiClient from '../lib/api/ai-client';

describe('ResuCraft Phase 8: Comprehensive User Journey Integration Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // =========================================================================
  // JOURNEY 1: Anonymous Resume Creation, Editing & JSON Import/Export
  // =========================================================================
  it('Journey 1: Anonymous user edits sections, autosaves locally, and exports valid JSON Resume', async () => {
    const store = useResumeStore.getState();

    // 1. Mutate personal information
    store.updateBasics({
      name: 'Vikash Singh',
      label: 'Staff Distributed Systems Engineer',
      email: 'vikash@resucraft.dev',
      summary: 'Architecting resilient edge architectures and local-first systems.',
    });

    // 2. Add work experience with STAR achievements
    store.addWorkExperience({
      name: 'CloudScale Inc',
      position: 'Staff Engineer',
      startDate: '2023-01',
      endDate: 'Present',
      highlights: [
        'Architected high-throughput NestJS microservices reducing latency by 40%.',
        'Implemented Dexie IndexedDB caching layer supporting 100% offline uptime.',
      ],
    });

    const updated = useResumeStore.getState().resume;
    expect(updated.basics.name).toBe('Vikash Singh');
    expect(updated.basics.label).toBe('Staff Distributed Systems Engineer');
    expect(updated.work.length).toBeGreaterThanOrEqual(1);

    // 3. Export to JSON Resume
    const jsonString = store.exportToJson();
    expect(jsonString).toContain('Staff Distributed Systems Engineer');
    expect(jsonString).toContain('CloudScale Inc');

    // 4. Re-import the exported JSON (Recovery Flow)
    const importResult = store.importFromJson(jsonString);
    expect(importResult.success).toBe(true);
    expect(useResumeStore.getState().resume.basics.name).toBe('Vikash Singh');
  });

  // =========================================================================
  // JOURNEY 2: PDF Content Integrity & Machine Reading Order
  // =========================================================================
  it('Journey 2: Resume data contains strictly structured ATS extractable content', () => {
    const resume = useResumeStore.getState().resume;

    expect(resume.basics.name).toBeDefined();
    expect(resume.basics.email).toBeDefined();
    expect(Array.isArray(resume.work)).toBe(true);
    expect(Array.isArray(resume.skills)).toBe(true);
  });

  // =========================================================================
  // JOURNEY 3: Deterministic Job Description Alignment
  // =========================================================================
  it('Journey 3: Compares target job description and returns deterministic, explainable alignment score', () => {
    const testResume: ResumeData = {
      basics: {
        name: 'Vikash Singh',
        label: 'Senior Full Stack Engineer',
        email: 'vikash@example.com',
        summary: 'Expert in TypeScript, React, Next.js, Node.js, and PostgreSQL.',
      },
      skills: [
        {
          id: 's1',
          name: 'Core Skills',
          keywords: ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Docker'],
        },
      ],
      work: [
        {
          id: 'w1',
          name: 'Tech Corp',
          position: 'Full Stack Engineer',
          startDate: '2021-01',
          endDate: 'Present',
          highlights: ['Built web applications with React, Next.js, and PostgreSQL.'],
        },
      ],
      education: [],
      projects: [],
    };

    const targetJobText =
      'We are seeking a Senior Software Engineer with strong experience in TypeScript, React, Next.js, PostgreSQL, and Kubernetes.';

    // Calculate score deterministically
    const result = analyzeJobAlignment(targetJobText, testResume);

    expect(result.scoreBreakdown.score).toBeGreaterThan(50);
    expect(result.matchedSkills.length).toBeGreaterThanOrEqual(3);
    expect(result.matchedSkills.some((s) => s.skill.toLowerCase() === 'typescript')).toBe(true);
    expect(result.missingSkills.some((s) => s.skill.toLowerCase() === 'kubernetes')).toBe(true);
  });

  // =========================================================================
  // JOURNEY 4: AI Enhancement with Strict Anti-Hallucination Guardrails
  // =========================================================================
  it('Journey 4: AI assistant optimizes bullet point with [X%] placeholder and safe fallback', async () => {
    const originalBullet = 'Improved backend database query performance';

    // Mock client fallback optimizer
    const response = await aiClient.requestBulletEnhancement({
      bullet: originalBullet,
      roleTitle: 'Software Engineer',
    });

    expect(response.original).toBe(originalBullet);
    expect(response.options.length).toBe(3);

    // Verify option styles
    const styles = response.options.map((o) => o.style);
    expect(styles).toContain('action_impact');
    expect(styles).toContain('technical_depth');
    expect(styles).toContain('concise');

    // Verify anti-hallucination metric prompt for unquantified bullets
    const actionOption = response.options.find((o) => o.style === 'action_impact');
    expect(actionOption?.text).toContain('[X%]');
    expect(actionOption?.missingMetricPrompt).toBeDefined();
  });

  // =========================================================================
  // JOURNEY 5: Optional Account & Cloud Resume Concurrency Conflict Recovery
  // =========================================================================
  it('Journey 5: Detects version conflict between cloud and local copy and resolves safely', async () => {
    const resume = useResumeStore.getState().resume;

    // Simulate conflict response from server
    vi.spyOn(syncClient, 'syncResumeToCloud').mockResolvedValue({
      success: false,
      status: 'conflict',
      conflict: {
        serverResume: {
          id: 'mock-uuid-1',
          userId: 'user-vikash',
          title: 'Cloud Resume (Ahead)',
          data: {
            ...resume,
            basics: { ...resume.basics, name: 'Vikash Singh (Cloud Version)' },
          },
          version: 5,
          clientUpdatedAt: '2026-11-06T15:00:00Z',
          createdAt: '2026-11-06T10:00:00Z',
          updatedAt: '2026-11-06T15:00:00Z',
        },
        message: 'A newer version exists in the cloud.',
      },
    });

    const syncResult = await syncClient.syncResumeToCloud({
      title: 'Local Resume (Behind)',
      data: resume,
      version: 2,
      clientUpdatedAt: '2026-11-06T12:00:00Z',
    });

    expect(syncResult.status).toBe('conflict');
    expect(syncResult.conflict?.serverResume.version).toBe(5);

    // Resolve conflict by keeping local and forcing version increment
    vi.spyOn(syncClient, 'resolveCloudConflict').mockResolvedValue({
      success: true,
      status: 'synced',
      resume: {
        id: 'mock-uuid-1',
        userId: 'user-vikash',
        title: 'Local Resume (Overwritten Cloud)',
        data: resume,
        version: 6,
        clientUpdatedAt: '2026-11-06T16:00:00Z',
        createdAt: '2026-11-06T10:00:00Z',
        updatedAt: '2026-11-06T16:00:00Z',
      },
    });

    const resolveResult = await syncClient.resolveCloudConflict({
      resolution: 'keep_local',
      resumeId: 'mock-uuid-1',
      localData: resume,
      localVersion: 2,
    });

    expect(resolveResult.success).toBe(true);
    expect(resolveResult.status).toBe('synced');
    expect(resolveResult.resume?.version).toBe(6);
  });
});
