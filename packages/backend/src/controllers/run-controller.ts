import type { Context } from 'hono';

import { MAX_RUN_DATA_BYTES } from '../config/constants.js';
import { runService } from '../services/run-service.js';
import { validateUpdatePublicBody } from '../utils/runValidation.js';
import { validateCreateRunBody } from '../utils/validation.js';
import { isValidPublicSlug, normalizePublicSlug } from '../utils/index.js';
import type { AuthContext } from '../middleware/auth.js';

/**
 * Controller layer - handles HTTP request/response
 * Thin layer that delegates to services and formats responses
 */
export class RunController {
  /**
   * GET /runs/list - List all runs for authenticated user
   */
  async getRunsList(c: AuthContext) {
    try {
      if (!c.user?.uid) {
        return c.json(
          {
            success: false,
            error: 'User ID missing in auth context',
          },
          401,
        );
      }

      const runsList = await runService.getUserRuns(c.user.uid);

      return c.json({
        success: true,
        data: runsList,
        count: runsList.length,
      });
    } catch (error) {
      console.error('Error fetching runs:', error);
      return c.json(
        {
          success: false,
          error: 'Failed to fetch runs',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }

  /**
   * GET /runs/editor/:id - Get a specific run for authenticated user
   */
  async getUserRun(c: AuthContext) {
    try {
      if (!c.user?.uid) {
        throw new Error('User ID missing in auth context');
      }

      const runId = c.req.param('id');
      const run = await runService.getRunForUser(runId, c.user.uid);

      if (!run) {
        return c.json(
          {
            success: false,
            error: 'Run not found',
          },
          404,
        );
      }

      return c.json({
        success: true,
        data: run,
      });
    } catch (error) {
      console.error('Error fetching run:', error);
      return c.json(
        {
          success: false,
          error: 'Failed to fetch run',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }

  /**
   * POST /runs/editor - Create a new run
   */
  async createRun(c: AuthContext) {
    try {
      // Check content length
      const contentLength = c.req.header('content-length');
      if (contentLength && Number(contentLength) > MAX_RUN_DATA_BYTES) {
        return c.json(
          {
            success: false,
            error: 'Payload too large',
            message: `Payload exceeds ${MAX_RUN_DATA_BYTES} bytes`,
          },
          413,
        );
      }

      // Parse and validate body
      const body = await c.req.json().catch(() => null);
      const validation = validateCreateRunBody(body);
      if (!validation.ok) {
        const err = validation.error;
        return c.json(
          {
            success: false,
            error: err.error,
            message: err.message,
          },
          err.status as 400,
        );
      }

      if (!c.user?.uid) {
        throw new Error('User ID missing in auth context');
      }

      // Create run (service handles slug uniqueness check)
      const created = await runService.createRun({
        userId: c.user.uid,
        runData: validation.value,
      });

      return c.json(
        {
          success: true,
          data: created,
        },
        201,
      );
    } catch (error) {
      console.error('Error creating run:', error);

      // Handle specific service errors
      if (error instanceof Error && error.message === 'Slug already exists') {
        return c.json(
          {
            success: false,
            error: 'Slug already exists',
            message: 'publicSlug is already in use',
          },
          409,
        );
      }

      return c.json(
        {
          success: false,
          error: 'Failed to create run',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }

  /**
   * PUT /runs/editor/:id - Update a run's public status
   */
  async updateRunPublicStatus(c: AuthContext) {
    try {
      const runId = c.req.param('id');

      if (!c.user?.uid) {
        throw new Error('User ID missing in auth context');
      }

      // Get existing run to check ownership and get current values
      const existingRun = await runService.getRunForUser(runId, c.user.uid);
      if (!existingRun) {
        return c.json(
          {
            success: false,
            error: 'Run not found',
          },
          404,
        );
      }

      // Parse and validate body
      const body = await c.req.json().catch(() => null);
      const validation = validateUpdatePublicBody(body, {
        isPublic: existingRun.isPublic,
        publicSlug: existingRun.publicSlug,
      });

      if (!validation.ok) {
        const err = validation.error;
        return c.json(
          {
            success: false,
            error: err.error,
            message: err.message,
          },
          err.status as 400 | 409 | 413,
        );
      }

      const { isPublic, publicSlug } = validation.value;

      // Update run (service handles slug uniqueness check)
      const updated = await runService.updateRunPublicStatus({
        runId,
        userId: c.user.uid,
        isPublic,
        publicSlug,
      });

      return c.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      console.error('Error updating run:', error);

      // Handle specific service errors
      if (error instanceof Error) {
        if (error.message === 'Run not found') {
          return c.json(
            {
              success: false,
              error: 'Run not found',
            },
            404,
          );
        }
        if (error.message === 'Slug already exists') {
          return c.json(
            {
              success: false,
              error: 'Slug already exists',
              message: 'publicSlug is already in use',
            },
            409,
          );
        }
      }

      return c.json(
        {
          success: false,
          error: 'Failed to update run',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }

  /**
   * DELETE /runs/editor/:id - Delete a run
   */
  async deleteRun(c: AuthContext) {
    try {
      if (!c.user?.uid) {
        throw new Error('User ID missing in auth context');
      }

      const runId = c.req.param('id');
      const deleted = await runService.deleteRun(runId, c.user.uid);

      if (!deleted) {
        return c.json(
          {
            success: false,
            error: 'Run not found',
          },
          404,
        );
      }

      return c.json({
        success: true,
        data: { id: runId },
      });
    } catch (error) {
      console.error('Error deleting run:', error);
      return c.json(
        {
          success: false,
          error: 'Failed to delete run',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }

  /**
   * GET /runs/public/:slug - Get a public run by slug
   */
  async getPublicRun(c: Context) {
    try {
      const slug = normalizePublicSlug(c.req.param('slug'));
      if (!isValidPublicSlug(slug)) {
        console.error('Invalid slug:', slug);
        return c.json(
          {
            success: false,
            error: 'Invalid slug',
            message:
              'Slug must contain only lowercase letters, numbers, or hyphens and be 3-64 characters long',
          },
          400,
        );
      }

      const publicRun = await runService.getPublicRunBySlug(slug);
      if (!publicRun) {
        return c.json(
          {
            success: false,
            error: 'Run not found',
          },
          404,
        );
      }

      return c.json({
        success: true,
        data: publicRun,
      });
    } catch (error) {
      console.error('Error fetching public run:', error);
      return c.json(
        {
          success: false,
          error: 'Failed to fetch public run',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }
}

// Export a singleton instance
export const runController = new RunController();
