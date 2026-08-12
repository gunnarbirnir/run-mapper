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
  const fitToInitialBoundsRef = useRef<(() => void) | null>(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isEditingPoiCoordinates, setIsEditingPoiCoordinates] = useState(false);
  const [editPointOfInterestType, setEditPointOfInterestType] =
    useState<PointOfInterestType | null>(null);
  const [editWaypointType, setEditWaypointType] = useState<WaypointType | null>(
    null,
  );
  const [editWaypointCoordinates, setEditWaypointCoordinates] =
    useState<Coordinates | null>(null);
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  const onUpdatePoiCoordinates = useCallback((coordinates: Coordinates) => {
    onUpdatePoiCoordinatesRef.current?.(coordinates);
  }, []);
  const fitToInitialBounds = useCallback(() => {
    fitToInitialBoundsRef.current?.();
  }, [fitToInitialBoundsRef]);

  return {
    isMapLoaded,
    isEditingPoiCoordinates,
    editPointOfInterestType,
    editWaypointType,
    editWaypointCoordinates,
    isAtInitialBounds,
    setIsMapLoaded,
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
