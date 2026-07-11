import type { ValidationResult } from '../types/validation.js';
import { isValidPublicSlug, normalizePublicSlug } from './index.js';

export interface ValidatedUpdatePublicBody {
  isPublic: boolean;
  publicSlug?: string;
}

export const validateUpdatePublicBody = (
  rawBody: unknown,
  existingRun: { isPublic?: unknown; publicSlug?: unknown },
): ValidationResult<ValidatedUpdatePublicBody> => {
  if (!rawBody || typeof rawBody !== 'object') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'Request body must be a JSON object',
      },
    };
  }

  const body = rawBody as {
    isPublic?: unknown;
    publicSlug?: unknown;
  };

  const { isPublic, publicSlug } = body;

  if (isPublic !== undefined && typeof isPublic !== 'boolean') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'isPublic must be a boolean',
      },
    };
  }

  if (publicSlug !== undefined && typeof publicSlug !== 'string') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'publicSlug must be a string',
      },
    };
  }

  const normalizedIsPublic =
    typeof isPublic === 'boolean' ? isPublic : existingRun.isPublic === true;
  const normalizedPublicSlug =
    typeof publicSlug === 'string'
      ? normalizePublicSlug(publicSlug)
      : typeof existingRun.publicSlug === 'string'
        ? normalizePublicSlug(existingRun.publicSlug)
        : undefined;

  if (normalizedIsPublic && !normalizedPublicSlug) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'publicSlug is required when isPublic is true',
      },
    };
  }

  if (!normalizedIsPublic && typeof publicSlug === 'string') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'publicSlug can only be provided when isPublic is true',
      },
    };
  }

  if (normalizedPublicSlug && !isValidPublicSlug(normalizedPublicSlug)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message:
          'publicSlug must contain only lowercase letters, numbers, or hyphens and be 3-64 characters long',
      },
    };
  }

  return {
    ok: true,
    value: {
      isPublic: normalizedIsPublic,
      publicSlug: normalizedPublicSlug,
    },
  };
};
