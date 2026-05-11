import { useState, useRef } from 'react';
import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const useMapState = () => {
  const mapRef = useRef<Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  return { isMapLoaded, setIsMapLoaded, mapRef };
};

export type MapState = ReturnType<typeof useMapState>;
