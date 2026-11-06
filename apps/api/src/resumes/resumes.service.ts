import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { SyncResumeDto } from './dto/sync-resume.dto.js';
import type { ResolveConflictDto } from './dto/resolve-conflict.dto.js';
import type { SyncResumeResponse, CloudResume } from '@resucraft/shared';

@Injectable()
export class ResumesService {
  private readonly logger = new Logger(ResumesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * List all cloud resumes belonging exclusively to the authenticated user.
   */
  async listUserResumes(userId: string): Promise<CloudResume[]> {
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });

    return resumes.map((r) => this.mapToCloudResume(r));
  }

  /**
   * Get single cloud resume ensuring strict user ownership isolation.
   */
  async getUserResume(id: string, userId: string): Promise<CloudResume> {
    const resume = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found or access denied.');
    }

    return this.mapToCloudResume(resume);
  }

  /**
   * Synchronize local resume with cloud storage.
   * Performs optimistic concurrency version check to detect conflicts.
   */
  async syncResume(
    userId: string,
    dto: SyncResumeDto,
  ): Promise<SyncResumeResponse> {
    const clientDate = new Date(dto.clientUpdatedAt);

    // If an existing ID was passed, verify existing cloud state
    if (dto.id) {
      const existing = await this.prisma.resume.findFirst({
        where: { id: dto.id, userId },
      });

      if (existing) {
        // Conflict Check: Server version is strictly higher and newer
        if (
          dto.version < existing.version &&
          clientDate < existing.clientUpdatedAt
        ) {
          this.logger.warn(
            `Sync conflict detected on resume ${existing.id} (Client v${dto.version} < Server v${existing.version})`,
          );

          return {
            success: false,
            status: 'conflict',
            conflict: {
              serverResume: this.mapToCloudResume(existing),
              message:
                'A newer version of this resume exists in the cloud. Please choose whether to keep your local edits or adopt the cloud version.',
            },
          };
        }

        // Clean update with version increment
        const updated = await this.prisma.resume.update({
          where: { id: existing.id },
          data: {
            title: dto.title,
            data: dto.data as any,
            version: Math.max(existing.version + 1, dto.version + 1),
            clientUpdatedAt: clientDate,
          },
        });

        return {
          success: true,
          status: 'synced',
          resume: this.mapToCloudResume(updated),
        };
      }
    }

    // Otherwise create a new cloud resume record
    const created = await this.prisma.resume.create({
      data: {
        ...(dto.id ? { id: dto.id } : {}),
        userId,
        title: dto.title,
        data: dto.data as any,
        version: 1,
        clientUpdatedAt: clientDate,
      },
    });

    return {
      success: true,
      status: 'synced',
      resume: this.mapToCloudResume(created),
    };
  }

  /**
   * Resolves a synchronization conflict explicitly chosen by the user.
   */
  async resolveConflict(
    userId: string,
    dto: ResolveConflictDto,
  ): Promise<SyncResumeResponse> {
    const existing = await this.prisma.resume.findFirst({
      where: { id: dto.resumeId, userId },
    });

    if (!existing) {
      throw new NotFoundException('Resume not found or access denied.');
    }

    if (dto.resolution === 'keep_local') {
      if (!dto.localData) {
        throw new ConflictException(
          'Local resume data is required to keep local version.',
        );
      }

      const clientDate = dto.clientUpdatedAt
        ? new Date(dto.clientUpdatedAt)
        : new Date();

      const updated = await this.prisma.resume.update({
        where: { id: existing.id },
        data: {
          data: dto.localData as any,
          version: existing.version + 1,
          clientUpdatedAt: clientDate,
        },
      });

      return {
        success: true,
        status: 'synced',
        resume: this.mapToCloudResume(updated),
      };
    }

    // 'keep_server': return server version for client to adopt
    return {
      success: true,
      status: 'synced',
      resume: this.mapToCloudResume(existing),
    };
  }

  /**
   * Delete cloud resume with strict user ownership verification.
   */
  async deleteResume(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; id: string }> {
    const existing = await this.prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Resume not found or access denied.');
    }

    await this.prisma.resume.delete({
      where: { id: existing.id },
    });

    return { success: true, id };
  }

  private mapToCloudResume(r: any): CloudResume {
    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      data: r.data,
      version: r.version,
      clientUpdatedAt: r.clientUpdatedAt.toISOString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }
}
