import { useState, useRef, useCallback } from 'react';
import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Coordinates, PointOfInterestType, WaypointType } from '~/types';

export const useMapState = () => {
  const mapRef = useRef<Map | null>(null);
  const onUpdatePoiCoordinatesRef = useRef<
    ((coordinates: Coordinates) => void) | null
  >(null);
  const editRouteActionsRef = useRef<{
    onSave: () => void;
    onCancel: () => void;
  }>({
    onSave: () => {},
    onCancel: () => {},
  });

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [editRouteCoordinates, setEditRouteCoordinates] = useState<
    Coordinates[]
  >([]);
  const [isEditingRouteCoordinates, setIsEditingRouteCoordinates] =
    useState(false);
  const [isEditingPoiCoordinates, setIsEditingPoiCoordinates] = useState(false);
  const [editPointOfInterestType, setEditPointOfInterestType] =
    useState<PointOfInterestType | null>(null);
  const [editWaypointType, setEditWaypointType] = useState<WaypointType | null>(
    null,
  );
  const [editWaypointCoordinates, setEditWaypointCoordinates] =
    useState<Coordinates | null>(null);

  const onUpdatePoiCoordinates = useCallback((coordinates: Coordinates) => {
    onUpdatePoiCoordinatesRef.current?.(coordinates);
  }, []);

  return {
    isMapLoaded,
    editRouteCoordinates,
    isEditingRouteCoordinates,
    isEditingPoiCoordinates,
    editPointOfInterestType,
    editWaypointType,
    editWaypointCoordinates,
    setIsMapLoaded,
    setEditRouteCoordinates,
    setIsEditingRouteCoordinates,
    setIsEditingPoiCoordinates,
    setEditPointOfInterestType,
    setEditWaypointType,
    setEditWaypointCoordinates,
    onUpdatePoiCoordinates,
    mapRef,
    onUpdatePoiCoordinatesRef,
    editRouteActionsRef,
  };
};

export type MapState = ReturnType<typeof useMapState>;
