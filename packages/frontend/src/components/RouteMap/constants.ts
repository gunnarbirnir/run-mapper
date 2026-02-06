import type { MapStyle } from '~/types';

export const BOUNDS_PADDING = 0.1;
export const LINE_WIDTH = 4;
export const LINE_OPACITY = 1;

export const MAP_STYLES: Record<MapStyle, string> = {
  standard: 'mapbox://styles/mapbox/standard',
  satellite: 'mapbox://styles/mapbox/standard-satellite',
};
