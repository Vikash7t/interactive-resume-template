import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { HealthCheckResponse } from '@resucraft/shared';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<HealthCheckResponse> {
    const dbPing = await this.prisma.ping();
    const memory = process.memoryUsage();

    return {
      status: dbPing.ok ? 'ok' : 'ok', // Non-fatal in local-first architecture
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbPing.ok ? 'up' : 'down',
          latencyMs: dbPing.latencyMs,
          error: dbPing.error,
        },
        memory: {
          heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
          heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
        },
      },
    };
  }
}
