import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject, useRef } from 'react';

import type { PointOfInterest } from '~/types';
import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { getPointOfInterestMarkerElement } from '~/utils/map';

interface UsePointsOfInterestProps {
  isMapLoaded: boolean;
  pointsOfInterest: PointOfInterest[];
  activePointOfInterest: string | null;
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  mapRef: RefObject<Map>;
}

const ZOOM_DELAY = 200;

export const usePointsOfInterest = ({
  isMapLoaded,
  pointsOfInterest,
  activePointOfInterest,
  panelIsOpen,
  isAnimatingPanel,
  mapRef,
}: UsePointsOfInterestProps) => {
  const prevPanelIsOpenRef = useRef(panelIsOpen);
  const { addMarker } = useMapHandlers({ mapRef });

  // Draw points of interest
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    let pointsOfInterestMarkers = [];

    for (const pointOfInterest of pointsOfInterest) {
      pointsOfInterestMarkers.push(
        addMarker(
          getPointOfInterestMarkerElement(
            pointOfInterest.type,
            undefined,
            pointOfInterest.id === activePointOfInterest,
          ),
          pointOfInterest.coordinates,
        ),
      );
    }

    pointsOfInterestMarkers = pointsOfInterestMarkers.filter(
      Boolean,
    ) as Marker[];

    return () => {
      pointsOfInterestMarkers.forEach((marker) => marker.remove());
    };
  }, [isMapLoaded, pointsOfInterest, activePointOfInterest, addMarker, mapRef]);

  // React to active point of interest change
  useEffect(() => {
    if (!panelIsOpen || isAnimatingPanel) {
      return;
    }

    const isPanelOpenChanged = prevPanelIsOpenRef.current !== panelIsOpen;
    prevPanelIsOpenRef.current = panelIsOpen;

    const activePointOfInterestDetails = pointsOfInterest.find(
      (pointOfInterest: PointOfInterest) =>
        pointOfInterest.id === activePointOfInterest,
    );

    if (!activePointOfInterest || !activePointOfInterestDetails) {
      return;
    }

    // To wait for map resize
    const poiZoomTimeout = setTimeout(
      () => {
        mapRef.current?.flyTo({
          center: [
            activePointOfInterestDetails.coordinates.lng,
            activePointOfInterestDetails.coordinates.lat,
          ],
          zoom: WAYPOINT_ZOOM,
          duration: FLY_TO_WAYPOINT_DURATION,
        });
      },
      isPanelOpenChanged ? ZOOM_DELAY : 0,
    );

    return () => {
      clearTimeout(poiZoomTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePointOfInterest, mapRef, panelIsOpen, isAnimatingPanel]);
};
