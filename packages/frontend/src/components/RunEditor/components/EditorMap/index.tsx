import { useRef, useState } from 'react';
import { Map } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { RouteStats } from './components/RouteStats';
import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { useLoadMap } from './hooks/useLoadMap';

export const EditorMap = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [, setIsMapLoaded] = useState(false);

  useLoadMap({
    setIsMapLoaded,
    mapRef,
    mapContainerRef,
  });

  return (
    <div className="bg-secondary-100 relative flex h-full w-full flex-1">
      <div ref={mapContainerRef} className="h-full w-full" />
      {/* TODO: Use real numbers */}
      <RouteStats distance={42.2} elevationGain={250} />
      <ActionButtonsContainer />
    </div>
  );
};
