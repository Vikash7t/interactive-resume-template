import Dexie, { type Table } from 'dexie';
import { type ResumeData, defaultSampleResume, normalizeResumeData } from '@resucraft/shared';

export interface LocalResumeRecord {
  id: string;
  title: string;
  data: ResumeData;
  createdAt: string;
  updatedAt: string;
}

export class ResumeDatabase extends Dexie {
  resumes!: Table<LocalResumeRecord, string>;

  constructor() {
    super('ResuCraft_LocalDB');

    // Storage Version 1 with indexes on id and updatedAt
    this.version(1).stores({
      resumes: 'id, title, createdAt, updatedAt',
    });
  }
}

export const resumeDb = new ResumeDatabase();

/**
 * Retrieves all stored resumes sorted by last modified date.
 */
export async function getAllLocalResumes(): Promise<LocalResumeRecord[]> {
  try {
    return await resumeDb.resumes.orderBy('updatedAt').reverse().toArray();
  } catch (err) {
    console.error('Dexie Error: Failed to fetch local resumes', err);
    return [];
  }
}

/**
 * Retrieves a single resume by its ID.
 */
export async function getLocalResume(id: string): Promise<LocalResumeRecord | undefined> {
  try {
    const record = await resumeDb.resumes.get(id);
    if (!record) return undefined;
    return {
      ...record,
      data: normalizeResumeData(record.data),
    };
  } catch (err) {
    console.error(`Dexie Error: Failed to fetch resume with id ${id}`, err);
    return undefined;
  }
}

/**
 * Creates or updates a resume document in local IndexedDB.
 */
export async function saveLocalResume(
  id: string,
  title: string,
  data: ResumeData,
): Promise<void> {
  try {
    const existing = await resumeDb.resumes.get(id);
    const now = new Date().toISOString();
    const normalized = normalizeResumeData(data);

    await resumeDb.resumes.put({
      id,
      title: title || normalized.basics.name || 'Untitled Resume',
      data: normalized,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    });
  } catch (err) {
    console.error('Dexie Error: Failed to save resume to IndexedDB', err);
    throw err;
  }
}

/**
 * Deletes a resume document from local IndexedDB.
 */
export async function deleteLocalResume(id: string): Promise<void> {
  try {
    await resumeDb.resumes.delete(id);
  } catch (err) {
    console.error(`Dexie Error: Failed to delete resume ${id}`, err);
    throw err;
  }
}

/**
 * Seeds a default sample resume if the local database is completely empty.
 */
export async function initDefaultResumeIfEmpty(): Promise<LocalResumeRecord> {
  const existing = await getAllLocalResumes();
  if (existing.length > 0) {
    return existing[0]!;
  }

  const defaultId = 'resume-default-01';
  const now = new Date().toISOString();
  const initialRecord: LocalResumeRecord = {
    id: defaultId,
    title: 'Vikash Singh — Software Developer',
    data: defaultSampleResume,
    createdAt: now,
    updatedAt: now,
  };

  await resumeDb.resumes.add(initialRecord);
  return initialRecord;
}
