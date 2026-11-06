'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Undo2,
  Redo2,
  Upload,
  FileJson,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  User,
  Award,
  Languages,
  Eye,
  Edit3,
  Columns,
  Target,
} from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import type { ResumeSectionId } from '@resucraft/shared';
import { BasicsEditor } from '../../components/editor/BasicsEditor';
import { WorkEditor } from '../../components/editor/WorkEditor';
import { EducationEditor } from '../../components/editor/EducationEditor';
import { SkillsEditor } from '../../components/editor/SkillsEditor';
import { ProjectsEditor } from '../../components/editor/ProjectsEditor';
import { CertificatesEditor } from '../../components/editor/CertificatesEditor';
import { LanguagesEditor } from '../../components/editor/LanguagesEditor';
import { getTemplateById } from '../../components/templates/TemplateRegistry';
import { Button } from '../../components/ui/Button';
import { downloadPdfResume } from '../../lib/pdf/generate-pdf';
import { JobAlignmentModal } from '../../components/alignment/JobAlignmentModal';

export default function EditorPage() {
  const {
    resume,
    title,
    activeSection,
    selectedTemplate,
    isSaving,
    setActiveSection,
    initializeStore,
    importFromJson,
    exportToJson,
  } = useResumeStore();

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [alignmentModalOpen, setAlignmentModalOpen] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Dexie IndexedDB rehydration
  useEffect(() => {
    setMounted(true);
    initializeStore();
  }, [initializeStore]);

  // Keyboard shortcut listener: Ctrl+Z (Undo), Ctrl+Y (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          useResumeStore.temporal.getState().redo();
        } else {
          e.preventDefault();
          useResumeStore.temporal.getState().undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        useResumeStore.temporal.getState().redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    link.download = `${
      resume.basics.name ? resume.basics.name.toLowerCase().replace(/\s+/g, '-') : 'resume'
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      await downloadPdfResume(resume);
    } catch (err) {
      console.error('Failed to generate ATS PDF:', err);
      alert('Unable to generate PDF resume. Please ensure required fields are valid.');
    } finally {
      setIsExportingPdf(false);
    }
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

  // Memoize active template component for maximum rendering performance
  const TemplateComponent = useMemo(
    () => getTemplateById(selectedTemplate).component,
    [selectedTemplate],
  );

  const sections: { id: ResumeSectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'basics', label: 'Personal Info', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'work', label: 'Experience', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-3.5 h-3.5" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'certificates', label: 'Certificates', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'languages', label: 'Languages', icon: <Languages className="w-3.5 h-3.5" /> },
  ];

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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-100/70">
      {/* Studio Header Toolbar */}
      <div
        className="border-b bg-white px-4 py-2.5 flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-bold text-slate-800 truncate max-w-[140px] sm:max-w-xs">
            {resume.basics.name || title}
          </span>

          {/* Autosave Status Indicator */}
          <div
            className="hidden sm:flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border"
            style={{ borderColor: 'var(--border)' }}
          >
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

        {/* Mobile View Toggle Switcher (Edit vs Preview) */}
        <div className="flex lg:hidden items-center p-0.5 rounded-lg bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded ${
              mobileTab === 'editor' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded ${
              mobileTab === 'preview' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>
        </div>

        {/* Action Controls & Undo/Redo */}
        <div className="flex items-center space-x-2">
          <div
            className="hidden sm:flex items-center border rounded-md mr-1"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-l-md transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-r-md border-l transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setImportModalOpen(true)}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import JSON</span>
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={handleExportJson}>
            <FileJson className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export JSON</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAlignmentModalOpen(true)}
            title="Analyze match against target Job Description"
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Job Alignment</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            title="Download ATS-Friendly Vector PDF"
          >
            {isExportingPdf ? (
              <>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Two-Pane Responsive Studio Workspace */}
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Left Pane: Section Form Editor */}
        <div
          className={`p-6 overflow-y-auto max-h-[calc(100vh-7rem)] bg-white ${
            mobileTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="max-w-xl mx-auto">
            {/* Navigation Tabs for Active Section */}
            <div
              className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-lg mb-6 border"
              style={{ borderColor: 'var(--border)' }}
            >
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
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

            {/* Render Isolated Section Component */}
            {activeSection === 'basics' && <BasicsEditor />}
            {activeSection === 'work' && <WorkEditor />}
            {activeSection === 'skills' && <SkillsEditor />}
            {activeSection === 'projects' && <ProjectsEditor />}
            {activeSection === 'education' && <EducationEditor />}
            {activeSection === 'certificates' && <CertificatesEditor />}
            {activeSection === 'languages' && <LanguagesEditor />}
          </div>
        </div>

        {/* Right Pane: Live Reactive Document Preview Canvas */}
        <div
          className={`p-6 overflow-y-auto max-h-[calc(100vh-7rem)] flex items-start justify-center ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
          style={{ backgroundColor: 'var(--surface-subtle)' }}
        >
          <div className="w-full max-w-2xl flex flex-col items-center">
            {/* Render Selected ATS Template */}
            <TemplateComponent resume={resume} />

            <div className="mt-4 pb-8 text-center text-[10px] text-slate-400">
              <span className="font-semibold text-slate-500">
                Certified Single-Column ATS Template
              </span>{' '}
              • Optimized for Workday, Greenhouse, Lever, and Taleo parsers
            </div>
          </div>
        </div>
      </div>

      {/* Import JSON Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full border p-6"
            style={{ borderColor: 'var(--border)' }}
          >
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Import Standard JSON Resume
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Paste standard JSON Resume syntax or upload a `.json` file to rehydrate the editor.
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
                className="w-full py-2.5 border-2 border-dashed rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
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
                  <p key={i} className="pl-4 text-[11px]">
                    • {err}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setImportModalOpen(false);
                  setImportErrors([]);
                }}
              >
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={handleProcessImport}>
                Validate & Import
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Target Job Description Alignment Engine Modal */}
      <JobAlignmentModal
        isOpen={alignmentModalOpen}
        onClose={() => setAlignmentModalOpen(false)}
        resume={resume}
      />
    </div>
  );
}
