import type {
  BoundingBox,
  Coordinates,
  Elevation,
  Bounds,
  RunCoordinates,
} from '~/types';
import { haversineDistance } from '~/utils';

// TODO: delete function and update Bounds type
export const getRouteBounds = (bbox: BoundingBox): Bounds => {
  return [
    // TODO: Wrong order (lat first)?
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
    const currentCoord: Coordinates = [runCoordinate.lat, runCoordinate.lng];
    if (prevCoord) {
      distance += haversineDistance(prevCoord, currentCoord);
    }
    coordinates.push(currentCoord);
    prevCoord = currentCoord;
    elevations.push({ value: runCoordinate.elevation, distance });
  });

  return { coordinates, elevations };
};
