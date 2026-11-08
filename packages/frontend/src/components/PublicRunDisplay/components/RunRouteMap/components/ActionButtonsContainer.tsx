import type { Map } from 'mapbox-gl';
import type { RefObject } from 'react';

import { Icon, Tooltip } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useMapZoom } from '~/hooks/useMapZoom';
import { MapActionButton, PlusMinusButton } from '~/components/MapActionButton';

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
        <PlusMinusButton
          index={mapActionButtonIndex++}
          tabIndex={BASE_TAB_INDEX + mapActionButtonIndex}
          plus={{
            tooltipLabel: 'Zoom in',
            onClick: zoomIn,
            disabled: !canZoomIn,
          }}
          minus={{
            tooltipLabel: 'Zoom out',
            onClick: zoomOut,
            disabled: !canZoomOut,
          }}
        />
      )}
      {!isFullscreen && (
        <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Fullscreen"
          tabIndex={BASE_TAB_INDEX + mapActionButtonIndex}
          combinedButtonsCount={1}
          onClick={openFullscreen}
        >
          <Icon name="externalLink" className="size-5" />
        </MapActionButton>
      )}
    </Tooltip.Provider>
  );
};
