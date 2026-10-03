import { db } from '../firebase/admin.js';
import type { RunRecordWithId, RunRecord } from '../types/index.js';

/**
 * Repository layer - handles all data access operations
 * Pure data access, no business logic
 */
export class RunRepository {
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

  async create(runData: RunRecord): Promise<{ id: string }> {
    const runRef = await db.collection('runs').add(runData);
    return { id: runRef.id };
  }

  async update(
    runId: string,
    runData: Partial<RunRecord>,
  ): Promise<RunRecordWithId> {
    const runRef = db.collection('runs').doc(runId);
    await runRef.update(runData);
    const updatedRunDoc = await runRef.get();

    return {
      id: updatedRunDoc.id,
      ...updatedRunDoc.data(),
    } as RunRecordWithId;
  }

  async delete(runId: string): Promise<boolean> {
    const runRef = db.collection('runs').doc(runId);
    const runDoc = await runRef.get();

    if (!runDoc.exists) {
      return false;
    }

    await runRef.delete();
    return true;
  }

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
