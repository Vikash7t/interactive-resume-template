import { z } from 'zod';

export const LocationSchema = z.object({
  address: z.string().optional().default(''),
  postalCode: z.string().optional().default(''),
  city: z.string().optional().default(''),
  countryCode: z.string().optional().default(''),
  region: z.string().optional().default(''),
});

export const ProfileSchema = z.object({
  network: z.string().min(1, 'Network name is required'),
  username: z.string().optional().default(''),
  url: z.string().url('Must be a valid URL').or(z.literal('')).optional().default(''),
});

export const BasicsSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  label: z.string().optional().default(''),
  image: z.string().optional().default(''),
  email: z.string().email('Invalid email address').or(z.literal('')).optional().default(''),
  phone: z.string().optional().default(''),
  url: z.string().url('Must be a valid URL').or(z.literal('')).optional().default(''),
  summary: z.string().optional().default(''),
  location: LocationSchema.optional().default({}),
  profiles: z.array(ProfileSchema).optional().default([]),
});

export const WorkExperienceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Company or organization name is required'),
  position: z.string().min(1, 'Position or title is required'),
  url: z.string().url().or(z.literal('')).optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  highlights: z.array(z.string()).optional().default([]),
});

export const EducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution name is required'),
  url: z.string().url().or(z.literal('')).optional().default(''),
  area: z.string().optional().default(''),
  studyType: z.string().optional().default(''),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  score: z.string().optional().default(''),
  courses: z.array(z.string()).optional().default([]),
});

export const SkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill category or name is required'),
  level: z.string().optional().default(''),
  keywords: z.array(z.string()).optional().default([]),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().default(''),
  highlights: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  startDate: z.string().optional().default(''),
  endDate: z.string().optional().default(''),
  url: z.string().url().or(z.literal('')).optional().default(''),
});

export const CertificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certificate name is required'),
  date: z.string().optional().default(''),
  issuer: z.string().optional().default(''),
  url: z.string().url().or(z.literal('')).optional().default(''),
});

export const ResumeDataSchema = z.object({
  basics: BasicsSchema,
  work: z.array(WorkExperienceSchema).optional().default([]),
  education: z.array(EducationSchema).optional().default([]),
  skills: z.array(SkillSchema).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  certificates: z.array(CertificateSchema).optional().default([]),
  meta: z
    .object({
      version: z.string().optional().default('v1.0.0'),
      canonical: z.string().optional(),
      lastModified: z.string().optional(),
    })
    .optional()
    .default({}),
});

export type ResumeData = z.infer<typeof ResumeDataSchema>;
export type Basics = z.infer<typeof BasicsSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Certificate = z.infer<typeof CertificateSchema>;
