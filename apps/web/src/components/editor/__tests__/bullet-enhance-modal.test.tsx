// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BulletEnhanceModal } from '../BulletEnhanceModal';
import * as aiClient from '../../../lib/api/ai-client';

describe('BulletEnhanceModal Component', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const mockEnhanceResponse = {
    original: 'Built a web application with Next.js',
    options: [
      {
        style: 'action_impact' as const,
        text: 'Architected high-throughput web application using Next.js, boosting responsiveness by [X%].',
        rationale: 'Strong action verb emphasizing engineering rigor and measurable outcome.',
        missingMetricPrompt: 'What percentage improvement in responsiveness was achieved?',
      },
      {
        style: 'technical_depth' as const,
        text: 'Spearheaded full-stack Next.js architecture with SSR caching and edge rendering.',
        rationale: 'Highlights technical architecture and low-latency infrastructure design.',
      },
      {
        style: 'concise' as const,
        text: 'Built and deployed scalable Next.js web application.',
        rationale: 'Concise, high-signal phrasing for recruiters.',
      },
    ],
    provider: 'gemini-1.5-flash',
    disclaimer: 'Verified anti-hallucination safe.',
  };

  it('does not render when isOpen is false', () => {
    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <BulletEnhanceModal
        isOpen={false}
        onClose={handleClose}
        originalBullet="Wrote code"
        onApply={handleApply}
      />,
    );

    expect(screen.queryByText(/AI Bullet Enhancement Assistant/i)).toBeNull();
  });

  it('renders modal and displays original bullet and context', async () => {
    vi.spyOn(aiClient, 'requestBulletEnhancement').mockResolvedValue(mockEnhanceResponse);

    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <BulletEnhanceModal
        isOpen={true}
        onClose={handleClose}
        originalBullet="Built a web application with Next.js"
        roleTitle="Staff Software Engineer"
        company="Acme Corp"
        onApply={handleApply}
      />,
    );

    expect(screen.getByText(/AI Bullet Enhancement Assistant/i)).toBeDefined();
    expect(screen.getByText(/Staff Software Engineer at Acme Corp/i)).toBeDefined();
    expect(screen.getByText(/"Built a web application with Next.js"/i)).toBeDefined();

    await waitFor(() => {
      expect(
        screen.getAllByText(/Architected high-throughput web application/i).length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  it('allows selecting an alternative style and applies it', async () => {
    vi.spyOn(aiClient, 'requestBulletEnhancement').mockResolvedValue(mockEnhanceResponse);

    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <BulletEnhanceModal
        isOpen={true}
        onClose={handleClose}
        originalBullet="Built a web application with Next.js"
        onApply={handleApply}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Spearheaded full-stack Next.js architecture/i)).toBeDefined();
    });

    // Click second option (Technical Rigor)
    const techOption = screen.getByText(/Spearheaded full-stack Next.js architecture/i);
    fireEvent.click(techOption);

    // Click Apply
    const applyBtn = screen.getByRole('button', { name: /Apply Selected Alternative/i });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      'Spearheaded full-stack Next.js architecture with SSR caching and edge rendering.',
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('injects user custom metric into [X%] placeholder before applying', async () => {
    vi.spyOn(aiClient, 'requestBulletEnhancement').mockResolvedValue(mockEnhanceResponse);

    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <BulletEnhanceModal
        isOpen={true}
        onClose={handleClose}
        originalBullet="Built a web application with Next.js"
        onApply={handleApply}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Quantify Your Real Achievement/i)).toBeDefined();
    });

    const metricInput = screen.getByPlaceholderText(/e\.g\. 45%, 3\.5x/i);
    fireEvent.change(metricInput, { target: { value: '42%' } });

    expect(screen.getByText(/✓ Injected into preview/i)).toBeDefined();

    // Click Apply
    const applyBtn = screen.getByRole('button', { name: /Apply Selected Alternative/i });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      'Architected high-throughput web application using Next.js, boosting responsiveness by 42%.',
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('toggles BYOK API key input accordion', async () => {
    vi.spyOn(aiClient, 'requestBulletEnhancement').mockResolvedValue(mockEnhanceResponse);

    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <BulletEnhanceModal
        isOpen={true}
        onClose={handleClose}
        originalBullet="Built a web application with Next.js"
        onApply={handleApply}
      />,
    );

    const byokToggle = screen.getByRole('button', { name: /Use Custom Gemini Key \(BYOK\)/i });
    fireEvent.click(byokToggle);

    expect(screen.getByPlaceholderText('AIzaSy...')).toBeDefined();
    expect(screen.getByText(/Session-only \(never saved\)/i)).toBeDefined();
  });
});
