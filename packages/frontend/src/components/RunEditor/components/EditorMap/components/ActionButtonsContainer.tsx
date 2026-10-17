import type { Map } from 'mapbox-gl';

import { Icon, Tooltip } from '~/primitives';
import { useMapZoom } from '~/hooks/useMapZoom';
import { useMediaQuery } from '~/hooks/useMediaQuery';

import { MapActionButton } from './MapActionButton';
import { RefObject } from 'react';

interface ActionButtonsContainerProps {
  isMapLoaded: boolean;
  isAtInitialBounds: boolean;
  resetRoute: () => void;
  mapRef: RefObject<Map>;
}

export const ActionButtonsContainer = ({
  isMapLoaded,
  isAtInitialBounds,
  resetRoute,
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
    </Tooltip.Provider>
  );
};
