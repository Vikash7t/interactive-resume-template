import { z } from 'zod';

export const LocationSchema = z
  .object({
    address: z.string().optional().default(''),
    postalCode: z.string().optional().default(''),
    city: z.string().optional().default(''),
    countryCode: z.string().optional().default(''),
    region: z.string().optional().default(''),
  })
  .passthrough();

export const ProfileSchema = z
  .object({
    network: z.string().min(1, 'Network name is required'),
    username: z.string().optional().default(''),
    url: z.string().url('Must be a valid URL').or(z.literal('')).optional().default(''),
  })
  .passthrough();

export const BasicsSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    label: z.string().optional().default(''),
    image: z.string().optional().default(''),
    email: z.string().email('Invalid email address').or(z.literal('')).optional().default(''),
    phone: z.string().optional().default(''),
    url: z.string().url('Must be a valid URL').or(z.literal('')).optional().default(''),
    summary: z.string().optional().default(''),
    location: LocationSchema.optional().default({}),
    profiles: z.array(ProfileSchema).optional().default([]),
  })
  .passthrough();

export const WorkExperienceSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Company or organization name is required'),
    position: z.string().min(1, 'Position or title is required'),
    url: z.string().url().or(z.literal('')).optional().default(''),
    startDate: z.string().optional().default(''),
    endDate: z.string().optional().default(''),
    summary: z.string().optional().default(''),
    highlights: z.array(z.string()).optional().default([]),
  })
  .passthrough();

export const EducationSchema = z
  .object({
    id: z.string().optional(),
    institution: z.string().min(1, 'Institution name is required'),
    url: z.string().url().or(z.literal('')).optional().default(''),
    area: z.string().optional().default(''),
    studyType: z.string().optional().default(''),
    startDate: z.string().optional().default(''),
    endDate: z.string().optional().default(''),
    score: z.string().optional().default(''),
    courses: z.array(z.string()).optional().default([]),
  })
  .passthrough();

export const SkillSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Skill category or name is required'),
    level: z.string().optional().default(''),
    keywords: z.array(z.string()).optional().default([]),
  })
  .passthrough();

export const ProjectSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional().default(''),
    highlights: z.array(z.string()).optional().default([]),
    keywords: z.array(z.string()).optional().default([]),
    startDate: z.string().optional().default(''),
    endDate: z.string().optional().default(''),
    url: z.string().url().or(z.literal('')).optional().default(''),
  })
  .passthrough();

export const CertificateSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, 'Certificate name is required'),
    date: z.string().optional().default(''),
    issuer: z.string().optional().default(''),
    url: z.string().url().or(z.literal('')).optional().default(''),
  })
  .passthrough();

export const LanguageSchema = z
  .object({
    id: z.string().optional(),
    language: z.string().min(1, 'Language name is required'),
    fluency: z.string().optional().default(''),
  })
  .passthrough();

export const ResumeDataSchema = z
  .object({
    basics: BasicsSchema,
    work: z.array(WorkExperienceSchema).optional().default([]),
    education: z.array(EducationSchema).optional().default([]),
    skills: z.array(SkillSchema).optional().default([]),
    projects: z.array(ProjectSchema).optional().default([]),
    certificates: z.array(CertificateSchema).optional().default([]),
    languages: z.array(LanguageSchema).optional().default([]),
    meta: z
      .object({
        version: z.string().optional().default('v1.0.0'),
        canonical: z.string().optional(),
        lastModified: z.string().optional(),
      })
      .passthrough()
      .optional()
      .default({}),
  })
  .passthrough();

export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type Basics = z.infer<typeof BasicsSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
export type Language = z.infer<typeof LanguageSchema>;

export type ResumeSectionId =
  | 'basics'
  | 'summary'
  | 'work'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'languages';

/**
 * Normalizes raw input into validated, standardized ResumeData.
 * Guarantees default fallbacks without dropping unmodeled optional fields.
 */
export function normalizeResumeData(raw: unknown): ResumeData {
  const result = ResumeDataSchema.safeParse(raw);
  if (result.success) {
    return result.data;
  }

  // Graceful fallback for minimal partial objects
  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    const basicsRaw = typeof obj.basics === 'object' && obj.basics !== null ? obj.basics : {};
    return ResumeDataSchema.parse({
      ...obj,
      basics: {
        name: 'Untitled Resume',
        ...basicsRaw,
      },
    });
  }

  // Absolute fallback
  return ResumeDataSchema.parse({
    basics: {
      name: 'Untitled Resume',
    },
  });
}

/**
 * Validates and parses an imported JSON string into ResumeData.
 * Returns actionable error messages if validation fails.
 */
