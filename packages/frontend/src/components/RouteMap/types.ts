import type { MutableRefObject } from 'react';

import type { Bounds, Coordinates, Waypoint, MapStyle } from '~/types';

export type LineFeature = GeoJSON.Feature<GeoJSON.LineString>;

export interface MapState {
  mapStyle: MapStyle;
  showWaypoints: boolean;
  isAtInitialBounds: boolean;
  routeIsAnimating: boolean;
  setMapStyle: (mapStyle: MapStyle) => void;
  setShowWaypoints: (showWaypoints: boolean) => void;
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  setRouteIsAnimating: (routeIsAnimating: boolean) => void;
  animateRouteRef: MutableRefObject<(() => void) | null>;
  setActiveIndexRef: MutableRefObject<
    ((updatedIndex: number | null) => void) | null
  >;
  setActiveWaypointRef: MutableRefObject<((waypoint: Waypoint) => void) | null>;
  fitInitialBoundsRef: MutableRefObject<(() => void) | null>;
  animateRoute: () => void;
  toggleShowWaypoints: () => void;
  handleSetActiveWaypoint: (waypoint: Waypoint) => void;
  handleFitInitialBounds: () => void;
}

export interface RouteMapProps extends MapState {
  routeId: string;
  bounds: Bounds;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  hideActiveMarker?: boolean;
  onWaypointClick: (id: string) => void;
}
