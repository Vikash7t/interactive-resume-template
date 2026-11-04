'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, FileText, ArrowRight, Github } from 'lucide-react';
import type { HealthCheckResponse } from '@resucraft/shared';

export function Navbar() {
  const [backendHealth, setBackendHealth] = useState<{
    status: 'checking' | 'up' | 'down';
    dbStatus: string;
  }>({ status: 'checking', dbStatus: 'unknown' });

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/health', {
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          const data: HealthCheckResponse = await res.json();
          setBackendHealth({
            status: 'up',
            dbStatus: data.services.database.status,
          });
        } else {
          setBackendHealth({ status: 'down', dbStatus: 'offline' });
        }
      } catch {
        setBackendHealth({ status: 'down', dbStatus: 'offline' });
      }
    };

    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Geometric pgAdmin facet aesthetics */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-105" style={{ background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 60%, var(--accent) 100%)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 9L12 16L22 9L12 2Z" fill="white" fillOpacity="0.9" />
              <path d="M2 14L12 21L22 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">ResuCraft</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: 'var(--secondary)' }}>AI</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-1">ATS-Conscious Resume Engine</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
          <Link href="/editor" className="flex items-center space-x-1.5 hover:text-slate-900 transition-colors">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Resume Studio</span>
          </Link>
          <div className="flex items-center space-x-1.5 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer" title="Privacy-first local storage active">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local-First (No Login)</span>
          </div>
        </nav>

        {/* Right Status & Actions */}
        <div className="flex items-center space-x-4">
          {/* API Health Telemetry Pill */}
          <div className="flex items-center space-x-2 text-xs font-medium px-2.5 py-1 rounded-full border bg-slate-50 text-slate-700" style={{ borderColor: 'var(--border)' }}>
            <span
              className={`w-2 h-2 rounded-full ${
                backendHealth.status === 'up'
                  ? 'bg-emerald-500 animate-pulse'
                  : backendHealth.status === 'checking'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
            <span className="hidden sm:inline">
              API: {backendHealth.status === 'up' ? `Online (DB ${backendHealth.dbStatus})` : backendHealth.status === 'checking' ? 'Checking...' : 'Offline (Local-First)'}
            </span>
          </div>

          <Link
            href="/editor"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white px-3.5 py-2 rounded-md shadow-sm transition-all hover:opacity-95"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <span>Open Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
