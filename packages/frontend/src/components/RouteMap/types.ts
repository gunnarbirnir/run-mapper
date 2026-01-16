import type { Bounds, Coordinates, Waypoint } from '~/types';

export type LineFeature = GeoJSON.Feature<GeoJSON.LineString>;

export interface RouteMapProps {
  routeId: string;
  bounds: Bounds;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
}
