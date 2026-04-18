import { useState } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import type { EditorRun } from '~/types';
import { IdProvider } from '~/context/IdContext';
import { SidePanel, Button, Form } from '~/primitives';

import { EditorMap } from './components/EditorMap';
import { RootPanel } from './components/RootPanel';
import { getRunEditorFormDefaults, useRunEditorForm } from './form';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  const [showRootPanel, setShowRootPanel] = useState(true);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [showWaypointPanel, setShowWaypointPanel] = useState(false);
  const isNewRun = !existingRun;

  const editorForm = useRunEditorForm({
    defaultValues: getRunEditorFormDefaults(existingRun),
  });

  useHotkey('P', () => {
    if (showRootPanel) {
      setShowRootPanel(false);
      setShowRoutePanel(false);
      setShowWaypointPanel(false);
    } else {
      setShowRootPanel(true);
    }
  });

  return (
    <IdProvider baseId="run-editor">
      <Form className="relative flex flex-1" onSubmit={editorForm.handleSubmit}>
        <SidePanel
          onOpen={() => setShowRootPanel(true)}
          panels={[
            {
              id: 'root',
              title: isNewRun ? 'New run' : 'Edit run',
              isVisible: showRootPanel,
              onClose: () => setShowRootPanel(false),
              content: <RootPanel form={editorForm} />,
            },
            {
              id: 'route',
              title: 'Route',
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
              isVisible: showWaypointPanel,
              onClose: () => setShowWaypointPanel(false),
              content: <div>Waypoint content</div>,
            },
          ]}
        />

        <div className="flex-1">
          <EditorMap />
        </div>
      </Form>
    </IdProvider>
  );
};
