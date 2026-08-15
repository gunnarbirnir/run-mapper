import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';

import { BoundingBox, Bounds, PointOfInterest, Waypoint } from '~/types';
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
import { useActiveRoute, type ActiveRouteState } from './hooks/useActiveRoute';
import { usePointsOfInterest } from './hooks/usePointsOfInterest';
import { useResetBounds } from './hooks/useResetBounds';
import { useResizeMap } from './hooks/useResizeMap';
import { useWaypoints } from './hooks/useWaypoints';
import { useFitToInitialBounds } from './hooks/useFitToInitialBounds';

type EditorMapProps = MapState &
  ActiveRouteState & {
    rootPanelIsAnimating: boolean;
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
  };

// Reykjavík
export const DEFAULT_EDITOR_BOUNDS: Bounds = [
  [-22.17, 64.02],
  [-21.52, 64.21],
];

export const EditorMap = ({
  initialBoundingBox,
  // Map state
  isMapLoaded,
  isAtInitialBounds,
  isEditingPoiCoordinates,
  editPointOfInterestType,
  editWaypointType,
  editWaypointCoordinates,
  // Active route state
  activeRouteDistance,
  activeRouteCoordinates,
  activeRouteControlPoints,
  activeRouteBoundingBox,
  activeRouteElevationStats,
  isEditingRouteCoordinates,
  selectedRoutePoint,
  isLoadingRouteData,
  // Panel states
  rootPanelIsAnimating,
  routePanelIsOpen,
  routePanelIsAnimating,
  hasMadeRouteChanges,
  currentPointsOfInterest,
  activePointOfInterest,
  pointOfInterestPanelIsOpen,
  pointOfInterestPanelIsAnimating,
  hasMadePointOfInterestChanges,
  currentWaypoints,
  activeWaypoint,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  hasMadeWaypointChanges,
  // Handlers
  fitToInitialBounds,
  onEditPointOfInterest,
  onUpdatePoiCoordinates,
  onEditWaypoint,
  setIsMapLoaded,
  setIsAtInitialBounds,
  setIsEditingPoiCoordinates,
  setEditPointOfInterestType,
  setEditWaypointType,
  setEditWaypointCoordinates,
  setActiveRouteControlPoints,
  setSelectedRoutePoint,
  // Refs
  mapRef,
  fitToInitialBoundsRef,
  isResettingBoundsRef,
  editRouteActionsRef,
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
  const showRouteStats =
    activeRouteDistance > 0 &&
    !isEditingRouteCoordinates &&
    !isLoadingRouteData;

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
    isMapLoaded,
    initialBounds,
    isAnyPanelAnimating,
    routePanelIsOpen,
    pointOfInterestPanelIsOpen,
    waypointPanelIsOpen,
    mapRef,
    isResettingBoundsRef,
  });

  useFitToInitialBounds({
    isMapLoaded,
    initialBounds,
    activeRouteBoundingBox,
    activeRouteCoordinates,
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

  // Pick up from here

  useDrawRoute({
    panelIsOpen: routePanelIsOpen,
    isAnimatingPanel: routePanelIsAnimating,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
    isEditingCoordinates: isEditingRouteCoordinates,
    isMapLoaded,
    editCoordinates: activeRouteCoordinates,
    selectedRoutePoint,
    initialBounds,
    activeRouteBoundingBox,
    setEditControlPoints: setActiveRouteControlPoints,
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
    routeDistance: activeRouteDistance,
    routeCoordinates: activeRouteCoordinates,
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
        {showRouteStats && (
          <RouteStats
            distance={activeRouteDistance}
            elevationGain={activeRouteElevationStats?.elevationGain ?? 0}
          />
        )}
      </AnimatePresence>
      <ActionButtonsContainer
        isMapLoaded={isMapLoaded}
        isAtInitialBounds={isAtInitialBounds}
        resetRoute={fitToInitialBounds}
        mapRef={mapRef}
      />
      <RouteCoordinatesToolbar
        isEditingRouteCoordinates={isEditingRouteCoordinates}
        selectedRoutePoint={selectedRoutePoint}
        activeRouteControlPoints={activeRouteControlPoints}
        setActiveRouteControlPoints={setActiveRouteControlPoints}
        editRouteActionsRef={editRouteActionsRef}
      />
      <SelectedRoutePointToolbar
        selectedRoutePoint={selectedRoutePoint}
        setSelectedRoutePoint={setSelectedRoutePoint}
        setActiveRouteControlPoints={setActiveRouteControlPoints}
      />
      <PoiCoordinatesToolbar
        isVisible={isEditingPoiCoordinates}
        onClose={() => setIsEditingPoiCoordinates(false)}
      />
    </div>
  );
};

export { useMapState, useActiveRoute };
