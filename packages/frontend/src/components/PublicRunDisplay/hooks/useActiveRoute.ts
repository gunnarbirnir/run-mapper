import { useState, useCallback } from 'react';

import type { PublicRun, PublicRoute } from '~/types';
import { getRunBasePath } from '~/utils';

const findRoute = (routes: PublicRoute[], routeId?: string) => {
  if (!routeId) {
    return routes.length > 0 ? routes[0] : null;
  }
  return routes.find((route) => route.id === routeId) ?? null;
};

export const useActiveRoute = ({
  run,
  initialRouteId,
  isFullscreen,
  isPreview,
}: {
  run: PublicRun;
  initialRouteId?: string;
  isFullscreen: boolean;
  isPreview: boolean;
}) => {
  const [activeRoute, setActiveRoute] = useState<PublicRoute | null>(
    findRoute(run.routes, initialRouteId),
  );

  const handleSetActiveRoute = useCallback(
    (updatedRouteId: string) => {
      const route = findRoute(run.routes, updatedRouteId);
      const basePath = getRunBasePath(run, isPreview);

      setActiveRoute(route);
      history.replaceState(
        null,
        '',
        `${basePath}?${isFullscreen ? 'isFullscreen=true&' : ''}routeId=${updatedRouteId}`,
      );
    },
    [run, isFullscreen, isPreview],
  );

  return {
    activeRoute,
    setActiveRoute: handleSetActiveRoute,
  };
};
