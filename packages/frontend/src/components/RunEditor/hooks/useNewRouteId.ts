import { useLayoutEffect, useState } from 'react';

import { Waypoint } from '~/types';

import { getWaypointsWithStartAndEnd } from '../utils';

interface UseNewRouteIdProps {
  routePanelVisible: boolean;
  routeEditId?: string | null;
  setRouteWaypoints: (routeId: string, waypoints: Waypoint[]) => void;
  deleteRouteWaypoint: (routeId: string) => void;
}

export const useNewRouteId = ({
  routePanelVisible,
  routeEditId,
  setRouteWaypoints,
  deleteRouteWaypoint,
}: UseNewRouteIdProps) => {
  const [newRouteId, setNewRouteId] = useState<string | null>(null);

  // useLayoutEffect instead of useEffect to prevent flicker
  useLayoutEffect(() => {
    const newId = `new-route-${Date.now()}`;

    if (routePanelVisible && !routeEditId) {
      setRouteWaypoints(newId, getWaypointsWithStartAndEnd([], newId));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewRouteId(newId);
    } else {
      setNewRouteId(null);
    }

    return () => {
      deleteRouteWaypoint(newId);
    };
  }, [routePanelVisible, routeEditId, setRouteWaypoints, deleteRouteWaypoint]);

  return newRouteId;
};
