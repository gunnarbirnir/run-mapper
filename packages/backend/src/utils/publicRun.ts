import type { EditorRun, BoundingBox, PublicRun } from '../types/index.js';
import {
  isValidCoordinates,
  isValidRunCoordinate,
  isValidWaypoint,
  defaultBoundingBox,
} from './runValidation.js';

export const sanitizePublicRun = (runData: EditorRun): PublicRun => {
  return {
    id: runData.id,
    name: typeof runData.name === 'string' ? runData.name : 'Untitled Run',
    defaultRouteId:
      runData.defaultRouteId ??
      (runData.routes.length > 0 ? runData.routes[0].id : undefined),
    publicSlug: runData.publicSlug ?? '',
    pointsOfInterest: runData.pointsOfInterest ?? [],
    routes: runData.routes.map((route) => ({
      id: route.id,
      name: route.name,
      boundingBox:
        Array.isArray(route.boundingBox) &&
        route.boundingBox.length === 2 &&
        isValidCoordinates(route.boundingBox[0]) &&
        isValidCoordinates(route.boundingBox[1])
          ? ([route.boundingBox[0], route.boundingBox[1]] as BoundingBox)
          : defaultBoundingBox,
      coordinates: Array.isArray(route.coordinates)
        ? route.coordinates.filter((coordinate) =>
            isValidRunCoordinate(coordinate),
          )
        : [],
      waypoints: Array.isArray(route.waypoints)
        ? route.waypoints.filter((waypoint) => isValidWaypoint(waypoint))
        : [],
    })),
  };
};
