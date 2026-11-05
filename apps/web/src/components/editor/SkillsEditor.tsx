import React, { useState } from 'react';
import { Wrench, Trash2, Plus, X } from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function SkillsEditor() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();
  const skillsList = resume.skills || [];
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});

  const handleAddKeyword = (skillId: string) => {
    const text = (tagInputs[skillId] || '').trim();
    if (!text) return;

    const currentSkill = skillsList.find((s) => s.id === skillId);
    if (!currentSkill) return;

    const existing = currentSkill.keywords || [];
    if (!existing.includes(text)) {
      updateSkill(skillId, { keywords: [...existing, text] });
    }
    setTagInputs((prev) => ({ ...prev, [skillId]: '' }));
  };

  const handleRemoveKeyword = (skillId: string, keywordToRemove: string) => {
    const currentSkill = skillsList.find((s) => s.id === skillId);
    if (!currentSkill) return;
    updateSkill(skillId, {
      keywords: (currentSkill.keywords || []).filter((k) => k !== keywordToRemove),
    });
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Technical Skills & Competencies"
        description="Group skills into categories (e.g. Languages, Frontend, Databases) for high ATS keyword density."
        actionLabel="Add Category"
        onAction={() => addSkill()}
      />

      {skillsList.length === 0 ? (
        <EmptyState
          icon={<Wrench className="w-5 h-5" />}
          title="No skill categories yet"
          description="Group your skills into categories like Frontend, Backend, or Cloud DevOps."
          actionLabel="Add First Category"
          onAction={() => addSkill()}
        />
      ) : (
        <div className="space-y-4">
          {skillsList.map((s, idx) => (
            <Card key={s.id || idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <Wrench className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">
                    {s.name || 'Category Name'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => s.id && removeSkill(s.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove this category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <Input
                  label="Category Name *"
                  placeholder="e.g. Frontend Development or Databases & Tools"
                  value={s.name}
                  onChange={(e) =>
                    s.id && updateSkill(s.id, { name: e.target.value })
                  }
                  required
                />

                {/* Keyword Tag Cloud */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Skills & Keywords
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(s.keywords || []).map((k, kIdx) => (
                      <span
                        key={kIdx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-medium text-slate-800 border"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span>{k}</span>
                        <button
                          type="button"
                          onClick={() => s.id && handleRemoveKeyword(s.id, k)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Tag Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={s.id ? tagInputs[s.id] || '' : ''}
                      onChange={(e) =>
                        s.id &&
                        setTagInputs((prev) => ({ ...prev, [s.id!]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (s.id) handleAddKeyword(s.id);
                        }
                      }}
                      placeholder="Add keyword (press Enter or click Add)..."
                      className="flex-1 px-3 py-1.5 text-xs rounded border bg-slate-50/70 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      style={{ borderColor: 'var(--border)' }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => s.id && handleAddKeyword(s.id)}
                      disabled={!s.id || !(tagInputs[s.id] || '').trim()}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
