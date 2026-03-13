import { useState, useCallback } from 'react';

import type { PublicRun, PublicRoute } from '~/types';

const findRoute = (run: PublicRun, routeId: string) => {
  return run.routes.find((route) => route.id === routeId) as PublicRoute;
};

export const useRoute = ({
  run,
  routeId,
  isFullscreen,
}: {
  run: PublicRun;
  routeId: string;
  isFullscreen: boolean;
}) => {
  const [currentRoute, setCurrentRoute] = useState<PublicRoute>(
    findRoute(run, routeId),
  );

  const handleSetCurrentRoute = useCallback(
    (updatedRouteId: string) => {
      const route = findRoute(run, updatedRouteId);
      setCurrentRoute(route);
      history.replaceState(
        null,
        '',
        `/run/${run.publicSlug}?${isFullscreen ? 'isFullscreen=true&' : ''}routeId=${updatedRouteId}`,
      );
    },
    [run, isFullscreen],
  );

  return {
    route: currentRoute,
    setRoute: handleSetCurrentRoute,
  };
};
