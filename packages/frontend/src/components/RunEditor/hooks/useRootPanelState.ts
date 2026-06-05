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
  waypointPanelState: {
    setShowPanel: setShowWaypointPanel,
    setEditId: setEditWaypointId,
  },
}: UseRootPanelStateProps) => {
  const [showRootPanel, setShowRootPanelState] = useState(true);
  const [isAnimatingRootPanel, setIsAnimatingRootPanel] = useState(false);

  const setShowRootPanel = useCallback((show: boolean) => {
    setShowRootPanelState((prev) => {
      if (prev !== show) {
        setIsAnimatingRootPanel(true);
        return show;
      }
      return prev;
    });
  }, []);

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
    setShowWaypointPanel(false);
    setShowPointOfInterestPanel(true);
  }, [
    setEditPointOfInterestId,
    setShowRoutePanel,
    setShowWaypointPanel,
    setShowPointOfInterestPanel,
  ]);

  const onEditPointOfInterest = useCallback(
    (poiId: string) => {
      setEditPointOfInterestId(poiId);
      setShowRoutePanel(false);
      setShowWaypointPanel(false);
      setShowPointOfInterestPanel(true);
    },
    [
      setEditPointOfInterestId,
      setShowRoutePanel,
      setShowWaypointPanel,
      setShowPointOfInterestPanel,
    ],
  );

  const onAddWaypoint = useCallback(() => {
    setEditWaypointId(null);
    setShowWaypointPanel(true);
  }, [setEditWaypointId, setShowWaypointPanel]);

  const onEditWaypoint = useCallback(
    (waypointId: string) => {
      setEditWaypointId(waypointId);
      setShowWaypointPanel(true);
    },
    [setEditWaypointId, setShowWaypointPanel],
  );

  const onAnimationComplete = useCallback(() => {
    setIsAnimatingRootPanel(false);
  }, [setIsAnimatingRootPanel]);

  return {
    showRootPanel,
    isAnimatingRootPanel,
    onOpen,
    onClose,
    onAddRoute,
    onEditRoute,
    onAddPointOfInterest,
    onEditPointOfInterest,
    onAddWaypoint,
    onEditWaypoint,
    onAnimationComplete,
  };
};

export type RootPanelState = ReturnType<typeof useRootPanelState>;
