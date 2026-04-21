import { useState } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import type { EditorRun, PointOfInterest } from '~/types';
import { IdProvider } from '~/context/IdContext';
import { SidePanel } from '~/primitives';

import { EditorMap } from './components/EditorMap';
import { RootPanel } from './components/RootPanel';
import { RoutePanel } from './components/RoutePanel';
import { PointOfInterestPanel } from './components/PointOfInterestPanel';
import { WaypointPanel } from './components/WaypointPanel';

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

  const [editPointOfInterestId, setEditPointOfInterestId] = useState<
    string | null
  >(null);
  const [currentPointsOfInterest, setCurrentPointsOfInterest] = useState<
    PointOfInterest[]
  >(existingRun?.pointsOfInterest ?? []);

  const isNewRun = !existingRun;

  const {
    handleOpenPanel,
    handleClosePanel,
    handleOpenRoutePanel,
    handleCloseRoutePanel,
    handleAddPointOfInterest,
    handleClosePointOfInterestPanel,
    handleOpenWaypointPanel,
    handleCloseWaypointPanel,
    handleEditPointOfInterest,
    handleUpdatePointsOfInterest,
  } = useHandlers({
    setShowRootPanel,
    setShowRoutePanel,
    setShowPointOfInterestPanel,
    setShowWaypointPanel,
    setEditPointOfInterestId,
    setCurrentPointsOfInterest,
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
      <div className="relative flex flex-1">
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
                  existingRun={existingRun}
                  currentPointsOfInterest={currentPointsOfInterest}
                  handleOpenRoutePanel={handleOpenRoutePanel}
                  handleAddPointOfInterest={handleAddPointOfInterest}
                  handleEditPointOfInterest={handleEditPointOfInterest}
                />
              ),
            },
            {
              id: 'point-of-interest',
              position: 1,
              title: editPointOfInterestId ? 'Edit POI' : 'Add POI',
              isVisible: showPointOfInterestPanel,
              onClose: handleClosePointOfInterestPanel,
              content: (
                <PointOfInterestPanel
                  editPointOfInterestId={editPointOfInterestId}
                  currentPointsOfInterest={currentPointsOfInterest}
                  handleUpdatePointsOfInterest={handleUpdatePointsOfInterest}
                  onClose={handleClosePointOfInterestPanel}
                />
              ),
            },
            {
              id: 'route',
              position: 1,
              title: 'Add route',
              isVisible: showRoutePanel,
              onClose: handleCloseRoutePanel,
              content: (
                <RoutePanel handleOpenWaypointPanel={handleOpenWaypointPanel} />
              ),
            },
            {
              id: 'waypoint',
              position: 2,
              title: 'Add waypoint',
              isVisible: showWaypointPanel,
              onClose: handleCloseWaypointPanel,
              content: <WaypointPanel />,
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
