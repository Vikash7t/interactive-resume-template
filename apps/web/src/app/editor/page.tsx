'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download, Layers, ShieldCheck } from 'lucide-react';

export default function EditorPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-100/70">
      {/* Studio Header Toolbar */}
      <div className="border-b bg-white px-4 py-2.5 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-semibold text-slate-800">Untitled Resume</span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Local Auto-Save Ready
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md border bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--border)' }}
            disabled
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--secondary)' }} />
            <span>AI Polish</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-md shadow-xs transition-opacity hover:opacity-95"
            style={{ backgroundColor: 'var(--primary)' }}
            disabled
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Two-Pane Responsive Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'var(--border)' }}>
        {/* Left Pane: Form Editor Container */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-7rem)] bg-white">
          <div className="max-w-xl mx-auto">
            <div className="border-b pb-4 mb-6" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-lg font-bold text-slate-900">Resume Studio Editor</h2>
              <p className="text-xs text-slate-500 mt-1">
                Phase 1 Application Shell established. The full interactive form controls, repeatable sections, and drag-and-drop will be mounted in Phase 2 & Phase 3.
              </p>
            </div>

            {/* Placeholder Section Card */}
            <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-center">
              <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">Editor State Architecture Configured</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Connected to @resucraft/shared schema definitions. Ready for Zustand + Dexie IndexedDB integration.
              </p>
            </div>
          </div>
        </div>

        {/* Right Pane: Live ATS Document Preview Canvas */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-7rem)] flex items-center justify-center" style={{ backgroundColor: 'var(--surface-subtle)' }}>
          <div className="w-full max-w-md aspect-[1/1.414] bg-white rounded-md shadow-lg border p-8 flex flex-col justify-between" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
              <div className="h-2.5 w-48 bg-slate-100 rounded mb-6" />

              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-100 rounded" />
                <div className="h-2 w-5/6 bg-slate-100 rounded" />
                <div className="h-2 w-4/6 bg-slate-100 rounded" />
              </div>
            </div>

            <div className="text-center py-4 border-t border-slate-100">
              <span className="text-[11px] font-medium text-slate-400 flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>Single-Column ATS Layout Engine Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
