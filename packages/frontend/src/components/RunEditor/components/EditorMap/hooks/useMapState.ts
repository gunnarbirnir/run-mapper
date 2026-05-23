import { useState, useRef } from 'react';
import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const useMapState = () => {
  const mapRef = useRef<Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isEditingPoiCoordinates, setIsEditingPoiCoordinates] = useState<
    string | null
  >(null);

  return {
    isMapLoaded,
    isEditingPoiCoordinates,
    setIsMapLoaded,
    setIsEditingPoiCoordinates,
    mapRef,
  };
};

export type MapState = ReturnType<typeof useMapState>;
