import type { Bounds, MapStyle } from '~/types';

export const LINE_WIDTH = 4;
export const LINE_OPACITY = 1;

export const BOUNDS_MAX_ZOOM = 14;
export const WAYPOINT_POI_ZOOM = 14;

export const BOUNDS_PADDING = {
  top: 80,
  bottom: 50,
  left: 40,
  right: 40,
};

export const FIT_INITIAL_BOUNDS_DURATION = 200;
export const FLY_TO_WAYPOINT_POI_DURATION = 300;

export const FIT_BOUNDS_CONFIG = {
  duration: FIT_INITIAL_BOUNDS_DURATION,
  padding: BOUNDS_PADDING,
  maxZoom: BOUNDS_MAX_ZOOM,
};

export const MAP_STYLES: Record<MapStyle, string> = {
  standard: 'mapbox://styles/mapbox/standard',
  satellite: 'mapbox://styles/mapbox/standard-satellite',
};

export const COORDINATES_DECIMALS = 6;

// Reykjavík
export const DEFAULT_MAP_BOUNDS: Bounds = [
  [-22.17, 64.02],
  [-21.52, 64.21],
];
