// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CloudSyncIndicator } from '../CloudSyncIndicator';
import * as authClientModule from '../../../lib/auth-client';

describe('CloudSyncIndicator Component', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders anonymous offline state when user is not logged in', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as any);

    render(<CloudSyncIndicator />);

    expect(screen.getByText('Offline (Local)')).toBeDefined();
    expect(screen.getByText('Sign In')).toBeDefined();
  });

  it('opens AuthModal when clicking anonymous offline button', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as any);

    render(<CloudSyncIndicator />);

    const signInBtn = screen.getByText('Sign In');
    fireEvent.click(signInBtn);

    expect(screen.getByText('ResuCraft Account')).toBeDefined();
  });

  it('renders Cloud Synced button when authenticated and synced', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: {
        user: { id: 'u1', name: 'Vikash Singh', email: 'vikash@example.com' },
      },
      isPending: false,
      error: null,
    } as any);

    render(<CloudSyncIndicator />);

    // Initially or upon sync state, indicator presents cloud status
    expect(screen.getByTitle(/Synced to cloud|Local changes preserved/i)).toBeDefined();
  });
});
