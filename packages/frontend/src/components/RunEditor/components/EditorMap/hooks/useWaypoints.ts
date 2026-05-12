import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject } from 'react';

import type { Coordinates, Waypoint } from '~/types';
import { getEndWaypoint, getStartWaypoint } from '~/utils/route';
import { useMapHandlers } from '~/hooks/useMapHandlers';

import { getMarkerElement, getWaypointMarkerElement } from '~/utils/map';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  routePanelIsOpen: boolean;
  mapRef: RefObject<Map>;
}

export const useWaypoints = ({
  isMapLoaded,
  coordinates,
  waypoints,
  routePanelIsOpen,
  mapRef,
}: UseWaypointsProps) => {
  const { addMarker } = useMapHandlers({ mapRef });

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !routePanelIsOpen) {
      return;
    }

    let waypointMarkers = [];

    const startWaypoint = getStartWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement('--color-success-500', '--color-success-600'),
        startWaypoint.coordinates,
      ),
    );

    const endWaypoint = getEndWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement('--color-error-500', '--color-error-600'),
        endWaypoint.coordinates,
      ),
    );

    for (const waypoint of waypoints) {
      waypointMarkers.push(
        addMarker(
          getWaypointMarkerElement(waypoint.type),
          waypoint.coordinates,
        ),
      );
    }

    waypointMarkers = waypointMarkers.filter(Boolean) as Marker[];

    return () => {
      waypointMarkers.forEach((marker) => marker.remove());
    };
  }, [
    isMapLoaded,
    coordinates,
    waypoints,
    routePanelIsOpen,
    addMarker,
    mapRef,
  ]);
};
