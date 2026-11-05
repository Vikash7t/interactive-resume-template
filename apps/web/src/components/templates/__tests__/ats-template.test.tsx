// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AtsSingleColumnTemplate } from '../AtsSingleColumnTemplate';
import { defaultSampleResume } from '@resucraft/shared';

describe('AtsSingleColumnTemplate Component', () => {
  it('renders candidate header and title with semantic h1', () => {
    render(<AtsSingleColumnTemplate resume={defaultSampleResume} />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('Vikash Singh');
    expect(screen.getByText('Full-Stack Software Developer')).toBeDefined();
    expect(screen.getByText('vikashsingh7490@gmail.com')).toBeDefined();
  });

  it('renders work experience with semantic list items', () => {
    render(<AtsSingleColumnTemplate resume={defaultSampleResume} />);

    expect(screen.getAllByText(/Tech Innovations Lab/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Full-Stack Software Engineer/).length).toBeGreaterThan(0);

    // Verify highlights render as list items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
    expect(listItems[0]?.textContent).toContain('Next.js App Router and NestJS');
  });

  it('renders technical skills grouped by category', () => {
    render(<AtsSingleColumnTemplate resume={defaultSampleResume} />);

    expect(screen.getAllByText(/Frontend Development/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TypeScript/).length).toBeGreaterThan(0);
  });

  it('strictly preserves single-column ATS structure with zero table elements', () => {
    const { container } = render(<AtsSingleColumnTemplate resume={defaultSampleResume} />);

    // ATS Rule: No tables (tables break screen readers and ATS text flow)
    const tables = container.querySelectorAll('table');
    expect(tables.length).toBe(0);

    // ATS Rule: Semantic article wrapper
    const article = container.querySelector('article');
    expect(article).not.toBeNull();
  });
});
