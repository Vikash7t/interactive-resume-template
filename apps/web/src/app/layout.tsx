import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Github, Shield, FileText, CheckCircle2, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ResuCraft AI — The Open, ATS-Conscious AI Resume Engine',
  description:
    'Build, refine and tailor your resume with transparent job-description insights, private local storage, and clean ATS-conscious vector PDF exports.',
  keywords: [
    'Resume Builder',
    'ATS Resume',
    'AI Resume Assistant',
    'Job Description Alignment',
    'Local-First Resume',
    'PDF Resume Generator',
    'JSON Resume',
  ],
  authors: [{ name: 'Vikash Singh', url: 'https://github.com/Vikash7t' }],
  openGraph: {
    title: 'ResuCraft AI — The Open, ATS-Conscious AI Resume Engine',
    description:
      'Build, refine and tailor your resume with transparent job-description insights, private local storage, and clean vector PDF exports.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800">
        <Navbar />
        <main className="flex-1">{children}</main>

        <footer
          className="border-t bg-white py-12 text-xs text-slate-600"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-slate-900">ResuCraft</span>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded text-white"
                  style={{ backgroundColor: 'var(--secondary)' }}
                >
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-sm leading-relaxed">
                Enterprise-grade, privacy-first, ATS-conscious AI Resume Builder & Job Description Alignment MVP. Built with Next.js 15, NestJS 11, Tailwind CSS v4, and PostgreSQL.
              </p>
              <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-500">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero telemetry • Local-First IndexedDB guarantee</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <Link href="/editor" className="hover:text-slate-900 transition-colors">
                    Resume Studio
                  </Link>
                </li>
                <li>
                  <a href="/#features" className="hover:text-slate-900 transition-colors">
                    Core Features
                  </a>
                </li>
                <li>
                  <a href="/#features" className="hover:text-slate-900 transition-colors">
                    ATS Single-Column Template
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Open Source</h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <a
                    href="https://github.com/Vikash7t/interactive-resume-template"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 hover:text-slate-900 transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 mr-1" />
                    <span>GitHub Repository</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Vikash7t/interactive-resume-template/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 transition-colors"
                  >
                    MIT License
                  </a>
                </li>
                <li>
                  <span className="text-slate-400">JSON Resume Schema v1.0.0</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} ResuCraft AI. Built by Vikash Singh.</p>
            <p className="mt-2 sm:mt-0">Free & Open Source under the MIT License.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
