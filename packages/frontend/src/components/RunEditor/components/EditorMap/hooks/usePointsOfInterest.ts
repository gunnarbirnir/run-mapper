import type { Map, Marker } from 'mapbox-gl';
import { useEffect, type RefObject } from 'react';

import type { PointOfInterest } from '~/types';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { getPointOfInterestMarkerElement } from '~/utils/map';

interface UsePointsOfInterestProps {
  isMapLoaded: boolean;
  pointsOfInterest: PointOfInterest[];
  mapRef: RefObject<Map>;
}

export const usePointsOfInterest = ({
  isMapLoaded,
  pointsOfInterest,
  mapRef,
}: UsePointsOfInterestProps) => {
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
          getPointOfInterestMarkerElement(pointOfInterest.type),
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
  }, [isMapLoaded, pointsOfInterest, addMarker, mapRef]);
};
