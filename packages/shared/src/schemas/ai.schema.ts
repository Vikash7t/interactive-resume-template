import { z } from 'zod';

export const BulletStyleSchema = z.enum([
  'action_impact',
  'technical_depth',
  'concise',
]);

export type BulletStyle = z.infer<typeof BulletStyleSchema>;

export const EnhancedBulletOptionSchema = z.object({
  text: z.string().min(5),
  style: BulletStyleSchema,
  rationale: z.string().min(5),
  missingMetricPrompt: z.string().optional(),
});

export type EnhancedBulletOption = z.infer<typeof EnhancedBulletOptionSchema>;

export const BulletEnhanceRequestSchema = z.object({
  bullet: z
    .string()
    .trim()
    .min(5, 'Bullet point must be at least 5 characters')
    .max(600, 'Bullet point cannot exceed 600 characters'),
  roleTitle: z.string().trim().max(100).optional(),
  company: z.string().trim().max(100).optional(),
  targetJobDescription: z.string().trim().max(10000).optional(),
  apiKey: z.string().trim().optional(),
});

export type BulletEnhanceRequest = z.infer<typeof BulletEnhanceRequestSchema>;

export const BulletEnhanceResponseSchema = z.object({
  original: z.string(),
  options: z.array(EnhancedBulletOptionSchema).min(1).max(3),
  provider: z.string(),
  disclaimer: z.string(),
});

export type BulletEnhanceResponse = z.infer<typeof BulletEnhanceResponseSchema>;
