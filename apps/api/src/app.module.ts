import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [PrismaModule, HealthModule, AiModule],
})
export class AppModule {}
