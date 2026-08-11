import { routingRepository } from '../repositories/routing-repository.js';
import type {
  Coordinates,
  RouteStats,
  CoordinatesWithId,
} from '../types/index.js';
import {
  sanitizeRouteBetweenPoints,
  sanitizeRouteStats,
} from '../utils/sanitize.js';

export class RoutingService {
  async getRouteBetweenPoints(params: {
    startPoint: Coordinates;
    endPoint: Coordinates;
  }): Promise<CoordinatesWithId[]> {
    const routeBetweenPoints =
      await routingRepository.getRouteBetweenPoints(params);

    return sanitizeRouteBetweenPoints(routeBetweenPoints);
  }

  async getRouteStats(coordinates: Coordinates[]): Promise<RouteStats> {
    return sanitizeRouteStats(coordinates);
  }
}

export const routingService = new RoutingService();
