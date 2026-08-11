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
  routeCoordinates: RouteCoordinates[];
  routeDistance: number;
  waypoints: Waypoint[];
  activeWaypoint: string | null;
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  hasMadeChanges: boolean;
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
  routeDistance: number,
): RouteCoordinates | null => {
  if (waypoint.type === 'start') {
    return getCoordinatesFromPosition(0, coordinates);
  }
  if (waypoint.type === 'end') {
    return getCoordinatesFromPosition(routeDistance, coordinates);
  }
  return getCoordinatesFromPosition(waypoint.position, coordinates);
};

export const useWaypoints = ({
  isMapLoaded,
  routeCoordinates,
  routeDistance,
  waypoints,
  activeWaypoint,
  panelIsOpen,
  isAnimatingPanel,
  hasMadeChanges,
  editWaypointType,
  editWaypointCoordinates,
  isEditingRouteCoordinates,
  onEditWaypoint,
  setEditWaypointType,
  setEditWaypointCoordinates,
  mapRef,
}: UseWaypointsProps) => {
  const { addMarker } = useMapHandlers({ mapRef });
  const panelIsOpenRef = useRef(panelIsOpen);

  // Reset edit waypoint type when active waypoint changes
  useEffect(() => {
    setEditWaypointType(null);
    setEditWaypointCoordinates(null);
  }, [activeWaypoint, setEditWaypointType, setEditWaypointCoordinates]);

  // Reset edit waypoint type when panel closes
  useEffect(() => {
    if (!panelIsOpen) {
      setEditWaypointType(null);
      setEditWaypointCoordinates(null);
    }
  }, [panelIsOpen, setEditWaypointType, setEditWaypointCoordinates]);

  // Draw waypoints
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isEditingRouteCoordinates) {
      return;
    }

    let waypointMarkers = [];
    const isClickable = !hasMadeChanges;

    for (const waypoint of waypoints) {
      const isStart = waypoint.type === 'start';
      const isEnd = waypoint.type === 'end';
      const isActive = waypoint.id === activeWaypoint;
      const positionCoordinates = getPositionCoordinates(
        waypoint,
        routeCoordinates,
        routeDistance,
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
    if (editWaypointCoordinates && !activeWaypoint && panelIsOpen) {
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
    routeCoordinates,
    routeDistance,
    waypoints,
    hasMadeChanges,
    panelIsOpen,
    editWaypointType,
    editWaypointCoordinates,
    isEditingRouteCoordinates,
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

    const positionCoordinates = getPositionCoordinates(
      activeWaypointDetails,
      routeCoordinates,
      routeDistance,
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
    routeCoordinates,
    routeDistance,
    waypoints,
    panelIsOpen,
    isAnimatingPanel,
    mapRef,
  ]);

  // Move to edit coordinates
  useEffect(() => {
    const panelJustOpened = !panelIsOpenRef.current && panelIsOpen;
    panelIsOpenRef.current = panelIsOpen;

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
    panelIsOpen,
    panelIsOpenRef,
  ]);
};
