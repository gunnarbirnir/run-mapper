import { routingRepository } from '../repositories/routing-repository.js';
import type {
  Coordinates,
  RouteData,
  CoordinatesWithId,
  RouteCoordinates,
} from '../types/index.js';
import {
  sanitizeRouteBetweenPoints,
  sanitizeRouteData,
} from '../utils/sanitize.js';

export class RoutingService {
  async getRouteBetweenPoints(params: {
    startPoint: Coordinates;
    endPoint: Coordinates;
    mode: 'driving' | 'walking';
  }): Promise<CoordinatesWithId[]> {
    const routeBetweenPoints =
      await routingRepository.getRouteBetweenPoints(params);

    return sanitizeRouteBetweenPoints(routeBetweenPoints);
  }

  async getRouteData(coordinates: RouteCoordinates[]): Promise<RouteData> {
    const elevationCoordinates = [];
    const elevationIndices = [];

    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      if (coordinate.elevation === undefined) {
        elevationCoordinates.push(coordinate);
        elevationIndices.push(i);
      }
    }

    const routeElevations =
      elevationCoordinates.length > 0
        ? await routingRepository.getRouteElevations(elevationCoordinates)
        : [];

    return sanitizeRouteData(coordinates, routeElevations, elevationIndices);
  }
}

export const routingService = new RoutingService();
