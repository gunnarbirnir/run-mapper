import { useCallback } from 'react';

import type { PointOfInterest } from '~/types';

interface UseSidePanelHandlersProps {
  currentPointsOfInterest: PointOfInterest[];
  setShowRootPanel: (isVisible: boolean) => void;
  setShowRoutePanel: (isVisible: boolean) => void;
  setShowPointOfInterestPanel: (isVisible: boolean) => void;
  setEditPointOfInterestId: (id: string | null) => void;
  setCurrentPointsOfInterest: (pointsOfInterest: PointOfInterest[]) => void;
  setHasMadeChangesPoi: (hasMadeChanges: boolean) => void;
  setShowWaypointPanel: (isVisible: boolean) => void;
}

export const useSidePanelHandlers = ({
  currentPointsOfInterest,
  setShowRootPanel,
  setShowRoutePanel,
  setShowPointOfInterestPanel,
  setShowWaypointPanel,
  setEditPointOfInterestId,
  setCurrentPointsOfInterest,
  setHasMadeChangesPoi,
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

  const handleDeletePointOfInterest = useCallback(
    (deleteId: string) => {
      const updatedPointsOfInterest = currentPointsOfInterest.filter(
        (poi) => poi.id !== deleteId,
      );
      setCurrentPointsOfInterest(updatedPointsOfInterest);
      setShowPointOfInterestPanel(false);
      setEditPointOfInterestId(null);
    },
    [
      currentPointsOfInterest,
      setCurrentPointsOfInterest,
      setShowPointOfInterestPanel,
      setEditPointOfInterestId,
    ],
  );

  const handleHasMadeChangesPoi = useCallback(
    (hasMadeChanges: boolean) => {
      setHasMadeChangesPoi(hasMadeChanges);
    },
    [setHasMadeChangesPoi],
  );

  const handleOpenWaypointPanel = useCallback(() => {
    setShowWaypointPanel(true);
  }, [setShowWaypointPanel]);

  const handleCloseWaypointPanel = useCallback(() => {
    setShowWaypointPanel(false);
  }, [setShowWaypointPanel]);

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
    handleDeletePointOfInterest,
    handleHasMadeChangesPoi,
  };
};
