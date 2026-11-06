// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { JobAlignmentModal } from '../JobAlignmentModal';
import type { ResumeData } from '@resucraft/shared';

describe('JobAlignmentModal Component', () => {
  afterEach(() => {
    cleanup();
  });
  const testResume: ResumeData = {
    basics: {
      name: 'Vikash Singh',
      label: 'Senior Full-Stack Engineer',
      email: 'vikash@example.com',
      summary: 'Passionate about building scalable distributed web applications.',
    },
    skills: [
      {
        id: 's1',
        name: 'Languages & Frameworks',
        keywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      },
    ],
    work: [
      {
        id: 'w1',
        name: 'Tech Corp',
        position: 'Software Engineer',
        startDate: '2021-01',
        endDate: 'Present',
        highlights: ['Built RESTful services with Node.js and PostgreSQL.'],
      },
    ],
    education: [],
    projects: [],
  };

  it('renders modal when isOpen is true and shows initial score calculation', () => {
    const handleClose = vi.fn();
    render(<JobAlignmentModal isOpen={true} onClose={handleClose} resume={testResume} />);

    expect(screen.getByText('Job Description Alignment Engine')).toBeDefined();
    expect(screen.getByText(/Alignment Coverage/i)).toBeDefined();
    expect(screen.getByText(/Non-Deceptive Ethical Guarantee/i)).toBeDefined();
    expect(screen.getByText(/Deterministic ATS Keyword Matcher/i)).toBeDefined();
  });

  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const { container } = render(
      <JobAlignmentModal isOpen={false} onClose={handleClose} resume={testResume} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('allows switching between Matched, Missing, Section Coverage, and Suggestions tabs', () => {
    const handleClose = vi.fn();
    render(<JobAlignmentModal isOpen={true} onClose={handleClose} resume={testResume} />);

    // Click Missing tab
    const missingTab = screen.getAllByRole('button', { name: /Missing \(\d+\)/i })[0];
    fireEvent.click(missingTab);
    expect(screen.getAllByText(/Core requirement in job posting|Preferred \/ nice-to-have qualification/i).length).toBeGreaterThan(0);

    // Click Section Coverage tab
    const sectionsTab = screen.getAllByRole('button', { name: /Section Coverage/i })[0];
    fireEvent.click(sectionsTab);
    expect(screen.getByText(/Technical Skills/i)).toBeDefined();

    // Click Suggestions tab
    const suggestionsTab = screen.getAllByRole('button', { name: /Suggestions \(\d+\)/i })[0];
    fireEvent.click(suggestionsTab);
    expect(screen.getAllByText(/Missing|Demonstrate|Keyword/i).length).toBeGreaterThan(0);
  });

  it('calls onClose when Done or Close button is clicked', () => {
    const handleClose = vi.fn();
    render(<JobAlignmentModal isOpen={true} onClose={handleClose} resume={testResume} />);

    const closeButton = screen.getByRole('button', { name: 'Close alignment modal' });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
