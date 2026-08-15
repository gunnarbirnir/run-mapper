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
    const routeElevations =
      await routingRepository.getRouteElevations(coordinates);
    return sanitizeRouteData(coordinates, routeElevations);
  }
}

export const routingService = new RoutingService();
