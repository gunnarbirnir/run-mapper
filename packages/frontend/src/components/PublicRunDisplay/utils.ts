import type { Coordinates, Elevation, RouteCoordinates } from '~/types';
import { haversineDistance } from '~/utils/route';

export const processRunRoute = (
  routeCoordinates: RouteCoordinates[] = [],
): { coordinates: Coordinates[]; elevations: Elevation[] } => {
  const coordinates: Coordinates[] = [];
  const elevations: Elevation[] = [];
  let distance = 0;
  let prevCoord: Coordinates | null = null;

  routeCoordinates.forEach((routeCoordinate) => {
    const currentCoord: Coordinates = {
      lng: routeCoordinate.lng,
      lat: routeCoordinate.lat,
    };
    if (prevCoord) {
      distance += haversineDistance(prevCoord, currentCoord);
    }
    coordinates.push(currentCoord);
    prevCoord = currentCoord;
    elevations.push({ value: routeCoordinate.elevation, distance });
  });

  return { coordinates, elevations };
};
