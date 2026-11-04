import { describe, it, expect } from 'vitest';
import { ResumeDataSchema } from '../schemas/resume.schema.js';

describe('ResumeDataSchema', () => {
  it('validates a complete minimal valid resume', () => {
    const validResume = {
      basics: {
        name: 'Vikash Singh',
        label: 'Full-Stack Developer',
        email: 'vikash@example.com',
        summary: 'Experienced software developer.',
      },
      work: [
        {
          name: 'Tech Corp',
          position: 'Software Engineer',
          startDate: '2023-01',
          endDate: 'Present',
          highlights: ['Architected Next.js and NestJS full-stack apps.'],
        },
      ],
      skills: [
        {
          name: 'Languages',
          keywords: ['TypeScript', 'JavaScript', 'SQL'],
        },
      ],
    };

    const parsed = ResumeDataSchema.parse(validResume);
    expect(parsed.basics.name).toBe('Vikash Singh');
    expect(parsed.work).toHaveLength(1);
    expect(parsed.skills?.[0]?.keywords).toContain('TypeScript');
  });

  it('fails validation when mandatory name is missing', () => {
    const invalidResume = {
      basics: {
        name: '',
      },
    };

    expect(() => ResumeDataSchema.parse(invalidResume)).toThrow();
  });
});
