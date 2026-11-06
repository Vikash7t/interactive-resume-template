import React, { useState, useMemo } from 'react';
import {
  X,
  Target,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import type { ResumeData } from '@resucraft/shared';
import { analyzeJobAlignment } from '@resucraft/shared';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Textarea } from '../ui/Textarea';

export interface JobAlignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    label: 'Full-Stack (TS / React / AWS)',
    text: `Senior Full-Stack Engineer

Basic Qualifications:
- 4+ years of professional software engineering experience
- Strong proficiency in TypeScript, React, and Node.js
- Production experience with PostgreSQL and Redis
- Solid background deploying to AWS and writing Docker containers

Preferred Qualifications:
- Hands-on knowledge of Next.js and Tailwind CSS
- Experience implementing CI/CD pipelines with GitHub Actions
- Familiarity with GraphQL and Microservices architecture`,
  },
  {
    label: 'Backend & Cloud (Go / K8s / Systems)',
    text: `Staff Backend Systems Architect

Minimum Qualifications:
- Expertise in Go or Rust
- Proven track record with Distributed Systems and Event-Driven Architecture
- Deep understanding of PostgreSQL, Redis, and message queues (Kafka)
- Experience running large-scale workloads on Kubernetes (K8s)

Preferred Qualifications:
- Familiarity with gRPC and protocol buffers
- Infrastructure as Code with Terraform
- Background in high-frequency low-latency systems and OWASP security`,
  },
];

