import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useRef } from 'react';

import { BoundingBox, PointOfInterest, PublicRoute, Waypoint } from '~/types';
import { formatBounds } from '~/utils/map';

import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { PoiCoordinatesToolbar } from './components/PoiCoordinatesToolbar';
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
  editPointOfInterestType,
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
  setIsEditingPoiCoordinates,
  setEditPointOfInterestType,
  onUpdatePoiCoordinates,
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

  useMapCursor({
    isMapLoaded,
    isEditingPoiCoordinates,
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
    onEditWaypoint,
    mapRef,
  });

  return (
    <div className="bg-secondary-100 relative flex h-full w-full flex-1">
      <div ref={mapContainerRef} className="h-full w-full" />
      {/* TODO: Use real numbers */}
      <RouteStats distance={42.2} elevationGain={250} />
      <ActionButtonsContainer />
      <PoiCoordinatesToolbar
        isVisible={Boolean(isEditingPoiCoordinates)}
        onClose={() => setIsEditingPoiCoordinates(null)}
      />
    </div>
  );
};

export { useMapState };
