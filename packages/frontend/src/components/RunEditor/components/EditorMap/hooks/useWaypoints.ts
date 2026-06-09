import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject } from 'react';

import type { Coordinates, Waypoint, WaypointType } from '~/types';
import { getEndWaypoint, getStartWaypoint } from '~/utils/route';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '~/constants/map';

import { getMarkerElement, getWaypointMarkerElement } from '~/utils/map';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  coordinates: Coordinates[];
  waypoints: Waypoint[];
  activeWaypoint: string | null;
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  hasMadeChanges: boolean;
  editWaypointType: WaypointType | null;
  editWaypointCoordinates: Coordinates | null;
  onEditWaypoint: (waypointId: string) => void;
  setEditWaypointType: (type: WaypointType | null) => void;
  setEditWaypointCoordinates: (coordinates: Coordinates | null) => void;
  mapRef: RefObject<Map>;
}

export const useWaypoints = ({
  isMapLoaded,
  coordinates,
  waypoints,
  activeWaypoint,
  panelIsOpen,
  isAnimatingPanel,
  hasMadeChanges,
  editWaypointType,
  editWaypointCoordinates,
  onEditWaypoint,
  setEditWaypointType,
  setEditWaypointCoordinates,
  mapRef,
}: UseWaypointsProps) => {
  const { addMarker } = useMapHandlers({ mapRef });

  // Reset edit waypoint type when active waypoint changes
  useEffect(() => {
    setEditWaypointType(null);
    setEditWaypointCoordinates(null);
  }, [activeWaypoint, setEditWaypointType, setEditWaypointCoordinates]);

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    let waypointMarkers = [];

    const startWaypoint = getStartWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-success-500',
          '--color-success-600',
          hasMadeChanges ? undefined : () => onEditWaypoint(startWaypoint.id),
        ),
        startWaypoint.coordinates,
      ),
    );

    const endWaypoint = getEndWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement(
          '--color-error-500',
          '--color-error-600',
          hasMadeChanges ? undefined : () => onEditWaypoint(endWaypoint.id),
        ),
        endWaypoint.coordinates,
      ),
    );

    for (const waypoint of waypoints) {
      const isActive = waypoint.id === activeWaypoint;
      waypointMarkers.push(
        addMarker(
          getWaypointMarkerElement(
            isActive && editWaypointType ? editWaypointType : waypoint.type,
            hasMadeChanges ? undefined : () => onEditWaypoint(waypoint.id),
            waypoint.id === activeWaypoint,
          ),
          isActive && editWaypointCoordinates
            ? editWaypointCoordinates
            : waypoint.coordinates,
        ),
      );
    }

    // New waypoint
    if (editWaypointCoordinates && !activeWaypoint && panelIsOpen) {
      waypointMarkers.push(
        addMarker(
          getWaypointMarkerElement(
            editWaypointType || 'hydration',
            undefined,
            true,
          ),
          editWaypointCoordinates,
        ),
      );
    }

    waypointMarkers = waypointMarkers.filter(Boolean) as Marker[];

    return () => {
      waypointMarkers.forEach((marker) => marker.remove());
    };
  }, [
    isMapLoaded,
    activeWaypoint,
    coordinates,
    waypoints,
    hasMadeChanges,
    panelIsOpen,
    editWaypointType,
    editWaypointCoordinates,
    addMarker,
    onEditWaypoint,
    mapRef,
  ]);

  // Zoom into active waypoint
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isAnimatingPanel) {
      return;
    }

    const map = mapRef.current;
    const activeWaypointDetails = waypoints.find(
      (waypoint: Waypoint) => waypoint.id === activeWaypoint,
    );

    if (!activeWaypoint || !activeWaypointDetails || !panelIsOpen) {
      return;
    }

    map.flyTo({
      center: [
        activeWaypointDetails.coordinates.lng,
        activeWaypointDetails.coordinates.lat,
      ],
      zoom: WAYPOINT_ZOOM,
      duration: FLY_TO_WAYPOINT_DURATION,
    });
  }, [
    isMapLoaded,
    activeWaypoint,
    waypoints,
    panelIsOpen,
    isAnimatingPanel,
    mapRef,
  ]);
};
