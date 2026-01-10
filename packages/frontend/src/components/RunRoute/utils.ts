import type { Bounds, Coordinates, Elevation } from '~/types';
import { haversineDistance } from '~/utils';

export const getRouteBounds = (
  bbox: [number, number, number, number],
): Bounds => {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

export const processRouteFeatures = (
  features: GeoJSON.Feature[],
): { coordinates: Coordinates[]; elevations: Elevation[] } => {
  const coordinates: Coordinates[] = [];
  const elevations: Elevation[] = [];
  let distance = 0;
  let prevCoord: Coordinates | null = null;

  features.forEach((feature) => {
    if (feature.geometry.type === 'Point') {
      const currentCoord = feature.geometry.coordinates as Coordinates;
      if (prevCoord) {
        distance += haversineDistance(prevCoord, currentCoord);
      }
      coordinates.push(currentCoord);
      prevCoord = currentCoord;
    }
    if (feature.properties?.ele !== undefined) {
      elevations.push({ value: feature.properties.ele, distance });
    }
  });

  return { coordinates, elevations };
};
