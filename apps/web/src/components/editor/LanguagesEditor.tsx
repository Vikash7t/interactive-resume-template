import React from 'react';
import { Languages, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export function LanguagesEditor() {
  const { resume, addLanguage, updateLanguage, removeLanguage } = useResumeStore();
  const langList = resume.languages || [];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Languages"
        description="Spoken and written language proficiencies."
        actionLabel="Add Language"
        onAction={() => addLanguage()}
      />

      {langList.length === 0 ? (
        <EmptyState
          icon={<Languages className="w-5 h-5" />}
          title="No languages added yet"
          description="Add languages and your corresponding proficiency level."
          actionLabel="Add First Language"
          onAction={() => addLanguage()}
        />
      ) : (
        <div className="space-y-4">
          {langList.map((l, idx) => (
            <Card key={l.id || idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <Languages className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {l.language || 'Language'}
                    </h3>
                    <p className="text-[11px] text-slate-500">{l.fluency}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => l.id && removeLanguage(l.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove language"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Language *"
                    placeholder="e.g. English"
                    value={l.language}
                    onChange={(e) =>
                      l.id && updateLanguage(l.id, { language: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Fluency / Proficiency Level"
                    placeholder="e.g. Professional Working or Native"
                    value={l.fluency || ''}
                    onChange={(e) =>
                      l.id && updateLanguage(l.id, { fluency: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
