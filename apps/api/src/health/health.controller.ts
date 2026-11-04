import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service.js';
import type { HealthCheckResponse } from '@resucraft/shared';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Application & database health check' })
  @ApiResponse({ status: 200, description: 'System health status retrieved successfully' })
  async check(): Promise<HealthCheckResponse> {
    return this.healthService.getHealth();
  }
}
