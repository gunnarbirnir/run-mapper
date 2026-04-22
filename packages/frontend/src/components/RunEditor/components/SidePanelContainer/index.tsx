import { useHotkey } from '@tanstack/react-hotkeys';
import { useState } from 'react';

import { SidePanel } from '~/primitives';
import type { EditorRun, PointOfInterest } from '~/types';

import { PointOfInterestPanel } from '../PointOfInterestPanel';
import { RootPanel } from '../RootPanel';
import { RoutePanel } from '../RoutePanel';
import { WaypointPanel } from '../WaypointPanel';
import { useSidePanelHandlers } from './useSidePanelHandlers';

interface SidePanelContainerProps {
  existingRun?: EditorRun;
}

export const SidePanelContainer = ({
  existingRun,
}: SidePanelContainerProps) => {
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
  } = useSidePanelHandlers({
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
    <SidePanel
      onOpen={handleOpenPanel}
      panels={[
        {
          id: 'root',
          position: 0,
          isVisible: showRootPanel,
          content: (
            <RootPanel
              existingRun={existingRun}
              currentPointsOfInterest={currentPointsOfInterest}
              onClose={handleClosePanel}
              handleOpenRoutePanel={handleOpenRoutePanel}
              handleAddPointOfInterest={handleAddPointOfInterest}
              handleEditPointOfInterest={handleEditPointOfInterest}
            />
          ),
        },
        {
          id: 'point-of-interest',
          position: 1,
          isVisible: showPointOfInterestPanel,
          content: (
            <PointOfInterestPanel
              editPointOfInterestId={editPointOfInterestId}
              currentPointsOfInterest={currentPointsOfInterest}
              onClose={handleClosePointOfInterestPanel}
              handleUpdatePointsOfInterest={handleUpdatePointsOfInterest}
            />
          ),
        },
        {
          id: 'route',
          position: 1,
          isVisible: showRoutePanel,
          content: (
            <RoutePanel
              onClose={handleCloseRoutePanel}
              handleOpenWaypointPanel={handleOpenWaypointPanel}
            />
          ),
        },
        {
          id: 'waypoint',
          position: 2,
          isVisible: showWaypointPanel,
          content: <WaypointPanel onClose={handleCloseWaypointPanel} />,
        },
      ]}
    />
  );
};
