import { useCallback } from 'react';

import type { PointOfInterest } from '~/types';

interface UseSidePanelHandlersProps {
  setShowRootPanel: (isVisible: boolean) => void;
  setShowRoutePanel: (isVisible: boolean) => void;
  setShowPointOfInterestPanel: (isVisible: boolean) => void;
  setShowWaypointPanel: (isVisible: boolean) => void;
  setEditPointOfInterestId: (id: string | null) => void;
  setCurrentPointsOfInterest: (pointsOfInterest: PointOfInterest[]) => void;
}

export const useSidePanelHandlers = ({
  setShowRootPanel,
  setShowRoutePanel,
  setShowPointOfInterestPanel,
  setShowWaypointPanel,
  setEditPointOfInterestId,
  setCurrentPointsOfInterest,
}: UseSidePanelHandlersProps) => {
  const handleOpenPanel = useCallback(() => {
    setShowRootPanel(true);
  }, [setShowRootPanel]);

  const handleClosePanel = useCallback(() => {
    setShowRootPanel(false);
    setShowRoutePanel(false);
    setShowPointOfInterestPanel(false);
  }, [setShowRootPanel, setShowRoutePanel, setShowPointOfInterestPanel]);

  const handleOpenRoutePanel = useCallback(() => {
    setShowPointOfInterestPanel(false);
    setShowRoutePanel(true);
  }, [setShowPointOfInterestPanel, setShowRoutePanel]);

  const handleCloseRoutePanel = useCallback(() => {
    setShowRoutePanel(false);
  }, [setShowRoutePanel]);

  const handleAddPointOfInterest = useCallback(() => {
    setEditPointOfInterestId(null);
    setShowRoutePanel(false);
    setShowPointOfInterestPanel(true);
  }, [
    setEditPointOfInterestId,
    setShowRoutePanel,
    setShowPointOfInterestPanel,
  ]);

  const handleClosePointOfInterestPanel = useCallback(() => {
    setShowPointOfInterestPanel(false);
  }, [setShowPointOfInterestPanel]);

  const handleOpenWaypointPanel = useCallback(() => {
    setShowWaypointPanel(true);
  }, [setShowWaypointPanel]);

  const handleCloseWaypointPanel = useCallback(() => {
    setShowWaypointPanel(false);
  }, [setShowWaypointPanel]);

  const handleEditPointOfInterest = useCallback(
    (poiId: string) => {
      setEditPointOfInterestId(poiId);
      setShowRoutePanel(false);
      setShowPointOfInterestPanel(true);
    },
    [setEditPointOfInterestId, setShowRoutePanel, setShowPointOfInterestPanel],
  );

  const handleUpdatePointsOfInterest = useCallback(
    (pointsOfInterest: PointOfInterest[]) => {
      setCurrentPointsOfInterest(pointsOfInterest);
      setShowPointOfInterestPanel(false);
    },
    [setCurrentPointsOfInterest, setShowPointOfInterestPanel],
  );

  return {
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
  };
};
