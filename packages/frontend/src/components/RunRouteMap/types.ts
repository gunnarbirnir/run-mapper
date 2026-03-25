import type { MutableRefObject } from 'react';

import type {
  BoundingBox,
  Coordinates,
  Waypoint,
  Elevation,
  PointOfInterest,
} from '~/types';

import type { RunDisplaySettings } from '../PublicRunDisplay/hooks/useSettings';

export type LineFeature = GeoJSON.Feature<GeoJSON.LineString>;

export interface MapState {
  isMapLoaded: boolean;
  isAtInitialBounds: boolean;
  routeIsAnimating: boolean;
  setIsMapLoaded: (isMapLoaded: boolean) => void;
  setIsAtInitialBounds: (isAtInitialBounds: boolean) => void;
  setRouteIsAnimating: (routeIsAnimating: boolean) => void;
  animateRouteRef: MutableRefObject<(() => void) | null>;
  setActiveIndexRef: MutableRefObject<
    ((updatedIndex: number | null) => void) | null
  >;
  fitToInitialBoundsRef: MutableRefObject<(() => void) | null>;
  isResettingBoundsRef: MutableRefObject<boolean>;
  animateRoute: () => void;
  setActiveMarkerIndex: (updatedIndex: number | null) => void;
  fitToInitialBounds: () => void;
}

export interface RouteMapProps extends MapState {
  routeId: string;
  runSlug: string;
  boundingBox: BoundingBox;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  pointsOfInterest: PointOfInterest[];
  elevations: Elevation[];
  isFullscreen: boolean;
  hideActiveMarker?: boolean;
  activeWaypoint: string | null;
  activePointOfInterest: string | null;
  settings: RunDisplaySettings;
  onWaypointClick: (id: string | null) => void;
  onPointOfInterestClick: (id: string | null) => void;
  onReset: () => void;
}
