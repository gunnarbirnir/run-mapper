import { useRef, useEffect, useMemo } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { RouteMapProps } from './types';
import {
  getPaddedBounds,
  getLineFeature,
  getRouteLayer,
  getMarkerElement,
} from './utils';

export const RouteMap = ({ bounds, coordinates, waypoints }: RouteMapProps) => {
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

      new mapboxgl.Marker({ element: getMarkerElement('--color-success-500') })
        .setLngLat([coordinates[0][0], coordinates[0][1]])
        .addTo(mapRef.current);
      new mapboxgl.Marker({ element: getMarkerElement('--color-error-500') })
        .setLngLat([
          coordinates[coordinates.length - 1][0],
          coordinates[coordinates.length - 1][1],
        ])
        .addTo(mapRef.current);

      for (const waypoint of waypoints) {
        new mapboxgl.Marker({
          element: getMarkerElement('--color-secondary-500', 'small'),
        })
          .setLngLat([waypoint.coordinates.lat, waypoint.coordinates.lng])
          .addTo(mapRef.current);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [coordinates, waypoints, paddedBounds]);

  return (
    <>
      <div ref={mapContainerRef} className="h-full w-full" />
    </>
  );
};
