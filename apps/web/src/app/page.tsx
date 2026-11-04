'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Cpu,
  Sparkles,
  ArrowRight,
  Upload,
  CheckCircle2,
  Database,
  Lock,
  Layers,
  FileCheck,
} from 'lucide-react';
import type { HealthCheckResponse } from '@resucraft/shared';

export default function HomePage() {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);

  useEffect(() => {
    fetch('http://localhost:4000/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setHealthData(data))
      .catch(() => setHealthData(null));
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background Geometric Facets (inspired by pgAdmin splash screen) */}
      <div className="absolute top-0 right-0 -z-10 w-full h-[640px] pointer-events-none opacity-40 overflow-hidden">
        <svg
          className="absolute -top-16 -right-24 w-[760px] h-[640px]"
          viewBox="0 0 760 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="400,0 760,180 520,380" fill="#5E429A" fillOpacity="0.25" />
          <polygon points="220,120 520,380 340,540" fill="#2B5C8F" fillOpacity="0.3" />
          <polygon points="520,380 760,180 760,560" fill="#1C73A6" fillOpacity="0.2" />
          <polygon points="120,320 340,540 240,640" fill="#5E429A" fillOpacity="0.15" />
          <polygon points="340,540 520,380 620,620" fill="#396DA6" fillOpacity="0.35" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Release / Architecture Badge */}
        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full border mb-8 bg-white/80 shadow-xs" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--secondary)' }} />
          <span>ResuCraft AI — Phase 1 Development Foundation Active</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Your experience deserves a{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 50%, var(--accent) 100%)' }}
            >
              better resume.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            Build, refine, and align your resume with transparent job-description insights, private local-first storage, and clean ATS-conscious vector PDF exports.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/editor"
              className="inline-flex items-center space-x-2 text-sm font-semibold text-white px-6 py-3.5 rounded-lg shadow-md transition-all hover:opacity-95 hover:shadow-lg"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <FileText className="w-4 h-4" />
              <span>Build Your Resume</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/editor?action=import"
              className="inline-flex items-center space-x-2 text-sm font-semibold px-5 py-3.5 rounded-lg border bg-white shadow-xs transition-colors hover:bg-slate-50 text-slate-700"
              style={{ borderColor: 'var(--border)' }}
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Import JSON Resume</span>
            </Link>
          </div>

          <p className="mt-3 text-xs text-slate-500 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            <span>Zero paywalls. No mandatory login. 100% private in your browser.</span>
          </p>
        </div>

        {/* Architecture & Engineering Standards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Privacy First */}
          <div className="p-6 rounded-xl border bg-white shadow-xs hover:shadow-md transition-shadow" style={{ borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Privacy-First Architecture</h3>
            <p className="mt-2 text-sm text-slate-600 leading-normal">
              Your career data lives strictly in your browser using IndexedDB. No mandatory cloud storage, no scraping, and no tracking cookies.
            </p>
          </div>

          {/* Card 2: ATS-Conscious Output */}
          <div className="p-6 rounded-xl border bg-white shadow-xs hover:shadow-md transition-shadow" style={{ borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ATS-Conscious Vector PDF</h3>
            <p className="mt-2 text-sm text-slate-600 leading-normal">
              Outputs clean, text-selectable vector PDFs generated with @react-pdf. Guaranteed logical reading order that parsers can read seamlessly.
            </p>
          </div>

          {/* Card 3: Deterministic Job Alignment */}
          <div className="p-6 rounded-xl border bg-white shadow-xs hover:shadow-md transition-shadow" style={{ borderColor: 'var(--border)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Deterministic JD Alignment</h3>
            <p className="mt-2 text-sm text-slate-600 leading-normal">
              Compares your skills and experience against target job descriptions without requiring AI tokens or inventing qualifications.
            </p>
          </div>
        </div>

        {/* Real-Time System & Monorepo Health Monitor */}
        <div className="mt-16 p-6 rounded-xl border bg-slate-900 text-slate-100 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold tracking-wide uppercase text-slate-300">Phase 1 Monorepo Runtime Health</h4>
              </div>
              <p className="text-xs text-slate-400 mt-1">Next.js 15 Frontend ↔ NestJS 11 Backend ↔ PostgreSQL 18 Service</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                API Port: 4000
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                Web Port: 3000
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Frontend App Router</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                <span>Next.js 15 (Active)</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Backend Microservice</span>
              <span className={`font-semibold flex items-center space-x-1 ${healthData ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full inline-block ${healthData ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span>{healthData ? 'NestJS 11 (Connected)' : 'Standby / Autonomous Mode'}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60">
              <span className="text-slate-400 block mb-1">Database Layer</span>
              <span className="text-slate-300 font-semibold flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-blue-400 inline-block" />
                <span>PostgreSQL 18 (Port 5432)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
