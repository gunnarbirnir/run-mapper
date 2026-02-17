/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

import type { RunCoordinates, BaseCoordinate } from '~/types';
import { MAP_STYLES } from '../RouteMap/constants';

export interface RouteData {
  coordinates: RunCoordinates[];
  boundingBox: [BaseCoordinate, BaseCoordinate];
}

export interface MapEditorProps {
  onRouteChange?: (data: RouteData | null) => void;
  initialCoordinates?: RunCoordinates[];
}

// Fetch elevation data for coordinates using Open Elevation API
const fetchElevations = async (
  coordinates: Array<{ lat: number; lng: number }>,
): Promise<number[]> => {
  try {
    // Open Elevation API expects locations in format {latitude, longitude}
    const locations = coordinates.map((coord) => ({
      latitude: coord.lat,
      longitude: coord.lng,
    }));

    const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch elevation data');
    }

    const data = await response.json();
    return data.results.map((result: { elevation: number }) => result.elevation || 0);
  } catch (error) {
    console.error('Error fetching elevations:', error);
    // Return zeros if elevation fetch fails
    return coordinates.map(() => 0);
  }
};

export const MapEditor = ({ onRouteChange, initialCoordinates }: MapEditorProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const onRouteChangeRef = useRef(onRouteChange);
  const [isDrawing, setIsDrawing] = useState(false);

  // Keep ref updated
  useEffect(() => {
    onRouteChangeRef.current = onRouteChange;
  }, [onRouteChange]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES.standard,
      center: [0, 0],
      zoom: 2,
    });

    mapRef.current = map;

    // Initialize Draw
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        line_string: true,
        trash: true,
      },
      defaultMode: 'draw_line_string',
    });

    map.addControl(draw as any);
    drawRef.current = draw;

    // Load initial coordinates if provided
    if (initialCoordinates && initialCoordinates.length > 0) {
      const coordinates = initialCoordinates.map((coord) => [coord.lng, coord.lat] as [number, number]);
      
      const feature: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates,
        },
        properties: {},
      };

      draw.add(feature);

      // Fit map to bounds
      const bounds = coordinates.reduce(
        (bounds, coord) => {
          return bounds.extend(coord as any);
        },
        new mapboxgl.LngLatBounds(coordinates[0] as any, coordinates[0] as any),
      );

      map.fitBounds(bounds, { padding: 50 });
    }

    // Calculate bounding box from coordinates
    const calculateBoundingBox = (
      coords: Array<{ lat: number; lng: number }>,
    ): [BaseCoordinate, BaseCoordinate] => {
      if (coords.length === 0) {
        return [
          { lat: 0, lng: 0 },
          { lat: 0, lng: 0 },
        ];
      }

      let minLat = coords[0].lat;
      let maxLat = coords[0].lat;
      let minLng = coords[0].lng;
      let maxLng = coords[0].lng;

      for (const coord of coords) {
        minLat = Math.min(minLat, coord.lat);
        maxLat = Math.max(maxLat, coord.lat);
        minLng = Math.min(minLng, coord.lng);
        maxLng = Math.max(maxLng, coord.lng);
      }

      return [
        { lat: minLat, lng: minLng },
        { lat: maxLat, lng: maxLng },
      ];
    };

    // Handle draw events
    const handleDrawUpdate = async () => {
      const data = draw.getAll();
      
      if (data.features.length > 0) {
        const feature = data.features[0] as GeoJSON.Feature<GeoJSON.LineString>;
        const coordinates = feature.geometry.coordinates;

        // Convert from [lng, lat] to {lat, lng} format
        const routeCoords = coordinates.map((coord) => ({
          lat: coord[1],
          lng: coord[0],
        }));

        // Fetch elevation data
        const elevations = await fetchElevations(routeCoords);

        // Combine coordinates with elevations
        const runCoordinates: RunCoordinates[] = routeCoords.map((coord, index) => ({
          lat: coord.lat,
          lng: coord.lng,
          elevation: elevations[index],
        }));

        // Calculate bounding box
        const boundingBox = calculateBoundingBox(routeCoords);

        onRouteChangeRef.current?.({
          coordinates: runCoordinates,
          boundingBox,
        });
      } else {
        onRouteChangeRef.current?.(null);
      }
    };

    map.on('draw.create', handleDrawUpdate);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.delete', handleDrawUpdate);

    map.on('load', () => {
      setIsDrawing(true);
    });

    return () => {
      map.remove();
      drawRef.current = null;
      mapRef.current = null;
    };
  }, [initialCoordinates]);

  const clearRoute = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
      onRouteChangeRef.current?.(null);
    }
  };

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full" />
      {isDrawing && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={clearRoute}
            className="rounded bg-white px-4 py-2 text-sm font-medium shadow-md hover:bg-gray-50"
          >
            Clear Route
          </button>
        </div>
      )}
    </div>
  );
};
