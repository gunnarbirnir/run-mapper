import { useCallback } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { SidePanel } from '~/primitives';
import type {
  EditorRun,
  BoundingBox,
  PointOfInterest,
  PointOfInterestType,
  PublicRoute,
  Waypoint,
  WaypointType,
  Coordinates,
  RouteCoordinates,
  RunUpdate,
  ElevationStats,
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
  isDeleting: boolean;
  error?: Error | null;
  successMessage?: string | null;
  activeRouteDistance: number;
  activeRouteCoordinates: RouteCoordinates[];
  activeRouteBoundingBox?: BoundingBox;
  activeRouteElevationStats?: ElevationStats;
  activeRouteError: Error | null;
  rootPanelState: RootPanelState;
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: PanelState<Waypoint>;
  isEditingRouteCoordinates: boolean;
  isEditingPoiCoordinates: boolean;
  onSubmit: (run: RunUpdate) => Promise<unknown>;
  onDeleteRun?: () => Promise<unknown>;
  setActiveRouteControlPoints: (coordinates: RouteCoordinates[]) => void;
  setIsEditingRouteCoordinates: (isEditing: boolean) => void;
  setIsEditingPoiCoordinates: (isEditing: boolean) => void;
  setEditPointOfInterestType: (type: PointOfInterestType | null) => void;
  setEditWaypointType: (type: WaypointType | null) => void;
  setEditWaypointCoordinates: (coordinates: Coordinates | null) => void;
  editRouteActionsRef: MapState['editRouteActionsRef'];
  onUpdatePoiCoordinatesRef: MapState['onUpdatePoiCoordinatesRef'];
}

export const SidePanelContainer = ({
  existingRun,
  isDeleting,
  error,
  successMessage,
  activeRouteDistance,
  activeRouteBoundingBox,
  activeRouteElevationStats,
  activeRouteCoordinates,
  activeRouteError,
  rootPanelState,
  routePanelState,
  pointOfInterestPanelState,
  waypointPanelState,
  isEditingRouteCoordinates,
  isEditingPoiCoordinates,
  onSubmit,
  onDeleteRun,
  setActiveRouteControlPoints,
  setIsEditingRouteCoordinates,
  setEditPointOfInterestType,
  setIsEditingPoiCoordinates,
  setEditWaypointType,
  setEditWaypointCoordinates,
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
    if (activeRouteCoordinates.length > 0) {
      setEditWaypointCoordinates(activeRouteCoordinates[0]);
    }
  }, [onAddWaypoint, setEditWaypointCoordinates, activeRouteCoordinates]);

  const handleSubmit = useCallback(
    async (run: RunUpdate) => {
      await onSubmit(run);
      routePanelState.onHasSubmittedChanges(false);
      pointOfInterestPanelState.onHasSubmittedChanges(false);
      waypointPanelState.onHasSubmittedChanges(false);
    },
    [onSubmit, routePanelState, pointOfInterestPanelState, waypointPanelState],
  );

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
              error={error}
              successMessage={successMessage}
              isDeleting={isDeleting}
              currentRoutes={routePanelState.currentItems}
              currentPointsOfInterest={pointOfInterestPanelState.currentItems}
              hasSubmittedChanges={
                routePanelState.hasSubmittedChanges ||
                pointOfInterestPanelState.hasSubmittedChanges ||
                waypointPanelState.hasSubmittedChanges
              }
              onClose={onClose}
              onAddRoute={onAddRoute}
              onEditRoute={onEditRoute}
              onAddPointOfInterest={onAddPointOfInterest}
              onEditPointOfInterest={onEditPointOfInterest}
              onSubmit={handleSubmit}
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
              activeRouteDistance={activeRouteDistance}
              activeRouteCoordinates={activeRouteCoordinates}
              activeRouteBoundingBox={activeRouteBoundingBox}
              activeRouteElevationStats={activeRouteElevationStats}
              activeRouteError={activeRouteError}
              isEditingRouteCoordinates={isEditingRouteCoordinates}
              currentWaypoints={waypointPanelState.currentItems}
              onAddWaypoint={handleAddWaypoint}
              onEditWaypoint={onEditWaypoint}
              setActiveRouteControlPoints={setActiveRouteControlPoints}
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
              activeRouteDistance={activeRouteDistance}
              activeRouteCoordinates={activeRouteCoordinates}
              setEditWaypointType={setEditWaypointType}
              setEditWaypointCoordinates={setEditWaypointCoordinates}
            />
          ),
        },
      ]}
    />
  );
};
