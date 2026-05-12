import type { Map } from 'mapbox-gl';
import { RefObject, useEffect } from 'react';

import type { PublicRoute } from '~/types';
import { getLineFeature, getRouteLayer, formatBounds } from '~/utils/map';
import { FIT_INITIAL_BOUNDS_DURATION, BOUNDS_PADDING } from '~/constants/map';

interface UseMapRouteProps {
  activeRoute: PublicRoute | undefined;
  routePanelIsOpen: boolean;
  isAnimatingPanel: boolean;
  isMapLoaded: boolean;
  mapRef: RefObject<Map>;
}

export const useDrawRoute = ({
  activeRoute,
  routePanelIsOpen,
  isAnimatingPanel,
  isMapLoaded,
  mapRef,
}: UseMapRouteProps) => {
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isAnimatingPanel) {
      return;
    }

    const map = mapRef.current;
    const coordinates =
      activeRoute?.coordinates && routePanelIsOpen
        ? activeRoute.coordinates
        : [];
    const routeLayer = getRouteLayer();
    const bounds = activeRoute?.boundingBox
      ? formatBounds(activeRoute?.boundingBox)
      : null;

    const clearRoute = () => {
      if (map.getLayer(routeLayer.id)) {
        map.removeLayer(routeLayer.id);
      }
      if (map.getSource(routeLayer.source)) {
        map.removeSource(routeLayer.source);
      }
    };

    const fitBounds = () => {
      if (bounds) {
        map.fitBounds(bounds, {
          padding: BOUNDS_PADDING,
          duration: FIT_INITIAL_BOUNDS_DURATION,
        });
      }
    };

    const drawRoute = () => {
      if (coordinates.length !== 0) {
        map.addSource(routeLayer.source, {
          type: 'geojson',
          data: getLineFeature(coordinates),
        });
        map.addLayer(routeLayer);
      }
    };

    fitBounds();
    clearRoute();
    drawRoute();
    map.on('resize', fitBounds);
    map.resize();

    return () => {
      map.off('resize', fitBounds);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isMapLoaded,
    mapRef,
    activeRoute?.id,
    routePanelIsOpen,
    isAnimatingPanel,
  ]);
};
