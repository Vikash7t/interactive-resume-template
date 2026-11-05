import React, { useState } from 'react';
import { FolderGit2, Trash2, X, Plus } from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { BulletListManager } from './BulletListManager';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

export function ProjectsEditor() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();
  const projectList = resume.projects || [];
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});

  const handleAddTech = (projId: string) => {
    const text = (techInputs[projId] || '').trim();
    if (!text) return;

    const current = projectList.find((p) => p.id === projId);
    if (!current) return;

    const existing = current.keywords || [];
    if (!existing.includes(text)) {
      updateProject(projId, { keywords: [...existing, text] });
    }
    setTechInputs((prev) => ({ ...prev, [projId]: '' }));
  };

  const handleRemoveTech = (projId: string, tech: string) => {
    const current = projectList.find((p) => p.id === projId);
    if (!current) return;
    updateProject(projId, {
      keywords: (current.keywords || []).filter((k) => k !== tech),
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Key Projects"
        description="Showcase scalable software solutions, open-source repositories, and SaaS platforms."
        actionLabel="Add Project"
        onAction={() => addProject()}
      />

      {projectList.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-5 h-5" />}
          title="No projects added yet"
          description="Highlight personal or open-source software projects with GitHub/live links."
          actionLabel="Add First Project"
          onAction={() => addProject()}
        />
      ) : (
        <div className="space-y-4">
          {projectList.map((p, idx) => (
            <Card key={p.id || idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <FolderGit2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {p.name || 'Untitled Project'}
                    </h3>
                    {p.url && (
                      <p className="text-[10.5px] text-slate-400 font-mono truncate max-w-xs">
                        {p.url}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => p.id && removeProject(p.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove this project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Project Title *"
                    placeholder="e.g. Workflow AI — Project Management SaaS"
                    value={p.name}
                    onChange={(e) =>
                      p.id && updateProject(p.id, { name: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Repository or Live Demo URL"
                    type="url"
                    placeholder="e.g. https://github.com/Vikash7t/workflow-ai"
                    value={p.url || ''}
                    onChange={(e) =>
                      p.id && updateProject(p.id, { url: e.target.value })
                    }
                  />
                </div>

                <Textarea
                  label="Project Overview & Problem Statement"
                  placeholder="One sentence explaining the core purpose and architectural architecture of the project..."
                  rows={2}
                  value={p.description || ''}
                  onChange={(e) =>
                    p.id && updateProject(p.id, { description: e.target.value })
                  }
                />

                {/* Tech Stack Tags */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Technologies Used
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(p.keywords || []).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-slate-100 text-[10.5px] font-medium text-slate-700 border"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => p.id && handleRemoveTech(p.id, tech)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={p.id ? techInputs[p.id] || '' : ''}
                      onChange={(e) =>
                        p.id &&
                        setTechInputs((prev) => ({ ...prev, [p.id!]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (p.id) handleAddTech(p.id);
                        }
                      }}
                      placeholder="Add tech (e.g. Next.js, Prisma, PostgreSQL)..."
                      className="flex-1 px-3 py-1.5 text-xs rounded border bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      style={{ borderColor: 'var(--border)' }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => p.id && handleAddTech(p.id)}
                      disabled={!p.id || !(techInputs[p.id] || '').trim()}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>

                {/* Reusable Bullet List for Project Highlights */}
                <BulletListManager
                  label="Architectural Highlights & Key Achievements"
                  bullets={p.highlights || []}
                  onChange={(updated) =>
                    p.id && updateProject(p.id, { highlights: updated })
                  }
                  placeholder="e.g., Implemented optimistic UI updates with Zustand and Server Actions..."
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
