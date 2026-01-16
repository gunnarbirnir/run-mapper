import { useRef, useEffect, useMemo } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Coordinates } from '~/types';

import type { RouteMapProps } from './types';
import {
  getPaddedBounds,
  getLineFeature,
  getRouteLayer,
  getMarkerElement,
} from './utils';

export const RouteMap = ({
  bounds,
  coordinates,
  waypoints,
  setActiveIndexRef,
}: RouteMapProps) => {
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

      const addMarker = (element: HTMLElement, markerCoords: Coordinates) => {
        if (mapRef.current) {
          return new mapboxgl.Marker({ element })
            .setLngLat([markerCoords[0], markerCoords[1]])
            .addTo(mapRef.current);
        }
      };

      const activeMarkerElement = getMarkerElement('--color-black', 'small');
      const activeMarker = addMarker(activeMarkerElement, [
        coordinates[0][0],
        coordinates[0][1],
      ]);
      activeMarkerElement.style.display = 'none';

      addMarker(getMarkerElement('--color-success-500'), [
        coordinates[0][0],
        coordinates[0][1],
      ]);
      addMarker(getMarkerElement('--color-error-500'), [
        coordinates[coordinates.length - 1][0],
        coordinates[coordinates.length - 1][1],
      ]);

      for (const waypoint of waypoints) {
        addMarker(getMarkerElement('--color-secondary-500', 'medium'), [
          waypoint.coordinates.lat,
          waypoint.coordinates.lng,
        ]);
      }

      setActiveIndexRef.current = (updatedIndex: number | null) => {
        if (updatedIndex !== null) {
          activeMarkerElement.style.display = 'block';
          activeMarker?.setLngLat([
            coordinates[updatedIndex][0],
            coordinates[updatedIndex][1],
          ]);
        } else {
          activeMarkerElement.style.display = 'none';
        }
      };
    });

    return () => {
      mapRef.current?.remove();
      setActiveIndexRef.current = null;
    };
  }, [coordinates, waypoints, paddedBounds, setActiveIndexRef]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};
