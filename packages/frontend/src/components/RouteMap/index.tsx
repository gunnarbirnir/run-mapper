import { useRef, useEffect, useMemo } from 'react';
import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { Coordinates, Waypoint } from '~/types';
import { getStartWaypoint, getEndWaypoint } from '~/utils';

import type { RouteMapProps } from './types';
import {
  getPaddedBounds,
  getLineFeature,
  getRouteLayer,
  getMarkerElement,
  getActiveMarkerElement,
  getWaypointMarkerElement,
} from './utils';
import { MAP_STYLES } from './constants';
import { useMapState } from './useMapState';

const FIT_INITIAL_BOUNDS_DURATION = 200;
const WAYPOINT_ZOOM = 12;
const FLY_TO_WAYPOINT_DURATION = 100;

export const RouteMap = ({
  bounds,
  coordinates,
  waypoints,
  style,
  hideActiveMarker = false,
  showWaypoints = true,
  setActiveIndexRef,
  fitInitialBoundsRef,
  setActiveWaypointRef,
  setIsAtInitialBounds,
  onWaypointClick,
}: RouteMapProps) => {
  const mapRef = useRef<Map | null>(null);
  const hasClickedFitInitialBoundsRef = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const hideActiveMarkerRef = useRef(hideActiveMarker);
  const paddedBounds = useMemo(() => getPaddedBounds(bounds), [bounds]);

  useEffect(() => {
    hideActiveMarkerRef.current = hideActiveMarker;
  }, [hideActiveMarker]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      bounds: paddedBounds,
      style: MAP_STYLES[style],
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

      const activeMarkerElement = getActiveMarkerElement();
      const activeMarker = addMarker(activeMarkerElement, [
        coordinates[0][0],
        coordinates[0][1],
      ]);
      activeMarkerElement.style.display = 'none';

      const handleWaypointClick = (waypoint: Waypoint) => {
        onWaypointClick(waypoint.id);
        mapRef.current?.flyTo({
          center: [waypoint.coordinates.lat, waypoint.coordinates.lng],
          zoom: WAYPOINT_ZOOM,
          duration: FLY_TO_WAYPOINT_DURATION,
        });
      };
      setActiveWaypointRef.current = handleWaypointClick;

      const startWaypoint = getStartWaypoint(coordinates);
      addMarker(
        getMarkerElement(
          '--color-success-500',
          '--color-success-600',
          showWaypoints ? () => handleWaypointClick(startWaypoint) : undefined,
        ),
        [startWaypoint.coordinates.lat, startWaypoint.coordinates.lng],
      );

      const endWaypoint = getEndWaypoint(coordinates);
      addMarker(
        getMarkerElement(
          '--color-error-500',
          '--color-error-600',
          showWaypoints ? () => handleWaypointClick(endWaypoint) : undefined,
        ),
        [endWaypoint.coordinates.lat, endWaypoint.coordinates.lng],
      );

      if (showWaypoints) {
        for (const waypoint of waypoints) {
          addMarker(
            getWaypointMarkerElement(waypoint.type, () =>
              handleWaypointClick(waypoint),
            ),
            [waypoint.coordinates.lat, waypoint.coordinates.lng],
          );
        }
      }

      setActiveIndexRef.current = (updatedIndex: number | null) => {
        if (updatedIndex !== null && !hideActiveMarkerRef.current) {
          activeMarkerElement.style.display = 'block';
          activeMarker?.setLngLat([
            coordinates[updatedIndex][0],
            coordinates[updatedIndex][1],
          ]);
        } else {
          activeMarkerElement.style.display = 'none';
        }
      };

      // Initially at initial bounds
      setIsAtInitialBounds(true);
    });

    mapRef.current.on('moveend', () => {
      if (hasClickedFitInitialBoundsRef.current) {
        hasClickedFitInitialBoundsRef.current = false;
        setIsAtInitialBounds(true);
      } else {
        setIsAtInitialBounds(false);
      }
    });

    fitInitialBoundsRef.current = () => {
      mapRef.current?.fitBounds(paddedBounds, {
        duration: FIT_INITIAL_BOUNDS_DURATION,
      });
      hasClickedFitInitialBoundsRef.current = true;
    };

    return () => {
      mapRef.current?.remove();
      setActiveIndexRef.current = null;
      fitInitialBoundsRef.current = null;
      setActiveWaypointRef.current = null;
    };
  }, [
    coordinates,
    waypoints,
    style,
    paddedBounds,
    showWaypoints,
    setActiveIndexRef,
    fitInitialBoundsRef,
    setActiveWaypointRef,
    setIsAtInitialBounds,
    onWaypointClick,
  ]);

  return <div ref={mapContainerRef} className="h-full w-full" />;
};

export { useMapState };
