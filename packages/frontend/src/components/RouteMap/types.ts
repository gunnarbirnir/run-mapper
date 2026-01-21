import type { MutableRefObject } from 'react';

import type { Bounds, Coordinates, Waypoint } from '~/types';

export type LineFeature = GeoJSON.Feature<GeoJSON.LineString>;

export interface RouteMapProps {
  routeId: string;
  bounds: Bounds;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  hideActiveMarker?: boolean;
  setActiveIndexRef: MutableRefObject<
    ((updatedIndex: number | null) => void) | null
  >;
}
