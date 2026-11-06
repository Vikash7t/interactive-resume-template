'use client';

import React from 'react';
import { AlertTriangle, HardDrive, Cloud, ArrowRight, Check } from 'lucide-react';
import type { CloudResume, ResumeData } from '@resucraft/shared';
import { Button } from '../ui/Button';

export interface ConflictResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  localResume: {
    title: string;
    data: ResumeData;
    version: number;
    updatedAt: string;
  };
  serverResume: CloudResume;
  onResolve: (choice: 'keep_local' | 'keep_server') => void;
  isResolving?: boolean;
}

export function ConflictResolutionModal({
  isOpen,
  onClose,
  localResume,
  serverResume,
  onResolve,
  isResolving = false,
}: ConflictResolutionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl border w-full max-w-2xl overflow-hidden flex flex-col"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-amber-200 bg-amber-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-500 text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-950">
                Synchronization Conflict Detected
              </h3>
              <p className="text-[10.5px] text-amber-800">
                A newer version of this resume was saved in the cloud from another device or session.
              </p>
            </div>
          </div>
        </div>

        {/* Content: Side-by-Side Comparison */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 leading-snug text-[11px]">
            Please review the versions below and choose how to proceed. Your local data will remain safe until you confirm.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Version Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
              <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
                <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                <span>Local Version (This Device)</span>
              </div>
              <div className="text-[10.5px] space-y-1 text-slate-600 font-mono">
                <div>Version: <span className="font-bold text-slate-800">v{localResume.version}</span></div>
                <div>Timestamp: {new Date(localResume.updatedAt).toLocaleString()}</div>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 text-[11px] text-slate-700 max-h-32 overflow-y-auto space-y-1">
                <p className="font-semibold text-slate-900">{localResume.data.basics?.name || 'Unnamed'}</p>
                <p className="text-slate-500 text-[10px] italic">{localResume.data.basics?.label || 'No title'}</p>
                <p className="text-[10px] text-slate-600 truncate">{localResume.data.basics?.summary || 'No summary'}</p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onResolve('keep_local')}
                disabled={isResolving}
                className="w-full text-xs font-semibold text-slate-800"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Keep Local (Overwrite Cloud)
              </Button>
            </div>

            {/* Cloud Version Card */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2.5">
              <div className="flex items-center space-x-1.5 text-purple-950 font-bold text-xs">
                <Cloud className="w-3.5 h-3.5 text-purple-600" />
                <span>Cloud Version (Remote Server)</span>
              </div>
              <div className="text-[10.5px] space-y-1 text-purple-900 font-mono">
                <div>Version: <span className="font-bold text-purple-800">v{serverResume.version}</span></div>
                <div>Timestamp: {new Date(serverResume.updatedAt).toLocaleString()}</div>
              </div>
              <div className="p-2 rounded bg-white border border-purple-200 text-[11px] text-slate-700 max-h-32 overflow-y-auto space-y-1">
                <p className="font-semibold text-slate-900">{serverResume.data?.basics?.name || 'Unnamed'}</p>
                <p className="text-slate-500 text-[10px] italic">{serverResume.data?.basics?.label || 'No title'}</p>
                <p className="text-[10px] text-slate-600 truncate">{serverResume.data?.basics?.summary || 'No summary'}</p>
              </div>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => onResolve('keep_server')}
                disabled={isResolving}
                className="w-full text-xs font-semibold"
              >
                <ArrowRight className="w-3.5 h-3.5 mr-1" />
                Adopt Cloud (Update Local)
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t bg-slate-50 flex items-center justify-between text-[10.5px] text-slate-500">
          <span>Neither option will cause permanent data loss without confirmation.</span>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isResolving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
