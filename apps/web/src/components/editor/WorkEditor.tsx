import React from 'react';
import { Briefcase, Trash2, Building2 } from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { BulletListManager } from './BulletListManager';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export function WorkEditor() {
  const {
    resume,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
  } = useResumeStore();

  const workList = resume.work || [];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Work Experience"
        description="Chronological engineering experience. Focus on quantifiable achievements."
        actionLabel="Add Experience"
        onAction={() => addWorkExperience()}
      />

      {workList.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-5 h-5" />}
          title="No work experience entries yet"
          description="Add your current or past engineering roles, internships, or freelance work."
          actionLabel="Add First Role"
          onAction={() => addWorkExperience()}
        />
      ) : (
        <div className="space-y-4">
          {workList.map((w, idx) => (
            <Card key={w.id || idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {w.position || 'Untitled Role'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {w.name || 'Company Name'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => w.id && removeWorkExperience(w.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove this role"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Company Name *"
                    placeholder="e.g. Tech Innovations Lab"
                    value={w.name}
                    onChange={(e) =>
                      w.id && updateWorkExperience(w.id, { name: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Job Title / Position *"
                    placeholder="e.g. Senior Software Engineer"
                    value={w.position}
                    onChange={(e) =>
                      w.id &&
                      updateWorkExperience(w.id, { position: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Start Date"
                    placeholder="e.g. 2023-01 or Jan 2023"
                    value={w.startDate || ''}
                    onChange={(e) =>
                      w.id &&
                      updateWorkExperience(w.id, { startDate: e.target.value })
                    }
                  />

                  <Input
                    label="End Date"
                    placeholder="e.g. Present or Dec 2024"
                    value={w.endDate || ''}
                    onChange={(e) =>
                      w.id &&
                      updateWorkExperience(w.id, { endDate: e.target.value })
                    }
                  />
                </div>

                {/* Reusable Bullet List Manager */}
                <BulletListManager
                  label="Achievement Bullet Points (STAR Method)"
                  bullets={w.highlights || []}
                  onChange={(updated) =>
                    w.id && updateWorkExperience(w.id, { highlights: updated })
                  }
                  placeholder="e.g., Optimized SQL queries with Prisma index tuning, reducing p99 latency by 35%..."
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
