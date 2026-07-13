import {
  MAX_RUN_NAME_LENGTH,
  MAX_RUN_POINTS_OF_INTEREST,
  MAX_RUN_ROUTES,
  MAX_ROUTE_COORDINATES,
  MAX_ROUTE_WAYPOINTS,
} from '../config/constants.js';
import {
  RouteCoordinates,
  WaypointType,
  PointOfInterest,
  Waypoint,
  PublicRoute,
} from '../types/index.js';
import type {
  ValidationResult,
  ErrResult,
  CreateRunBody,
} from '../types/validation.js';
import {
  normalizePublicSlug,
  isValidPublicSlug,
  isValidCoordinates,
  isValidRouteCoordinates,
  isValidPointOfInterestType,
  isValidBoundingBox,
  isValidWaypointType,
  isFiniteNumber,
  generateImageSeed,
  generateId,
} from './index.js';
import { calculateDistance, getBoundingBox } from './route.js';

export const validatePointsOfInterestBody = (
  rawBody: unknown,
): ValidationResult<PointOfInterest> => {
  if (!rawBody || typeof rawBody !== 'object') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'pointsOfInterest must be an array of objects',
      },
    };
  }

  const body = rawBody as PointOfInterest;
  const { name, description, coordinates, type } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'pointsOfInterest.name must be a string',
      },
    };
  }

  const normalizedName = name.trim();

  if (normalizedName.length > MAX_RUN_NAME_LENGTH) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `pointsOfInterest.name must be at most ${MAX_RUN_NAME_LENGTH} characters`,
      },
    };
  }

  if (description !== undefined && typeof description !== 'string') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'pointsOfInterest.description must be a string',
      },
    };
  }

  if (!isValidCoordinates(coordinates)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message:
          'pointsOfInterest.coordinates must be a valid coordinates object',
      },
    };
  }

  if (type !== undefined && !isValidPointOfInterestType(type)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'pointsOfInterest.type must be a valid point of interest type',
      },
    };
  }

  const normalizedType = type ?? 'expo';

  return {
    ok: true,
    value: {
      id: generateId(),
      name: normalizedName,
      type: normalizedType,
      description,
      coordinates,
    },
  };
};

export const validateWaypointBody = (
  rawBody: unknown,
): ValidationResult<Waypoint> => {
  if (!rawBody || typeof rawBody !== 'object') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints must be an array of objects',
      },
    };
  }

  const body = rawBody as Waypoint;
  const { name, description, coordinates, type, position, amenities } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.name must be a string',
      },
    };
  }

  const normalizedName = name.trim();

  if (normalizedName.length > MAX_RUN_NAME_LENGTH) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `waypoints.name must be at most ${MAX_RUN_NAME_LENGTH} characters`,
      },
    };
  }

  if (description !== undefined && typeof description !== 'string') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.description must be a string',
      },
    };
  }

  if (!isValidCoordinates(coordinates)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.coordinates must be a valid coordinates object',
      },
    };
  }

  if (type !== undefined && !isValidWaypointType(type)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.type must be a valid waypoint type',
      },
    };
  }

  const normalizedType = type ?? 'energy';

  if (!isFiniteNumber(position) || position < 0) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.position must be a positive number',
      },
    };
  }

  if (amenities !== undefined && !Array.isArray(amenities)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.amenities must be an array',
      },
    };
  }

  const normalizedAmenities: WaypointType[] = amenities ?? [];
  if (!normalizedAmenities.every(isValidWaypointType)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'waypoints.amenities must be an array of valid waypoint types',
      },
    };
  }

  return {
    ok: true,
    value: {
      id: generateId(),
      name: normalizedName,
      type: normalizedType,
      description,
      coordinates,
      position,
      amenities: normalizedAmenities,
    },
  };
};

