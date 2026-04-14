import type {
  BoundingBox,
  Waypoint,
  RouteCoordinates,
  Coordinates,
} from '../types/index.js';
import {
  MAX_ROUTE_COORDINATES,
  MAX_ROUTE_DATA_BYTES,
  MAX_ROUTE_WAYPOINTS,
  MAX_RUN_NAME_LENGTH,
} from '../config/constants.js';
import { isValidPublicSlug, normalizePublicSlug } from './index.js';

export interface RouteDataPayload {
  boundingBox?: BoundingBox;
  coordinates?: RouteCoordinates[];
  waypoints?: Waypoint[];
}

export interface NormalizedRouteData {
  boundingBox: BoundingBox;
  coordinates: RouteCoordinates[];
  waypoints: Waypoint[];
}

export const defaultBoundingBox: BoundingBox = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 0 },
];

export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const coordinate = value as Coordinates;
  return (
    isFiniteNumber(coordinate.lat) &&
    isFiniteNumber(coordinate.lng) &&
    coordinate.lat >= -90 &&
    coordinate.lat <= 90 &&
    coordinate.lng >= -180 &&
    coordinate.lng <= 180
  );
};

export const isValidRunCoordinate = (
  value: unknown,
): value is RouteCoordinates => {
  if (!isValidCoordinates(value)) {
    return false;
  }
  return isFiniteNumber((value as RouteCoordinates).elevation);
};

export const isValidWaypoint = (value: unknown): value is Waypoint => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const waypoint = value as Waypoint;
  return (
    typeof waypoint.id === 'string' &&
    typeof waypoint.name === 'string' &&
    isValidCoordinates(waypoint.coordinates) &&
    [
      'energy',
      'entertainment',
      'hydration',
      'timing',
      'restrooms',
      'start',
      'end',
    ].includes(waypoint.type as string)
  );
};

export const normalizeRouteData = (
  routeData?: RouteDataPayload,
): NormalizedRouteData => {
  return {
    boundingBox: routeData?.boundingBox ?? defaultBoundingBox,
    coordinates: routeData?.coordinates ?? [],
    waypoints: routeData?.waypoints ?? [],
  };
};

export interface ValidationError {
  status: number;
  error: string;
  message: string;
}

export interface ValidatedCreateRunBody {
  name: string;
  normalizedRouteData: NormalizedRouteData;
  isPublic: boolean;
  publicSlug?: string;
}

export interface OkResult<T> {
  ok: true;
  value: T;
  error?: undefined;
}

export interface ErrResult {
  ok: false;
  error: ValidationError;
  value?: undefined;
}

export type ValidationResult<T> = OkResult<T> | ErrResult;

export const validateCreateRunBody = (
  rawBody: unknown,
): ValidationResult<ValidatedCreateRunBody> => {
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
    name?: unknown;
    routeData?: RouteDataPayload;
    isPublic?: unknown;
    publicSlug?: unknown;
  };

  const { name, routeData, isPublic, publicSlug } = body;

  if (name !== undefined && typeof name !== 'string') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'name must be a string',
      },
    };
  }

  if (typeof name === 'string' && name.trim().length > MAX_RUN_NAME_LENGTH) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `name must be at most ${MAX_RUN_NAME_LENGTH} characters`,
      },
    };
  }

  if (
    routeData !== undefined &&
    (typeof routeData !== 'object' || routeData === null)
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routeData must be an object',
      },
    };
  }

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

  const normalizedPublicSlug =
    typeof publicSlug === 'string'
      ? normalizePublicSlug(publicSlug)
      : undefined;
  const normalizedIsPublic = isPublic === true;

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

  if (!normalizedIsPublic && normalizedPublicSlug) {
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

  if (routeData?.coordinates && !Array.isArray(routeData.coordinates)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routeData.coordinates must be an array',
      },
    };
  }

  if (routeData?.waypoints && !Array.isArray(routeData.waypoints)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routeData.waypoints must be an array',
      },
    };
  }

  if (
    routeData?.coordinates &&
    routeData.coordinates.length > MAX_ROUTE_COORDINATES
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `routeData.coordinates must contain at most ${MAX_ROUTE_COORDINATES} points`,
      },
    };
  }

  if (
    routeData?.waypoints &&
    routeData.waypoints.length > MAX_ROUTE_WAYPOINTS
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `routeData.waypoints must contain at most ${MAX_ROUTE_WAYPOINTS} entries`,
      },
    };
  }

  if (
    routeData?.boundingBox &&
    (!Array.isArray(routeData.boundingBox) ||
      routeData.boundingBox.length !== 2 ||
      !isValidCoordinates(routeData.boundingBox[0]) ||
      !isValidCoordinates(routeData.boundingBox[1]))
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message:
          'routeData.boundingBox must contain exactly two valid coordinates',
      },
    };
  }

  if (
    routeData?.coordinates &&
    !routeData.coordinates.every((coordinate) =>
      isValidRunCoordinate(coordinate),
    )
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routeData.coordinates contains invalid coordinates',
      },
    };
  }

  if (
    routeData?.waypoints &&
    !routeData.waypoints.every(
      (waypoint) =>
        waypoint &&
        typeof waypoint.id === 'string' &&
        typeof waypoint.name === 'string' &&
        isValidCoordinates(waypoint.coordinates),
    )
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routeData.waypoints contains invalid entries',
      },
    };
  }

  const normalizedRouteData = normalizeRouteData(routeData);
  const payloadBytes = Buffer.byteLength(
    JSON.stringify(normalizedRouteData),
    'utf8',
  );

  if (payloadBytes > MAX_ROUTE_DATA_BYTES) {
    return {
      ok: false,
      error: {
        status: 413,
        error: 'Payload too large',
        message: `routeData exceeds ${MAX_ROUTE_DATA_BYTES} bytes`,
      },
    };
  }

  const normalizedName =
    typeof name === 'string' && name.trim() ? name.trim() : 'Untitled Run';

  return {
    ok: true,
    value: {
      name: normalizedName,
      normalizedRouteData,
      isPublic: normalizedIsPublic,
      publicSlug: normalizedPublicSlug,
    },
  };
};

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
