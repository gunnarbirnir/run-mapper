import mapboxgl, { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect } from 'react';

export const MapContainer = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken = 'TOKEN';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-74.0242, 40.6941],
      zoom: 10.12,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      style={{ height: 500, width: 800 }}
    />
  );
};
