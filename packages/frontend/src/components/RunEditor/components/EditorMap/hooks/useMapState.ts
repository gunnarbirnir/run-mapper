import { useState, useRef, useCallback } from 'react';
import { Map } from 'mapbox-gl';

import {
  Coordinates,
  CoordinatesWithId,
  PointOfInterestType,
  WaypointType,
} from '~/types';

import { useEditRouteCoordinates } from './useEditRouteCoordinates';

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
  const [editRouteControlPoints, setEditRouteControlPoints] = useState<
    CoordinatesWithId[]
  >([]);
  const { editRouteCoordinates } = useEditRouteCoordinates({
    editRouteControlPoints,
  });
  const [isEditingRouteCoordinates, setIsEditingRouteCoordinates] =
    useState(false);
  const [selectedRoutePoint, setSelectedRoutePoint] = useState<string | null>(
    null,
  );
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
    editRouteControlPoints,
    editRouteCoordinates,
    isEditingRouteCoordinates,
    selectedRoutePoint,
    isEditingPoiCoordinates,
    editPointOfInterestType,
    editWaypointType,
    editWaypointCoordinates,
    isAtInitialBounds,
    setIsMapLoaded,
    setEditRouteControlPoints,
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
