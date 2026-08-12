import { useMemo } from 'react';

import { IdProvider } from '~/context/IdContext';
import type {
  EditorRun,
  PointOfInterest,
  PublicRoute,
  Waypoint,
  RunUpdate,
} from '~/types';
import { getBoundingBox } from '~/utils/route';

import { EditorFooter } from './components/EditorFooter';
import { EditorMap, useMapState, useEditRoute } from './components/EditorMap';
import { SidePanelContainer } from './components/SidePanelContainer';
import { usePanelState } from './hooks/usePanelState';
import { useRootPanelState } from './hooks/useRootPanelState';
import { useWaypointCurrentItems } from './hooks/useWaypointCurrentItems';

interface RunEditorProps {
  existingRun?: EditorRun;
  error?: Error | null;
  successMessage?: string | null;
  isDeleting?: boolean;
  onSubmit: (run: RunUpdate) => void;
  onDeleteRun?: () => void;
}

export const RunEditor = ({
  existingRun,
  error,
  successMessage,
  isDeleting = false,
  onSubmit,
  onDeleteRun,
}: RunEditorProps) => {
  const routePanelState = usePanelState<PublicRoute>({
    existingItems: existingRun?.routes,
  });
  const pointOfInterestPanelState = usePanelState<PointOfInterest>({
    existingItems: existingRun?.pointsOfInterest,
  });
  const waypointPanelState = usePanelState<Waypoint>({
    ...useWaypointCurrentItems({ routePanelState }),
  });
  const rootPanelState = useRootPanelState({
    routePanelState,
    pointOfInterestPanelState,
    waypointPanelState,
  });

  const activeRoute = useMemo(
    () =>
      routePanelState.currentItems.find(
        (route) => route.id === routePanelState.editId,
      ),
    [routePanelState.currentItems, routePanelState.editId],
  );
  const initialBoundingBox = useMemo(
    () =>
      // TODO: Reduce zoom if only one POI
      pointOfInterestPanelState.currentItems.length
        ? getBoundingBox(
            pointOfInterestPanelState.currentItems.map(
              (poi) => poi.coordinates,
            ),
          )
        : routePanelState.currentItems.length
          ? routePanelState.currentItems[0].boundingBox
          : undefined,
    [pointOfInterestPanelState.currentItems, routePanelState.currentItems],
  );

  const mapState = useMapState();
  const {
    isEditingPoiCoordinates,
    setIsEditingPoiCoordinates,
    setEditPointOfInterestType,
    setEditWaypointType,
    setEditWaypointCoordinates,
    editRouteActionsRef,
    onUpdatePoiCoordinatesRef,
  } = mapState;
  const editRouteState = useEditRoute({
    activeRoute,
  });
  const {
    editRouteCoordinates,
    routeDistance,
    routeBoundingBox,
    routeElevationStats,
    isEditingRouteCoordinates,
    setEditRouteControlPoints,
    setIsEditingRouteCoordinates,
  } = editRouteState;

  return (
    <IdProvider baseId="run-editor">
      <div className="relative isolate flex flex-1">
        <SidePanelContainer
          // Base props
          existingRun={existingRun}
          error={error}
          isDeleting={isDeleting}
          successMessage={successMessage}
          // Edit route state
          routeDistance={routeDistance}
          routeBoundingBox={routeBoundingBox}
          routeElevationStats={routeElevationStats}
          routeCoordinates={editRouteCoordinates}
          isEditingRouteCoordinates={isEditingRouteCoordinates}
          // Panel states
          rootPanelState={rootPanelState}
          routePanelState={routePanelState}
          pointOfInterestPanelState={pointOfInterestPanelState}
          waypointPanelState={waypointPanelState}
          // Map state
          isEditingPoiCoordinates={isEditingPoiCoordinates}
          // Handlers
          onSubmit={onSubmit}
          onDeleteRun={onDeleteRun}
          setEditRouteControlPoints={setEditRouteControlPoints}
          setIsEditingRouteCoordinates={setIsEditingRouteCoordinates}
          setIsEditingPoiCoordinates={setIsEditingPoiCoordinates}
          setEditPointOfInterestType={setEditPointOfInterestType}
          setEditWaypointType={setEditWaypointType}
          setEditWaypointCoordinates={setEditWaypointCoordinates}
          // Refs
          editRouteActionsRef={editRouteActionsRef}
          onUpdatePoiCoordinatesRef={onUpdatePoiCoordinatesRef}
        />
        <div className="z-1 flex flex-1 flex-col">
          <EditorMap
            {...mapState}
            {...editRouteState}
            initialBoundingBox={initialBoundingBox}
            rootPanelIsAnimating={rootPanelState.isAnimatingRootPanel}
            // Route panel state
            routePanelIsOpen={routePanelState.showPanel}
            routePanelIsAnimating={routePanelState.isAnimatingPanel}
            hasMadeRouteChanges={routePanelState.hasMadeChanges}
            // Points of interest panel state
            currentPointsOfInterest={pointOfInterestPanelState.currentItems}
            activePointOfInterest={pointOfInterestPanelState.editId}
            pointOfInterestPanelIsOpen={pointOfInterestPanelState.showPanel}
            pointOfInterestPanelIsAnimating={
              pointOfInterestPanelState.isAnimatingPanel
            }
            hasMadePointOfInterestChanges={
              pointOfInterestPanelState.hasMadeChanges
            }
            // Waypoint panel state
            currentWaypoints={waypointPanelState.currentItems}
            activeWaypoint={waypointPanelState.editId}
            waypointPanelIsOpen={waypointPanelState.showPanel}
            waypointPanelIsAnimating={waypointPanelState.isAnimatingPanel}
            hasMadeWaypointChanges={waypointPanelState.hasMadeChanges}
            // Handlers
            onEditPointOfInterest={rootPanelState.onEditPointOfInterest}
            onEditWaypoint={rootPanelState.onEditWaypoint}
          />
          <EditorFooter />
        </div>
      </div>
    </IdProvider>
  );
};
