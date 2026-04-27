import { useCallback, useState } from 'react';

import type { PointOfInterest, PublicRoute, Waypoint } from '~/types';

import { type PanelState } from './usePanelState';
import { type RecordPanelState } from './useRecordPanelState';

interface UseRootPanelStateProps {
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: RecordPanelState<Waypoint>;
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
    setEditRecordId: setEditWaypointRecordId,
  },
}: UseRootPanelStateProps) => {
  const [showRootPanel, setShowRootPanel] = useState(true);

  const handleSetEditRouteId = useCallback(
    (routeId: string | null) => {
      setEditRouteId(routeId);
      setEditWaypointRecordId(routeId);
    },
    [setEditRouteId, setEditWaypointRecordId],
  );

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
    handleSetEditRouteId(null);
    setShowPointOfInterestPanel(false);
    setShowRoutePanel(true);
  }, [handleSetEditRouteId, setShowPointOfInterestPanel, setShowRoutePanel]);

  const onEditRoute = useCallback(
    (routeId: string) => {
      handleSetEditRouteId(routeId);
      setShowPointOfInterestPanel(false);
      setShowRoutePanel(true);
    },
    [handleSetEditRouteId, setShowPointOfInterestPanel, setShowRoutePanel],
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

  return {
    showRootPanel,
    onOpen,
    onClose,
    onAddRoute,
    onEditRoute,
    onAddPointOfInterest,
    onEditPointOfInterest,
    onAddWaypoint,
    onEditWaypoint,
  };
};
