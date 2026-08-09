import { useMemo } from 'react';

import { IdProvider } from '~/context/IdContext';
import type {
  EditorRun,
  PointOfInterest,
  PublicRoute,
  Waypoint,
  RunUpdate,
} from '~/types';
import {
  processRunRoute,
  calculateDistance,
  getBoundingBox,
} from '~/utils/route';

import { EditorFooter } from './components/EditorFooter';
import { EditorMap, useMapState } from './components/EditorMap';
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

  const mapState = useMapState();
  const {
    editRouteCoordinates,
    isEditingRouteCoordinates,
    isEditingPoiCoordinates,
    setEditRouteCoordinates,
    setIsEditingRouteCoordinates,
    setIsEditingPoiCoordinates,
    setEditPointOfInterestType,
    setEditWaypointType,
    setEditWaypointCoordinates,
    editRouteActionsRef,
    onUpdatePoiCoordinatesRef,
  } = mapState;
  const activeRoute = useMemo(
    () =>
      routePanelState.currentItems.find(
        (route) => route.id === routePanelState.editId,
      ),
    [routePanelState.currentItems, routePanelState.editId],
  );
  const { elevations: activeRouteElevations } = useMemo(
    // TODO: use edit route
    () => processRunRoute(activeRoute?.coordinates || []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRoute?.id],
  );
  const routeDistance = useMemo(
    () => calculateDistance(editRouteCoordinates),
    [editRouteCoordinates],
  );
  const initialBoundingBox = useMemo(
    () =>
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

  return (
    <IdProvider baseId="run-editor">
      <div className="relative isolate flex flex-1">
        <SidePanelContainer
          existingRun={existingRun}
          routeDistance={routeDistance}
          routeCoordinates={editRouteCoordinates}
          rootPanelState={rootPanelState}
          routePanelState={routePanelState}
          pointOfInterestPanelState={pointOfInterestPanelState}
          waypointPanelState={waypointPanelState}
          isEditingRouteCoordinates={isEditingRouteCoordinates}
          isEditingPoiCoordinates={isEditingPoiCoordinates}
          isDeleting={isDeleting}
          error={error}
          successMessage={successMessage}
          setEditRouteCoordinates={setEditRouteCoordinates}
          setIsEditingPoiCoordinates={setIsEditingPoiCoordinates}
          setEditPointOfInterestType={setEditPointOfInterestType}
          setEditWaypointType={setEditWaypointType}
          setIsEditingRouteCoordinates={setIsEditingRouteCoordinates}
          setEditWaypointCoordinates={setEditWaypointCoordinates}
          onSubmit={onSubmit}
          onDeleteRun={onDeleteRun}
          editRouteActionsRef={editRouteActionsRef}
          onUpdatePoiCoordinatesRef={onUpdatePoiCoordinatesRef}
        />
        <div className="z-1 flex flex-1 flex-col">
          <EditorMap
            {...mapState}
            activeRoute={activeRoute}
            initialBoundingBox={initialBoundingBox}
            activeRouteElevations={activeRouteElevations}
            routeDistance={routeDistance}
            rootPanelIsAnimating={rootPanelState.isAnimatingRootPanel}
            routePanelIsOpen={routePanelState.showPanel}
            routePanelIsAnimating={routePanelState.isAnimatingPanel}
            hasMadeRouteChanges={routePanelState.hasMadeChanges}
            currentPointsOfInterest={pointOfInterestPanelState.currentItems}
            activePointOfInterest={pointOfInterestPanelState.editId}
            pointOfInterestPanelIsOpen={pointOfInterestPanelState.showPanel}
            pointOfInterestPanelIsAnimating={
              pointOfInterestPanelState.isAnimatingPanel
            }
            hasMadePointOfInterestChanges={
              pointOfInterestPanelState.hasMadeChanges
            }
            currentWaypoints={waypointPanelState.currentItems}
            activeWaypoint={waypointPanelState.editId}
            waypointPanelIsOpen={waypointPanelState.showPanel}
            waypointPanelIsAnimating={waypointPanelState.isAnimatingPanel}
            hasMadeWaypointChanges={waypointPanelState.hasMadeChanges}
            onEditPointOfInterest={rootPanelState.onEditPointOfInterest}
            onEditWaypoint={rootPanelState.onEditWaypoint}
          />
          <EditorFooter />
        </div>
      </div>
    </IdProvider>
  );
};
