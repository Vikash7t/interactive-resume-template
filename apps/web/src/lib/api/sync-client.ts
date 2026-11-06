import {
  type SyncResumeRequest,
  type SyncResumeResponse,
  type ConflictResolution,
  type CloudResume,
  SyncResumeResponseSchema,
  CloudResumeSchema,
} from '@resucraft/shared';

/**
 * Pushes local resume state to the cloud with optimistic versioning.
 * Returns either { status: 'synced' } or { status: 'conflict' }.
 */
export async function syncResumeToCloud(
  req: SyncResumeRequest,
): Promise<SyncResumeResponse> {
  const res = await fetch('/api/resumes/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(req),
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  const data = await res.json();
  return SyncResumeResponseSchema.parse(data);
}

/**
 * Resolves an active synchronization conflict explicitly chosen by the user.
 */
export async function resolveCloudConflict(
  payload: ConflictResolution,
): Promise<SyncResumeResponse> {
  const res = await fetch('/api/resumes/resolve-conflict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  const data = await res.json();
  return SyncResumeResponseSchema.parse(data);
}

/**
 * Fetches all resumes owned by the authenticated user.
 */
export async function fetchCloudResumes(): Promise<CloudResume[]> {
  const res = await fetch('/api/resumes', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (res.status === 401) {
    throw new Error('UNAUTHORIZED');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch cloud resumes: ${res.statusText}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data.map((d) => CloudResumeSchema.parse(d)) : [];
}

/**
 * Deletes a resume from cloud storage.
 */
export async function deleteCloudResume(id: string): Promise<boolean> {
  const res = await fetch(`/api/resumes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  return res.ok;
}
