import { useCallback } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { SidePanel } from '~/primitives';
import type {
  EditorRun,
  PointOfInterest,
  PointOfInterestType,
  PublicRoute,
  Waypoint,
  WaypointType,
  Coordinates,
  RunUpdate,
} from '~/types';

import { type PanelState } from '../../hooks/usePanelState';
import { type RootPanelState } from '../../hooks/useRootPanelState';
import type { MapState } from '../EditorMap/hooks/useMapState';
import { PointOfInterestPanel } from '../PointOfInterestPanel';
import { RootPanel } from '../RootPanel';
import { RoutePanel } from '../RoutePanel';
import { WaypointPanel } from '../WaypointPanel';

interface SidePanelContainerProps {
  existingRun?: EditorRun;
  routeDistance: number;
  routeCoordinates: Coordinates[];
  rootPanelState: RootPanelState;
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: PanelState<Waypoint>;
  isEditingRouteCoordinates: boolean;
  isEditingPoiCoordinates: boolean;
  isDeleting: boolean;
  error?: Error | null;
  setEditRouteCoordinates: (coordinates: Coordinates[]) => void;
  setIsEditingRouteCoordinates: (isEditing: boolean) => void;
  setIsEditingPoiCoordinates: (isEditing: boolean) => void;
  setEditPointOfInterestType: (type: PointOfInterestType | null) => void;
  setEditWaypointType: (type: WaypointType | null) => void;
  setEditWaypointCoordinates: (coordinates: Coordinates | null) => void;
  onSubmit: (run: RunUpdate) => void | Promise<unknown>;
  onDeleteRun?: () => void;
  editRouteActionsRef: MapState['editRouteActionsRef'];
  onUpdatePoiCoordinatesRef: MapState['onUpdatePoiCoordinatesRef'];
}

export const SidePanelContainer = ({
  existingRun,
  routeDistance,
  routeCoordinates,
  rootPanelState,
  routePanelState,
  pointOfInterestPanelState,
  waypointPanelState,
  isEditingRouteCoordinates,
  isEditingPoiCoordinates,
  isDeleting,
  error,
  setEditRouteCoordinates,
  setIsEditingRouteCoordinates,
  setEditPointOfInterestType,
  setIsEditingPoiCoordinates,
  setEditWaypointType,
  setEditWaypointCoordinates,
  onSubmit,
  onDeleteRun,
  editRouteActionsRef,
  onUpdatePoiCoordinatesRef,
}: SidePanelContainerProps) => {
  const {
    showRootPanel,
    onOpen,
    onClose,
    onAddRoute,
    onEditRoute,
    onAddPointOfInterest,
    onEditPointOfInterest,
    onAddWaypoint,
    onEditWaypoint,
    onAnimationComplete,
  } = rootPanelState;

  const handleAddWaypoint = useCallback(() => {
    onAddWaypoint();
    if (routeCoordinates.length > 0) {
      setEditWaypointCoordinates(routeCoordinates[0]);
    }
  }, [onAddWaypoint, setEditWaypointCoordinates, routeCoordinates]);

  useHotkey('P', () => {
    if (showRootPanel) {
      onClose();
    } else {
      onOpen();
    }
  });

  return (
    <SidePanel
      onOpen={onOpen}
      className="z-10"
      // To be below route stats
      toggleClassName="top-16"
      panels={[
        {
          id: 'root',
          position: 0,
          isVisible: showRootPanel,
          disabled: [
            routePanelState,
            pointOfInterestPanelState,
            waypointPanelState,
          ].some((state) => state.hasMadeChanges),
          onAnimationComplete,
          content: (
            <RootPanel
              existingRun={existingRun}
              currentRoutes={routePanelState.currentItems}
              currentPointsOfInterest={pointOfInterestPanelState.currentItems}
              error={error}
              isDeleting={isDeleting}
              onClose={onClose}
              onAddRoute={onAddRoute}
              onEditRoute={onEditRoute}
              onAddPointOfInterest={onAddPointOfInterest}
              onEditPointOfInterest={onEditPointOfInterest}
              onSubmit={onSubmit}
              onDeleteRun={onDeleteRun}
            />
          ),
        },
        {
          id: 'point-of-interest',
          position: 1,
          isVisible: pointOfInterestPanelState.showPanel,
          onAnimationComplete: pointOfInterestPanelState.onAnimationComplete,
          content: (
            <PointOfInterestPanel
              {...pointOfInterestPanelState}
              isEditingPoiCoordinates={isEditingPoiCoordinates}
              setEditPointOfInterestType={setEditPointOfInterestType}
              setIsEditingPoiCoordinates={setIsEditingPoiCoordinates}
              onUpdatePoiCoordinatesRef={onUpdatePoiCoordinatesRef}
            />
          ),
        },
        {
          id: 'route',
          position: 1,
          isVisible: routePanelState.showPanel,
          disabled: waypointPanelState.hasMadeChanges,
          onAnimationComplete: routePanelState.onAnimationComplete,
          content: (
            <RoutePanel
              {...routePanelState}
              currentWaypoints={waypointPanelState.currentItems}
              routeDistance={routeDistance}
              routeCoordinates={routeCoordinates}
              isEditingRouteCoordinates={isEditingRouteCoordinates}
              onAddWaypoint={handleAddWaypoint}
              onEditWaypoint={onEditWaypoint}
              setEditRouteCoordinates={setEditRouteCoordinates}
              setIsEditingRouteCoordinates={setIsEditingRouteCoordinates}
              editRouteActionsRef={editRouteActionsRef}
            />
          ),
        },
        {
          id: 'waypoint',
          position: 2,
          isVisible: waypointPanelState.showPanel,
          onAnimationComplete: waypointPanelState.onAnimationComplete,
          content: (
            <WaypointPanel
              {...waypointPanelState}
              routeDistance={routeDistance}
              routeCoordinates={routeCoordinates}
              setEditWaypointType={setEditWaypointType}
              setEditWaypointCoordinates={setEditWaypointCoordinates}
            />
          ),
        },
      ]}
    />
  );
};
