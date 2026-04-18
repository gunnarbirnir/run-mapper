import { useState } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import type { EditorRun } from '~/types';
import { IdProvider } from '~/context/IdContext';
import { SidePanel, Button } from '~/primitives';

import { EditorMap } from './components/EditorMap';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  const [showMainPanel, setShowMainPanel] = useState(true);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [showWaypointPanel, setShowWaypointPanel] = useState(false);
  const isNewRun = !existingRun;

  useHotkey('P', () => {
    if (showMainPanel) {
      setShowMainPanel(false);
      setShowRoutePanel(false);
      setShowWaypointPanel(false);
    } else {
      setShowMainPanel(true);
    }
  });

  return (
    <IdProvider baseId="run-editor">
      <div className="relative flex flex-1">
        <SidePanel
          onOpen={() => setShowMainPanel(true)}
          panels={[
            {
              id: 'main',
              title: isNewRun ? 'New run' : 'Edit run',
              className: 'p-6 pb-12',
              isVisible: showMainPanel,
              onClose: () => setShowMainPanel(false),
              content: (
                <Button onClick={() => setShowRoutePanel(true)}>
                  Show Route
                </Button>
              ),
            },
            {
              id: 'route',
              title: 'Route',
              className: 'p-6 pb-12',
              isVisible: showRoutePanel,
              onClose: () => setShowRoutePanel(false),
              content: (
                <Button onClick={() => setShowWaypointPanel(true)}>
                  Show Waypoint
                </Button>
              ),
            },
            {
              id: 'waypoint',
              title: 'Waypoint',
              className: 'p-6 pb-12',
              isVisible: showWaypointPanel,
              onClose: () => setShowWaypointPanel(false),
              content: <div>Waypoint content</div>,
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
