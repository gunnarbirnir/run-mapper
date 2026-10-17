import type { Coordinates, DirectionsResponse } from '../types/index.js';

const MAPBOX_DIRECTIONS_BASE_URL =
  'https://api.mapbox.com/directions/v5/mapbox';
const ELEVATION_BASE_URL = 'https://api.open-meteo.com/v1/elevation';
const ELEVATION_BATCH_SIZE = 100;

export class RoutingRepository {
  async getRouteBetweenPoints({
    startPoint,
    endPoint,
    mode,
  }: {
    startPoint: Coordinates;
    endPoint: Coordinates;
    mode: 'driving' | 'walking';
  }): Promise<DirectionsResponse> {
    const response = await fetch(
      `${MAPBOX_DIRECTIONS_BASE_URL}/${mode}/${startPoint.lng},${startPoint.lat};${endPoint.lng},${endPoint.lat}?geometries=geojson&overview=full&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
    );
    return await response.json();
  }
  
  async getRouteElevations(coordinates: Coordinates[]): Promise<number[]> {
    const batches: Coordinates[][] = [];
    for (let i = 0; i < coordinates.length; i += ELEVATION_BATCH_SIZE) {
      batches.push(coordinates.slice(i, i + ELEVATION_BATCH_SIZE));
    }

    const elevationBatches = await Promise.all(
      batches.map(async (batch) => {
        const latitudes = batch.map((coordinate) => coordinate.lat).join(',');
        const longitudes = batch.map((coordinate) => coordinate.lng).join(',');

        const response = await fetch(
          `${ELEVATION_BASE_URL}?latitude=${latitudes}&longitude=${longitudes}`,
        );
        const data = (await response.json()) as { elevation: number[] };
        return data.elevation;
      }),
    );

    return elevationBatches.flat();
  }
}

export const routingRepository = new RoutingRepository();
