import type {
  BaseCoordinate,
  Coordinates,
  Elevation,
  Bounds,
  RunCoordinates,
} from '~/types';
import { haversineDistance } from '~/utils';

// TODO: delete function and update Bounds type
export const getRouteBounds = (
  bbox: [BaseCoordinate, BaseCoordinate],
): Bounds => {
  return [
    // Coordinates are stored as [lng, lat] for Mapbox compatibility
    [bbox[0].lng, bbox[0].lat],
    [bbox[1].lng, bbox[1].lat],
  ];
};

export const processRunRoute = (
  runCoordinates: RunCoordinates[],
): { coordinates: Coordinates[]; elevations: Elevation[] } => {
  const coordinates: Coordinates[] = [];
  const elevations: Elevation[] = [];
  let distance = 0;
  let prevCoord: Coordinates | null = null;

  runCoordinates.forEach((runCoordinate) => {
    // Coordinates are [lng, lat] for Mapbox and haversineDistance
    const currentCoord: Coordinates = [runCoordinate.lng, runCoordinate.lat];
    if (prevCoord) {
      distance += haversineDistance(prevCoord, currentCoord);
    }
    coordinates.push(currentCoord);
    prevCoord = currentCoord;
    elevations.push({ value: runCoordinate.elevation, distance });
  });

  return { coordinates, elevations };
};
