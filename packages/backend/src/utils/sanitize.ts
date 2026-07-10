import type {
  RunRecordWithId,
  BoundingBox,
  PublicRun,
  PointOfInterest,
  Waypoint,
  Coordinates,
  EditorRun,
} from '../types/index.js';
import {
  isValidBoundingBox,
  isValidRouteCoordinates,
  isValidCoordinates,
} from './validation.js';
import type { ListRun, PublicRoute } from '../types/index.js';
import { getImageSeed } from './index.js';

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
    imageSeed: runData.imageSeed ?? getImageSeed(),
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
    displayDistance: route.displayDistance,
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
    imageSeed: runData.imageSeed ?? getImageSeed(),
  };
};
