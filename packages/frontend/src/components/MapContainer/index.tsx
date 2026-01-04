import { useRef, useEffect } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { MapContainerProps } from './types';
import { getPaddedBounds, getLineFeature, getRouteLayer } from './utils';

export const MapContainer = ({
  routeId,
  bounds,
  routeFeatures,
}: MapContainerProps) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const paddedBounds = getPaddedBounds(bounds);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      bounds: paddedBounds,
    });

    mapRef.current.on('load', () => {
      if (!mapRef.current) {
        return;
      }

      mapRef.current.addSource('route-source', {
        type: 'geojson',
        data: getLineFeature(routeFeatures),
      });
      mapRef.current.addLayer(getRouteLayer());
    });

    return () => {
      mapRef.current?.remove();
    };
    // Only update map when routeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export type { MapContainerProps };
