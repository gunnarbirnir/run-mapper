import { db } from '../firebase/admin.js';
import type { RunRecordWithId, RunRecord } from '../types/index.js';

/**
 * Repository layer - handles all data access operations
 * Pure data access, no business logic
 */
export class RunRepository {
  /**
   * Get all runs for a user
   */
  async findByUserId(userId: string): Promise<RunRecordWithId[]> {
    const runsSnapshot = await db
      .collection('runs')
      .where('userId', '==', userId)
      .get();

    return runsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as RunRecordWithId[];
  }

  /**
   * Get a run by ID
   */
  async findById(runId: string): Promise<RunRecordWithId | null> {
    const runDoc = await db.collection('runs').doc(runId).get();
    if (!runDoc.exists) {
      return null;
    }

    return {
      id: runDoc.id,
      ...runDoc.data(),
    } as RunRecordWithId;
  }

  /**
   * Get a run by ID that belongs to a specific user
   */
  async findByIdAndUserId(
    runId: string,
    userId: string,
  ): Promise<RunRecordWithId | null> {
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
  async update(runId: string, runData: RunRecord): Promise<RunRecordWithId> {
    const runRef = db.collection('runs').doc(runId);
    await runRef.update(runData);
    const updatedRunDoc = await runRef.get();

    return {
      id: updatedRunDoc.id,
      ...updatedRunDoc.data(),
    } as RunRecordWithId;
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
  async findRunBySlug(slug: string): Promise<RunRecordWithId | null> {
    const runsSnapshot = await db
      .collection('runs')
      .where('publicSlug', '==', slug)
      .limit(1)
      .get();

    const runDoc = runsSnapshot.docs[0];
    if (!runDoc) {
      return null;
    }

    const runData = runDoc.data() as RunRecord | undefined;
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
