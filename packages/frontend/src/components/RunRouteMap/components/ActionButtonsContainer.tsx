import type { Map } from 'mapbox-gl';
import type { RefObject } from 'react';

import { Icon, Tooltip } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useMapZoom } from '~/hooks/useMapZoom';

import { MapActionButton } from '../components/MapActionButton';

interface ActionButtonsContainerProps {
  isMapLoaded: boolean;
  isAtInitialBounds: boolean;
  isFullscreen: boolean;
  resetRoute: () => void;
  openFullscreen: () => void;
  mapRef: RefObject<Map>;
}

export const ActionButtonsContainer = ({
  isMapLoaded,
  isAtInitialBounds,
  isFullscreen,
  resetRoute,
  openFullscreen,
  mapRef,
}: ActionButtonsContainerProps) => {
  const { isSmallScreen } = useMediaQuery();
  const { zoomIn, zoomOut, canZoomIn, canZoomOut } = useMapZoom({
    isMapLoaded,
    mapRef,
  });
  let mapActionButtonIndex = 0;

  return (
    <Tooltip.Provider>
      {/* <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Play"
          disabled={routeIsAnimating}
          onClick={playRoute}
        >
          <Icon name="play" className="size-5" />
        </MapActionButton> */}
      <MapActionButton
        index={mapActionButtonIndex++}
        tooltipLabel="Reset"
        disabled={isAtInitialBounds}
        onClick={resetRoute}
      >
        <Icon name="reset" className="size-4.5" />
      </MapActionButton>
      {!isSmallScreen && (
        <>
          <MapActionButton
            index={mapActionButtonIndex++}
            tooltipLabel="Zoom in"
            onClick={zoomIn}
            disabled={!canZoomIn}
          >
            <Icon name="plus" className="size-4.5" />
          </MapActionButton>
          <MapActionButton
            index={mapActionButtonIndex++}
            tooltipLabel="Zoom out"
            onClick={zoomOut}
            disabled={!canZoomOut}
          >
            <Icon name="minus" className="size-4.5" />
          </MapActionButton>
        </>
      )}
      {!isFullscreen && (
        <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Fullscreen"
          onClick={openFullscreen}
        >
          <Icon name="externalLink" className="size-5" />
        </MapActionButton>
      )}
    </Tooltip.Provider>
  );
};
