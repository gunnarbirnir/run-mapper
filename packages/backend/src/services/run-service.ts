import { runRepository, type RunRecord, type RunWithId } from '../repositories/run-repository.js';
import {
  type NormalizedRouteData,
  type BaseCoordinate,
  type RunCoordinate,
  type Waypoint,
} from '../validation/runPayload.js';
import { isValidPublicSlug, normalizePublicSlug } from '../utils/publicSlug.js';

export interface PublicRun {
  id: string;
  name: string;
  boundingBox: [BaseCoordinate, BaseCoordinate];
  coordinates: RunCoordinate[];
  waypoints: Waypoint[];
}

/**
 * Service layer - handles business logic
 * Orchestrates validation, repository calls, and business rules
 */
export class RunService {
  /**
   * Get all runs for a user
   */
  async getUserRuns(userId: string): Promise<RunWithId[]> {
    return runRepository.findByUserId(userId);
  }

  /**
   * Get a run for a user (with ownership check)
   */
  async getRunForUser(runId: string, userId: string): Promise<RunWithId | null> {
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
    const { userId, name, routeData, isPublic, publicSlug } = params;

    // Check if slug is already in use
    if (publicSlug) {
      const slugExists = await runRepository.slugExists(publicSlug);
      if (slugExists) {
        throw new Error('Slug already exists');
      }
    }

    const runToCreate: RunRecord = {
      userId,
      name,
      createdAt: new Date().toISOString(),
      isPublic,
      ...(isPublic && publicSlug ? { publicSlug } : {}),
      ...routeData,
    };

    return runRepository.create(runToCreate);
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

    const runData = await runRepository.findPublicBySlug(normalizedSlug);
    if (!runData) {
      return null;
    }

    return this.sanitizePublicRun(runData);
  }

  /**
   * Sanitize run data for public consumption
   */
  private sanitizePublicRun(runData: RunWithId): PublicRun {
    const defaultBoundingBox: [BaseCoordinate, BaseCoordinate] = [
      { lat: 0, lng: 0 },
      { lat: 0, lng: 0 },
    ];

    const isFiniteNumber = (value: unknown): value is number =>
      typeof value === 'number' && Number.isFinite(value);

    const isValidCoordinate = (value: unknown): value is BaseCoordinate => {
      if (!value || typeof value !== 'object') return false;
      const coordinate = value as BaseCoordinate;
      return (
        isFiniteNumber(coordinate.lat) &&
        isFiniteNumber(coordinate.lng) &&
        coordinate.lat >= -90 &&
        coordinate.lat <= 90 &&
        coordinate.lng >= -180 &&
        coordinate.lng <= 180
      );
    };

    const isValidRunCoordinate = (value: unknown): value is RunCoordinate => {
      if (!isValidCoordinate(value)) return false;
      return isFiniteNumber((value as RunCoordinate).elevation);
    };

    const isValidWaypoint = (value: unknown): value is Waypoint => {
      if (!value || typeof value !== 'object') return false;
      const waypoint = value as Waypoint;
      return (
        typeof waypoint.id === 'string' &&
        typeof waypoint.name === 'string' &&
        isValidCoordinate(waypoint.coordinates) &&
        ['energy', 'entertainment', 'start', 'end'].includes(
          waypoint.type as string,
        )
      );
    };

    return {
      id: runData.id,
      name: typeof runData.name === 'string' ? runData.name : 'Untitled Run',
      boundingBox:
        Array.isArray(runData.boundingBox) &&
        runData.boundingBox.length === 2 &&
        isValidCoordinate(runData.boundingBox[0]) &&
        isValidCoordinate(runData.boundingBox[1])
          ? ([
              runData.boundingBox[0],
              runData.boundingBox[1],
            ] as [BaseCoordinate, BaseCoordinate])
          : defaultBoundingBox,
      coordinates: Array.isArray(runData.coordinates)
        ? runData.coordinates.filter((coordinate) =>
            isValidRunCoordinate(coordinate),
          )
        : [],
      waypoints: Array.isArray(runData.waypoints)
        ? runData.waypoints.filter((waypoint) => isValidWaypoint(waypoint))
        : [],
    };
  }
}

// Export a singleton instance
export const runService = new RunService();
