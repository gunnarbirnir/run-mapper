import type { MutableRefObject } from 'react';

import type {
  BoundingBox,
  Coordinates,
  Waypoint,
  MapStyle,
  Elevation,
} from '~/types';

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
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
  isResettingBoundsRef: MutableRefObject<boolean>;
  animateRoute: () => void;
  toggleShowWaypoints: () => void;
  setActiveMarkerIndex: (updatedIndex: number | null) => void;
  fitToInitialBounds: () => void;
}

export interface RouteMapProps extends MapState {
  routeId: string;
  runSlug: string;
  boundingBox: BoundingBox;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  elevations: Elevation[];
  isFullscreen: boolean;
  hideActiveMarker?: boolean;
  activeWaypoint: string | null;
  onWaypointClick: (id: string) => void;
  resetOverlayState: () => void;
}
