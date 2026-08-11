import type { Coordinates, DirectionsResponse } from '../types/index.js';

const MAPBOX_DIRECTIONS_BASE_URL =
  'https://api.mapbox.com/directions/v5/mapbox/walking';

export class RoutingRepository {
  async getRouteBetweenPoints({
    startPoint,
    endPoint,
  }: {
    startPoint: Coordinates;
    endPoint: Coordinates;
  }): Promise<DirectionsResponse> {
    const response = await fetch(
      `${MAPBOX_DIRECTIONS_BASE_URL}/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?geometries=geojson&overview=full&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    return await response.json();
  }
}

export const routingRepository = new RoutingRepository();
