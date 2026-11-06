import { z } from 'zod';
import { ResumeDataSchema } from './resume.schema';

export const SyncStatusSchema = z.enum([
  'synced',
  'local_only',
  'syncing',
  'conflict',
  'error',
]);

export type SyncStatus = z.infer<typeof SyncStatusSchema>;

export const CloudResumeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  title: z.string(),
  data: ResumeDataSchema,
  version: z.number().int().nonnegative(),
  clientUpdatedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CloudResume = z.infer<typeof CloudResumeSchema>;

export const SyncResumeRequestSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).default('Untitled Resume'),
  data: ResumeDataSchema,
  version: z.number().int().nonnegative().default(1),
  clientUpdatedAt: z.string(),
});

export type SyncResumeRequest = z.infer<typeof SyncResumeRequestSchema>;

export const SyncResumeResponseSchema = z.object({
  success: z.boolean(),
  status: z.enum(['synced', 'conflict']),
  resume: CloudResumeSchema.optional(),
  conflict: z
    .object({
      serverResume: CloudResumeSchema,
      message: z.string(),
    })
    .optional(),
});

export type SyncResumeResponse = z.infer<typeof SyncResumeResponseSchema>;

export const ConflictResolutionSchema = z.object({
  resolution: z.enum(['keep_local', 'keep_server']),
  resumeId: z.string().uuid(),
  localData: ResumeDataSchema.optional(),
  localVersion: z.number().int().optional(),
  clientUpdatedAt: z.string().optional(),
});

export type ConflictResolution = z.infer<typeof ConflictResolutionSchema>;
