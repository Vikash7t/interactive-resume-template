import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { EnhanceBulletDto } from './dto/enhance-bullet.dto';
import type { BulletEnhanceResponse } from '@resucraft/shared';

@ApiTags('AI Resume Assistant')
@Controller('api/ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('enhance-bullet')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'Enhance a resume bullet point with anti-hallucination guardrails',
  })
  @ApiResponse({
    status: 200,
    description: '3 structured variations of the bullet point returned successfully',
  })
  async enhanceBullet(@Body() dto: EnhanceBulletDto): Promise<BulletEnhanceResponse> {
    // Audit log while strictly redacting any secret key (OWASP & Section 11 compliance)
    const hasByok = Boolean(dto.apiKey);
    this.logger.log(
      `Received bullet enhancement request (Role: "${dto.roleTitle || 'N/A'}", BYOK: ${hasByok}, BulletLen: ${dto.bullet.length})`,
    );

    return await this.aiService.enhanceBullet(dto);
  }
}
