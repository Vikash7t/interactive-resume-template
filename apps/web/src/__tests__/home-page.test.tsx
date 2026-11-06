// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HomePage from '../app/page';

describe('HomePage Component (Phase 9 Launch Experience)', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders hero headline, subheadline, and primary CTA to editor', () => {
    render(<HomePage />);

    expect(screen.getByText(/Your experience deserves a/i)).toBeDefined();
    expect(screen.getByText(/better resume\./i)).toBeDefined();
    expect(screen.getByText(/Build, refine and tailor your resume/i)).toBeDefined();

    const ctaLinks = screen.getAllByRole('link', { name: /Build Your Resume/i });
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1);
    expect(ctaLinks[0]?.getAttribute('href')).toBe('/editor');
  });

  it('renders trust indicators and privacy guarantees', () => {
    render(<HomePage />);

    expect(screen.getByText('100% Anonymous & Local-First')).toBeDefined();
    expect(screen.getByText('No Forced Sign-Up')).toBeDefined();
    expect(screen.getByText('Direct Vector PDF Exports')).toBeDefined();
    expect(screen.getByText('Zero-Hallucination AI')).toBeDefined();
  });

  it('renders all core feature architectural pillars', () => {
    render(<HomePage />);

    expect(screen.getByText('100% Local-First & Private')).toBeDefined();
    expect(screen.getByText('Deterministic ATS Alignment')).toBeDefined();
    expect(screen.getByText('Direct Vector PDF Generation')).toBeDefined();
    expect(screen.getByText('Anti-Hallucination AI Assistant')).toBeDefined();
    expect(screen.getByText('Optional Cloud Sync (Better Auth)')).toBeDefined();
    expect(screen.getByText('JSON Resume Standard')).toBeDefined();
  });

  it('toggles interactive FAQ items open and closed', () => {
    render(<HomePage />);

    const faqQuestion = screen.getByText('Do I need to create an account or provide a credit card?');
    expect(faqQuestion).toBeDefined();

    // Initially open (index 0)
    expect(screen.getByText(/ResuCraft AI is 100% free, open-source, and local-first/i)).toBeDefined();

    // Click to close
    fireEvent.click(faqQuestion);
    expect(screen.queryByText(/ResuCraft AI is 100% free, open-source, and local-first/i)).toBeNull();

    // Click another question to open
    const secondFaq = screen.getByText('How does ResuCraft AI guarantee ATS readability?');
    fireEvent.click(secondFaq);
    expect(screen.getByText(/Unlike graphic resume builders that use complex columns/i)).toBeDefined();
  });
});
