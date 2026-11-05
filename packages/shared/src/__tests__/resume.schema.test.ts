import { describe, it, expect } from 'vitest';
import {
  ResumeDataSchema,
  normalizeResumeData,
  importFromJsonResumeString,
  exportToJsonResumeString,
  defaultSampleResume,
} from '../schemas/resume.schema.js';

describe('Resume Data Domain Architecture', () => {
  it('validates defaultSampleResume completely without errors', () => {
    const parsed = ResumeDataSchema.parse(defaultSampleResume);
    expect(parsed.basics.name).toBe('Vikash Singh');
    expect(parsed.work).toHaveLength(1);
    expect(parsed.projects).toHaveLength(2);
    expect(parsed.skills?.[0]?.keywords).toContain('TypeScript');
    expect(parsed.languages?.[0]?.language).toBe('English');
  });

  it('normalizes partial data and falls back safely', () => {
    const raw = {
      basics: {
        name: 'Alex Developer',
        email: 'alex@example.com',
      },
    };

    const normalized = normalizeResumeData(raw);
    expect(normalized.basics.name).toBe('Alex Developer');
    expect(normalized.work).toEqual([]);
    expect(normalized.skills).toEqual([]);
  });

  it('preserves unknown custom fields (passthrough)', () => {
    const withCustomField = {
      ...defaultSampleResume,
      customSection: {
        title: 'Volunteer Work',
        items: ['Open Source Contributor'],
      },
    };

    const parsed = ResumeDataSchema.parse(withCustomField);
    expect((parsed as Record<string, unknown>).customSection).toBeDefined();
  });

  it('correctly serializes and re-imports JSON Resume data', () => {
    const jsonStr = exportToJsonResumeString(defaultSampleResume);
    const importResult = importFromJsonResumeString(jsonStr);

    expect(importResult.success).toBe(true);
    if (importResult.success) {
      expect(importResult.data.basics.name).toBe(defaultSampleResume.basics.name);
      expect(importResult.data.work?.length).toBe(defaultSampleResume.work?.length);
    }
  });

  it('returns structured validation errors for invalid JSON string', () => {
    const invalidJson = '{ "basics": { "name": "" } }';
    const importResult = importFromJsonResumeString(invalidJson);

    expect(importResult.success).toBe(false);
    if (!importResult.success) {
      expect(importResult.errors.length).toBeGreaterThan(0);
      expect(importResult.errors[0]).toContain('name');
    }
  });

  it('handles syntax error in malformed JSON', () => {
    const malformed = 'not a json at all';
    const importResult = importFromJsonResumeString(malformed);

    expect(importResult.success).toBe(false);
    if (!importResult.success) {
      expect(importResult.errors[0]).toContain('JSON Parse Error');
    }
  });
});
