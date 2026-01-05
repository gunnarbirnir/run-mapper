import type { Bounds, Coordinates } from '~/types';

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
): { coordinates: Coordinates[]; elevations: number[] } => {
  const coordinates: Coordinates[] = [];
  const elevations: number[] = [];

  features.forEach((feature) => {
    if (feature.geometry.type === 'Point') {
      coordinates.push(feature.geometry.coordinates as Coordinates);
    }
    if (feature.properties?.ele !== undefined) {
      elevations.push(feature.properties.ele);
    }
  });

  return { coordinates, elevations };
};
