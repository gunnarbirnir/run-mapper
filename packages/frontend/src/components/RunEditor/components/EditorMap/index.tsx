import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';

import {
  BoundingBox,
  Coordinates,
  Elevation,
  PointOfInterest,
  PublicRoute,
  Waypoint,
} from '~/types';
import { formatBounds } from '~/utils/map';
import { calculateElevationGain } from '~/utils/route';

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

interface EditorMapProps extends MapState {
  rootPanelIsAnimating: boolean;
  activeRoute: PublicRoute | undefined;
  activeRouteCoordinates: Coordinates[];
  activeRouteElevations: Elevation[];
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
  activeRouteCoordinates,
  activeRouteElevations,
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
  editRouteCoordinates,
  isAtInitialBounds,
  onEditPointOfInterest,
  onEditWaypoint,
  setIsMapLoaded,
  setEditRouteCoordinates,
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
  const initialBounds = initialBoundingBox
    ? formatBounds(initialBoundingBox)
    : undefined;
  const elevationGain = useMemo(() => {
    return calculateElevationGain(activeRouteElevations);
  }, [activeRouteElevations]);

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

  useFitToInitialBounds({
    isMapLoaded,
    bounds: initialBounds,
    mapRef,
    setIsAtInitialBounds,
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
    setEditCoordinates: setEditRouteCoordinates,
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
    coordinates: activeRouteCoordinates,
    waypoints: currentWaypoints,
    activeWaypoint,
    panelIsOpen: waypointPanelIsOpen,
    isAnimatingPanel: waypointPanelIsAnimating,
    hasMadeChanges: hasMadeWaypointChanges,
    editWaypointType,
    editWaypointCoordinates,
    isEditingRouteCoordinates,
    isEditingPoiCoordinates,
    onEditWaypoint,
    setEditWaypointType,
    setEditWaypointCoordinates,
    mapRef,
  });

  return (
    <div className="bg-secondary-100 relative flex h-full w-full flex-1">
      <div ref={mapContainerRef} className="h-full w-full" />
      <AnimatePresence>
        {activeRoute ? (
          <RouteStats distance={routeDistance} elevationGain={elevationGain} />
        ) : null}
      </AnimatePresence>
      <ActionButtonsContainer
        isMapLoaded={isMapLoaded}
        mapRef={mapRef}
        isAtInitialBounds={isAtInitialBounds}
        initialBounds={initialBounds}
        hasActiveRoute={Boolean(activeRoute)}
        resetRoute={fitToInitialBounds}
      />
      <RouteCoordinatesToolbar
        isEditingRouteCoordinates={isEditingRouteCoordinates}
        editRouteCoordinates={editRouteCoordinates}
        selectedRoutePoint={selectedRoutePoint}
        setEditRouteCoordinates={setEditRouteCoordinates}
        editRouteActionsRef={editRouteActionsRef}
      />
      <SelectedRoutePointToolbar
        selectedRoutePoint={selectedRoutePoint}
        setSelectedRoutePoint={setSelectedRoutePoint}
        setEditRouteCoordinates={setEditRouteCoordinates}
      />
      <PoiCoordinatesToolbar
        isVisible={isEditingPoiCoordinates}
        onClose={() => setIsEditingPoiCoordinates(false)}
      />
    </div>
  );
};

export { useMapState };
