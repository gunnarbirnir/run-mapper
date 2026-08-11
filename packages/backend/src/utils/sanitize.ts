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
  RouteStats,
} from '../types/index.js';
import type { ListRun, PublicRoute } from '../types/index.js';
import {
  generateImageSeed,
  isValidBoundingBox,
  isValidRouteCoordinates,
  isValidCoordinates,
  generateId,
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

export const sanitizeRouteStats = (
  directionsResponse: DirectionsResponse,
): RouteStats => {
  if (directionsResponse.routes.length === 0) {
    return {
      boundingBox: DEFAULT_BOUNDING_BOX,
      coordinates: [],
      distance: 0,
      elevationStats: {
        elevationGain: 0,
        elevationLoss: 0,
        netElevation: 0,
        maxElevation: 0,
        minElevation: 0,
      },
    };
  }

  const routeResponse = directionsResponse.routes[0];
  const responseCoordinates = routeResponse.geometry.coordinates;
  let cumulativeDistance = 0;
  const coordinates = responseCoordinates
    .map((coord, index) => ({
      id: generateId(),
      lng: coord[0],
      lat: coord[1],
      isControlPoint: false,
      // TODO: Get elevation
      elevation: 0,
      distance: (cumulativeDistance +=
        index === 0
          ? 0
          : haversineDistance(
              {
                lng: responseCoordinates[index - 1][0],
                lat: responseCoordinates[index - 1][1],
              },
              { lng: coord[0], lat: coord[1] },
            )),
    }))
    .filter(isValidRouteCoordinates);

  return {
    coordinates,
    distance: routeResponse.distance,
    boundingBox: getBoundingBox(coordinates),
    elevationStats: getElevationStats(coordinates),
  };
};
