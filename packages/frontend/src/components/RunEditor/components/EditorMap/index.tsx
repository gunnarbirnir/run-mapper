import { useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

import { PublicRoute } from '~/types';

import { ActionButtonsContainer } from './components/ActionButtonsContainer';
import { RouteStats } from './components/RouteStats';
import { useDrawRoute } from './hooks/useDrawRoute';
import { useMapState, type MapState } from './hooks/useMapState';
import { useLoadMap } from './hooks/useLoadMap';

interface EditorMapProps extends MapState {
  activeRoute: PublicRoute | undefined;
  routePanelIsOpen: boolean;
  isAnimatingPanel: boolean;
}

export const EditorMap = ({
  activeRoute,
  routePanelIsOpen,
  isAnimatingPanel,
  isMapLoaded,
  setIsMapLoaded,
  mapRef,
}: EditorMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useLoadMap({
    setIsMapLoaded,
    mapRef,
    mapContainerRef,
  });

  useDrawRoute({
    activeRoute,
    routePanelIsOpen,
    isAnimatingPanel,
    isMapLoaded,
    mapRef,
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

export { useMapState };
