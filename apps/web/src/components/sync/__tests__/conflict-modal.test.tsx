// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ConflictResolutionModal } from '../ConflictResolutionModal';
import type { CloudResume } from '@resucraft/shared';

describe('ConflictResolutionModal Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockLocalResume = {
    title: 'Senior Engineer',
    data: {
      basics: {
        name: 'Vikash Singh',
        label: 'Staff Engineer',
        summary: 'Architecting local-first web applications.',
      },
    } as any,
    version: 2,
    updatedAt: '2026-11-06T10:00:00Z',
  };

  const mockServerResume: CloudResume = {
    id: '11111111-1111-1111-1111-111111111111',
    userId: 'u-1',
    title: 'Senior Engineer',
    data: {
      basics: {
        name: 'Vikash Singh',
        label: 'Principal Engineer',
        summary: 'Cloud-synced enterprise scale systems.',
      },
    } as any,
    version: 5,
    clientUpdatedAt: '2026-11-06T12:00:00Z',
    createdAt: '2026-11-06T09:00:00Z',
    updatedAt: '2026-11-06T12:00:00Z',
  };

  it('renders conflict modal and displays both local and cloud versions', () => {
    render(
      <ConflictResolutionModal
        isOpen={true}
        onClose={vi.fn()}
        localResume={mockLocalResume}
        serverResume={mockServerResume}
        onResolve={vi.fn()}
      />,
    );

    expect(screen.getByText('Synchronization Conflict Detected')).toBeDefined();
    expect(screen.getByText('Local Version (This Device)')).toBeDefined();
    expect(screen.getByText('Cloud Version (Remote Server)')).toBeDefined();
    expect(screen.getByText('v2')).toBeDefined();
    expect(screen.getByText('v5')).toBeDefined();
    expect(screen.getByText('Staff Engineer')).toBeDefined();
    expect(screen.getByText('Principal Engineer')).toBeDefined();
  });

  it('triggers onResolve with keep_local when Keep Local button is clicked', () => {
    const handleResolve = vi.fn();
    render(
      <ConflictResolutionModal
        isOpen={true}
        onClose={vi.fn()}
        localResume={mockLocalResume}
        serverResume={mockServerResume}
        onResolve={handleResolve}
      />,
    );

    const keepLocalBtn = screen.getByRole('button', { name: /Keep Local \(Overwrite Cloud\)/i });
    fireEvent.click(keepLocalBtn);

    expect(handleResolve).toHaveBeenCalledWith('keep_local');
  });

  it('triggers onResolve with keep_server when Adopt Cloud button is clicked', () => {
    const handleResolve = vi.fn();
    render(
      <ConflictResolutionModal
        isOpen={true}
        onClose={vi.fn()}
        localResume={mockLocalResume}
        serverResume={mockServerResume}
        onResolve={handleResolve}
      />,
    );

    const adoptCloudBtn = screen.getByRole('button', { name: /Adopt Cloud \(Update Local\)/i });
    fireEvent.click(adoptCloudBtn);

    expect(handleResolve).toHaveBeenCalledWith('keep_server');
  });
});
