import type React from 'react';
import type { ResumeData } from '@resucraft/shared';

export interface TemplateProps {
  resume: ResumeData;
  className?: string;
  isPrintPreview?: boolean;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  isAtsCertified: boolean;
  component: React.ComponentType<TemplateProps>;
}
