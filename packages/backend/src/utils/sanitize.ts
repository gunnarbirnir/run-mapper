import type {
  RunRecordWithId,
  BoundingBox,
  PublicRun,
  PointOfInterest,
  Waypoint,
  CoordinatesWithId,
  EditorRun,
  DirectionsResponse,
  RouteData,
  RouteCoordinates,
  ElevationStats,
} from '../types/index.js';
import type { ListRun, PublicRoute } from '../types/index.js';
import {
  generateImageSeed,
  isValidBoundingBox,
  isValidRouteCoordinates,
  isValidCoordinates,
  generateId,
  roundNumber,
} from './index.js';
import {
  getBoundingBox,
  getElevationStats,
  haversineDistance,
} from './route.js';
import {
  DISTANCE_DECIMALS,
  COORDINATES_DECIMALS,
  ELEVATION_DECIMALS,
} from '../config/constants.js';

// Sanitize fetched data in service layer

// Reykjavík
const DEFAULT_BOUNDING_BOX: BoundingBox = [
  { lat: 64.02, lng: -22.17 },
  { lat: 64.21, lng: -21.52 },
];
const DEFAULT_ELEVATION_STATS: ElevationStats = {
  elevationGain: 0,
  elevationLoss: 0,
  netElevation: 0,
  maxElevation: 0,
  minElevation: 0,
};

export const sanitizeListRun = (runData: RunRecordWithId): ListRun => {
  return {
    id: runData.id || generateId(),
    name: runData.name || 'Untitled Run',
    isPublic: runData.isPublic ?? false,
    publicSlug: runData.publicSlug ?? '',
    createdAt: runData.createdAt,
    updatedAt: runData.updatedAt,
    imageSeed: runData.imageSeed ?? generateImageSeed(),
  };
};

const sanitizePointsOfInterest = (
  pointOfInterest: PointOfInterest,
): PointOfInterest | null => {
  return isValidCoordinates(pointOfInterest.coordinates)
    ? {
        id: pointOfInterest.id || generateId(),
        name: pointOfInterest.name || 'Untitled POI',
        description: pointOfInterest.description,
        coordinates: pointOfInterest.coordinates,
        type: pointOfInterest.type || 'expo',
      }
    : null;
};

const sanitizeWaypoint = (waypoint: Waypoint): Waypoint | null => {
  return isValidCoordinates(waypoint.coordinates)
    ? {
        id: waypoint.id || generateId(),
        name: waypoint.name || 'Untitled Waypoint',
        description: waypoint.description,
        coordinates: waypoint.coordinates,
        type: waypoint.type || 'energy',
        position: waypoint.position ?? 0,
        amenities: waypoint.amenities ?? [],
      }
    : null;
};

const sanitizePublicRoute = (route: PublicRoute): PublicRoute => {
  return {
    id: route.id || generateId(),
    name: route.name || 'Untitled Route',
    boundingBox: isValidBoundingBox(route.boundingBox)
      ? route.boundingBox
      : DEFAULT_BOUNDING_BOX,
    coordinates: route.coordinates.filter(isValidRouteCoordinates),
    waypoints: route.waypoints
      .map(sanitizeWaypoint)
      .filter(Boolean) as Waypoint[],
    distance: route.distance ?? 0,
    displayDistance: route.displayDistance,
    elevationStats: route.elevationStats ?? DEFAULT_ELEVATION_STATS,
  };
};

export const sanitizePublicRun = (runData: RunRecordWithId): PublicRun => {
  return {
    id: runData.id || generateId(),
    name: runData.name || 'Untitled Run',
    defaultRouteId:
      runData.defaultRouteId ??
      // Find shortest route once distance is part of route data
      (runData.routes.length > 0 ? runData.routes[0].id : undefined),
    publicSlug: runData.publicSlug ?? '',
    pointsOfInterest: runData.pointsOfInterest
      .map(sanitizePointsOfInterest)
      .filter(Boolean) as PointOfInterest[],
    routes: runData.routes.map(sanitizePublicRoute),
  };
};

export const sanitizeEditorRun = (runData: RunRecordWithId): EditorRun => {
  return {
    ...sanitizePublicRun(runData),
    isPublic: runData.isPublic ?? false,
    createdAt: runData.createdAt,
    updatedAt: runData.updatedAt,
    imageSeed: runData.imageSeed ?? generateImageSeed(),
  };
};

export const sanitizeRouteBetweenPoints = (
  directionsResponse: DirectionsResponse,
): CoordinatesWithId[] => {
  if (directionsResponse.routes.length === 0) {
    return [];
  }

  return directionsResponse.routes[0].geometry.coordinates
    .map((coordinate) => ({
      id: generateId(),
      lng: roundNumber(coordinate[0], COORDINATES_DECIMALS),
      lat: roundNumber(coordinate[1], COORDINATES_DECIMALS),
    }))
    .filter(isValidCoordinates);
};

export const sanitizeRouteData = (
  coordinates: RouteCoordinates[],
  routeElevations: number[],
  elevationIndices: number[],
): RouteData => {
  let cumulativeDistance = 0;
  const routeCoordinates = coordinates.map((coord, index) => ({
    id: coord.id,
    lng: roundNumber(coord.lng, COORDINATES_DECIMALS),
    lat: roundNumber(coord.lat, COORDINATES_DECIMALS),
    isControlPoint: coord.isControlPoint ?? false,
    elevation: roundNumber(coord.elevation ?? 0, ELEVATION_DECIMALS),
    distance: roundNumber(
      (cumulativeDistance +=
        index === 0 ? 0 : haversineDistance(coordinates[index - 1], coord)),
      DISTANCE_DECIMALS,
    ),
  }));

  for (let i = 0; i < elevationIndices.length; i++) {
    const index = elevationIndices[i];
    routeCoordinates[index].elevation = routeElevations[i];
  }

  return {
    distance: roundNumber(cumulativeDistance, DISTANCE_DECIMALS),
    coordinates: routeCoordinates,
    boundingBox: getBoundingBox(routeCoordinates),
    elevationStats: getElevationStats(routeCoordinates),
  };
};
