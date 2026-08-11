import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';

import { BoundingBox, PointOfInterest, PublicRoute, Waypoint } from '~/types';
import { formatBounds } from '~/utils/map';

import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { PoiCoordinatesToolbar } from './components/PoiCoordinatesToolbar';
import { SelectedRoutePointToolbar } from './components/SelectedRoutePointToolbar';
import { RouteCoordinatesToolbar } from './components/RouteCoordinatesToolbar';
import { RouteStats } from './components/RouteStats';
import { useDrawRoute } from './hooks/useDrawRoute';
import { useLoadMap } from './hooks/useLoadMap';
import { useMapCursor } from './hooks/useMapCursor';
import { useMapState, type MapState } from './hooks/useMapState';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import { useResetBounds } from './hooks/useResetBounds';
import { useResizeMap } from './hooks/useResizeMap';
import { useWaypoints } from './hooks/useWaypoints';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';
import { DEFAULT_EDITOR_BOUNDS } from './constants';

interface EditorMapProps extends MapState {
  rootPanelIsAnimating: boolean;
  activeRoute: PublicRoute | undefined;
  routeDistance: number;
  routePanelIsOpen: boolean;
  routePanelIsAnimating: boolean;
  hasMadeRouteChanges: boolean;
  currentPointsOfInterest: PointOfInterest[];
  activePointOfInterest: string | null;
  pointOfInterestPanelIsOpen: boolean;
  pointOfInterestPanelIsAnimating: boolean;
  hasMadePointOfInterestChanges: boolean;
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
  routeDistance,
  routePanelIsOpen,
  routePanelIsAnimating,
  hasMadeRouteChanges,
  currentPointsOfInterest,
  activePointOfInterest,
  pointOfInterestPanelIsOpen,
  pointOfInterestPanelIsAnimating,
  hasMadePointOfInterestChanges,
  editPointOfInterestType,
  editWaypointType,
  editWaypointCoordinates,
  isEditingRouteCoordinates,
  selectedRoutePoint,
  isEditingPoiCoordinates,
  currentWaypoints,
  activeWaypoint,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  hasMadeWaypointChanges,
  initialBoundingBox,
  isMapLoaded,
  routeBoundingBox,
  routeElevationStats,
  editRouteControlPoints,
  editRouteCoordinates,
  isAtInitialBounds,
  onEditPointOfInterest,
  onEditWaypoint,
  setIsMapLoaded,
  setEditRouteControlPoints,
  setSelectedRoutePoint,
  setIsEditingPoiCoordinates,
  setEditPointOfInterestType,
  setEditWaypointType,
  setEditWaypointCoordinates,
  setIsAtInitialBounds,
  onUpdatePoiCoordinates,
  fitToInitialBoundsRef,
  mapRef,
  editRouteActionsRef,
  isResettingBoundsRef,
  fitToInitialBounds,
}: EditorMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const initialBounds = useMemo(
    () =>
      initialBoundingBox
        ? formatBounds(initialBoundingBox)
        : DEFAULT_EDITOR_BOUNDS,
    [initialBoundingBox],
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
    isResettingBoundsRef,
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
    isResettingBoundsRef,
  });

  useFitToInitialBounds({
    isMapLoaded,
    initialBounds,
    routeBoundingBox,
    routeCoordinates: editRouteCoordinates,
    setIsAtInitialBounds,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  });

  useMapCursor({
    isMapLoaded,
    isEditingRouteCoordinates,
    isEditingPoiCoordinates,
    mapRef,
  });

  useDrawRoute({
    activeRoute,
    panelIsOpen: routePanelIsOpen,
    isAnimatingPanel: routePanelIsAnimating,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
    isEditingCoordinates: isEditingRouteCoordinates,
    isMapLoaded,
    editCoordinates: editRouteCoordinates,
    selectedRoutePoint,
    setEditControlPoints: setEditRouteControlPoints,
    setSelectedRoutePoint,
    mapRef,
    isResettingBoundsRef,
  });

  usePointsOfInterest({
    isMapLoaded,
    pointsOfInterest: currentPointsOfInterest,
    activePointOfInterest,
    panelIsOpen: pointOfInterestPanelIsOpen,
    isAnimatingPanel: pointOfInterestPanelIsAnimating,
    hasMadeAnyChanges,
    isEditingCoordinates: isEditingPoiCoordinates,
    isEditingRouteCoordinates,
    editPointOfInterestType,
    onEditPointOfInterest,
    onUpdatePoiCoordinates,
    setEditPointOfInterestType,
    mapRef,
  });

  useWaypoints({
    isMapLoaded,
    routeDistance,
    routeCoordinates: editRouteCoordinates,
    waypoints: currentWaypoints,
    activeWaypoint,
    panelIsOpen: waypointPanelIsOpen,
    isAnimatingPanel: waypointPanelIsAnimating,
    hasMadeChanges: hasMadeWaypointChanges,
    editWaypointType,
    editWaypointCoordinates,
    isEditingRouteCoordinates,
    onEditWaypoint,
    setEditWaypointType,
    setEditWaypointCoordinates,
    mapRef,
  });

  return (
    <div className="bg-secondary-100 relative flex h-full w-full flex-1">
      <div ref={mapContainerRef} className="h-full w-full" />
      <AnimatePresence>
        {routeDistance > 0 && !isEditingRouteCoordinates ? (
          <RouteStats
            distance={routeDistance}
            elevationGain={routeElevationStats?.elevationGain ?? 0}
          />
        ) : null}
      </AnimatePresence>
      <ActionButtonsContainer
        isMapLoaded={isMapLoaded}
        mapRef={mapRef}
        isAtInitialBounds={isAtInitialBounds}
        resetRoute={fitToInitialBounds}
      />
      <RouteCoordinatesToolbar
        isEditingRouteCoordinates={isEditingRouteCoordinates}
        editRouteControlPoints={editRouteControlPoints}
        selectedRoutePoint={selectedRoutePoint}
        setEditRouteControlPoints={setEditRouteControlPoints}
        editRouteActionsRef={editRouteActionsRef}
      />
      <SelectedRoutePointToolbar
        selectedRoutePoint={selectedRoutePoint}
        setSelectedRoutePoint={setSelectedRoutePoint}
        setEditRouteControlPoints={setEditRouteControlPoints}
      />
      <PoiCoordinatesToolbar
        isVisible={isEditingPoiCoordinates}
        onClose={() => setIsEditingPoiCoordinates(false)}
      />
    </div>
  );
};

export { useMapState };
