import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject } from 'react';

import type { Coordinates, Waypoint } from '~/types';
import { getEndWaypoint, getStartWaypoint } from '~/utils/route';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '~/constants/map';

import { getMarkerElement, getWaypointMarkerElement } from '~/utils/map';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  activeWaypoint: string | null;
  routePanelIsOpen: boolean;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  mapRef: RefObject<Map>;
}

export const useWaypoints = ({
  isMapLoaded,
  coordinates,
  waypoints,
  activeWaypoint,
  routePanelIsOpen,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
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
          getWaypointMarkerElement(
            waypoint.type,
            undefined,
            waypoint.id === activeWaypoint,
          ),
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
    activeWaypoint,
    routePanelIsOpen,
    addMarker,
    mapRef,
  ]);

  // React to active waypoint change
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || waypointPanelIsAnimating) {
      return;
    }

    const map = mapRef.current;
    const activeWaypointDetails = waypoints.find(
      (waypoint: Waypoint) => waypoint.id === activeWaypoint,
    );

    if (!activeWaypoint || !activeWaypointDetails) {
      return;
    }

    if (waypointPanelIsOpen) {
      map.flyTo({
        center: [
          activeWaypointDetails.coordinates.lng,
          activeWaypointDetails.coordinates.lat,
        ],
        zoom: WAYPOINT_ZOOM,
        duration: FLY_TO_WAYPOINT_DURATION,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeWaypoint,
    waypointPanelIsAnimating,
    isMapLoaded,
    waypointPanelIsOpen,
    mapRef,
  ]);
};