export function JobAlignmentModal({ isOpen, onClose, resume }: JobAlignmentModalProps) {
  const [jdText, setJdText] = useState(SAMPLE_JOB_DESCRIPTIONS[0].text);
  const [activeTab, setActiveTab] = useState<'matched' | 'missing' | 'sections' | 'suggestions'>('matched');

  // Real-time deterministic analysis (zero network overhead, instant reactivity)
  const alignmentResult = useMemo(() => {
    return analyzeJobAlignment(jdText, resume);
  }, [jdText, resume]);

  if (!isOpen) return null;

  const { scoreBreakdown, matchedSkills, missingSkills, sectionCoverage, suggestions, disclaimer } =
    alignmentResult;

  const scoreColor =
    scoreBreakdown.score >= 75
      ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
      : scoreBreakdown.score >= 50
        ? 'text-amber-700 bg-amber-50 border-amber-300'
        : 'text-rose-700 bg-rose-50 border-rose-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-2xl border w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/80"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center space-x-2.5">
            <div
              className="p-1.5 rounded-lg text-white"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Job Description Alignment Engine
              </h2>
              <p className="text-[11px] text-slate-500">
                Deterministic ATS Keyword Matcher • 100% In-Browser Privacy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close alignment modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Split 2-column or stack on mobile */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'var(--border)' }}>
          {/* Left Column: Target Job Description Input (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-slate-50/50 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800">
                Target Job Description
              </label>
              {jdText && (
                <button
                  type="button"
                  onClick={() => setJdText('')}
                  className="text-[10.5px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Quick Samples */}
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Load Sample Target Role:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJdText(sample.text)}
                    className="px-2 py-1 text-[11px] font-medium bg-white border border-slate-200 rounded text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste target job description or requirements here..."
              rows={14}
              className="w-full flex-1 text-xs font-mono bg-white resize-none"
            />

            <div className="mt-3 p-2.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-[11px] text-slate-700 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Non-Deceptive Ethical Guarantee:</strong> We only highlight skills you genuinely possess. Never falsify experience to manipulate ATS metrics.
              </span>
            </div>
          </div>

          {/* Right Column: Real-Time Alignment Analytics (7 cols) */}
          <div className="lg:col-span-7 p-5 flex flex-col bg-white">
            {/* Scorecard Header */}
            <div className="p-4 rounded-xl border bg-slate-50/60 mb-4" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                    Alignment Coverage
                  </span>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {scoreBreakdown.score}%
                    </span>
                    <span className="text-xs text-slate-500">
                      ({scoreBreakdown.matchedRequiredCount + scoreBreakdown.matchedPreferredCount} / {scoreBreakdown.totalRequiredCount + scoreBreakdown.totalPreferredCount} matched)
                    </span>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${scoreColor}`}>
                  {scoreBreakdown.score >= 75
                    ? 'Strong Alignment'
                    : scoreBreakdown.score >= 50
                      ? 'Moderate Alignment'
                      : 'Needs Alignment'}
                </div>
              </div>

              {/* Mathematical Formula Explanation */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span>{scoreBreakdown.formulaDescription}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-4 gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('matched')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'matched'
                    ? 'border-b-2 text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={activeTab === 'matched' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
              >
                Matched ({matchedSkills.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('missing')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'missing'
                    ? 'border-b-2 text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={activeTab === 'missing' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
              >
                Missing ({missingSkills.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sections')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'sections'
                    ? 'border-b-2 text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={activeTab === 'sections' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
              >
                Section Coverage
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('suggestions')}
                className={`pb-2 transition-colors cursor-pointer ${
                  activeTab === 'suggestions'
                    ? 'border-b-2 text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                style={activeTab === 'suggestions' ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
              >
                Suggestions ({suggestions.length})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px]">
              {/* TAB 1: MATCHED SKILLS */}
              {activeTab === 'matched' && (
                <div>
                  {matchedSkills.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No matched keywords found yet. Try pasting requirements in the left panel.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {matchedSkills.map((m) => (
                        <div
                          key={m.canonical}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="text-xs font-bold text-slate-800">
                                  {m.skill}
                                </span>
                                {m.matchType === 'synonym' && m.aliasMatched && (
                                  <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                                    via alias: {m.aliasMatched}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 text-[10.5px] text-slate-500 mt-0.5">
                                <span>Found in:</span>
                                {m.matchedInSections.map((sec) => (
                                  <Badge key={sec} variant="outline" className="text-[9.5px] px-1.5 py-0">
                                    {sec}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <Badge variant={m.priority === 'required' ? 'primary' : 'secondary'}>
                            {m.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: MISSING SKILLS */}
              {activeTab === 'missing' && (
                <div>
                  {missingSkills.length === 0 ? (
                    <div className="text-center py-8 text-xs text-emerald-600 font-medium flex flex-col items-center">
                      <CheckCircle2 className="w-6 h-6 mb-1" />
                      <span>Outstanding! 100% of detected JD requirements match your resume.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {missingSkills.map((m) => (
                        <div
                          key={m.canonical}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <AlertCircle className={`w-4 h-4 shrink-0 ${m.priority === 'required' ? 'text-rose-500' : 'text-amber-500'}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-800">
                                {m.skill}
                              </span>
                              <p className="text-[10.5px] text-slate-500 mt-0.5">
                                {m.priority === 'required'
                                  ? 'Core requirement in job posting'
                                  : 'Preferred / nice-to-have qualification'}
                              </p>
                            </div>
                          </div>

                          <Badge variant={m.priority === 'required' ? 'danger' : 'warning'}>
                            {m.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SECTION COVERAGE */}
              {activeTab === 'sections' && (
                <div className="space-y-2.5">
                  {sectionCoverage.map((sec) => (
                    <div
                      key={sec.section}
                      className="p-3 rounded-lg border border-slate-200 bg-white"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
                        <span className="flex items-center space-x-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          <span>{sec.label}</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {sec.matchCount} {sec.matchCount === 1 ? 'match' : 'matches'}
                        </span>
                      </div>
                      {sec.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {sec.skills.map((s) => (
                            <Badge key={s} variant="success" className="text-[10px]">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10.5px] text-slate-400 italic mt-0.5">
                          No matching keywords found in this section.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SUGGESTIONS */}
              {activeTab === 'suggestions' && (
                <div className="space-y-2.5">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No specific suggestions for this configuration.
                    </div>
                  ) : (
                    suggestions.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/70"
                      >
                        <div className="flex items-start space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{s.title}</h4>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {s.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Disclaimer Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 leading-tight">
              {disclaimer}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="px-6 py-3 border-t bg-slate-50 flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-[11px] text-slate-500">
            ResuCraft Deterministic Matcher • Fully reproducible
          </span>

          <Button type="button" variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
