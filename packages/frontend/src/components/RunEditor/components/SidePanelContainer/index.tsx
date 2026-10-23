import { useCallback, useState } from 'react';

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
import { useMediaQuery } from '~/hooks/useMediaQuery';

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
  isLoadingRouteData: boolean;
  isLoadingRouteBetweenPoints: boolean;
  rootPanelState: RootPanelState;
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: PanelState<Waypoint>;
  isEditingRouteCoordinates: boolean;
  isEditingPoiCoordinates: boolean;
  isViewingMapOnSmallScreen: boolean;
  onSubmit: (run: RunUpdate) => Promise<unknown>;
  onDeleteRun?: () => Promise<unknown>;
  setHasMadeChanges: (hasMadeChanges: boolean) => void;
  setActiveRouteControlPoints: (coordinates: RouteCoordinates[]) => void;
  setIsEditingRouteCoordinates: (isEditing: boolean) => void;
  setIsEditingPoiCoordinates: (isEditing: boolean) => void;
  setEditPointOfInterestType: (type: PointOfInterestType | null) => void;
  setEditWaypointType: (type: WaypointType | null) => void;
  setEditWaypointCoordinates: (coordinates: Coordinates | null) => void;
  setIsViewingMapOnSmallScreen: (isViewing: boolean) => void;
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
  isLoadingRouteData,
  isLoadingRouteBetweenPoints,
  rootPanelState,
  routePanelState,
  pointOfInterestPanelState,
  waypointPanelState,
  isEditingRouteCoordinates,
  isEditingPoiCoordinates,
  isViewingMapOnSmallScreen,
  onSubmit,
  onDeleteRun,
  setHasMadeChanges,
  setActiveRouteControlPoints,
  setIsEditingRouteCoordinates,
  setEditPointOfInterestType,
  setIsEditingPoiCoordinates,
  setEditWaypointType,
  setEditWaypointCoordinates,
  setIsViewingMapOnSmallScreen,
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
  const { isSmallScreen } = useMediaQuery();
  const [hasUpdatedRouteWaypoints, setHasUpdatedRouteWaypoints] =
    useState(false);
  const isEditingOnSmallScreen =
    isSmallScreen && (isEditingRouteCoordinates || isEditingPoiCoordinates);
  const showMapOnSmallScreen =
    isViewingMapOnSmallScreen || isEditingOnSmallScreen;

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

  return (
    <SidePanel
      onOpen={onOpen}
      hideToggle={showMapOnSmallScreen}
      toggleClassName="mt-6"
      className="z-10"
      panels={[
        {
          id: 'root',
          position: 0,
          isVisible: showRootPanel && !showMapOnSmallScreen,
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
              setHasMadeChanges={setHasMadeChanges}
            />
          ),
        },
        {
          id: 'point-of-interest',
          position: 1,
          isVisible:
            pointOfInterestPanelState.showPanel && !showMapOnSmallScreen,
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
          isVisible: routePanelState.showPanel && !showMapOnSmallScreen,
          disabled: waypointPanelState.hasMadeChanges,
          onAnimationComplete: routePanelState.onAnimationComplete,
          content: (
            <RoutePanel
              {...routePanelState}
              activeRouteDistance={activeRouteDistance}
              activeRouteCoordinates={activeRouteCoordinates}
              activeRouteBoundingBox={activeRouteBoundingBox}
              activeRouteElevationStats={activeRouteElevationStats}
              isLoadingRouteData={isLoadingRouteData}
              isLoadingRouteBetweenPoints={isLoadingRouteBetweenPoints}
              activeRouteError={activeRouteError}
              isEditingRouteCoordinates={isEditingRouteCoordinates}
              currentWaypoints={waypointPanelState.currentItems}
              activeWaypoint={waypointPanelState.editId}
              hasUpdatedRouteWaypoints={hasUpdatedRouteWaypoints}
              onAddWaypoint={handleAddWaypoint}
              onEditWaypoint={onEditWaypoint}
              onViewMap={() => setIsViewingMapOnSmallScreen(true)}
              setActiveRouteControlPoints={setActiveRouteControlPoints}
              setIsEditingRouteCoordinates={setIsEditingRouteCoordinates}
              setHasUpdatedRouteWaypoints={setHasUpdatedRouteWaypoints}
              editRouteActionsRef={editRouteActionsRef}
            />
          ),
        },
        {
          id: 'waypoint',
          position: 2,
          isVisible: waypointPanelState.showPanel && !showMapOnSmallScreen,
          onAnimationComplete: waypointPanelState.onAnimationComplete,
          content: (
            <WaypointPanel
              {...waypointPanelState}
              activeRouteDistance={activeRouteDistance}
              activeRouteCoordinates={activeRouteCoordinates}
              setEditWaypointType={setEditWaypointType}
              setEditWaypointCoordinates={setEditWaypointCoordinates}
              setHasUpdatedRouteWaypoints={setHasUpdatedRouteWaypoints}
            />
          ),
        },
      ]}
    />
  );
};
