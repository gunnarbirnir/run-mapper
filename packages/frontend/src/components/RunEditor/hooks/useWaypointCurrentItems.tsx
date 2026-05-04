import { useMemo, useCallback, useState, useLayoutEffect } from 'react';

import type { PublicRoute, Waypoint } from '~/types';

import { getWaypointsWithStartAndEnd } from '../utils';
import { PanelState } from './usePanelState';

interface UseWaypointCurrentItemsProps {
  routePanelState: PanelState<PublicRoute>;
}

export const useWaypointCurrentItems = ({
  routePanelState: {
    showPanel: routePanelVisible,
    editId: routeEditId,
    currentItems: routeCurrentItems,
    setCurrentItems: setRouteCurrentItems,
  },
}: UseWaypointCurrentItemsProps): {
  currentItems: Waypoint[];
  parentPanelVisible: boolean;
  setCurrentItems: (updatedItems: Waypoint[]) => void;
} => {
  const [newRouteWaypoints, setNewRouteWaypoints] = useState<Waypoint[] | null>(
    null,
  );

  // useLayoutEffect instead of useEffect to prevent flicker
  useLayoutEffect(() => {
    const newId = `new-route-${Date.now()}`;

    if (routePanelVisible && !routeEditId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewRouteWaypoints(getWaypointsWithStartAndEnd([], newId));
    } else {
      setNewRouteWaypoints(null);
    }
  }, [routePanelVisible, routeEditId]);

  const routeItemMap = useMemo(() => {
    // TODO: Most of this can be removed when no longer working with test data
    return routeCurrentItems.reduce(
      (acc, route) => {
        const routeWaypoints = route.waypoints.map((wp) => ({
          ...wp,
          id: `${route.id}-${wp.id}`,
        }));

        acc[route.id] = getWaypointsWithStartAndEnd(routeWaypoints, route.id);
        return acc;
      },
      {} as Record<string, Waypoint[]>,
    );
  }, [routeCurrentItems]);

  const currentItems = useMemo(() => {
    return routeEditId
      ? (routeItemMap[routeEditId] ?? [])
      : (newRouteWaypoints ?? []);
  }, [routeItemMap, newRouteWaypoints, routeEditId]);

  const setCurrentItems = useCallback(
    (updatedWaypoints: Waypoint[]) => {
      if (routeEditId) {
        setRouteCurrentItems(
          routeCurrentItems.map((route) => ({
            ...route,
            waypoints:
              route.id === routeEditId ? updatedWaypoints : route.waypoints,
          })),
        );
      } else {
        setNewRouteWaypoints(updatedWaypoints);
      }
    },
    [routeEditId, routeCurrentItems, setRouteCurrentItems],
  );

  return {
    currentItems,
    parentPanelVisible: routePanelVisible,
    setCurrentItems,
  };
};
