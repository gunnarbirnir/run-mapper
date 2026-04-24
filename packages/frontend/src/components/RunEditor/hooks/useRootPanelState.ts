import { useCallback, useState } from 'react';

import type { PointOfInterest, PublicRoute, Waypoint } from '~/types';

import { type PanelState } from './usePanelState';

interface UseRootPanelStateProps {
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: PanelState<Waypoint>;
}

export const useRootPanelState = ({
  routePanelState: {
    setShowPanel: setShowRoutePanel,
    setEditId: setEditRouteId,
  },
  pointOfInterestPanelState: {
    setShowPanel: setShowPointOfInterestPanel,
    setEditId: setEditPointOfInterestId,
  },
  waypointPanelState: { setShowPanel: setShowWaypointPanel },
}: UseRootPanelStateProps) => {
  const [showRootPanel, setShowRootPanel] = useState(true);

  const onOpen = useCallback(() => {
    setShowRootPanel(true);
  }, [setShowRootPanel]);

  const onClose = useCallback(() => {
    setShowRootPanel(false);
    setShowRoutePanel(false);
    setShowPointOfInterestPanel(false);
    setShowWaypointPanel(false);
  }, [
    setShowRootPanel,
    setShowRoutePanel,
    setShowPointOfInterestPanel,
    setShowWaypointPanel,
  ]);

  const onAddRoute = useCallback(() => {
    setEditRouteId(null);
    setShowPointOfInterestPanel(false);
    setShowRoutePanel(true);
  }, [setEditRouteId, setShowPointOfInterestPanel, setShowRoutePanel]);

  const onEditRoute = useCallback(
    (routeId: string) => {
      setEditRouteId(routeId);
      setShowPointOfInterestPanel(false);
      setShowRoutePanel(true);
    },
    [setEditRouteId, setShowPointOfInterestPanel, setShowRoutePanel],
  );

  const onAddPointOfInterest = useCallback(() => {
    setEditPointOfInterestId(null);
    setShowRoutePanel(false);
    setShowPointOfInterestPanel(true);
  }, [
    setEditPointOfInterestId,
    setShowRoutePanel,
    setShowPointOfInterestPanel,
  ]);

  const onEditPointOfInterest = useCallback(
    (poiId: string) => {
      setEditPointOfInterestId(poiId);
      setShowRoutePanel(false);
      setShowPointOfInterestPanel(true);
    },
    [setEditPointOfInterestId, setShowRoutePanel, setShowPointOfInterestPanel],
  );

  const onOpenWaypointPanel = useCallback(() => {
    setShowWaypointPanel(true);
  }, [setShowWaypointPanel]);

  return {
    showRootPanel,
    onOpen,
    onClose,
    onAddRoute,
    onAddPointOfInterest,
    onEditRoute,
    onEditPointOfInterest,
    onOpenWaypointPanel,
  };
};
