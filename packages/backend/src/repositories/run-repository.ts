import { db } from '../firebase/admin.js';
import type { NormalizedRouteData } from '../utils/runValidation.js';
import type { EditorRun, EditorRunRecord } from '../types/index.js';

export interface RunRecord extends NormalizedRouteData {
  userId: string;
  name: string;
  createdAt: string;
  isPublic: boolean;
  publicSlug?: string;
}

export interface RunWithId extends RunRecord {
  id: string;
}

/**
 * Repository layer - handles all data access operations
 * Pure data access, no business logic
 */
export class RunRepository {
  /**
   * Get all runs for a user
   */
  async findByUserId(userId: string): Promise<RunWithId[]> {
    const runsSnapshot = await db
      .collection('runs')
      .where('userId', '==', userId)
      .get();

    return runsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RunWithId[];
  }

  /**
   * Get a run by ID
   */
  async findById(runId: string): Promise<RunWithId | null> {
    const runDoc = await db.collection('runs').doc(runId).get();
    if (!runDoc.exists) {
      return null;
    }

    return {
      id: runDoc.id,
      ...runDoc.data(),
    } as RunWithId;
  }

  /**
   * Get a run by ID that belongs to a specific user
   */
  async findByIdAndUserId(
    runId: string,
    userId: string,
  ): Promise<RunWithId | null> {
    const run = await this.findById(runId);
    if (!run || run.userId !== userId) {
      return null;
    }
    return run;
  }

  /**
   * Create a new run
   */
  async create(runData: RunRecord): Promise<{ id: string }> {
    const runRef = await db.collection('runs').add(runData);
    return { id: runRef.id };
  }

  /**
   * Update a run's public status and slug
   */
  async updatePublicStatus(
    runId: string,
    updates: { isPublic: boolean; publicSlug?: string | null },
  ): Promise<RunWithId> {
    const runRef = db.collection('runs').doc(runId);
    const updatePayload: Record<string, unknown> = {
      isPublic: updates.isPublic,
    };

    if (updates.isPublic && updates.publicSlug) {
      updatePayload.publicSlug = updates.publicSlug;
    } else {
      updatePayload.publicSlug = null;
    }

    await runRef.update(updatePayload);
    const updatedRunDoc = await runRef.get();

    return {
      id: updatedRunDoc.id,
      ...updatedRunDoc.data(),
    } as RunWithId;
  }

  /**
   * Delete a run
   */
  async delete(runId: string): Promise<boolean> {
    const runRef = db.collection('runs').doc(runId);
    const runDoc = await runRef.get();

    if (!runDoc.exists) {
      return false;
    }

    await runRef.delete();
    return true;
  }

  /**
   * Check if a public slug is already in use
   */
  async slugExists(slug: string, excludeRunId?: string): Promise<boolean> {
    const runsSnapshot = await db
      .collection('runs')
      .where('publicSlug', '==', slug)
      .limit(1)
      .get();

    if (runsSnapshot.empty) {
      return false;
    }

    // If excluding a run ID, check if the found run is different
    if (excludeRunId) {
      const foundRun = runsSnapshot.docs[0];
      return foundRun.id !== excludeRunId;
    }

    return true;
  }

  /**
   * Find a public run by slug
   */
  async findRunBySlug(slug: string): Promise<EditorRun | null> {
    const runsSnapshot = await db
      .collection('runs')
      .where('publicSlug', '==', slug)
      .limit(1)
      .get();

    const runDoc = runsSnapshot.docs[0];
    if (!runDoc) {
      return null;
    }

    const runData = runDoc.data() as EditorRunRecord | undefined;
    if (!runData || runData.isPublic !== true) {
      return null;
    }

    return {
      id: runDoc.id,
      ...runData,
    };
  }
}

// Export a singleton instance
export const runRepository = new RunRepository();
