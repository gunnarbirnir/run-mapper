import { routingService } from '../services/routing-service.js';
import type { AuthContext } from '../middleware/auth.js';
import { validateRouteDataBody } from '../utils/validation.js';

export class RoutingController {
  async getRouteBetweenPoints(c: AuthContext) {
    try {
      const userId = c.user?.uid;
      if (!userId) {
        return c.json(
          {
            success: false,
            error: 'User ID missing in auth context',
          },
          401,
        );
      }

      const startLat = c.req.query('startLat');
      const endLat = c.req.query('endLat');
      const startLng = c.req.query('startLng');
      const endLng = c.req.query('endLng');
      const mode = c.req.query('mode');

      if (!startLat || !endLat || !startLng || !endLng) {
        return c.json(
          {
            success: false,
            error: 'Start and end coordinates are required',
          },
          400,
        );
      }

      const routeBetweenPoints = await routingService.getRouteBetweenPoints({
        startPoint: { lat: Number(startLat), lng: Number(startLng) },
        endPoint: { lat: Number(endLat), lng: Number(endLng) },
        mode: mode === 'driving' ? 'driving' : 'walking',
      });

      return c.json({
        success: true,
        data: routeBetweenPoints,
        count: routeBetweenPoints.length,
      });
    } catch (error) {
      console.error('Error fetching route:', error);
      return c.json(
        {
          success: false,
          error: 'Failed to fetch route',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }

  async getRouteData(c: AuthContext) {
    try {
      const userId = c.user?.uid;
      if (!userId) {
        return c.json(
          {
            success: false,
            error: 'User ID missing in auth context',
          },
          401,
        );
      }

      const body = await c.req.json().catch(() => null);
      const validation = validateRouteDataBody(body);
      if (!validation.ok) {
        const err = validation.error;
        return c.json(
          {
            success: false,
            error: err.error,
            message: err.message,
          },
          err.status as 400,
        );
      }

      const routeData = await routingService.getRouteData(validation.value);

      return c.json({
        success: true,
        data: routeData,
      });
    } catch (error) {
      console.error('Error fetching route data:', error);
      return c.json(
        {
          success: false,
          error: 'Failed to fetch route data',
          message: 'An unexpected error occurred',
        },
        500,
      );
    }
  }
}

export const routingController = new RoutingController();
