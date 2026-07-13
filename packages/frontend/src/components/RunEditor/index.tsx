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
  onSubmit: (run: RunUpdate) => void | Promise<unknown>;
}

export const RunEditor = ({ existingRun, error, onSubmit }: RunEditorProps) => {
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
  const {
    coordinates: activeRouteCoordinates,
    elevations: activeRouteElevations,
  } = useMemo(
    () => processRunRoute(activeRoute?.coordinates || []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeRoute?.id],
  );
  const routeDistance = useMemo(
    () => calculateDistance(activeRouteCoordinates),
    [activeRouteCoordinates],
  );
  const initialBoundingBox = useMemo(
    () =>
      existingRun?.pointsOfInterest.length
        ? getBoundingBox(
            existingRun?.pointsOfInterest.map((poi) => poi.coordinates) || [],
          )
        : existingRun?.routes.length
          ? existingRun?.routes[0].boundingBox
          : undefined,
    [existingRun?.pointsOfInterest, existingRun?.routes],
  );

  return (
    <IdProvider baseId="run-editor">
      <div className="relative isolate flex flex-1">
        <SidePanelContainer
          existingRun={existingRun}
          routeDistance={routeDistance}
          routeCoordinates={activeRouteCoordinates}
          rootPanelState={rootPanelState}
          routePanelState={routePanelState}
          pointOfInterestPanelState={pointOfInterestPanelState}
          waypointPanelState={waypointPanelState}
          editRouteCoordinates={editRouteCoordinates}
          isEditingRouteCoordinates={isEditingRouteCoordinates}
          isEditingPoiCoordinates={isEditingPoiCoordinates}
          error={error}
          setEditRouteCoordinates={setEditRouteCoordinates}
          setIsEditingPoiCoordinates={setIsEditingPoiCoordinates}
          setEditPointOfInterestType={setEditPointOfInterestType}
          setEditWaypointType={setEditWaypointType}
          setIsEditingRouteCoordinates={setIsEditingRouteCoordinates}
          setEditWaypointCoordinates={setEditWaypointCoordinates}
          onSubmit={onSubmit}
          editRouteActionsRef={editRouteActionsRef}
          onUpdatePoiCoordinatesRef={onUpdatePoiCoordinatesRef}
        />
        <div className="z-1 flex flex-1 flex-col">
          <EditorMap
            {...mapState}
            initialBoundingBox={initialBoundingBox}
            activeRoute={activeRoute}
            activeRouteCoordinates={activeRouteCoordinates}
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
