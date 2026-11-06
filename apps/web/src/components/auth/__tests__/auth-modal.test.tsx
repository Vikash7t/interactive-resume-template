// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { AuthModal } from '../AuthModal';
import * as authClientModule from '../../../lib/auth-client';

describe('AuthModal Component', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('does not render when isOpen is false', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as any);

    render(<AuthModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByText(/ResuCraft Account/i)).toBeNull();
  });

  it('renders unauthenticated state with Sign In and Sign Up tabs and Local-First notice', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as any);

    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('ResuCraft Account')).toBeDefined();
    expect(screen.getByText(/Local-First Guarantee/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeDefined();
    expect(screen.getByPlaceholderText('name@example.com')).toBeDefined();
  });

  it('toggles to Create Account tab and displays Full Name field', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: null,
      isPending: false,
      error: null,
    } as any);

    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    const createTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createTab);

    expect(screen.getByPlaceholderText('e.g. Vikash Singh')).toBeDefined();
    expect(screen.getByRole('button', { name: /Register & Enable Cloud Sync/i })).toBeDefined();
  });

  it('renders authenticated session view with user details and Sign Out option', () => {
    vi.spyOn(authClientModule, 'useSession').mockReturnValue({
      data: {
        user: {
          id: 'u-1',
          name: 'Vikash Singh',
          email: 'vikash@example.com',
          emailVerified: true,
        },
        session: {
          id: 's-1',
          userId: 'u-1',
          token: 'tok-123',
          expiresAt: new Date(),
        },
      },
      isPending: false,
      error: null,
    } as any);

    render(<AuthModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('Account & Cloud Sync')).toBeDefined();
    expect(screen.getByText('Vikash Singh')).toBeDefined();
    expect(screen.getByText('vikash@example.com')).toBeDefined();
    expect(screen.getByText(/Cloud Sync Enabled/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign Out/i })).toBeDefined();
  });
});
