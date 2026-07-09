import { useState, useRef, useCallback } from 'react';
import { Map } from 'mapbox-gl';

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
  const isResettingBoundsRef = useRef(false);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [editRouteCoordinates, setEditRouteCoordinates] = useState<
    Coordinates[]
  >([]);
  const [isEditingRouteCoordinates, setIsEditingRouteCoordinates] =
    useState(false);
  const [selectedRoutePoint, setSelectedRoutePoint] =
    // Index of the selected route point
    // TODO: Use id instead
    useState<number | null>(null);
  const [isEditingPoiCoordinates, setIsEditingPoiCoordinates] = useState(false);
  const [editPointOfInterestType, setEditPointOfInterestType] =
    useState<PointOfInterestType | null>(null);
  const [editWaypointType, setEditWaypointType] = useState<WaypointType | null>(
    null,
  );
  const [editWaypointCoordinates, setEditWaypointCoordinates] =
    useState<Coordinates | null>(null);
  const fitToInitialBoundsRef = useRef<(() => void) | null>(null);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const onUpdatePoiCoordinates = useCallback((coordinates: Coordinates) => {
    onUpdatePoiCoordinatesRef.current?.(coordinates);
  }, []);

  const fitToInitialBounds = useCallback(() => {
    fitToInitialBoundsRef.current?.();
  }, [fitToInitialBoundsRef]);

  return {
    isMapLoaded,
    editRouteCoordinates,
    isEditingRouteCoordinates,
    selectedRoutePoint,
    isEditingPoiCoordinates,
    editPointOfInterestType,
    editWaypointType,
    editWaypointCoordinates,
    isAtInitialBounds,
    setIsMapLoaded,
    setEditRouteCoordinates,
    setIsEditingRouteCoordinates,
    setSelectedRoutePoint,
    setIsEditingPoiCoordinates,
    setEditPointOfInterestType,
    setEditWaypointType,
    setEditWaypointCoordinates,
    setIsAtInitialBounds,
    onUpdatePoiCoordinates,
    fitToInitialBounds,
    mapRef,
    onUpdatePoiCoordinatesRef,
    editRouteActionsRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
  };
};

export type MapState = ReturnType<typeof useMapState>;
