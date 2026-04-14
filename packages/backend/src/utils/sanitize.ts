import type {
  RunRecordWithId,
  BoundingBox,
  PublicRun,
  PointOfInterest,
  Waypoint,
} from '../types/index.js';
import {
  isValidBoundingBox,
  isValidRouteCoordinates,
  isValidCoordinates,
} from './validation.js';
import type { ListRun, PublicRoute } from '../types/index.js';
import { getImageSeed } from './index.js';

const defaultBoundingBox: BoundingBox = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 0 },
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
      : { lat: 0, lng: 0 },
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
      : { lat: 0, lng: 0 },
    type: waypoint.type ?? 'energy',
    distance: waypoint.distance ?? 0,
    amenities: waypoint.amenities ?? [],
  };
};

const sanitizePublicRoute = (route: PublicRoute): PublicRoute => {
  return {
    id: route.id,
    name: route.name,
    boundingBox: isValidBoundingBox(route.boundingBox)
      ? ([route.boundingBox[0], route.boundingBox[1]] as BoundingBox)
      : defaultBoundingBox,
    coordinates: route.coordinates.filter(isValidRouteCoordinates),
    waypoints: route.waypoints.map(sanitizeWaypoint),
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
