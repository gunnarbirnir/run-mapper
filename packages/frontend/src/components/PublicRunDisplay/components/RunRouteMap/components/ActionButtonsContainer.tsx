import type { Map } from 'mapbox-gl';
import type { RefObject } from 'react';

import { Icon, Tooltip } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useMapZoom } from '~/hooks/useMapZoom';
import { MapActionButton } from '~/components/MapActionButton';

interface ActionButtonsContainerProps {
  isMapLoaded: boolean;
  isAtInitialBounds: boolean;
  isFullscreen: boolean;
  resetRoute: () => void;
  openFullscreen: () => void;
  mapRef: RefObject<Map>;
}

// Should come after drawers
const BASE_TAB_INDEX = 30;

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
      <MapActionButton
        index={mapActionButtonIndex++}
        tooltipLabel="Reset"
        disabled={isAtInitialBounds}
        tabIndex={BASE_TAB_INDEX + mapActionButtonIndex}
        onClick={resetRoute}
      >
        <Icon name="reset" className="size-4.5" />
      </MapActionButton>
      {!isSmallScreen && (
        <>
          <MapActionButton
            index={mapActionButtonIndex++}
            tooltipLabel="Zoom in"
            tabIndex={BASE_TAB_INDEX + mapActionButtonIndex}
            onClick={zoomIn}
            disabled={!canZoomIn}
          >
            <Icon name="plus" className="size-4.5" />
          </MapActionButton>
          <MapActionButton
            index={mapActionButtonIndex++}
            tooltipLabel="Zoom out"
            tabIndex={BASE_TAB_INDEX + mapActionButtonIndex}
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
          tabIndex={BASE_TAB_INDEX + mapActionButtonIndex}
          onClick={openFullscreen}
        >
          <Icon name="externalLink" className="size-5" />
        </MapActionButton>
      )}
    </Tooltip.Provider>
  );
};
