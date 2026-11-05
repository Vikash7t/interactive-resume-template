import type { TemplateMetadata } from './types';
import { AtsSingleColumnTemplate } from './AtsSingleColumnTemplate';

export const availableTemplates: TemplateMetadata[] = [
  {
    id: 'ats-single-column',
    name: 'Certified ATS Single-Column',
    description:
      'Engineered specifically for maximum readability and parsing precision across Workday, Greenhouse, Lever, and Taleo.',
    isAtsCertified: true,
    component: AtsSingleColumnTemplate,
  },
];

export function getTemplateById(id: string): TemplateMetadata {
  const found = availableTemplates.find((t) => t.id === id);
  return found || availableTemplates[0]!;
}
