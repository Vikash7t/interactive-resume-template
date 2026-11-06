import { IsString, IsNotEmpty, IsIn, IsOptional, IsInt, IsObject } from 'class-validator';
import type { ResumeData } from '@resucraft/shared';

export class ResolveConflictDto {
  @IsIn(['keep_local', 'keep_server'])
  resolution!: 'keep_local' | 'keep_server';

  @IsString()
  @IsNotEmpty()
  resumeId!: string;

  @IsOptional()
  @IsObject()
  localData?: ResumeData;

  @IsOptional()
  @IsInt()
  localVersion?: number;

  @IsOptional()
  @IsString()
  clientUpdatedAt?: string;
}
