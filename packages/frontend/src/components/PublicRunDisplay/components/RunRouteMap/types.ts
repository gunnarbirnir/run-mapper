import type { PointOfInterest, PublicRoute } from '~/types';

import type { RunDisplaySettings } from '../../hooks/useSettings';
import type { MapState } from './hooks/useMapState';

export interface RouteMapProps extends MapState {
  runId: string;
  runSlug: string;
  route: PublicRoute | null;
  pointsOfInterest: PointOfInterest[];
  isFullscreen: boolean;
  hideActiveMarker?: boolean;
  activeWaypoint: string | null;
  activePointOfInterest: string | null;
  isPreview: boolean;
  settings: RunDisplaySettings;
  onWaypointClick: (id: string | null) => void;
  onPointOfInterestClick: (id: string | null) => void;
  onReset: () => void;
}
