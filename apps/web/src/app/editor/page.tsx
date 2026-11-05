'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Download,
  Layers,
  ShieldCheck,
  Undo2,
  Redo2,
  Upload,
  FileJson,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  User,
} from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import type { ResumeSectionId } from '@resucraft/shared';

export default function EditorPage() {
  const {
    resume,
    title,
    activeSection,
    isSaving,
    lastSavedAt,
    updateBasics,
    addWorkExperience,
    removeWorkExperience,
    addSkill,
    removeSkill,
    addProject,
    removeProject,
    setActiveSection,
    initializeStore,
    importFromJson,
    exportToJson,
  } = useResumeStore();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Dexie IndexedDB rehydration on client mount
  useEffect(() => {
    setMounted(true);
    initializeStore();
  }, [initializeStore]);

  // Undo / Redo controls via Zundo temporal store
  const handleUndo = () => {
    useResumeStore.temporal.getState().undo();
  };

  const handleRedo = () => {
    useResumeStore.temporal.getState().redo();
  };

  const handleExportJson = () => {
    const jsonStr = exportToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.basics.name ? resume.basics.name.toLowerCase().replace(/\s+/g, '-') : 'resume'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessImport = () => {
    setImportErrors([]);
    const res = importFromJson(importInput);
    if (res.success) {
      setImportModalOpen(false);
      setImportInput('');
    } else if (res.errors) {
      setImportErrors(res.errors);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportInput(content);
        const res = importFromJson(content);
        if (res.success) {
          setImportModalOpen(false);
          setImportInput('');
        } else if (res.errors) {
          setImportErrors(res.errors);
        }
      }
    };
    reader.readAsText(file);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <Clock className="w-4 h-4 animate-spin" style={{ color: 'var(--primary)' }} />
          <span>Rehydrating local resume from IndexedDB...</span>
        </div>
      </div>
    );
  }

  const sections: { id: ResumeSectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'basics', label: 'Personal Info', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'work', label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
  ];

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
            <span>Home</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-800">{resume.basics.name || title}</span>

          {/* Autosave Status Pill */}
          <div className="flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border" style={{ borderColor: 'var(--border)' }}>
            {isSaving ? (
              <>
                <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                <span>Saving to IndexedDB...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Saved locally</span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls & Undo/Redo */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center border rounded-md mr-1" style={{ borderColor: 'var(--border)' }}>
            <button
              type="button"
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-l-md transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-r-md border-l transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setImportModalOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center space-x-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            disabled
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-md shadow-xs opacity-80 cursor-not-allowed"
            style={{ backgroundColor: 'var(--primary)' }}
            title="PDF Renderer will be wired in Phase 4"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF (Phase 4)</span>
          </button>
        </div>
      </div>

      {/* Two-Pane Responsive Studio Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'var(--border)' }}>
        {/* Left Pane: Interactive Editor Forms */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-7rem)] bg-white">
          <div className="max-w-xl mx-auto">
            {/* Navigation Tabs for Active Section */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg mb-6 border" style={{ borderColor: 'var(--border)' }}>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeSection === sec.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  style={activeSection === sec.id ? { color: 'var(--primary)' } : {}}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* SECTION: BASICS (PERSONAL INFO) */}
            {activeSection === 'basics' && (
              <div className="space-y-4">
                <div className="border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
                  <p className="text-xs text-slate-500">Essential contact details and professional title.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={resume.basics.name}
                      onChange={(e) => updateBasics({ name: e.target.value })}
                      placeholder="e.g. Vikash Singh"
                      className="w-full px-3 py-2 rounded-md border text-slate-900 focus:outline-none focus:ring-1"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Professional Title</label>
                    <input
                      type="text"
                      value={resume.basics.label || ''}
                      onChange={(e) => updateBasics({ label: e.target.value })}
                      placeholder="e.g. Full-Stack Software Developer"
                      className="w-full px-3 py-2 rounded-md border text-slate-900 focus:outline-none focus:ring-1"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.basics.email || ''}
                      onChange={(e) => updateBasics({ email: e.target.value })}
                      placeholder="e.g. vikash@example.com"
                      className="w-full px-3 py-2 rounded-md border text-slate-900 focus:outline-none focus:ring-1"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.basics.phone || ''}
                      onChange={(e) => updateBasics({ phone: e.target.value })}
                      placeholder="+91 ..."
                      className="w-full px-3 py-2 rounded-md border text-slate-900 focus:outline-none focus:ring-1"
                      style={{ borderColor: 'var(--border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 text-xs mb-1">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={resume.basics.summary || ''}
                    onChange={(e) => updateBasics({ summary: e.target.value })}
                    placeholder="Brief 2-3 sentence overview of engineering strengths..."
                    className="w-full px-3 py-2 rounded-md border text-xs text-slate-900 focus:outline-none focus:ring-1"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              </div>
            )}

            {/* SECTION: WORK EXPERIENCE */}
            {activeSection === 'work' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Work Experience</h3>
                    <p className="text-xs text-slate-500">Quantifiable impact, roles, and technical achievements.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addWorkExperience()}
                    className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(resume.work || []).map((w, idx) => (
                    <div key={w.id || idx} className="p-4 rounded-lg border bg-slate-50/60 text-xs space-y-2" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{w.position || 'Untitled Role'} at {w.name}</span>
                        <button
                          type="button"
                          onClick={() => w.id && removeWorkExperience(w.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-500 text-[11px]">{w.startDate} - {w.endDate || 'Present'}</p>
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {w.highlights?.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: SKILLS */}
            {activeSection === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Skills</h3>
                    <p className="text-xs text-slate-500">Categorized competencies for ATS matching.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(resume.skills || []).map((s, idx) => (
                    <div key={s.id || idx} className="p-3.5 rounded-lg border bg-slate-50/60 text-xs" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-800">{s.name}</span>
                        <button
                          type="button"
                          onClick={() => s.id && removeSkill(s.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.keywords?.map((k, kIdx) => (
                          <span key={kIdx} className="px-2 py-0.5 rounded bg-white border text-[11px] font-medium text-slate-700" style={{ borderColor: 'var(--border)' }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: PROJECTS */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Projects</h3>
                    <p className="text-xs text-slate-500">Engineered applications, SaaS, and open-source repos.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProject()}
                    className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(resume.projects || []).map((p, idx) => (
                    <div key={p.id || idx} className="p-3.5 rounded-lg border bg-slate-50/60 text-xs space-y-1.5" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{p.name}</span>
                        <button
                          type="button"
                          onClick={() => p.id && removeProject(p.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-600">{p.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.keywords?.map((k, kIdx) => (
                          <span key={kIdx} className="px-1.5 py-0.5 rounded bg-slate-200/70 text-[10px] font-medium text-slate-700">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Live Reactive Document Preview Canvas */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-7rem)] flex items-start justify-center" style={{ backgroundColor: 'var(--surface-subtle)' }}>
          {/* A4 White Canvas Sheet */}
          <div
            className="w-full max-w-lg bg-white rounded shadow-md border p-8 font-sans text-slate-900 transition-all"
            style={{ borderColor: 'var(--border)', minHeight: '640px' }}
          >
            {/* Header / Basics */}
            <div className="border-b pb-3 mb-4 text-center" style={{ borderColor: 'var(--border)' }}>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{resume.basics.name || 'Your Full Name'}</h1>
              <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--primary)' }}>
                {resume.basics.label || 'Software Developer'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-slate-500 mt-1.5">
                {resume.basics.email && <span>{resume.basics.email}</span>}
                {resume.basics.phone && <span>• {resume.basics.phone}</span>}
                {resume.basics.location?.city && <span>• {resume.basics.location.city}, {resume.basics.location.countryCode}</span>}
                {resume.basics.url && <span>• {resume.basics.url}</span>}
              </div>
            </div>

            {/* Summary */}
            {resume.basics.summary && (
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b pb-0.5 mb-1" style={{ borderColor: 'var(--border)' }}>
                  Professional Summary
                </h2>
                <p className="text-[11px] text-slate-600 leading-relaxed">{resume.basics.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {(resume.work || []).length > 0 && (
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b pb-0.5 mb-2" style={{ borderColor: 'var(--border)' }}>
                  Work Experience
                </h2>
                <div className="space-y-2.5">
                  {resume.work?.map((w, idx) => (
                    <div key={w.id || idx}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{w.position} <span className="font-normal text-slate-500">— {w.name}</span></span>
                        <span className="text-slate-500 font-mono text-[10px]">{w.startDate} - {w.endDate || 'Present'}</span>
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 mt-1 text-[10.5px] text-slate-600">
                        {w.highlights?.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {(resume.skills || []).length > 0 && (
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b pb-0.5 mb-1.5" style={{ borderColor: 'var(--border)' }}>
                  Technical Skills
                </h2>
                <div className="space-y-1 text-[11px]">
                  {resume.skills?.map((s, idx) => (
                    <div key={s.id || idx} className="text-slate-700">
                      <span className="font-semibold text-slate-800">{s.name}: </span>
                      <span className="text-slate-600">{s.keywords?.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {(resume.projects || []).length > 0 && (
              <div className="mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 border-b pb-0.5 mb-2" style={{ borderColor: 'var(--border)' }}>
                  Key Projects
                </h2>
                <div className="space-y-2">
                  {resume.projects?.map((p, idx) => (
                    <div key={p.id || idx}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">{p.name}</span>
                        {p.url && <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{p.url}</span>}
                      </div>
                      <p className="text-[10.5px] text-slate-600 mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-3 border-t text-center text-[10px] text-slate-400" style={{ borderColor: 'var(--border)' }}>
              <span>Single-Column ATS Layout Engine • Certified Text-Selectable Output</span>
            </div>
          </div>
        </div>
      </div>

      {/* Import JSON Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border p-6" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Import Standard JSON Resume</h3>
            <p className="text-xs text-slate-500 mb-4">
              Paste standard JSON Resume data or upload a `.json` file to rehydrate the editor.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json"
              className="hidden"
            />

            <div className="mb-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 border-2 border-dashed rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5"
                style={{ borderColor: 'var(--border)' }}
              >
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Upload .json File</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="Or paste standard JSON Resume syntax here..."
              className="w-full p-3 font-mono text-[11px] rounded-lg border focus:outline-none focus:ring-1"
              style={{ borderColor: 'var(--border)' }}
            />

            {importErrors.length > 0 && (
              <div className="mt-3 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 space-y-1">
                <div className="flex items-center space-x-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Validation Errors Detected:</span>
                </div>
                {importErrors.map((err, i) => (
                  <p key={i} className="pl-4 text-[11px]">• {err}</p>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setImportModalOpen(false);
                  setImportErrors([]);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessImport}
                className="px-4 py-1.5 text-xs font-semibold text-white rounded-md shadow-xs transition-opacity hover:opacity-95"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Validate & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
