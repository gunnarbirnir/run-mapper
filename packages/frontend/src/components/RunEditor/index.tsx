import { useState } from 'react';

import type { EditorRun } from '~/types';
import { IdProvider } from '~/context/IdContext';
import { SidePanelGroup, Button } from '~/primitives';

import { EditorMap } from './components/EditorMap';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [showWaypointPanel, setShowWaypointPanel] = useState(false);
  const isNewRun = !existingRun;

  return (
    <IdProvider baseId="run-editor">
      <div className="flex flex-1">
        <SidePanelGroup
          panels={[
            {
              id: 'main',
              title: isNewRun ? 'New run' : 'Edit run',
              className: 'p-6 pb-12',
              content: (
                <Button onClick={() => setShowRoutePanel(!showRoutePanel)}>
                  Show Route
                </Button>
              ),
            },
            {
              id: 'route',
              title: 'Route',
              className: 'p-6 pb-12',
              content: (
                <Button
                  onClick={() => setShowWaypointPanel(!showWaypointPanel)}
                >
                  Show Waypoints
                </Button>
              ),
              isVisible: showRoutePanel,
            },
            {
              id: 'waypoint',
              title: 'Waypoint',
              className: 'p-6 pb-12',
              content: 'Waypoint panel content',
              isVisible: showWaypointPanel,
            },
          ]}
        />

        <div className="flex-1">
          <EditorMap />
        </div>
      </div>
    </IdProvider>
  );
};
