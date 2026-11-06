import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsObject,
  Min,
} from 'class-validator';
import type { ResumeData } from '@resucraft/shared';

export class SyncResumeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsObject()
  data!: ResumeData;

  @IsInt()
  @Min(1)
  version!: number;

  @IsString()
  @IsNotEmpty()
  clientUpdatedAt!: string;
}
