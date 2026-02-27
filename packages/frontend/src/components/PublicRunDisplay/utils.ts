import type { Coordinates, Elevation, RunCoordinates } from '~/types';
import { haversineDistance } from '~/utils/route';

export const processRunRoute = (
  runCoordinates: RunCoordinates[],
): { coordinates: Coordinates[]; elevations: Elevation[] } => {
  const coordinates: Coordinates[] = [];
  const elevations: Elevation[] = [];
  let distance = 0;
  let prevCoord: Coordinates | null = null;

  runCoordinates.forEach((runCoordinate) => {
    const currentCoord: Coordinates = {
      lng: runCoordinate.lng,
      lat: runCoordinate.lat,
    };
    if (prevCoord) {
      distance += haversineDistance(prevCoord, currentCoord);
    }
    coordinates.push(currentCoord);
    prevCoord = currentCoord;
    elevations.push({ value: runCoordinate.elevation, distance });
  });

  return { coordinates, elevations };
};
