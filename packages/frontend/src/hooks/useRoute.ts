import { useState, useCallback } from 'react';

import type { PublicRun, PublicRoute } from '~/types';

const findRoute = (run: PublicRun, routeId: string) => {
  return run.routes.find((route) => route.id === routeId) as PublicRoute;
};

export const useRoute = ({
  run,
  routeId,
}: {
  run: PublicRun;
  routeId: string;
}) => {
  const [currentRoute, setCurrentRoute] = useState<PublicRoute>(
    findRoute(run, routeId),
  );

  const handleSetCurrentRoute = useCallback(
    (updatedRouteId: string) => {
      const route = findRoute(run, updatedRouteId);
      setCurrentRoute(route);
    },
    [run],
  );

  return {
    route: currentRoute,
    setRoute: handleSetCurrentRoute,
  };
};
