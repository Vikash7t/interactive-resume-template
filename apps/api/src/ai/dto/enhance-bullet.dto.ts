import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EnhanceBulletDto {
  @ApiProperty({
    description: 'The original resume bullet point to optimize',
    example: 'Worked on database queries and improved speed.',
  })
  @IsString()
  @MinLength(5, { message: 'Bullet point must be at least 5 characters long' })
  @MaxLength(600, { message: 'Bullet point cannot exceed 600 characters' })
  bullet!: string;

  @ApiPropertyOptional({
    description: 'Role or position title for context',
    example: 'Senior Backend Engineer',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  roleTitle?: string;

  @ApiPropertyOptional({
    description: 'Company or organization name for context',
    example: 'CloudScale Technologies',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiPropertyOptional({
    description: 'Optional target job description to guide phrasing alignment',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  targetJobDescription?: string;

  @ApiPropertyOptional({
    description: 'Optional user-supplied Gemini API key (BYOK mode, never persisted)',
  })
  @IsOptional()
  @IsString()
  apiKey?: string;
}
