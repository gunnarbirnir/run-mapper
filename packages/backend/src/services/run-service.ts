import {
  runRepository,
  type RunWithId,
} from '../repositories/run-repository.js';
import type { NormalizedRouteData } from '../utils/runValidation.js';
import type { PublicRun, ListRun } from '../types/index.js';
import { isValidPublicSlug, normalizePublicSlug } from '../utils/index.js';
import { sanitizeListRun, sanitizePublicRun } from '../utils/sanitize.js';

/**
 * Service layer - handles business logic
 * Orchestrates validation, repository calls, and business rules
 */
export class RunService {
  /**
   * Get all runs for a user
   */
  async getUserRuns(userId: string): Promise<ListRun[]> {
    const runs = await runRepository.findByUserId(userId);
    return runs.map(sanitizeListRun);
  }

  /**
   * Get a run for a user (with ownership check)
   */
  async getRunForUser(
    runId: string,
    userId: string,
  ): Promise<RunWithId | null> {
    return runRepository.findByIdAndUserId(runId, userId);
  }

  /**
   * Create a new run with validation and business logic
   */
  async createRun(params: {
    userId: string;
    name: string;
    routeData: NormalizedRouteData;
    isPublic: boolean;
    publicSlug?: string;
  }): Promise<{ id: string }> {
    const { /* userId, name, routeData, isPublic, */ publicSlug } = params;

    // Check if slug is already in use
    if (publicSlug) {
      const slugExists = await runRepository.slugExists(publicSlug);
      if (slugExists) {
        throw new Error('Slug already exists');
      }
    }

    throw new Error('Not implemented yet');

    /* const runToCreate: RunRecord = {
      userId,
      name,
      createdAt: new Date().toISOString(),
      isPublic,
      ...(isPublic && publicSlug ? { publicSlug } : {}),
      ...routeData,
    };

    return runRepository.create(runToCreate); */
  }

  /**
   * Update a run's public status with validation
   */
  async updateRunPublicStatus(params: {
    runId: string;
    userId: string;
    isPublic: boolean;
    publicSlug?: string;
  }): Promise<RunWithId> {
    const { runId, userId, isPublic, publicSlug } = params;

    // Verify ownership
    const existingRun = await runRepository.findByIdAndUserId(runId, userId);
    if (!existingRun) {
      throw new Error('Run not found');
    }

    // Check if slug is already in use by another run
    if (isPublic && publicSlug) {
      const slugExists = await runRepository.slugExists(publicSlug, runId);
      if (slugExists) {
        throw new Error('Slug already exists');
      }
    }

    return runRepository.updatePublicStatus(runId, {
      isPublic,
      publicSlug: publicSlug || null,
    });
  }

  /**
   * Delete a run (with ownership check)
   */
  async deleteRun(runId: string, userId: string): Promise<boolean> {
    // Verify ownership
    const existingRun = await runRepository.findByIdAndUserId(runId, userId);
    if (!existingRun) {
      return false;
    }

    return runRepository.delete(runId);
  }

  /**
   * Get a public run by slug with sanitization
   */
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
}

// Export a singleton instance
export const runService = new RunService();
