import type { Map, Marker, Popup } from 'mapbox-gl';
import { useEffect, useRef, type RefObject, useMemo } from 'react';

import type { Coordinates, Waypoint } from '~/types';
import { getEndWaypoint, getStartWaypoint } from '~/utils/route';
import { useMediaQuery } from '~/hooks/useMediaQuery';

import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '../constants';
import {
  getMarkerElement,
  getMarkerTooltip,
  getWaypointMarkerElement,
} from '../utils';
import { useHandlers } from './useHandlers';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  activeWaypoint: string | null;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  showWaypoints: boolean;
  onWaypointClick: (waypoint: string, openDrawer: boolean) => void;
  fitToInitialBounds: () => void;
  mapRef: RefObject<Map>;
}

const WAYPOINT_LAT_OFFSET = 0.003;

export const useWaypoints = ({
  isMapLoaded,
  activeWaypoint,
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
  const isSmallScreenRef = useRef(false);
  const { addMarker } = useHandlers({ mapRef });
  const { isSmallScreen } = useMediaQuery();

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

  // Sync ref to state
  useEffect(() => {
    isSmallScreenRef.current = isSmallScreen;
  }, [isSmallScreen]);

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const waypointMarkers = [];
    const popups: Record<string, Popup> = {};

    const startWaypoint = getStartWaypoint(coordinates);
    popups[startWaypoint.id] = getMarkerTooltip(
      startWaypoint,
      isSmallScreenRef.current,
    );
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-success-500',
          '--color-success-600',
          showWaypoints
            ? () => onWaypointClick(startWaypoint.id, !isSmallScreenRef.current)
            : undefined,
        ),
        startWaypoint.coordinates,
      ),
    );

    const endWaypoint = getEndWaypoint(coordinates);
    popups[endWaypoint.id] = getMarkerTooltip(
      endWaypoint,
      isSmallScreenRef.current,
    );
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-error-500',
          '--color-error-600',
          showWaypoints
            ? () => onWaypointClick(endWaypoint.id, !isSmallScreenRef.current)
            : undefined,
        ),
        endWaypoint.coordinates,
      ),
    );

    if (showWaypoints) {
      for (const waypoint of waypoints) {
        popups[waypoint.id] = getMarkerTooltip(
          waypoint,
          isSmallScreenRef.current,
        );
        waypointMarkers.push(
          addMarker(
            getWaypointMarkerElement(waypoint.type, () =>
              onWaypointClick(waypoint.id, !isSmallScreenRef.current),
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
    isSmallScreenRef,
  ]);

  // React to active waypoint change
  useEffect(() => {
    if (activeWaypointRef.current) {
      popupsRef.current[activeWaypointRef.current]?.remove();
    }

    if (!activeWaypoint) {
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
        activeWaypointDetails.coordinates.lng +
          (isSmallScreenRef.current ? 0 : WAYPOINT_LAT_OFFSET),
        activeWaypointDetails.coordinates.lat,
      ],
      zoom: WAYPOINT_ZOOM,
      duration: FLY_TO_WAYPOINT_DURATION,
    });
  }, [
    activeWaypoint,
    mapRef,
    extendedWaypoints,
    fitToInitialBounds,
    isSmallScreenRef,
  ]);
};
