import type { Coordinates, DirectionsResponse } from '../types/index.js';

const MAPBOX_DIRECTIONS_BASE_URL = 'https://api.mapbox.com/directions/v5';
const MAPBOX_TILEQUERY_BASE_URL =
  'https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery';
const CONCURRENT_REQUESTS = 10;

export class RoutingRepository {
  async getRouteBetweenPoints({
    startPoint,
    endPoint,
  }: {
    startPoint: Coordinates;
    endPoint: Coordinates;
  }): Promise<DirectionsResponse> {
    const response = await fetch(
      `${MAPBOX_DIRECTIONS_BASE_URL}/mapbox/walking/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?geometries=geojson&overview=full&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    return await response.json();
  }

  async getCoordinatesBetweenPoints(
    coordinates: Coordinates[],
  ): Promise<(Coordinates & { elevation: number })[]> {
    const results: (Coordinates & { elevation: number })[] = [];

    for (let i = 0; i < coordinates.length; i += CONCURRENT_REQUESTS) {
      const batch = coordinates.slice(i, i + CONCURRENT_REQUESTS);
      const responses = await Promise.all(
        batch.map((coordinate) =>
          fetch(
            `${MAPBOX_TILEQUERY_BASE_URL}/${coordinate.lng},${coordinate.lat}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
          ).then((response) => response.json()),
        ),
      );

      results.push(
        ...responses.map((item) => ({
          lng: item.features[0].geometry.coordinates[0],
          lat: item.features[0].geometry.coordinates[1],
          elevation: item.features[0].properties.elevation,
        })),
      );
    }

    return results;
  }
}

export const routingRepository = new RoutingRepository();
