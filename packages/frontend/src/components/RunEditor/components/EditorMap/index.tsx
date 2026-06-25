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
  setIsEditingRouteCoordinates,
  setIsEditingPoiCoordinates,
  setEditPointOfInterestType,
  setEditWaypointType,
  setEditWaypointCoordinates,
  onUpdateRouteCoordinates,
  onUpdatePoiCoordinates,
  mapRef,
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
    onUpdateRouteCoordinates,
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
      <ActionButtonsContainer />
      <RouteCoordinatesToolbar
        isVisible={isEditingRouteCoordinates}
        onClose={() => setIsEditingRouteCoordinates(false)}
      />
      <PoiCoordinatesToolbar
        isVisible={isEditingPoiCoordinates}
        onClose={() => setIsEditingPoiCoordinates(false)}
      />
    </div>
  );
};

export { useMapState };
