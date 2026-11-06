import type { Map, Marker, Popup } from 'mapbox-gl';
import { useEffect, useRef, type RefObject } from 'react';

import type { Coordinates, Waypoint } from '~/types';
import {
  FLY_TO_WAYPOINT_POI_DURATION,
  WAYPOINT_POI_ZOOM,
} from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { getMarkerElement, getWaypointMarkerElement } from '~/utils/map';

import { getWaypointTooltip, getTooltipLatOffset } from '../utils';

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
  const popupsRef = useRef<Record<string, Popup>>({});
  const { addMarker } = useMapHandlers({ mapRef });

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const waypointMarkers: (Marker | undefined)[] = [];
    const popups: Record<string, Popup> = {};

    const startWaypoint = waypoints.find(
      (waypoint) => waypoint.type === 'start',
    );
    if (startWaypoint) {
      popups[startWaypoint.id] = getWaypointTooltip(startWaypoint);
      waypointMarkers.push(
        addMarker(
          getMarkerElement({
            color: '--color-success-500',
            hoverColor: '--color-success-600',
            onClick: showWaypoints
              ? () => onWaypointClick(startWaypoint.id)
              : undefined,
          }),
          startWaypoint.coordinates,
        ),
      );
    }

    const endWaypoint = waypoints.find((waypoint) => waypoint.type === 'end');
    if (endWaypoint) {
      popups[endWaypoint.id] = getWaypointTooltip(endWaypoint);
      waypointMarkers.push(
        addMarker(
          getMarkerElement({
            color: '--color-error-500',
            hoverColor: '--color-error-600',
            onClick: showWaypoints
              ? () => onWaypointClick(endWaypoint.id)
              : undefined,
          }),
          endWaypoint.coordinates,
        ),
      );
    }

    if (showWaypoints) {
      for (const waypoint of waypoints.filter(
        (waypoint) => waypoint.type !== 'start' && waypoint.type !== 'end',
      )) {
        popups[waypoint.id] = getWaypointTooltip(waypoint);
        waypointMarkers.push(
          addMarker(
            getWaypointMarkerElement({
              type: waypoint.type,
              onClick: () => onWaypointClick(waypoint.id),
            }),
            waypoint.coordinates,
          ),
        );
      }
    }

    popupsRef.current = popups;

    return () => {
      waypointMarkers.forEach((marker) => marker?.remove());
      Object.values(popupsRef.current).forEach((popup) => popup.remove());
      activeWaypointRef.current = null;
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

    const activeWaypointDetails = waypoints.find(
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
      zoom: WAYPOINT_POI_ZOOM,
      duration: FLY_TO_WAYPOINT_POI_DURATION,
    });
  }, [
    activeWaypoint,
    activePointOfInterest,
    waypoints,
    mapRef,
    fitToInitialBounds,
  ]);
};