export function importFromJsonResumeString(
  jsonString: string,
): { success: true; data: ResumeData } | { success: false; errors: string[] } {
  try {
    const rawParsed = JSON.parse(jsonString);
    const validationResult = ResumeDataSchema.safeParse(rawParsed);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors.map(
        (err) => `${err.path.join('.') || 'root'}: ${err.message}`,
      );
      return { success: false, errors: formattedErrors };
    }

    return { success: true, data: validationResult.data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON syntax';
    return { success: false, errors: [`JSON Parse Error: ${message}`] };
  }
}

/**
 * Serializes ResumeData into standard formatted JSON Resume string.
 */
export function exportToJsonResumeString(data: ResumeData): string {
  const normalized = normalizeResumeData(data);
  return JSON.stringify(normalized, null, 2);
}

/**
 * Default sample resume fixture based on professional full-stack development profile.
 */
export const defaultSampleResume: ResumeData = ResumeDataSchema.parse({
  basics: {
    name: 'Vikash Singh',
    label: 'Full-Stack Software Developer',
    email: 'vikashsingh7490@gmail.com',
    phone: '+91 9876543210',
    url: 'https://github.com/Vikash7t',
    summary:
      'Full-Stack Developer experienced in architecting scalable web applications with Next.js, React, Node.js, NestJS, and PostgreSQL. Focused on clean architecture, type safety, deterministic performance, and ATS-conscious documentation.',
    location: {
      city: 'Bengaluru',
      region: 'Karnataka',
      countryCode: 'IN',
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'Vikash7t',
        url: 'https://github.com/Vikash7t',
      },
      {
        network: 'LinkedIn',
        username: 'vikash-singh',
        url: 'https://www.linkedin.com/in/vikash-singh-2714a0278',
      },
    ],
  },
  work: [
    {
      id: 'work-1',
      name: 'Tech Innovations Lab',
      position: 'Full-Stack Software Engineer',
      url: 'https://github.com/Vikash7t',
      startDate: '2023-08',
      endDate: 'Present',
      summary: 'Engineering high-performance SaaS applications and modular backend microservices.',
      highlights: [
        'Architected Next.js App Router and NestJS microservices handling 10,000+ daily operational requests.',
        'Designed relational schemas with PostgreSQL and Prisma, optimizing query latency by 35% through indexing.',
        'Integrated Role-Based Access Control (RBAC) and OAuth authentication, reducing unauthorized access incidents to 0.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Visvesvaraya Technological University',
      studyType: 'Bachelor of Engineering',
      area: 'Computer Science & Engineering',
      startDate: '2020',
      endDate: '2024',
      score: '8.4 CGPA',
      courses: ['Data Structures & Algorithms', 'Database Management Systems', 'Software Engineering'],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'Frontend Development',
      keywords: ['TypeScript', 'JavaScript (ES6+)', 'React 19', 'Next.js App Router', 'Tailwind CSS v4'],
    },
    {
      id: 'skill-2',
      name: 'Backend & APIs',
      keywords: ['Node.js', 'NestJS', 'Express.js', 'REST APIs', 'Swagger/OpenAPI'],
    },
    {
      id: 'skill-3',
      name: 'Databases & Tooling',
      keywords: ['PostgreSQL', 'Prisma ORM', 'Git', 'GitHub Actions', 'Docker'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Workflow AI — Project Management SaaS',
      description: 'Intelligent project management platform featuring AI-assisted sprint planning and task automation.',
      highlights: [
        'Built reactive Kanban board with optimistic UI updates and real-time synchronization.',
        'Integrated LLM API for automated user story generation and task prioritization.',
      ],
      keywords: ['Next.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
      url: 'https://github.com/Vikash7t/workflow-ai',
    },
    {
      id: 'proj-2',
      name: 'LMS Platform',
      description: 'Scalable learning management system with course builder, progress analytics, and video playback.',
      highlights: [
        'Engineered responsive video curriculum player with automated checkpoint tracking.',
        'Structured modular database schema with Prisma for instructors, courses, and student enrollments.',
      ],
      keywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      url: 'https://github.com/Vikash7t/lms-platform',
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'Full-Stack Web Development Professional',
      issuer: 'Meta',
      date: '2024',
      url: '',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'English',
      fluency: 'Professional Working Proficiency',
    },
    {
      id: 'lang-2',
      language: 'Hindi',
      fluency: 'Native / Bilingual Proficiency',
    },
  ],
  meta: {
    version: 'v1.0.0',
    lastModified: new Date().toISOString(),
  },
});
