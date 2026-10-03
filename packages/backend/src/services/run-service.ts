import { runRepository } from '../repositories/run-repository.js';
import type { CreateRunBody, UpdateRunBody } from '../types/validation.js';
import type {
  PublicRun,
  ListRun,
  RunRecordWithId,
  EditorRun,
} from '../types/index.js';
import {
  getCurrentTimestamp,
  isValidPublicSlug,
  normalizePublicSlug,
} from '../utils/index.js';
import {
  sanitizeListRun,
  sanitizePublicRun,
  sanitizeEditorRun,
} from '../utils/sanitize.js';

/**
 * Service layer - handles business logic
 * Orchestrates validation, repository calls, and business rules
 */
export class RunService {
  async getUserRuns(userId: string): Promise<ListRun[]> {
    const runs = await runRepository.findByUserId(userId);
    return runs.map(sanitizeListRun);
  }

  async getRunForUser(
    runId: string,
    userId: string,
  ): Promise<EditorRun | null> {
    const runData = await runRepository.findByIdAndUserId(runId, userId);
    if (!runData) {
      return null;
    }
    return sanitizeEditorRun(runData);
  }

  async createRun(params: {
    userId: string;
    runData: CreateRunBody;
  }): Promise<EditorRun> {
    const { userId, runData } = params;

    // Check if slug is already in use
    if (runData.publicSlug) {
      const slugExists = await runRepository.slugExists(runData.publicSlug);
      if (slugExists) {
        throw new Error('Slug already exists');
      }
    }

    const runToCreate = {
      ...runData,
      createdAt: getCurrentTimestamp(),
    };

    const { id } = await runRepository.create({ userId, ...runToCreate });

    return { id, ...runToCreate };
  }

  async updateRun(params: {
    runId: string;
    userId: string;
    runData: UpdateRunBody;
  }): Promise<RunRecordWithId> {
    const { runId, userId, runData } = params;

    const runToUpdate = {
      ...runData,
      userId,
      updatedAt: getCurrentTimestamp(),
    };

    return runRepository.update(runId, runToUpdate);
  }

  async deleteRun(runId: string, userId: string): Promise<boolean> {
    // Verify ownership
    const existingRun = await runRepository.findByIdAndUserId(runId, userId);
    if (!existingRun) {
      return false;
    }

    return runRepository.delete(runId);
  }

  async getPublicRunBySlug(slug: string): Promise<PublicRun | null> {
    const normalizedSlug = normalizePublicSlug(slug);
    if (!isValidPublicSlug(normalizedSlug)) {
      return null;
    }

    const runData = await runRepository.findRunBySlug(normalizedSlug);
    if (!runData) {
      return null;
    }

    return sanitizePublicRun(runData);
  }

  async publishRun(runId: string, userId: string): Promise<boolean> {
    const runData = await runRepository.findByIdAndUserId(runId, userId);
    if (!runData) {
      return false;
    }

    await runRepository.update(runId, { isPublic: true });
    return true;
  }

  async unpublishRun(runId: string, userId: string): Promise<boolean> {
    const runData = await runRepository.findByIdAndUserId(runId, userId);
    if (!runData) {
      return false;
    }

    await runRepository.update(runId, { isPublic: false });
    return true;
  }
}

// Export a singleton instance
export const runService = new RunService();
