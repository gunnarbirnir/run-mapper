import { useState, useCallback } from 'react';

import type { PublicRun, PublicRoute } from '~/types';
import { getRunBasePath } from '~/utils';

const findRoute = (run: PublicRun, routeId: string) => {
  return run.routes.find((route) => route.id === routeId) as PublicRoute;
};

export const useRoute = ({
  run,
  routeId,
  isFullscreen,
  isPreview,
}: {
  run: PublicRun;
  routeId: string;
  isFullscreen: boolean;
  isPreview: boolean;
}) => {
  const [currentRoute, setCurrentRoute] = useState<PublicRoute>(
    findRoute(run, routeId),
  );

  const handleSetCurrentRoute = useCallback(
    (updatedRouteId: string) => {
      const route = findRoute(run, updatedRouteId);
      const basePath = getRunBasePath(run, isPreview);

      setCurrentRoute(route);
      history.replaceState(
        null,
        '',
        `${basePath}?${isFullscreen ? 'isFullscreen=true&' : ''}routeId=${updatedRouteId}`,
      );
    },
    [run, isFullscreen, isPreview],
  );

  return {
    route: currentRoute,
    setRoute: handleSetCurrentRoute,
  };
};
