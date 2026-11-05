import React, { memo } from 'react';
import type { TemplateProps } from './types';

/**
 * Certified ATS Single-Column Template.
 * Engineered specifically to maximize parsing accuracy on Workday, Greenhouse, Lever, and Taleo.
 *
 * Rules:
 * - 100% semantic DOM elements (h1, h2, ul, li, p)
 * - Single-column natural vertical flow
 * - Zero multi-column tables or floating text frames
 * - System font stack for deterministic character metrics
 * - Page-break resilience (break-inside-avoid on entry cards)
 */
export const AtsSingleColumnTemplate = memo(function AtsSingleColumnTemplate({
  resume,
  className = '',
}: TemplateProps) {
  const { basics, work, education, skills, projects, certificates, languages } = resume;

  return (
    <article
      className={`w-full max-w-2xl bg-white text-slate-900 font-sans p-8 sm:p-10 shadow-lg rounded border transition-all ${className}`}
      style={{
        borderColor: 'var(--border)',
        minHeight: '840px',
        fontFamily: 'Calibri, Arial, "Helvetica Neue", sans-serif',
      }}
    >
      {/* 1. HEADER / BASICS */}
      <header className="text-center pb-3 mb-4 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
          {basics.name || 'Your Full Name'}
        </h1>

        {basics.label && (
          <p className="text-xs font-semibold text-slate-700 tracking-wide mt-0.5">
            {basics.label}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-0.5 text-[11px] text-slate-600 mt-1.5 font-normal">
          {basics.location?.city && (
            <span>
              {basics.location.city}
              {basics.location.countryCode ? `, ${basics.location.countryCode}` : ''}
            </span>
          )}
          {basics.phone && <span>• {basics.phone}</span>}
          {basics.email && (
            <span>
              •{' '}
              <a href={`mailto:${basics.email}`} className="text-slate-900 underline">
                {basics.email}
              </a>
            </span>
          )}
          {basics.url && (
            <span>
              •{' '}
              <a
                href={basics.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 underline"
              >
                {basics.url.replace(/^https?:\/\//, '')}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* 2. EXECUTIVE SUMMARY */}
      {basics.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify">
            {basics.summary}
          </p>
        </section>
      )}

      {/* 3. TECHNICAL SKILLS */}
      {(skills || []).length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1 text-[11.5px] text-slate-800">
            {skills?.map((s, idx) => (
              <p key={s.id || idx} className="leading-snug">
                <strong className="font-semibold text-slate-900">{s.name}: </strong>
                <span>{s.keywords?.join(', ')}</span>
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 4. WORK EXPERIENCE */}
      {(work || []).length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3.5">
            {work?.map((w, idx) => (
              <div key={w.id || idx} className="break-inside-avoid">
                <div className="flex items-baseline justify-between text-[12px]">
                  <div>
                    <strong className="font-bold text-slate-900">{w.position}</strong>
                    <span className="text-slate-700"> — {w.name}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap ml-2">
                    {w.startDate || ''} {w.startDate && (w.endDate || 'Present') ? '–' : ''}{' '}
                    {w.endDate || 'Present'}
                  </span>
                </div>

                {w.summary && (
                  <p className="text-[11px] text-slate-700 italic mt-0.5">
                    {w.summary}
                  </p>
                )}

                {w.highlights && w.highlights.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[11.5px] text-slate-800 leading-normal">
                    {w.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. KEY PROJECTS */}
      {(projects || []).length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Engineering Projects
          </h2>
          <div className="space-y-3">
            {projects?.map((p, idx) => (
              <div key={p.id || idx} className="break-inside-avoid">
                <div className="flex items-baseline justify-between text-[12px]">
                  <div>
                    <strong className="font-bold text-slate-900">{p.name}</strong>
                    {p.keywords && p.keywords.length > 0 && (
                      <span className="text-[11px] text-slate-600 italic">
                        {' '}
                        ({p.keywords.join(', ')})
                      </span>
                    )}
                  </div>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10.5px] text-slate-700 underline truncate max-w-[160px] ml-2"
                    >
                      {p.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                {p.description && (
                  <p className="text-[11px] text-slate-700 mt-0.5 leading-normal">
                    {p.description}
                  </p>
                )}

                {p.highlights && p.highlights.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 space-y-0.5 text-[11.5px] text-slate-800 leading-normal">
                    {p.highlights.map((h, hIdx) => (
                      <li key={hIdx}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. EDUCATION */}
      {(education || []).length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education?.map((e, idx) => (
              <div key={e.id || idx} className="break-inside-avoid">
                <div className="flex items-baseline justify-between text-[12px]">
                  <div>
                    <strong className="font-bold text-slate-900">
                      {e.studyType ? `${e.studyType} in ${e.area || ''}` : e.area || 'Degree'}
                    </strong>
                    <span className="text-slate-700"> — {e.institution}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap ml-2">
                    {e.startDate || ''} {e.startDate && e.endDate ? '–' : ''} {e.endDate || ''}
                  </span>
                </div>

                {e.score && (
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    <strong>Score / GPA:</strong> {e.score}
                  </p>
                )}

                {e.courses && e.courses.length > 0 && (
                  <p className="text-[10.5px] text-slate-600 mt-0.5">
                    <strong>Coursework:</strong> {e.courses.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. CERTIFICATIONS */}
      {(certificates || []).length > 0 && (
        <section className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Certifications
          </h2>
          <div className="space-y-1 text-[11.5px] text-slate-800">
            {certificates?.map((c, idx) => (
              <p key={c.id || idx} className="leading-snug">
                <strong className="font-semibold text-slate-900">{c.name}</strong>
                {c.issuer ? ` — ${c.issuer}` : ''}
                {c.date ? ` (${c.date})` : ''}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 8. LANGUAGES */}
      {(languages || []).length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Languages
          </h2>
          <p className="text-[11.5px] text-slate-800 leading-snug">
            {languages
              ?.map((l) => (l.fluency ? `${l.language} (${l.fluency})` : l.language))
              .join(' • ')}
          </p>
        </section>
      )}
    </article>
  );
});
