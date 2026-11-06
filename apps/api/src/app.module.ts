import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { AiModule } from './ai/ai.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ResumesModule } from './resumes/resumes.module.js';

@Module({
  imports: [PrismaModule, HealthModule, AiModule, AuthModule, ResumesModule],
})
export class AppModule {}
