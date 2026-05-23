import { useMemo } from 'react';

import { IdProvider } from '~/context/IdContext';
import type {
  EditorRun,
  PointOfInterest,
  PublicRoute,
  Waypoint,
} from '~/types';

import { EditorFooter } from './components/EditorFooter';
import { EditorMap, useMapState } from './components/EditorMap';
import { SidePanelContainer } from './components/SidePanelContainer';
import { usePanelState } from './hooks/usePanelState';
import { useRootPanelState } from './hooks/useRootPanelState';
import { useWaypointCurrentItems } from './hooks/useWaypointCurrentItems';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
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
  const activeRoute = useMemo(
    () =>
      routePanelState.currentItems.find(
        (route) => route.id === routePanelState.editId,
      ),
    [routePanelState.currentItems, routePanelState.editId],
  );

  return (
    <IdProvider baseId="run-editor">
      <div className="relative isolate flex flex-1">
        <SidePanelContainer
          existingRun={existingRun}
          rootPanelState={rootPanelState}
          routePanelState={routePanelState}
          pointOfInterestPanelState={pointOfInterestPanelState}
          waypointPanelState={waypointPanelState}
        />
        <div className="z-1 flex flex-1 flex-col">
          <EditorMap
            {...mapState}
            initialBoundingBox={existingRun?.routes[0].boundingBox}
            activeRoute={activeRoute}
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
