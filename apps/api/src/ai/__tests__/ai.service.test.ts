import { describe, it, expect } from 'vitest';
import { AiService } from '../ai.service';
import { BulletEnhanceResponseSchema } from '@resucraft/shared';

describe('AiService (Bullet Enhancement Engine)', () => {
  const service = new AiService();

  it('transforms weak opener into executive active verbs', async () => {
    const res = await service.enhanceBullet({
      bullet: 'worked on distributed cache to speed up reads',
      roleTitle: 'Senior Backend Engineer',
      company: 'ScaleTech',
    });

    expect(res).toBeDefined();
    expect(res.original).toBe('worked on distributed cache to speed up reads');
    expect(res.options).toHaveLength(3);

    // Verify schema adherence
    const parsed = BulletEnhanceResponseSchema.safeParse(res);
    expect(parsed.success).toBe(true);

    // Action Impact should replace "worked on" with strong active verb
    const actionOption = res.options.find((o) => o.style === 'action_impact');
    expect(actionOption).toBeDefined();
    expect(actionOption?.text).toMatch(/Engineered and optimized/i);

    // Should prompt for missing metric placeholder
    expect(actionOption?.text).toContain('[X%]');
    expect(actionOption?.missingMetricPrompt).toBeDefined();
  });

  it('preserves existing numbers without generating unneeded metric prompts', async () => {
    const res = await service.enhanceBullet({
      bullet: 'Architected PostgreSQL read replicas reducing p99 latency by 42%',
      roleTitle: 'Staff Infrastructure Engineer',
    });

    expect(res.options).toHaveLength(3);
    const actionOption = res.options.find((o) => o.style === 'action_impact');
    expect(actionOption?.text).toContain('42%');
    expect(actionOption?.missingMetricPrompt).toBeUndefined();
  });

  it('generates 3 distinct stylistic archetypes (action_impact, technical_depth, concise)', async () => {
    const res = await service.enhanceBullet({
      bullet: 'Helped to build the checkout service using TypeScript and Redis',
      roleTitle: 'Full-Stack Developer',
    });

    const styles = res.options.map((o) => o.style);
    expect(styles).toContain('action_impact');
    expect(styles).toContain('technical_depth');
    expect(styles).toContain('concise');

    // Each option must have a clear rationale
    for (const opt of res.options) {
      expect(opt.rationale.length).toBeGreaterThan(10);
    }
  });
});
