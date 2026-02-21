import {
  useEffect,
  useRef,
  type MutableRefObject,
  type RefObject,
} from 'react';
import type { Map, Marker } from 'mapbox-gl';

import type { Waypoint, Coordinates } from '~/types';
import { getStartWaypoint, getEndWaypoint } from '~/utils';

import { getMarkerElement, getWaypointMarkerElement } from '../utils';
import { WAYPOINT_ZOOM, FLY_TO_WAYPOINT_DURATION } from '../constants';
import { useHandlers } from './useHandlers';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  showWaypoints: boolean;
  onWaypointClick: (waypoint: string) => void;
  mapRef: RefObject<Map>;
  setActiveWaypointRef: MutableRefObject<((waypoint: Waypoint) => void) | null>;
}

export const useWaypoints = ({
  isMapLoaded,
  coordinates,
  waypoints,
  showWaypoints,
  onWaypointClick,
  mapRef,
  setActiveWaypointRef,
}: UseWaypointsProps) => {
  const waypointMarkersRef = useRef<Marker[]>([]);
  const { addMarker } = useHandlers({ mapRef });

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const waypointMarkers = [];

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
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-success-500',
          '--color-success-600',
          showWaypoints ? () => handleWaypointClick(startWaypoint) : undefined,
        ),
        [startWaypoint.coordinates.lat, startWaypoint.coordinates.lng],
      ),
    );

    const endWaypoint = getEndWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-error-500',
          '--color-error-600',
          showWaypoints ? () => handleWaypointClick(endWaypoint) : undefined,
        ),
        [endWaypoint.coordinates.lat, endWaypoint.coordinates.lng],
      ),
    );

    if (showWaypoints) {
      for (const waypoint of waypoints) {
        waypointMarkers.push(
          addMarker(
            getWaypointMarkerElement(waypoint.type, () =>
              handleWaypointClick(waypoint),
            ),
            [waypoint.coordinates.lat, waypoint.coordinates.lng],
          ),
        );
      }
    }

    waypointMarkersRef.current = waypointMarkers.filter(Boolean) as Marker[];

    return () => {
      setActiveWaypointRef.current = null;
      waypointMarkersRef.current.forEach((marker) => marker.remove());
    };
  }, [
    isMapLoaded,
    coordinates,
    waypoints,
    showWaypoints,
    addMarker,
    onWaypointClick,
    mapRef,
    setActiveWaypointRef,
  ]);
};
