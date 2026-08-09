import type {
  RunRecordWithId,
  BoundingBox,
  PublicRun,
  PointOfInterest,
  Waypoint,
  Coordinates,
  EditorRun,
  RouteBetweenPoints,
  DirectionsResponse,
} from '../types/index.js';
import type { ListRun, PublicRoute } from '../types/index.js';
import {
  generateId,
  generateImageSeed,
  isValidBoundingBox,
  isValidRouteCoordinates,
  isValidCoordinates,
} from './index.js';
import { getElevationStats } from './route.js';

// Sanitize fetched data in service layer

const DEFAULT_COORDINATES: Coordinates = { lat: 0, lng: 0 };
const DEFAULT_BOUNDING_BOX: BoundingBox = [
  DEFAULT_COORDINATES,
  DEFAULT_COORDINATES,
];

export const sanitizeListRun = (runData: RunRecordWithId): ListRun => {
  return {
    id: runData.id,
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
): PointOfInterest => {
  return {
    id: pointOfInterest.id,
    name: pointOfInterest.name || 'Untitled POI',
    description: pointOfInterest.description,
    coordinates: isValidCoordinates(pointOfInterest.coordinates)
      ? pointOfInterest.coordinates
      : DEFAULT_COORDINATES,
    type: pointOfInterest.type ?? 'expo',
  };
};

const sanitizeWaypoint = (waypoint: Waypoint): Waypoint => {
  return {
    id: waypoint.id,
    name: waypoint.name || 'Untitled Waypoint',
    description: waypoint.description,
    coordinates: isValidCoordinates(waypoint.coordinates)
      ? waypoint.coordinates
      : DEFAULT_COORDINATES,
    type: waypoint.type ?? 'energy',
    position: waypoint.position ?? 0,
    amenities: waypoint.amenities ?? [],
  };
};

const sanitizePublicRoute = (route: PublicRoute): PublicRoute => {
  return {
    id: route.id,
    name: route.name || 'Untitled Route',
    boundingBox: isValidBoundingBox(route.boundingBox)
      ? ([route.boundingBox[0], route.boundingBox[1]] as BoundingBox)
      : DEFAULT_BOUNDING_BOX,
    coordinates: route.coordinates.filter(isValidRouteCoordinates),
    waypoints: route.waypoints.map(sanitizeWaypoint),
    distance: route.distance ?? 0,
    displayDistance: route.displayDistance,
    elevationStats: route.elevationStats,
  };
};

export const sanitizePublicRun = (runData: RunRecordWithId): PublicRun => {
  return {
    id: runData.id,
    name: runData.name || 'Untitled Run',
    defaultRouteId:
      runData.defaultRouteId ??
      // Find shortest route once distance is part of route data
      (runData.routes.length > 0 ? runData.routes[0].id : undefined),
    publicSlug: runData.publicSlug ?? '',
    pointsOfInterest: runData.pointsOfInterest.map(sanitizePointsOfInterest),
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

export const sanitizeDirectionsResponse = (
  directionsResponse: DirectionsResponse,
): { distance: number; coordinates: Coordinates[] } => {
  if (directionsResponse.routes.length === 0) {
    return {
      distance: 0,
      coordinates: [],
    };
  }

  const routeResponse = directionsResponse.routes[0];

  return {
    distance: directionsResponse.routes[0].distance ?? 0,
    coordinates: routeResponse.geometry.coordinates
      .map((coordinate) => ({
        lng: coordinate[0],
        lat: coordinate[1],
      }))
      .filter(isValidCoordinates),
  };
};

export const sanitizeRouteBetweenPoints = (routeBetweenPoints: {
  distance: number;
  coordinates: (Coordinates & { elevation: number })[];
}): RouteBetweenPoints => {
  return {
    distance: routeBetweenPoints.distance ?? 0,
    elevationStats: getElevationStats(routeBetweenPoints.coordinates),
    coordinates: routeBetweenPoints.coordinates
      .map((coordinate, index) => ({
        id: generateId(),
        isRoutePoint:
          index === 0 || index === routeBetweenPoints.coordinates.length - 1,
        lng: coordinate.lng,
        lat: coordinate.lat,
        elevation: coordinate.elevation,
      }))
      .filter(isValidRouteCoordinates),
  };
};
