import type { Map } from 'mapbox-gl';
import { RefObject, useEffect } from 'react';

import type { PublicRoute } from '~/types';
import { getLineFeature, getRouteLayer, getPaddedBounds } from '~/utils/map';
import {
  FIT_INITIAL_BOUNDS_DURATION,
  // BOUNDS_PADDING_PX,
} from '~/constants/map';

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
    const paddedBounds = activeRoute?.boundingBox
      ? getPaddedBounds(activeRoute?.boundingBox)
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
      if (paddedBounds) {
        map.fitBounds(paddedBounds, {
          // padding: BOUNDS_PADDING_PX,
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
    drawRoute();
    map.on('resize', fitBounds);
    map.resize();

    return () => {
      clearRoute();
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
