import { useRef, useMemo } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { PublicRoute, BoundingBox, PointOfInterest } from '~/types';
import { formatBounds } from '~/utils/map';

import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { RouteStats } from './components/RouteStats';
import { useDrawRoute } from './hooks/useDrawRoute';
import { useResizeMap } from './hooks/useResizeMap';
import { useMapState, type MapState } from './hooks/useMapState';
import { useLoadMap } from './hooks/useLoadMap';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import { useWaypoints } from './hooks/useWaypoints';

interface EditorMapProps extends MapState {
  rootPanelIsAnimating: boolean;
  activeRoute: PublicRoute | undefined;
  routePanelIsOpen: boolean;
  routePanelIsAnimating: boolean;
  currentPointsOfInterest: PointOfInterest[];
  activePointOfInterest: string | null;
  pointOfInterestPanelIsOpen: boolean;
  pointOfInterestPanelIsAnimating: boolean;
  waypointPanelIsAnimating: boolean;
  initialBoundingBox?: BoundingBox;
}

export const EditorMap = ({
  rootPanelIsAnimating,
  activeRoute,
  routePanelIsOpen,
  routePanelIsAnimating,
  currentPointsOfInterest,
  activePointOfInterest,
  pointOfInterestPanelIsOpen,
  pointOfInterestPanelIsAnimating,
  waypointPanelIsAnimating,
  initialBoundingBox,
  isMapLoaded,
  setIsMapLoaded,
  mapRef,
}: EditorMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initialBounds = initialBoundingBox
    ? formatBounds(initialBoundingBox)
    : undefined;

  const activeRouteCoordinates = useMemo(
    () => activeRoute?.coordinates || [],
    [activeRoute],
  );
  const activeRouteWaypoints = useMemo(
    () => activeRoute?.waypoints || [],
    [activeRoute],
  );

  useLoadMap({
    initialBounds,
    setIsMapLoaded,
    mapRef,
    mapContainerRef,
  });

  useResizeMap({
    rootPanelIsAnimating,
    waypointPanelIsAnimating,
    isMapLoaded,
    mapRef,
  });

  useDrawRoute({
    activeRoute,
    routePanelIsOpen,
    isAnimatingPanel: routePanelIsAnimating,
    isMapLoaded,
    mapRef,
  });

  usePointsOfInterest({
    isMapLoaded,
    pointsOfInterest: currentPointsOfInterest,
    activePointOfInterest,
    panelIsOpen: pointOfInterestPanelIsOpen,
    isAnimatingPanel: pointOfInterestPanelIsAnimating,
    mapRef,
  });

  useWaypoints({
    isMapLoaded,
    coordinates: activeRouteCoordinates,
    waypoints: activeRouteWaypoints,
    routePanelIsOpen,
    mapRef,
  });

  return (
    <div className="bg-secondary-100 relative flex h-full w-full flex-1">
      <div ref={mapContainerRef} className="h-full w-full" />
      {/* TODO: Use real numbers */}
      <RouteStats distance={42.2} elevationGain={250} />
      <ActionButtonsContainer />
    </div>
  );
};

export { useMapState };
