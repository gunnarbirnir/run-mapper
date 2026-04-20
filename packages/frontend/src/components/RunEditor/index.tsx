import { useState } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import type { EditorRun } from '~/types';
import { IdProvider } from '~/context/IdContext';
import { SidePanel, Form } from '~/primitives';

import { EditorMap } from './components/EditorMap';
import { RootPanel } from './components/RootPanel';
import { RoutePanel } from './components/RoutePanel';
import { PointOfInterestPanel } from './components/PointOfInterestPanel';
import { WaypointPanel } from './components/WaypointPanel';

import { getRunEditorFormDefaults, useRunEditorForm } from './form';
import { useHandlers } from './hooks/useHandlers';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  const [showRootPanel, setShowRootPanel] = useState(true);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [showPointOfInterestPanel, setShowPointOfInterestPanel] =
    useState(false);
  const [showWaypointPanel, setShowWaypointPanel] = useState(false);
  const isNewRun = !existingRun;

  const {
    handleOpenPanel,
    handleClosePanel,
    handleOpenRoutePanel,
    handleCloseRoutePanel,
    handleOpenPointOfInterestPanel,
    handleClosePointOfInterestPanel,
    handleOpenWaypointPanel,
    handleCloseWaypointPanel,
  } = useHandlers({
    setShowRootPanel,
    setShowRoutePanel,
    setShowPointOfInterestPanel,
    setShowWaypointPanel,
  });

  const editorForm = useRunEditorForm({
    defaultValues: getRunEditorFormDefaults(existingRun),
  });

  useHotkey('P', () => {
    if (showRootPanel) {
      handleClosePanel();
    } else {
      handleOpenPanel();
    }
  });

  return (
    <IdProvider baseId="run-editor">
      <Form className="relative flex flex-1" onSubmit={editorForm.handleSubmit}>
        <SidePanel
          onOpen={handleOpenPanel}
          panels={[
            {
              id: 'root',
              position: 0,
              title: isNewRun ? 'New run' : 'Edit run',
              isVisible: showRootPanel,
              onClose: handleClosePanel,
              content: (
                <RootPanel
                  form={editorForm}
                  handleOpenRoutePanel={handleOpenRoutePanel}
                  handleOpenPointOfInterestPanel={
                    handleOpenPointOfInterestPanel
                  }
                />
              ),
            },
            {
              id: 'point-of-interest',
              position: 1,
              title: 'Add POI',
              isVisible: showPointOfInterestPanel,
              onClose: handleClosePointOfInterestPanel,
              content: <PointOfInterestPanel form={editorForm} />,
            },
            {
              id: 'route',
              position: 1,
              title: 'Add route',
              isVisible: showRoutePanel,
              onClose: handleCloseRoutePanel,
              content: (
                <RoutePanel
                  form={editorForm}
                  handleOpenWaypointPanel={handleOpenWaypointPanel}
                />
              ),
            },
            {
              id: 'waypoint',
              position: 2,
              title: 'Add waypoint',
              isVisible: showWaypointPanel,
              onClose: handleCloseWaypointPanel,
              content: <WaypointPanel form={editorForm} />,
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
