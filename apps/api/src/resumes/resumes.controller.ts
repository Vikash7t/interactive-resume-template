import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard, type AuthenticatedUser } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { ResumesService } from './resumes.service.js';
import { SyncResumeDto } from './dto/sync-resume.dto.js';
import { ResolveConflictDto } from './dto/resolve-conflict.dto.js';
import type { CloudResume, SyncResumeResponse } from '@resucraft/shared';

@Controller('resumes')
@UseGuards(AuthGuard)
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  async listResumes(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CloudResume[]> {
    return this.resumesService.listUserResumes(user.id);
  }

  @Get(':id')
  async getResume(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<CloudResume> {
    return this.resumesService.getUserResume(id, user.id);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncResume(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SyncResumeDto,
  ): Promise<SyncResumeResponse> {
    return this.resumesService.syncResume(user.id, dto);
  }

  @Post('resolve-conflict')
  @HttpCode(HttpStatus.OK)
  async resolveConflict(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ResolveConflictDto,
  ): Promise<SyncResumeResponse> {
    return this.resumesService.resolveConflict(user.id, dto);
  }

  @Delete(':id')
  async deleteResume(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ success: boolean; id: string }> {
    return this.resumesService.deleteResume(id, user.id);
  }
}
