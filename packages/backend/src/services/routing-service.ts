import { routingRepository } from '../repositories/routing-repository.js';
import type { Coordinates, RouteBetweenPoints } from '../types/index.js';
import {
  sanitizeDirectionsResponse,
  sanitizeRouteBetweenPoints,
} from '../utils/sanitize.js';

export class RoutingService {
  async getRouteBetweenPoints(params: {
    startPoint: Coordinates;
    endPoint: Coordinates;
  }): Promise<RouteBetweenPoints> {
    const routeBetweenPoints =
      await routingRepository.getRouteBetweenPoints(params);
    const sanitizedRoute = sanitizeDirectionsResponse(routeBetweenPoints);

    const routeWithElevations = {
      ...sanitizedRoute,
      coordinates: await routingRepository.getCoordinatesBetweenPoints(
        sanitizedRoute.coordinates,
      ),
    };
    return sanitizeRouteBetweenPoints(routeWithElevations);
  }
}

export const routingService = new RoutingService();
