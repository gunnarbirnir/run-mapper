import { useState, useRef, useCallback } from 'react';
import { Map } from 'mapbox-gl';

import { Coordinates, PointOfInterestType, WaypointType } from '~/types';

export const useMapState = () => {
  const mapRef = useRef<Map | null>(null);
  const isResettingBoundsRef = useRef(false);
  const fitToInitialBoundsRef = useRef<(() => void) | null>(null);
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
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);
  const [isEditingPoiCoordinates, setIsEditingPoiCoordinates] = useState(false);
  const [editPointOfInterestType, setEditPointOfInterestType] =
    useState<PointOfInterestType | null>(null);
  const [editWaypointType, setEditWaypointType] = useState<WaypointType | null>(
    null,
  );
  const [editWaypointCoordinates, setEditWaypointCoordinates] =
    useState<Coordinates | null>(null);

  const fitToInitialBounds = useCallback(() => {
    fitToInitialBoundsRef.current?.();
  }, [fitToInitialBoundsRef]);
  const onUpdatePoiCoordinates = useCallback((coordinates: Coordinates) => {
    onUpdatePoiCoordinatesRef.current?.(coordinates);
  }, []);

  return {
    isMapLoaded,
    isAtInitialBounds,
    editPointOfInterestType,
    isEditingPoiCoordinates,
    editWaypointType,
    editWaypointCoordinates,
    fitToInitialBounds,
    onUpdatePoiCoordinates,
    setIsMapLoaded,
    setIsAtInitialBounds,
    setIsEditingPoiCoordinates,
    setEditPointOfInterestType,
    setEditWaypointType,
    setEditWaypointCoordinates,
    mapRef,
    fitToInitialBoundsRef,
    isResettingBoundsRef,
    editRouteActionsRef,
    onUpdatePoiCoordinatesRef,
  };
};

export type MapState = ReturnType<typeof useMapState>;
