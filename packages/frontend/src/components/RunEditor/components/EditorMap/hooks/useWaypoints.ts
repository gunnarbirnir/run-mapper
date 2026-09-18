import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject, useRef } from 'react';

import type {
  Coordinates,
  Waypoint,
  WaypointType,
  RouteCoordinates,
} from '~/types';
import { getCoordinatesFromPosition } from '~/utils/route';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '~/constants/map';

import { getMarkerElement, getWaypointMarkerElement } from '~/utils/map';

interface UseWaypointsProps {
  isMapLoaded: boolean;
  activeRouteCoordinates: RouteCoordinates[];
  activeRouteDistance: number;
  currentWaypoints: Waypoint[];
  activeWaypoint: string | null;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  hasMadeWaypointChanges: boolean;
  editWaypointType: WaypointType | null;
  editWaypointCoordinates: Coordinates | null;
  isEditingRouteCoordinates: boolean;
  onEditWaypoint: (waypointId: string) => void;
  setEditWaypointType: (type: WaypointType | null) => void;
  setEditWaypointCoordinates: (coordinates: Coordinates | null) => void;
  mapRef: RefObject<Map>;
}

const getPositionCoordinates = (
  waypoint: Waypoint,
  coordinates: RouteCoordinates[],
  activeRouteDistance: number,
): RouteCoordinates | null => {
  if (waypoint.type === 'start') {
    return getCoordinatesFromPosition(0, coordinates);
  }
  if (waypoint.type === 'end') {
    return getCoordinatesFromPosition(activeRouteDistance, coordinates);
  }
  return getCoordinatesFromPosition(waypoint.position, coordinates);
};

export const useWaypoints = ({
  isMapLoaded,
  activeRouteCoordinates,
  activeRouteDistance,
  currentWaypoints,
  activeWaypoint,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  hasMadeWaypointChanges,
  editWaypointType,
  editWaypointCoordinates,
  isEditingRouteCoordinates,
  onEditWaypoint,
  setEditWaypointType,
  setEditWaypointCoordinates,
  mapRef,
}: UseWaypointsProps) => {
  const { addMarker } = useMapHandlers({ mapRef });
  const panelIsOpenRef = useRef(waypointPanelIsOpen);

  // Reset edit waypoint type when active waypoint changes
  useEffect(() => {
    setEditWaypointType(null);
    setEditWaypointCoordinates(null);
  }, [activeWaypoint, setEditWaypointType, setEditWaypointCoordinates]);

  // Reset edit waypoint type when panel closes
  useEffect(() => {
    if (!waypointPanelIsOpen) {
      setEditWaypointType(null);
      setEditWaypointCoordinates(null);
    }
  }, [waypointPanelIsOpen, setEditWaypointType, setEditWaypointCoordinates]);

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isEditingRouteCoordinates) {
      return;
    }

    let waypointMarkers = [];
    const isClickable = !hasMadeWaypointChanges;

    for (const waypoint of currentWaypoints) {
      const isStart = waypoint.type === 'start';
      const isEnd = waypoint.type === 'end';
      const isActive = waypoint.id === activeWaypoint;
      const positionCoordinates = getPositionCoordinates(
        waypoint,
        activeRouteCoordinates,
        activeRouteDistance,
      );

      if (!positionCoordinates) {
        continue;
      }

      if (isStart) {
        waypointMarkers.push(
          addMarker(
            getMarkerElement({
              color: '--color-success-500',
              hoverColor: '--color-success-600',
              onClick: isClickable
                ? () => onEditWaypoint(waypoint.id)
                : undefined,
              isFocused: waypoint.id === activeWaypoint,
            }),
            positionCoordinates,
          ),
        );
      } else if (isEnd) {
        waypointMarkers.push(
          addMarker(
            getMarkerElement({
              color: '--color-error-500',
              hoverColor: '--color-error-600',
              onClick: isClickable
                ? () => onEditWaypoint(waypoint.id)
                : undefined,
              isFocused: waypoint.id === activeWaypoint,
            }),
            positionCoordinates,
          ),
        );
      } else {
        waypointMarkers.push(
          addMarker(
            getWaypointMarkerElement({
              type:
                isActive && editWaypointType ? editWaypointType : waypoint.type,
              onClick: isClickable
                ? () => onEditWaypoint(waypoint.id)
                : undefined,
              isFocused: waypoint.id === activeWaypoint,
            }),
            isActive && editWaypointCoordinates
              ? editWaypointCoordinates
              : waypoint.coordinates,
          ),
        );
      }
    }

    // New waypoint
    if (editWaypointCoordinates && !activeWaypoint && waypointPanelIsOpen) {
      waypointMarkers.push(
        addMarker(
          getWaypointMarkerElement({
            type: editWaypointType || 'energy',
            isFocused: true,
          }),
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
    activeRouteCoordinates,
    activeRouteDistance,
    currentWaypoints,
    hasMadeWaypointChanges,
    waypointPanelIsOpen,
    editWaypointType,
    editWaypointCoordinates,
    isEditingRouteCoordinates,
    addMarker,
    onEditWaypoint,
    mapRef,
  ]);

  // Zoom into active waypoint
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || waypointPanelIsAnimating) {
      return;
    }

    const map = mapRef.current;
    const activeWaypointDetails = currentWaypoints.find(
      (waypoint: Waypoint) => waypoint.id === activeWaypoint,
    );

    if (!activeWaypoint || !activeWaypointDetails || !waypointPanelIsOpen) {
      return;
    }

    const positionCoordinates = getPositionCoordinates(
      activeWaypointDetails,
      activeRouteCoordinates,
      activeRouteDistance,
    );

    if (positionCoordinates) {
      map.flyTo({
        center: [positionCoordinates.lng, positionCoordinates.lat],
        zoom: WAYPOINT_ZOOM,
        duration: FLY_TO_WAYPOINT_DURATION,
      });
    }
  }, [
    isMapLoaded,
    activeWaypoint,
    activeRouteCoordinates,
    activeRouteDistance,
    currentWaypoints,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
    mapRef,
  ]);

  // Move to edit coordinates
  useEffect(() => {
    const panelJustOpened = !panelIsOpenRef.current && waypointPanelIsOpen;
    panelIsOpenRef.current = waypointPanelIsOpen;

    if (!isMapLoaded || !mapRef.current || !editWaypointCoordinates) {
      return;
    }

    if (panelJustOpened) {
      mapRef.current.flyTo({
        center: [editWaypointCoordinates.lng, editWaypointCoordinates.lat],
        zoom: WAYPOINT_ZOOM,
        duration: FLY_TO_WAYPOINT_DURATION,
      });
    } else {
      mapRef.current.jumpTo({
        center: [editWaypointCoordinates.lng, editWaypointCoordinates.lat],
        zoom: WAYPOINT_ZOOM,
      });
    }
  }, [
    isMapLoaded,
    mapRef,
    editWaypointCoordinates,
    waypointPanelIsOpen,
    panelIsOpenRef,
  ]);
};
