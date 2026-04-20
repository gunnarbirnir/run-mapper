import { useCallback } from 'react';

interface UseHandlersProps {
  setShowRootPanel: (isVisible: boolean) => void;
  setShowRoutePanel: (isVisible: boolean) => void;
  setShowPointOfInterestPanel: (isVisible: boolean) => void;
  setShowWaypointPanel: (isVisible: boolean) => void;
}

export const useHandlers = ({
  setShowRootPanel,
  setShowRoutePanel,
  setShowPointOfInterestPanel,
  setShowWaypointPanel,
}: UseHandlersProps) => {
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

  const handleOpenPointOfInterestPanel = useCallback(() => {
    setShowRoutePanel(false);
    setShowPointOfInterestPanel(true);
  }, [setShowRoutePanel, setShowPointOfInterestPanel]);

  const handleClosePointOfInterestPanel = useCallback(() => {
    setShowPointOfInterestPanel(false);
  }, [setShowPointOfInterestPanel]);

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
    handleOpenPointOfInterestPanel,
    handleClosePointOfInterestPanel,
    handleOpenWaypointPanel,
    handleCloseWaypointPanel,
  };
};
