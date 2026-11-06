'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Cpu,
  Sparkles,
  ArrowRight,
  Upload,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Target,
  Database,
  ExternalLink,
  Github,
  Zap,
  Check,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Do I need to create an account or provide a credit card?',
      a: 'No. ResuCraft AI is 100% free, open-source, and local-first. You can build, edit, tailor, and export full PDF resumes without ever creating an account. All your data stays securely in your browser’s IndexedDB storage.',
    },
    {
      q: 'How does ResuCraft AI guarantee ATS readability?',
      a: 'Unlike graphic resume builders that use complex columns, floating text frames, or raster images, ResuCraft AI renders direct vector single-column PDFs using standard typography. We run automated machine extraction test suites verifying 100% text selectability and logical reading order.',
    },
    {
      q: 'How does the Job Description Alignment Engine work?',
      a: 'It is a deterministic, explainable algorithm running entirely offline in your browser. It extracts required and preferred qualifications, aliases, and technical n-grams, calculating an honest match percentage and pinpointing specific keywords your resume is missing.',
    },
    {
      q: 'What prevents the AI assistant from inventing false qualifications?',
      a: 'ResuCraft AI enforces strict anti-hallucination guardrails via structured Zod schema output validation. The AI is strictly forbidden from fabricating numbers, employers, or tools. If a measurable impact is unquantified, it generates a bracketed placeholder like [X%] and prompts you to provide your real achievement.',
    },
    {
      q: 'Is my data private if I choose to enable Cloud Sync?',
      a: 'Yes. Cloud synchronization is strictly opt-in using Better Auth and PostgreSQL. Resumes are version-controlled with optimistic concurrency conflict detection. Signing out preserves all your local resumes in this browser.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-slate-50/50">
      {/* Background Geometric Facets (pgAdmin-inspired architectural aesthetic) */}
      <div className="absolute top-0 right-0 -z-10 w-full h-[720px] pointer-events-none opacity-40 overflow-hidden">
        <svg
          className="absolute -top-16 -right-24 w-[760px] h-[720px]"
          viewBox="0 0 760 720"
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 space-y-24">
        {/* ================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ================================================================= */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full border bg-white/90 shadow-xs" style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ResuCraft AI 1.0 — Privacy-First & Production Ready</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Your experience deserves a{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 70%, var(--accent) 100%)',
              }}
            >
              better resume.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Build, refine and tailor your resume with transparent job-description insights, private local storage and clean ATS-conscious vector PDF exports.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/editor"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-semibold text-white px-6 py-3 rounded-lg shadow-md transition-all hover:opacity-95 hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <FileText className="w-4 h-4" />
              <span>Build Your Resume</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-medium text-slate-700 bg-white border px-5 py-3 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
              style={{ borderColor: 'var(--border)' }}
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Anonymous & Local-First</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>No Forced Sign-Up</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Vector PDF Exports</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero-Hallucination AI</span>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. VISUAL PREVIEW & WORKFLOW SHOWCASE */}
        {/* ================================================================= */}
        <section className="rounded-2xl border bg-white p-4 sm:p-6 shadow-xl relative overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between border-b pb-3 mb-4 text-xs font-semibold text-slate-700" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-slate-400 text-[11px] ml-2">resucraft.dev/editor</span>
            </div>
            <Badge variant="success" className="text-[10px]">
              Live ATS Single-Column Layout
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Interactive Controls Preview */}
            <div className="lg:col-span-5 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-600" />
                    <span>Job Description Alignment</span>
                  </span>
                  <span className="font-bold text-emerald-600 font-mono text-[11px]">88% Match</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Deterministic keyword extraction comparing skills against your target job.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">✓ TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">✓ Next.js 15</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-medium">✓ PostgreSQL</span>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-medium">✗ Kubernetes (Missing)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Bullet Enhancement</span>
                  </span>
                  <Badge variant="primary" className="text-[9.5px]">Anti-Hallucination</Badge>
                </div>
                <p className="text-[11px] text-purple-900 leading-snug">
                  "Architected Next.js microservices reducing latency by <strong className="text-purple-700 bg-purple-100 px-1 rounded">[X%]</strong>."
                </p>
                <p className="text-[10px] text-purple-700 italic">
                  💡 Injects real measurable metrics instead of inventing fake achievements.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Direct Vector PDF</p>
                  <p className="text-[10.5px] text-slate-500">100% extractable text with zero clipping.</p>
                </div>
                <Link
                  href="/editor"
                  className="px-3 py-1.5 rounded bg-slate-900 text-white font-medium text-[11px] hover:bg-slate-800 transition-colors"
                >
                  Try Now
                </Link>
              </div>
            </div>

            {/* Right: Rendered Resume Mock Card */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-300 p-6 shadow-sm font-sans space-y-4 text-slate-800">
              <div className="border-b pb-3">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Vikash Singh</h2>
                <p className="text-xs font-semibold text-slate-700">Staff Distributed Systems Engineer</p>
                <p className="text-[10.5px] text-slate-500 font-mono mt-0.5">San Francisco, CA • vikash@resucraft.dev • linkedin.com/in/vikash • github.com/Vikash7t</p>
              </div>

              <div className="space-y-1">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">Professional Summary</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Principal-level Full-Stack and Distributed Systems Engineer with 8+ years architecting high-throughput, local-first web applications using Next.js, Node.js, and PostgreSQL.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">Core Technical Skills</h3>
                <p className="text-[10.5px] text-slate-700 leading-tight">
                  <strong className="text-slate-900">Languages & Frameworks:</strong> TypeScript, JavaScript, React 19, Next.js 15, NestJS, Node.js, Tailwind CSS v4
                </p>
                <p className="text-[10.5px] text-slate-700 leading-tight">
                  <strong className="text-slate-900">Databases & Cloud:</strong> PostgreSQL 18, Prisma ORM, Dexie IndexedDB, Docker, AWS, Better Auth
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">Experience Highlights</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-900">
                    <span>Staff Engineer — Tech Enterprise Corp</span>
                    <span className="font-mono text-slate-500 text-[10px]">2022 – Present</span>
                  </div>
                  <ul className="list-disc list-inside text-[10.5px] text-slate-700 space-y-0.5">
                    <li>Architected distributed microservices handling 45,000+ RPS with sub-35ms p99 response times.</li>
                    <li>Designed local-first Dexie IndexedDB caching layer ensuring 100% offline availability for 150k active users.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. CORE ARCHITECTURAL PILLARS (FEATURES) */}
        {/* ================================================================= */}
        <section id="features" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Engineered with Architectural Rigor</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ResuCraft AI replaces deceptive black-box resume tools with transparent engineering and user ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-white shadow-xs space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2.5 rounded-lg text-white w-fit" style={{ backgroundColor: 'var(--primary)' }}>
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">100% Local-First & Private</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your resume data is stored in your browser’s IndexedDB via Dexie. No tracking, no mandatory cloud sync, and zero silent data uploads.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-xs space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2.5 rounded-lg text-white w-fit" style={{ backgroundColor: 'var(--secondary)' }}>
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Deterministic ATS Alignment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mathematically transparent keyword coverage engine. Differentiates between required and preferred skills without relying on expensive external AI APIs.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-xs space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2.5 rounded-lg text-white w-fit" style={{ backgroundColor: 'var(--accent)' }}>
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Direct Vector PDF Generation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct vector PDF export via @react-pdf/renderer. Automated unit tests ensure selectable text, strict reading order, and multi-page pagination.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-xs space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2.5 rounded-lg text-white w-fit bg-purple-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Anti-Hallucination AI Assistant</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Powered by Gemini Flash via Vercel AI SDK. Strict guardrails prevent fabricated metrics or fake skills, prompting you with [X%] placeholders.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-xs space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2.5 rounded-lg text-white w-fit bg-indigo-700">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Optional Cloud Sync (Better Auth)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opt-in encrypted cloud backups backed by PostgreSQL & Prisma. Optimistic concurrency conflict resolution protects against multi-device overwrites.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-white shadow-xs space-y-3" style={{ borderColor: 'var(--border)' }}>
              <div className="p-2.5 rounded-lg text-white w-fit bg-emerald-700">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">JSON Resume Standard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full schema compatibility with standard JSON Resume. Effortlessly import or export your raw resume data at any time with zero vendor lock-in.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. HOW IT WORKS */}
        {/* ================================================================= */}
        <section className="space-y-8 bg-white p-8 rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">How It Works in 3 Steps</h2>
            <p className="text-xs text-slate-500">Go from rough bullet points to an ATS-optimized PDF in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-600 font-mono">STEP 01</span>
              <h3 className="text-sm font-bold text-slate-900">Input Your Career History</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fill in structured form sections for experience, skills, and projects, or paste your existing JSON Resume for instant auto-fill.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-600 font-mono">STEP 02</span>
              <h3 className="text-sm font-bold text-slate-900">Align with Target Job Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste the job description you are targeting. View matched keywords and use the AI assistant to upgrade bullets with measurable STAR outcomes.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-600 font-mono">STEP 03</span>
              <h3 className="text-sm font-bold text-slate-900">Download ATS Vector PDF</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Export a clean, machine-parsable vector PDF. Ready to submit directly to Greenhouse, Workday, Lever, and other major ATS platforms.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. INTERACTIVE FAQ */}
        {/* ================================================================= */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500">Everything you need to know about our privacy and ATS guarantees.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border bg-white overflow-hidden transition-all shadow-xs"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-slate-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t pt-3 bg-slate-50/50" style={{ borderColor: 'var(--border)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. CALL TO ACTION BANNER */}
        {/* ================================================================= */}
        <section
          className="rounded-2xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl"
          style={{
            background:
              'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 70%, var(--accent) 100%)',
          }}
        >
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to craft an ATS-winning resume?
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Start building your ATS-compliant resume right now. Completely free, no registration required, with 100% private local storage.
            </p>
          </div>

          <div>
            <Link
              href="/editor"
              className="inline-flex items-center space-x-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-slate-100 transition-all text-xs"
            >
              <FileText className="w-4 h-4 text-purple-700" />
              <span>Launch Resume Studio</span>
              <ArrowRight className="w-4 h-4 text-slate-700" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
