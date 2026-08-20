import type {
  RunRecordWithId,
  BoundingBox,
  PublicRun,
  PointOfInterest,
  Waypoint,
  Coordinates,
  CoordinatesWithId,
  EditorRun,
  DirectionsResponse,
  RouteData,
  RouteCoordinates,
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

// Sanitize fetched data in service layer

const DEFAULT_COORDINATES: Coordinates = { lat: 0, lng: 0 };
const DEFAULT_BOUNDING_BOX: BoundingBox = [
  DEFAULT_COORDINATES,
  DEFAULT_COORDINATES,
];
const DISTANCE_DECIMALS = 5;
const COORDINATES_DECIMALS = 6;

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

export const sanitizeRouteBetweenPoints = (
  directionsResponse: DirectionsResponse,
): CoordinatesWithId[] => {
  if (directionsResponse.routes.length === 0) {
    return [];
  }

  return directionsResponse.routes[0].geometry.coordinates
    .map((coordinate) => ({
      id: generateId(),
      lng: coordinate[0],
      lat: coordinate[1],
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
    elevation: coord.elevation ?? 0,
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
