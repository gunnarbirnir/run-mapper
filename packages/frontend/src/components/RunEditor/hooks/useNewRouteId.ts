import { useLayoutEffect, useState } from 'react';

import { Waypoint } from '~/types';

import { getWaypointsWithStartAndEnd } from '../utils';

interface UseNewRouteIdProps {
  editRouteId: string | null;
  setRouteWaypoints: (routeId: string, waypoints: Waypoint[]) => void;
}

export const useNewRouteId = ({
  editRouteId,
  setRouteWaypoints,
}: UseNewRouteIdProps) => {
  const [newRouteId, setNewRouteId] = useState<string | null>(null);

  // useLayoutEffect instead of useEffect to prevent flicker
  useLayoutEffect(() => {
    if (editRouteId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewRouteId(null);
    } else {
      const newId = `new-route-${Date.now()}`;
      setRouteWaypoints(newId, getWaypointsWithStartAndEnd([], newId));
      setNewRouteId(newId);
    }
  }, [editRouteId, setRouteWaypoints]);

  return newRouteId;
};
