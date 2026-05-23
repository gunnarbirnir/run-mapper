import { useRef, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { PublicRoute, BoundingBox, PointOfInterest, Waypoint } from '~/types';
import { Text } from '~/primitives';
import { formatBounds } from '~/utils/map';

import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { RouteStats } from './components/RouteStats';
import { ToolbarContainer } from './components/ToolbarContainer';
import { useDrawRoute } from './hooks/useDrawRoute';
import { useResizeMap } from './hooks/useResizeMap';
import { useMapState, type MapState } from './hooks/useMapState';
import { useLoadMap } from './hooks/useLoadMap';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import { useWaypoints } from './hooks/useWaypoints';
import { useResetBounds } from './hooks/useResetBounds';

interface EditorMapProps extends MapState {
  rootPanelIsAnimating: boolean;
  activeRoute: PublicRoute | undefined;
  routePanelIsOpen: boolean;
  routePanelIsAnimating: boolean;
  hasMadeRouteChanges: boolean;
  currentPointsOfInterest: PointOfInterest[];
  activePointOfInterest: string | null;
  pointOfInterestPanelIsOpen: boolean;
  pointOfInterestPanelIsAnimating: boolean;
  hasMadePointOfInterestChanges: boolean;
  isEditingPoiCoordinates: string | null;
  currentWaypoints: Waypoint[];
  activeWaypoint: string | null;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  hasMadeWaypointChanges: boolean;
  initialBoundingBox?: BoundingBox;
  onEditPointOfInterest: (pointOfInterestId: string) => void;
  onEditWaypoint: (waypointId: string) => void;
}

export const EditorMap = ({
  rootPanelIsAnimating,
  activeRoute,
  routePanelIsOpen,
  routePanelIsAnimating,
  hasMadeRouteChanges,
  currentPointsOfInterest,
  activePointOfInterest,
  pointOfInterestPanelIsOpen,
  pointOfInterestPanelIsAnimating,
  hasMadePointOfInterestChanges,
  isEditingPoiCoordinates,
  currentWaypoints,
  activeWaypoint,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  hasMadeWaypointChanges,
  initialBoundingBox,
  isMapLoaded,
  onEditPointOfInterest,
  onEditWaypoint,
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
  const isAnyPanelAnimating =
    rootPanelIsAnimating ||
    routePanelIsAnimating ||
    pointOfInterestPanelIsAnimating ||
    waypointPanelIsAnimating;
  const hasMadeAnyChanges =
    hasMadeRouteChanges ||
    hasMadePointOfInterestChanges ||
    hasMadeWaypointChanges;

  useLoadMap({
    initialBounds,
    setIsMapLoaded,
    mapRef,
    mapContainerRef,
  });

  useResizeMap({
    isAnyPanelAnimating,
    isMapLoaded,
    mapRef,
  });

  useResetBounds({
    initialBounds,
    isAnyPanelAnimating,
    routePanelIsOpen,
    pointOfInterestPanelIsOpen,
    waypointPanelIsOpen,
    isMapLoaded,
    mapRef,
  });

  useDrawRoute({
    activeRoute,
    panelIsOpen: routePanelIsOpen,
    isAnimatingPanel: routePanelIsAnimating,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
    isMapLoaded,
    mapRef,
  });

  usePointsOfInterest({
    isMapLoaded,
    pointsOfInterest: currentPointsOfInterest,
    activePointOfInterest,
    panelIsOpen: pointOfInterestPanelIsOpen,
    isAnimatingPanel: pointOfInterestPanelIsAnimating,
    hasMadeAnyChanges,
    isEditingCoordinates: isEditingPoiCoordinates,
    onEditPointOfInterest,
    mapRef,
  });

  useWaypoints({
    isMapLoaded,
    coordinates: activeRouteCoordinates,
    waypoints: currentWaypoints,
    activeWaypoint,
    panelIsOpen: waypointPanelIsOpen,
    isAnimatingPanel: waypointPanelIsAnimating,
    hasMadeChanges: hasMadeWaypointChanges,
    onEditWaypoint,
    mapRef,
  });

  return (
    <div className="bg-secondary-100 relative flex h-full w-full flex-1">
      <div ref={mapContainerRef} className="h-full w-full" />
      {/* TODO: Use real numbers */}
      <RouteStats distance={42.2} elevationGain={250} />
      <ActionButtonsContainer />
      <AnimatePresence>
        {Boolean(isEditingPoiCoordinates) && (
          <ToolbarContainer>
            <Text className="px-4 py-2 text-center text-sm" variant="subtle">
              Click on the map to update coordinates
            </Text>
          </ToolbarContainer>
        )}
      </AnimatePresence>
    </div>
  );
};

export { useMapState };
