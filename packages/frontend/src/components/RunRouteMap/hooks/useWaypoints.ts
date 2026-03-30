import type { Map, Marker, Popup } from 'mapbox-gl';
import { useEffect, useRef, type RefObject, useMemo } from 'react';

import type { Coordinates, Waypoint } from '~/types';
import { getEndWaypoint, getStartWaypoint } from '~/utils/route';

import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '../constants';
import {
  getMarkerElement,
  getWaypointTooltip,
  getWaypointMarkerElement,
  getTooltipLatOffset,
} from '../utils';
import { useHandlers } from './useHandlers';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  activeWaypoint: string | null;
  activePointOfInterest: string | null;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  showWaypoints: boolean;
  onWaypointClick: (waypoint: string) => void;
  fitToInitialBounds: () => void;
  mapRef: RefObject<Map>;
}

export const useWaypoints = ({
  isMapLoaded,
  activeWaypoint,
  activePointOfInterest,
  coordinates,
  waypoints,
  showWaypoints,
  onWaypointClick,
  fitToInitialBounds,
  mapRef,
}: UseWaypointsProps) => {
  const activeWaypointRef = useRef<string | null>(null);
  const waypointMarkersRef = useRef<Marker[]>([]);
  const popupsRef = useRef<Record<string, Popup>>({});
  const { addMarker } = useHandlers({ mapRef });

  const extendedWaypoints = useMemo(
    () =>
      coordinates.length > 0
        ? [
            getStartWaypoint(coordinates),
            ...waypoints,
            getEndWaypoint(coordinates),
          ]
        : [],
    [coordinates, waypoints],
  );

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const waypointMarkers = [];
    const popups: Record<string, Popup> = {};

    const startWaypoint = getStartWaypoint(coordinates);
    popups[startWaypoint.id] = getWaypointTooltip(startWaypoint);
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-success-500',
          '--color-success-600',
          showWaypoints ? () => onWaypointClick(startWaypoint.id) : undefined,
        ),
        startWaypoint.coordinates,
      ),
    );

    const endWaypoint = getEndWaypoint(coordinates);
    popups[endWaypoint.id] = getWaypointTooltip(endWaypoint);
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-error-500',
          '--color-error-600',
          showWaypoints ? () => onWaypointClick(endWaypoint.id) : undefined,
        ),
        endWaypoint.coordinates,
      ),
    );

    if (showWaypoints) {
      for (const waypoint of waypoints) {
        popups[waypoint.id] = getWaypointTooltip(waypoint);
        waypointMarkers.push(
          addMarker(
            getWaypointMarkerElement(waypoint.type, () =>
              onWaypointClick(waypoint.id),
            ),
            waypoint.coordinates,
          ),
        );
      }
    }

    popupsRef.current = popups;
    waypointMarkersRef.current = waypointMarkers.filter(Boolean) as Marker[];

    return () => {
      waypointMarkersRef.current.forEach((marker) => marker.remove());
      Object.values(popupsRef.current).forEach((popup) => popup.remove());
      activeWaypointRef.current = null;
      waypointMarkersRef.current = [];
      popupsRef.current = {};
    };
  }, [
    isMapLoaded,
    coordinates,
    waypoints,
    showWaypoints,
    addMarker,
    onWaypointClick,
    fitToInitialBounds,
    mapRef,
  ]);

  // React to active waypoint change
  useEffect(() => {
    if (activeWaypoint === activeWaypointRef.current) {
      return;
    }

    if (activeWaypointRef.current) {
      popupsRef.current[activeWaypointRef.current]?.remove();
    }

    if (!activeWaypoint && !activePointOfInterest) {
      fitToInitialBounds();
    }

    activeWaypointRef.current = activeWaypoint;

    const activeWaypointDetails = extendedWaypoints.find(
      (waypoint: Waypoint) => waypoint.id === activeWaypoint,
    );

    if (!activeWaypoint || !activeWaypointDetails) {
      return;
    }

    const popup = popupsRef.current[activeWaypoint];
    if (popup && mapRef.current) {
      popup
        .setLngLat([
          activeWaypointDetails.coordinates.lng,
          activeWaypointDetails.coordinates.lat,
        ])
        .addTo(mapRef.current);
    }

    mapRef.current?.flyTo({
      center: [
        activeWaypointDetails.coordinates.lng,
        activeWaypointDetails.coordinates.lat +
          getTooltipLatOffset(activeWaypointDetails),
      ],
      zoom: WAYPOINT_ZOOM,
      duration: FLY_TO_WAYPOINT_DURATION,
    });
  }, [
    activeWaypoint,
    activePointOfInterest,
    mapRef,
    extendedWaypoints,
    fitToInitialBounds,
  ]);
};
