import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { useResumeStore } from '../resume-store';
import { defaultSampleResume } from '@resucraft/shared';

describe('useResumeStore & Persistence Architecture', () => {
  beforeEach(() => {
    // Reset store state before each test
    useResumeStore.setState({
      resume: defaultSampleResume,
      title: 'Test Resume',
      preferences: {
        zoomLevel: 100,
        autoSave: false, // Disable autoSave in fast unit tests
        showGridLines: false,
      },
    });
    // Clear temporal history
    useResumeStore.temporal.getState().clear();
  });

  it('initializes with default sample resume data', () => {
    const state = useResumeStore.getState();
    expect(state.resume.basics.name).toBe('Vikash Singh');
    expect(state.resume.work?.length).toBeGreaterThan(0);
  });

  it('updates basics information immutably', () => {
    useResumeStore.getState().updateBasics({ name: 'Alex Johnson', label: 'Senior Architect' });
    const state = useResumeStore.getState();
    expect(state.resume.basics.name).toBe('Alex Johnson');
    expect(state.resume.basics.label).toBe('Senior Architect');
  });

  it('adds and removes work experience entries', () => {
    const initialCount = useResumeStore.getState().resume.work?.length || 0;

    useResumeStore.getState().addWorkExperience({
      name: 'Google',
      position: 'Staff Engineer',
    });

    expect(useResumeStore.getState().resume.work?.length).toBe(initialCount + 1);
    const added = useResumeStore.getState().resume.work?.[0];
    expect(added?.name).toBe('Google');

    if (added?.id) {
      useResumeStore.getState().removeWorkExperience(added.id);
      expect(useResumeStore.getState().resume.work?.length).toBe(initialCount);
    }
  });

  it('reorders work experience entries correctly', () => {
    useResumeStore.setState({
      resume: {
        ...defaultSampleResume,
        work: [
          { id: '1', name: 'Company A', position: 'Dev' },
          { id: '2', name: 'Company B', position: 'Dev' },
        ],
      },
    });

    useResumeStore.getState().reorderWorkExperience(0, 1);
    const works = useResumeStore.getState().resume.work || [];
    expect(works[0]?.name).toBe('Company B');
    expect(works[1]?.name).toBe('Company A');
  });

  it('exports and re-imports JSON Resume data without loss', () => {
    const exportedStr = useResumeStore.getState().exportToJson();
    expect(typeof exportedStr).toBe('string');

    const result = useResumeStore.getState().importFromJson(exportedStr);
    expect(result.success).toBe(true);
    expect(useResumeStore.getState().resume.basics.name).toBe('Vikash Singh');
  });

  it('rejects invalid JSON imports without corrupting existing state', () => {
    const badJson = '{"basics": {"name": ""}}';
    const originalName = useResumeStore.getState().resume.basics.name;

    const result = useResumeStore.getState().importFromJson(badJson);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();

    // Verify existing state was preserved (no data loss)
    expect(useResumeStore.getState().resume.basics.name).toBe(originalName);
  });

  it('supports undo and redo operations via Zundo temporal store', () => {
    const originalName = useResumeStore.getState().resume.basics.name;

    useResumeStore.getState().updateBasics({ name: 'Changed Name' });
    expect(useResumeStore.getState().resume.basics.name).toBe('Changed Name');

    // Undo
    useResumeStore.temporal.getState().undo();
    expect(useResumeStore.getState().resume.basics.name).toBe(originalName);

    // Redo
    useResumeStore.temporal.getState().redo();
    expect(useResumeStore.getState().resume.basics.name).toBe('Changed Name');
  });
});
