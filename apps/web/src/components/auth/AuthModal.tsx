'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Cloud,
} from 'lucide-react';
import { signIn, signUp, signOut, useSession } from '../../lib/auth-client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await signIn.email({
        email: email.trim(),
        password,
      });

      if (res.error) {
        setErrorMsg(res.error.message || 'Failed to sign in. Please verify your credentials.');
      } else {
        setSuccessMsg('Signed in successfully!');
        if (onAuthSuccess) onAuthSuccess();
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred connecting to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }

    setLoading(true);

    try {
      const res = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      });

      if (res.error) {
        setErrorMsg(res.error.message || 'Failed to register account.');
      } else {
        setSuccessMsg('Account created successfully!');
        if (onAuthSuccess) onAuthSuccess();
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred connecting to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl border w-full max-w-md overflow-hidden flex flex-col"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between bg-slate-50/80"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="p-1.5 rounded-lg text-white"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                {session?.user ? 'Account & Cloud Sync' : 'ResuCraft Account'}
              </h3>
              <p className="text-[10.5px] text-slate-500">
                Optional Cloud Backup • Local Privacy Preserved
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close authentication modal"
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          {session?.user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Current User
                  </span>
                  <Badge variant="primary" className="text-[9.5px]">
                    <Cloud className="w-3 h-3 mr-1" />
                    Cloud Sync Enabled
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{session.user.name}</p>
                  <p className="text-xs text-slate-500">{session.user.email}</p>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Your resumes are automatically backed up to your private cloud with version control.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <p className="text-[10px] text-slate-400 leading-tight">
                  Signing out preserves all your local resumes in this browser.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            /* Unauthenticated View: Sign In / Sign Up */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setTab('signin');
                    setErrorMsg(null);
                  }}
                  className={`py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                    tab === 'signin'
                      ? 'bg-white shadow-xs text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('signup');
                    setErrorMsg(null);
                  }}
                  className={`py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                    tab === 'signup'
                      ? 'bg-white shadow-xs text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-[11px] text-rose-700 flex items-start space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
                {tab === 'signup' && (
                  <Input
                    label="Full Name *"
                    placeholder="e.g. Vikash Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                )}

                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password *"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={loading}
                  className="w-full text-xs mt-2"
                >
                  {loading ? (
                    'Processing...'
                  ) : tab === 'signin' ? (
                    <>
                      <LogIn className="w-3.5 h-3.5 mr-1" />
                      Sign In to ResuCraft
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      Register & Enable Cloud Sync
                    </>
                  )}
                </Button>
              </form>

              {/* Ethical Local-First Guarantee Notice */}
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200/80 text-[10.5px] text-slate-500 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Local-First Guarantee:</strong> Accounts are completely optional. ResuCraft works 100% offline in your browser without an account.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
