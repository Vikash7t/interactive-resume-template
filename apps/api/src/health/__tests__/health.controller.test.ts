import { describe, it, expect, vi } from 'vitest';
import { HealthController } from '../health.controller.js';
import { HealthService } from '../health.service.js';
import type { PrismaService } from '../../prisma/prisma.service.js';

describe('HealthController', () => {
  it('returns health telemetry with status ok', async () => {
    const mockPrisma = {
      ping: vi.fn().mockResolvedValue({ ok: true, latencyMs: 5 }),
    } as unknown as PrismaService;

    const healthService = new HealthService(mockPrisma);
    const controller = new HealthController(healthService);

    const result = await controller.check();
    expect(result.status).toBe('ok');
    expect(result.services.database.status).toBe('up');
    expect(result.services.database.latencyMs).toBe(5);
    expect(result.services.memory.heapUsedMb).toBeGreaterThan(0);
  });
});
