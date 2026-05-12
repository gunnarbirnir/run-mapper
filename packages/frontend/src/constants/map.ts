import type { MapStyle } from '~/types';

export const BOUNDS_PADDING = {
  top: 80,
  bottom: 50,
  left: 40,
  right: 40,
};
export const LINE_WIDTH = 4;
export const LINE_OPACITY = 1;
export const FIT_INITIAL_BOUNDS_DURATION = 200;
export const WAYPOINT_ZOOM = 14;
export const FLY_TO_WAYPOINT_DURATION = 300;

export const MAP_STYLES: Record<MapStyle, string> = {
  standard: 'mapbox://styles/mapbox/standard',
  satellite: 'mapbox://styles/mapbox/standard-satellite',
};
