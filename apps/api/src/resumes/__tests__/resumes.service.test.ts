import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumesService } from '../resumes.service.js';
import { NotFoundException } from '@nestjs/common';
import type { PrismaService } from '../../prisma/prisma.service.js';

describe('ResumesService Cloud Sync Engine', () => {
  let service: ResumesService;
  let mockPrisma: any;

  const mockDate = new Date('2026-11-06T12:00:00Z');
  const mockResumeDbRecord = {
    id: '11111111-1111-1111-1111-111111111111',
    userId: 'user-123',
    title: 'Senior Engineer Resume',
    data: {
      basics: { name: 'Vikash Singh', label: 'Full Stack Engineer' },
    },
    version: 2,
    clientUpdatedAt: mockDate,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  beforeEach(() => {
    mockPrisma = {
      resume: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };
    service = new ResumesService(mockPrisma as PrismaService);
  });

  it('lists user cloud resumes strictly filtered by userId', async () => {
    mockPrisma.resume.findMany.mockResolvedValue([mockResumeDbRecord]);

    const result = await service.listUserResumes('user-123');

    expect(mockPrisma.resume.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-123' },
      orderBy: { updatedAt: 'desc' },
    });
    expect(result.length).toBe(1);
    expect(result[0]?.id).toBe('11111111-1111-1111-1111-111111111111');
    expect(result[0]?.version).toBe(2);
  });

  it('throws NotFoundException if resume does not exist or belongs to another user', async () => {
    mockPrisma.resume.findFirst.mockResolvedValue(null);

    await expect(
      service.getUserResume('unknown-id', 'user-123'),
    ).rejects.toThrow(NotFoundException);
  });

  it('creates a new cloud resume on initial sync', async () => {
    mockPrisma.resume.findFirst.mockResolvedValue(null);
    mockPrisma.resume.create.mockResolvedValue(mockResumeDbRecord);

    const result = await service.syncResume('user-123', {
      title: 'Senior Engineer Resume',
      data: { basics: { name: 'Vikash Singh', label: 'Full Stack Engineer' } } as any,
      version: 1,
      clientUpdatedAt: '2026-11-06T12:00:00Z',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('synced');
    expect(result.resume?.id).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('detects a conflict when cloud version is strictly higher and newer', async () => {
    // Existing cloud record has version 5, updated at 12:00
    mockPrisma.resume.findFirst.mockResolvedValue({
      ...mockResumeDbRecord,
      version: 5,
      clientUpdatedAt: new Date('2026-11-06T12:00:00Z'),
    });

    // Client attempts to sync version 3 with older timestamp 11:00
    const result = await service.syncResume('user-123', {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Older Local Edit',
      data: { basics: { name: 'Vikash' } } as any,
      version: 3,
      clientUpdatedAt: '2026-11-06T11:00:00Z',
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe('conflict');
    expect(result.conflict?.serverResume.version).toBe(5);
    expect(result.conflict?.message).toContain('newer version of this resume exists');
  });

  it('resolves conflict with keep_local by overwriting cloud with incremented version', async () => {
    mockPrisma.resume.findFirst.mockResolvedValue(mockResumeDbRecord);
    mockPrisma.resume.update.mockResolvedValue({
      ...mockResumeDbRecord,
      version: 3,
      data: { basics: { name: 'Vikash Local Override' } },
    });

    const result = await service.resolveConflict('user-123', {
      resolution: 'keep_local',
      resumeId: '11111111-1111-1111-1111-111111111111',
      localData: { basics: { name: 'Vikash Local Override' } } as any,
      localVersion: 2,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('synced');
    expect(mockPrisma.resume.update).toHaveBeenCalled();
  });

  it('deletes resume verifying userId ownership', async () => {
    mockPrisma.resume.findFirst.mockResolvedValue(mockResumeDbRecord);
    mockPrisma.resume.delete.mockResolvedValue(mockResumeDbRecord);

    const result = await service.deleteResume('11111111-1111-1111-1111-111111111111', 'user-123');
    expect(result.success).toBe(true);
    expect(result.id).toBe('11111111-1111-1111-1111-111111111111');
  });
});
