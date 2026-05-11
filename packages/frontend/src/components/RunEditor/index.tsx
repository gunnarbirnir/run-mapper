import { useState } from 'react';

import { IdProvider } from '~/context/IdContext';
import type {
  EditorRun,
  PointOfInterest,
  PublicRoute,
  Waypoint,
} from '~/types';

import { EditorMap, useMapState } from './components/EditorMap';
import { SidePanelContainer } from './components/SidePanelContainer';
import { EditorFooter } from './components/EditorFooter';
import { usePanelState } from './hooks/usePanelState';
import { useWaypointCurrentItems } from './hooks/useWaypointCurrentItems';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  const [isAnimatingPanel, setIsAnimatingPanel] = useState(false);
  const routePanelState = usePanelState<PublicRoute>({
    existingItems: existingRun?.routes,
  });
  const pointOfInterestPanelState = usePanelState<PointOfInterest>({
    existingItems: existingRun?.pointsOfInterest,
  });
  const waypointPanelState = usePanelState<Waypoint>({
    ...useWaypointCurrentItems({ routePanelState }),
  });
  const mapState = useMapState();

  return (
    <IdProvider baseId="run-editor">
      <div className="relative isolate flex flex-1">
        <SidePanelContainer
          existingRun={existingRun}
          routePanelState={routePanelState}
          pointOfInterestPanelState={pointOfInterestPanelState}
          waypointPanelState={waypointPanelState}
          setIsAnimatingPanel={setIsAnimatingPanel}
        />
        <div className="z-1 flex flex-1 flex-col">
          <EditorMap
            {...mapState}
            routePanelIsOpen={routePanelState.showPanel}
            isAnimatingPanel={isAnimatingPanel}
            activeRoute={routePanelState.currentItems.find(
              (route) => route.id === routePanelState.editId,
            )}
          />
          <EditorFooter />
        </div>
      </div>
    </IdProvider>
  );
};
