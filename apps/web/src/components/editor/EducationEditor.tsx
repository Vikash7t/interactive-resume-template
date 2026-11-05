import React from 'react';
import { GraduationCap, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export function EducationEditor() {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const educationList = resume.education || [];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Education"
        description="Degrees, universities, relevant coursework, and academic qualifications."
        actionLabel="Add Education"
        onAction={() => addEducation()}
      />

      {educationList.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-5 h-5" />}
          title="No education entries yet"
          description="Add your degree, university, bootcamp, or academic milestones."
          actionLabel="Add First Education"
          onAction={() => addEducation()}
        />
      ) : (
        <div className="space-y-4">
          {educationList.map((e, idx) => (
            <Card key={e.id || idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {e.studyType ? `${e.studyType} in ${e.area || 'Field'}` : e.institution}
                    </h3>
                    <p className="text-[11px] text-slate-500">{e.institution}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => e.id && removeEducation(e.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove this entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Institution / University *"
                    placeholder="e.g. Visvesvaraya Technological University"
                    value={e.institution}
                    onChange={(ev) =>
                      e.id && updateEducation(e.id, { institution: ev.target.value })
                    }
                    required
                  />

                  <Input
                    label="Degree / Study Type *"
                    placeholder="e.g. Bachelor of Engineering"
                    value={e.studyType || ''}
                    onChange={(ev) =>
                      e.id && updateEducation(e.id, { studyType: ev.target.value })
                    }
                  />

                  <Input
                    label="Area of Study / Major"
                    placeholder="e.g. Computer Science & Engineering"
                    value={e.area || ''}
                    onChange={(ev) =>
                      e.id && updateEducation(e.id, { area: ev.target.value })
                    }
                  />

                  <Input
                    label="GPA / Grade / Score"
                    placeholder="e.g. 8.4 CGPA or 3.8 / 4.0"
                    value={e.score || ''}
                    onChange={(ev) =>
                      e.id && updateEducation(e.id, { score: ev.target.value })
                    }
                  />

                  <Input
                    label="Start Date"
                    placeholder="e.g. 2020"
                    value={e.startDate || ''}
                    onChange={(ev) =>
                      e.id && updateEducation(e.id, { startDate: ev.target.value })
                    }
                  />

                  <Input
                    label="End Date (or Expected)"
                    placeholder="e.g. 2024"
                    value={e.endDate || ''}
                    onChange={(ev) =>
                      e.id && updateEducation(e.id, { endDate: ev.target.value })
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
