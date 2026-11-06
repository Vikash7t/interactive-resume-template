'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Cloud,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  HardDrive,
  User,
} from 'lucide-react';
import { useSession } from '../../lib/auth-client';
import { useResumeStore } from '../../store/resume-store';
import {
  syncResumeToCloud,
  resolveCloudConflict,
} from '../../lib/api/sync-client';
import type { SyncStatus, CloudResume } from '@resucraft/shared';
import { AuthModal } from '../auth/AuthModal';
import { ConflictResolutionModal } from './ConflictResolutionModal';

export function CloudSyncIndicator() {
  const { data: session } = useSession();
  const { resume, title, setResumeData } = useResumeStore();

  const [status, setStatus] = useState<SyncStatus>('local_only');
  const [conflictData, setConflictData] = useState<CloudResume | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [version, setVersion] = useState(1);
  const [isResolving, setIsResolving] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync logic when resume changes and user is authenticated
  const triggerSync = useCallback(async () => {
    if (!session?.user) {
      setStatus('local_only');
      return;
    }

    try {
      setStatus('syncing');
      const res = await syncResumeToCloud({
        title,
        data: resume,
        version,
        clientUpdatedAt: new Date().toISOString(),
      });

      if (res.status === 'conflict' && res.conflict) {
        setStatus('conflict');
        setConflictData(res.conflict.serverResume);
        setConflictModalOpen(true);
      } else if (res.status === 'synced' && res.resume) {
        setStatus('synced');
        setVersion(res.resume.version);
      }
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        setStatus('local_only');
      } else {
        console.warn('Background sync deferred (local changes preserved):', err.message);
        setStatus('error');
      }
    }
  }, [session, resume, title, version]);

  // Debounced auto-sync on content edit (only if logged in)
  useEffect(() => {
    if (!session?.user) {
      setStatus('local_only');
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerSync();
    }, 2000);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [resume, title, session?.user, triggerSync]);

  const handleResolveConflict = async (choice: 'keep_local' | 'keep_server') => {
    if (!conflictData) return;

    try {
      setIsResolving(true);
      if (choice === 'keep_server') {
        // Overwrite local state with cloud state
        setResumeData(conflictData.data);
        setVersion(conflictData.version);
        setStatus('synced');
        setConflictModalOpen(false);
        setConflictData(null);
      } else {
        // Keep local: force update server
        const res = await resolveCloudConflict({
          resolution: 'keep_local',
          resumeId: conflictData.id,
          localData: resume,
          localVersion: version,
          clientUpdatedAt: new Date().toISOString(),
        });

        if (res.resume) {
          setVersion(res.resume.version);
        }
        setStatus('synced');
        setConflictModalOpen(false);
        setConflictData(null);
      }
    } catch (err) {
      console.error('Failed to resolve conflict:', err);
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-1">
        {/* Sync Button / Badge */}
        {!session?.user ? (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Local-only mode. Click to optionally enable cloud backup."
          >
            <HardDrive className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Offline (Local)</span>
            <span className="text-[9.5px] px-1 py-0.2 bg-slate-200 text-slate-600 rounded">
              Sign In
            </span>
          </button>
        ) : status === 'syncing' ? (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <RotateCw className="w-3 h-3 text-purple-600 animate-spin" />
            <span className="hidden sm:inline">Syncing to cloud...</span>
          </div>
        ) : status === 'conflict' ? (
          <button
            type="button"
            onClick={() => setConflictModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer animate-pulse"
            title="Conflict detected. Click to resolve."
          >
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Conflict Detected</span>
          </button>
        ) : status === 'synced' ? (
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            title={`Synced to cloud as ${session.user.name}`}
          >
            <Cloud className="w-3 h-3 text-emerald-600" />
            <span className="hidden sm:inline">Cloud Synced</span>
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
          </button>
        ) : (
          <button
            type="button"
            onClick={triggerSync}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            title="Local changes preserved. Click to retry sync."
          >
            <Cloud className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Sync Offline</span>
          </button>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={() => {
          triggerSync();
        }}
      />

      {/* Conflict Resolution Modal */}
      {conflictData && (
        <ConflictResolutionModal
          isOpen={conflictModalOpen}
          onClose={() => setConflictModalOpen(false)}
          localResume={{
            title,
            data: resume,
            version,
            updatedAt: new Date().toISOString(),
          }}
          serverResume={conflictData}
          onResolve={handleResolveConflict}
          isResolving={isResolving}
        />
      )}
    </>
  );
}
