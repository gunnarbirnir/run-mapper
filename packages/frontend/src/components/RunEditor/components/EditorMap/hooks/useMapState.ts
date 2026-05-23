import { useState, useRef, useCallback } from 'react';
import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Coordinates, PointOfInterestType } from '~/types';

export const useMapState = () => {
  const mapRef = useRef<Map | null>(null);
  const onUpdatePoiCoordinatesRef = useRef<
    ((coordinates: Coordinates) => void) | null
  >(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isEditingPoiCoordinates, setIsEditingPoiCoordinates] = useState<
    string | null
  >(null);
  const [editPointOfInterestType, setEditPointOfInterestType] =
    useState<PointOfInterestType | null>(null);

  const onUpdatePoiCoordinates = useCallback((coordinates: Coordinates) => {
    onUpdatePoiCoordinatesRef.current?.(coordinates);
  }, []);

  return {
    isMapLoaded,
    isEditingPoiCoordinates,
    editPointOfInterestType,
    setIsMapLoaded,
    setIsEditingPoiCoordinates,
    setEditPointOfInterestType,
    onUpdatePoiCoordinates,
    mapRef,
    onUpdatePoiCoordinatesRef,
  };
};

export type MapState = ReturnType<typeof useMapState>;
