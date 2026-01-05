import { useRef, useEffect, useMemo } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { RouteMapProps } from './types';
import { getPaddedBounds, getLineFeature, getRouteLayer } from './utils';

export const RouteMap = ({ bounds, coordinates }: RouteMapProps) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const paddedBounds = useMemo(() => getPaddedBounds(bounds), [bounds]);

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
        data: getLineFeature(coordinates),
      });
      mapRef.current.addLayer(getRouteLayer());
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [coordinates, paddedBounds]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};