export const validateRouteBody = (
  rawBody: unknown,
): ValidationResult<PublicRoute> => {
  if (!rawBody || typeof rawBody !== 'object') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes must be an array of objects',
      },
    };
  }

  const body = rawBody as PublicRoute;
  const { name, displayDistance, coordinates, waypoints } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes.name must be a string',
      },
    };
  }

  const normalizedName = name.trim();

  if (normalizedName.length > MAX_RUN_NAME_LENGTH) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `routes.name must be at most ${MAX_RUN_NAME_LENGTH} characters`,
      },
    };
  }

  if (displayDistance !== undefined && typeof displayDistance !== 'number') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes.displayDistance must be a number',
      },
    };
  }

  const calculatedBoundingBox = getBoundingBox(coordinates);

  if (!isValidBoundingBox(calculatedBoundingBox)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes.coordinates does not form a valid bounding box',
      },
    };
  }

  if (coordinates !== undefined && !Array.isArray(coordinates)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes.coordinates must be an array',
      },
    };
  }

  const normalizedCoordinates: RouteCoordinates[] = coordinates ?? [];

  if (normalizedCoordinates.length > MAX_ROUTE_COORDINATES) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `routes.coordinates must be at most ${MAX_ROUTE_COORDINATES} items`,
      },
    };
  }

  if (!normalizedCoordinates.every(isValidRouteCoordinates)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message:
          'routes.coordinates must be an array of valid route coordinates',
      },
    };
  }

  if (waypoints !== undefined && !Array.isArray(waypoints)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes.waypoints must be an array',
      },
    };
  }

  const normalizedWaypoints: Waypoint[] = waypoints ?? [];
  for (const waypoint of waypoints) {
    const validation = validateWaypointBody(waypoint);
    if (!validation.ok) {
      return validation as ErrResult;
    }
    normalizedWaypoints.push(validation.value);
  }

  if (normalizedWaypoints.length > MAX_ROUTE_WAYPOINTS) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `routes.waypoints must be at most ${MAX_ROUTE_WAYPOINTS} items`,
      },
    };
  }

  return {
    ok: true,
    value: {
      id: generateId(),
      name: normalizedName,
      distance: calculateDistance(normalizedCoordinates),
      displayDistance,
      boundingBox: calculatedBoundingBox,
      coordinates: normalizedCoordinates,
      waypoints: normalizedWaypoints,
    },
  };
};

export const validateCreateRunBody = (
  rawBody: unknown,
): ValidationResult<CreateRunBody> => {
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

  const body = rawBody as CreateRunBody;
  const {
    name,
    // defaultRouteId,
    isPublic,
    publicSlug,
    pointsOfInterest,
    routes,
  } = body;

  if (typeof name !== 'string' || name.trim().length === 0) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'name must be a string',
      },
    };
  }

  const normalizedName = name.trim();

  if (normalizedName.length > MAX_RUN_NAME_LENGTH) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `name must be at most ${MAX_RUN_NAME_LENGTH} characters`,
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

  if (typeof publicSlug !== 'string') {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'publicSlug must be a string',
      },
    };
  }

  const normalizedPublicSlug = normalizePublicSlug(publicSlug);
  const normalizedIsPublic = isPublic === true;

  if (!isValidPublicSlug(normalizedPublicSlug)) {
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

  if (pointsOfInterest !== undefined && !Array.isArray(pointsOfInterest)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'pointsOfInterest must be an array',
      },
    };
  }

  const normalizedPointsOfInterest: PointOfInterest[] = [];
  for (const pointOfInterest of pointsOfInterest) {
    const validation = validatePointsOfInterestBody(pointOfInterest);
    if (!validation.ok) {
      return validation as ErrResult;
    }
    normalizedPointsOfInterest.push(validation.value);
  }

  if (normalizedPointsOfInterest.length > MAX_RUN_POINTS_OF_INTEREST) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `pointsOfInterest must be at most ${MAX_RUN_POINTS_OF_INTEREST} items`,
      },
    };
  }

  if (routes !== undefined && !Array.isArray(routes)) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: 'routes must be an array',
      },
    };
  }

  const normalizedRoutes: PublicRoute[] = [];
  for (const route of routes) {
    const validation = validateRouteBody(route);
    if (!validation.ok) {
      return validation as ErrResult;
    }
    normalizedRoutes.push(validation.value);
  }

  if (normalizedRoutes.length > MAX_RUN_ROUTES) {
    return {
      ok: false,
      error: {
        status: 400,
        error: 'Invalid payload',
        message: `routes must be at most ${MAX_RUN_ROUTES} items`,
      },
    };
  }

  return {
    ok: true,
    value: {
      name: normalizedName,
      isPublic: normalizedIsPublic,
      publicSlug: normalizedPublicSlug,
      pointsOfInterest: normalizedPointsOfInterest,
      routes: normalizedRoutes,
      imageSeed: generateImageSeed(),
    },
  };
};
