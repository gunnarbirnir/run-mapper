import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject, useRef } from 'react';

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
  isEditingRouteCoordinates: string | null;
  isEditingPoiCoordinates: string | null;
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
  isEditingRouteCoordinates,
  isEditingPoiCoordinates,
  onEditWaypoint,
  setEditWaypointType,
  setEditWaypointCoordinates,
  mapRef,
}: UseWaypointsProps) => {
  const { addMarker } = useMapHandlers({ mapRef });
  const panelIsOpenRef = useRef(panelIsOpen);
  const isEditingInMap = Boolean(
    isEditingRouteCoordinates || isEditingPoiCoordinates,
  );

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
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    let waypointMarkers = [];
    const isClickable = !hasMadeChanges && !isEditingInMap;

    const startWaypoint = getStartWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement({
          color: '--color-success-500',
          hoverColor: '--color-success-600',
          onClick: isClickable
            ? () => onEditWaypoint(startWaypoint.id)
            : undefined,
          isEditingInMap,
        }),
        startWaypoint.coordinates,
      ),
    );

    const endWaypoint = getEndWaypoint(coordinates);
    waypointMarkers.push(
      addMarker(
        getMarkerElement({
          color: '--color-error-500',
          hoverColor: '--color-error-600',
          onClick: isClickable
            ? () => onEditWaypoint(endWaypoint.id)
            : undefined,
          isEditingInMap,
        }),
        endWaypoint.coordinates,
      ),
    );

    for (const waypoint of waypoints) {
      const isActive = waypoint.id === activeWaypoint;
      waypointMarkers.push(
        addMarker(
          getWaypointMarkerElement({
            type:
              isActive && editWaypointType ? editWaypointType : waypoint.type,
            onClick: isClickable
              ? () => onEditWaypoint(waypoint.id)
              : undefined,
            isFocused: waypoint.id === activeWaypoint,
            isEditingInMap,
          }),
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
          getWaypointMarkerElement({
            type: editWaypointType || 'hydration',
            isFocused: true,
            isEditingInMap,
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
    coordinates,
    waypoints,
    hasMadeChanges,
    panelIsOpen,
    editWaypointType,
    editWaypointCoordinates,
    isEditingInMap,
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
