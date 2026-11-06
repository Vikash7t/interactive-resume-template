import { create } from 'zustand';
import { temporal } from 'zundo';
import {
  type ResumeData,
  type Basics,
  type WorkExperience,
  type Education,
  type Skill,
  type Project,
  type Certificate,
  type Language,
  type ResumeSectionId,
  defaultSampleResume,
  normalizeResumeData,
  importFromJsonResumeString,
  exportToJsonResumeString,
} from '@resucraft/shared';
import {
  saveLocalResume,
  getLocalResume,
  initDefaultResumeIfEmpty,
  getAllLocalResumes,
  type LocalResumeRecord,
} from '../lib/db/resume-db';

export interface EditorPreferences {
  zoomLevel: number;
  autoSave: boolean;
  showGridLines: boolean;
}

export interface ResumeStoreState {
  // Resume Identity & Data
  resumeId: string;
  title: string;
  resume: ResumeData;

  // Editor Meta State
  activeSection: ResumeSectionId;
  selectedTemplate: string;
  preferences: EditorPreferences;
  isSaving: boolean;
  lastSavedAt: string | null;
  savedResumesList: LocalResumeRecord[];

  // Section Mutations
  updateBasics: (patch: Partial<Basics>) => void;

  // Work Experience
  addWorkExperience: (entry?: Partial<WorkExperience>) => void;
  updateWorkExperience: (id: string, patch: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  reorderWorkExperience: (fromIndex: number, toIndex: number) => void;

  // Education
  addEducation: (entry?: Partial<Education>) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkill: (entry?: Partial<Skill>) => void;
  updateSkill: (id: string, patch: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  // Projects
  addProject: (entry?: Partial<Project>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;

  // Certificates
  addCertificate: (entry?: Partial<Certificate>) => void;
  updateCertificate: (id: string, patch: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;

  // Languages
  addLanguage: (entry?: Partial<Language>) => void;
  updateLanguage: (id: string, patch: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  // Navigation & Preferences
  setActiveSection: (section: ResumeSectionId) => void;
  setSelectedTemplate: (templateId: string) => void;
  setPreferences: (prefs: Partial<EditorPreferences>) => void;

  // Persistence & Storage Operations
  initializeStore: () => Promise<void>;
  loadResumeById: (id: string) => Promise<boolean>;
  createNewResume: (title?: string) => Promise<string>;
  saveCurrentToDatabase: () => Promise<void>;
  refreshSavedResumesList: () => Promise<void>;

  // Import / Export Operations
  setResumeData: (data: ResumeData) => void;
  importFromJson: (jsonStr: string) => { success: boolean; errors?: string[] };
  exportToJson: () => string;
}

export const useResumeStore = create<ResumeStoreState>()(
  temporal(
    (set, get) => ({
      resumeId: 'resume-default-01',
      title: 'Vikash Singh — Software Developer',
      resume: defaultSampleResume,
      activeSection: 'basics',
      selectedTemplate: 'ats-single-column',
      preferences: {
        zoomLevel: 100,
        autoSave: true,
        showGridLines: false,
      },
      isSaving: false,
      lastSavedAt: null,
      savedResumesList: [],

      // --- SECTION MUTATIONS ---

      updateBasics: (patch) => {
        set((state) => {
          const updatedResume: ResumeData = {
            ...state.resume,
            basics: {
              ...state.resume.basics,
              ...patch,
            },
          };
          return { resume: updatedResume };
        });
        if (get().preferences.autoSave) {
          get().saveCurrentToDatabase();
        }
      },

      addWorkExperience: (entry) => {
        const newId = `work-${Date.now()}`;
        const newWork: WorkExperience = {
          id: newId,
          name: entry?.name || 'New Company',
          position: entry?.position || 'Job Title',
          url: entry?.url || '',
          startDate: entry?.startDate || '',
          endDate: entry?.endDate || '',
          summary: entry?.summary || '',
          highlights: entry?.highlights || ['Key achievement or quantified impact statement.'],
        };

        set((state) => ({
          resume: {
            ...state.resume,
            work: [newWork, ...(state.resume.work || [])],
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      updateWorkExperience: (id, patch) => {
        set((state) => ({
          resume: {
            ...state.resume,
            work: (state.resume.work || []).map((w) => (w.id === id ? { ...w, ...patch } : w)),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      removeWorkExperience: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            work: (state.resume.work || []).filter((w) => w.id !== id),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      reorderWorkExperience: (fromIndex, toIndex) => {
        set((state) => {
          const items = [...(state.resume.work || [])];
          const [movedItem] = items.splice(fromIndex, 1);
          if (movedItem) {
            items.splice(toIndex, 0, movedItem);
          }
          return { resume: { ...state.resume, work: items } };
        });
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      addEducation: (entry) => {
        const newId = `edu-${Date.now()}`;
        const newEdu: Education = {
          id: newId,
          institution: entry?.institution || 'University or College',
          studyType: entry?.studyType || 'Degree',
          area: entry?.area || 'Field of Study',
          startDate: entry?.startDate || '',
          endDate: entry?.endDate || '',
          score: entry?.score || '',
          courses: entry?.courses || [],
          url: entry?.url || '',
        };

        set((state) => ({
          resume: {
            ...state.resume,
            education: [...(state.resume.education || []), newEdu],
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      updateEducation: (id, patch) => {
        set((state) => ({
          resume: {
            ...state.resume,
            education: (state.resume.education || []).map((e) => (e.id === id ? { ...e, ...patch } : e)),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      removeEducation: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            education: (state.resume.education || []).filter((e) => e.id !== id),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      addSkill: (entry) => {
        const newId = `skill-${Date.now()}`;
        const newSkill: Skill = {
          id: newId,
          name: entry?.name || 'Category Name',
          level: entry?.level || '',
          keywords: entry?.keywords || ['Skill 1', 'Skill 2'],
        };

        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...(state.resume.skills || []), newSkill],
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      updateSkill: (id, patch) => {
        set((state) => ({
          resume: {
            ...state.resume,
            skills: (state.resume.skills || []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      removeSkill: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            skills: (state.resume.skills || []).filter((s) => s.id !== id),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      addProject: (entry) => {
        const newId = `proj-${Date.now()}`;
        const newProj: Project = {
          id: newId,
          name: entry?.name || 'Project Name',
          description: entry?.description || 'Description of architectural problem solved.',
          highlights: entry?.highlights || ['Key engineering highlight'],
          keywords: entry?.keywords || ['TypeScript', 'Next.js'],
          url: entry?.url || '',
          startDate: entry?.startDate || '',
          endDate: entry?.endDate || '',
        };

        set((state) => ({
          resume: {
            ...state.resume,
            projects: [...(state.resume.projects || []), newProj],
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      updateProject: (id, patch) => {
        set((state) => ({
          resume: {
            ...state.resume,
            projects: (state.resume.projects || []).map((p) => (p.id === id ? { ...p, ...patch } : p)),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      removeProject: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            projects: (state.resume.projects || []).filter((p) => p.id !== id),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      addCertificate: (entry) => {
        const newId = `cert-${Date.now()}`;
        const newCert: Certificate = {
          id: newId,
          name: entry?.name || 'Certificate Name',
          issuer: entry?.issuer || 'Issuing Authority',
          date: entry?.date || '',
          url: entry?.url || '',
        };

        set((state) => ({
          resume: {
            ...state.resume,
            certificates: [...(state.resume.certificates || []), newCert],
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      updateCertificate: (id, patch) => {
        set((state) => ({
          resume: {
            ...state.resume,
            certificates: (state.resume.certificates || []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      removeCertificate: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            certificates: (state.resume.certificates || []).filter((c) => c.id !== id),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      addLanguage: (entry) => {
        const newId = `lang-${Date.now()}`;
        const newLang: Language = {
          id: newId,
          language: entry?.language || 'Language',
          fluency: entry?.fluency || 'Working Proficiency',
        };

        set((state) => ({
          resume: {
            ...state.resume,
            languages: [...(state.resume.languages || []), newLang],
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      updateLanguage: (id, patch) => {
        set((state) => ({
          resume: {
            ...state.resume,
            languages: (state.resume.languages || []).map((l) => (l.id === id ? { ...l, ...patch } : l)),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      removeLanguage: (id) => {
        set((state) => ({
          resume: {
            ...state.resume,
            languages: (state.resume.languages || []).filter((l) => l.id !== id),
          },
        }));
        if (get().preferences.autoSave) get().saveCurrentToDatabase();
      },

      // --- META & PREFERENCES ---

      setActiveSection: (section) => set({ activeSection: section }),
      setSelectedTemplate: (templateId) => set({ selectedTemplate: templateId }),
      setPreferences: (prefs) =>
        set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

      // --- PERSISTENCE & STORAGE ---

      initializeStore: async () => {
        try {
          const initialRecord = await initDefaultResumeIfEmpty();
          const allResumes = await getAllLocalResumes();
          set({
            resumeId: initialRecord.id,
            title: initialRecord.title,
            resume: initialRecord.data,
            lastSavedAt: initialRecord.updatedAt,
            savedResumesList: allResumes,
          });
        } catch (err) {
          console.error('Failed to initialize local IndexedDB store', err);
        }
      },

      loadResumeById: async (id: string) => {
        try {
          const record = await getLocalResume(id);
          if (record) {
            set({
              resumeId: record.id,
              title: record.title,
              resume: record.data,
              lastSavedAt: record.updatedAt,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      createNewResume: async (title = 'Untitled Resume') => {
        const newId = `resume-${Date.now()}`;
        const emptyResume: ResumeData = normalizeResumeData({
          basics: {
            name: title,
          },
        });

        await saveLocalResume(newId, title, emptyResume);
        const allResumes = await getAllLocalResumes();

        set({
          resumeId: newId,
          title,
          resume: emptyResume,
          lastSavedAt: new Date().toISOString(),
          savedResumesList: allResumes,
        });

        return newId;
      },

      saveCurrentToDatabase: async () => {
        const { resumeId, title, resume } = get();
        set({ isSaving: true });
        try {
          await saveLocalResume(resumeId, title, resume);
          const all = await getAllLocalResumes();
          set({
            isSaving: false,
            lastSavedAt: new Date().toISOString(),
            savedResumesList: all,
          });
        } catch (err) {
          console.error('AutoSave failed:', err);
          set({ isSaving: false });
        }
      },

      refreshSavedResumesList: async () => {
        const list = await getAllLocalResumes();
        set({ savedResumesList: list });
      },

      // --- IMPORT / EXPORT & SYNC ---

      setResumeData: (data: ResumeData) => {
        const normalized = normalizeResumeData(data);
        set({ resume: normalized });
        if (get().preferences.autoSave) {
          get().saveCurrentToDatabase();
        }
      },

      importFromJson: (jsonStr: string) => {
        const result = importFromJsonResumeString(jsonStr);
        if (!result.success) {
          return { success: false, errors: result.errors };
        }

        const importedData = result.data;
        const newTitle = importedData.basics.name
          ? `${importedData.basics.name} — Resume`
          : 'Imported Resume';

        set({
          resume: importedData,
          title: newTitle,
        });

        if (get().preferences.autoSave) {
          get().saveCurrentToDatabase();
        }

        return { success: true };
      },

      exportToJson: () => {
        return exportToJsonResumeString(get().resume);
      },
    }),
    {
      // Zundo Configuration: Record history for content changes only
      limit: 50,
      partialize: (state) => ({
        resume: state.resume,
        title: state.title,
      }),
    },
  ),
);
