import type { Map, Marker, Popup } from 'mapbox-gl';
import { useEffect, useRef, type RefObject } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import type { PointOfInterest } from '~/types';

import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '../constants';
import {
  getPointOfInterestMarkerElement,
  getPointOfInterestTooltip,
  getTooltipLatOffset,
} from '../utils';
import { useHandlers } from './useHandlers';

interface UsePointsOfInterestProps {
  isMapLoaded: boolean;
  pointsOfInterest: PointOfInterest[];
  showPointsOfInterest: boolean;
  activePointOfInterest: string | null;
  activeWaypoint: string | null;
  onPointOfInterestClick: (pointOfInterest: string | null) => void;
  fitToInitialBounds: () => void;
  mapRef: RefObject<Map>;
}

export const usePointsOfInterest = ({
  isMapLoaded,
  pointsOfInterest,
  showPointsOfInterest,
  activePointOfInterest,
  activeWaypoint,
  onPointOfInterestClick,
  fitToInitialBounds,
  mapRef,
}: UsePointsOfInterestProps) => {
  const activePointOfInterestRef = useRef<string | null>(null);
  const pointsOfInterestMarkersRef = useRef<Marker[]>([]);
  const popupsRef = useRef<Record<string, Popup>>({});
  const { addMarker } = useHandlers({ mapRef });

  useHotkey('Escape', () => onPointOfInterestClick(null), {
    enabled: Boolean(activePointOfInterest),
    conflictBehavior: 'allow',
  });

  // Draw points of interest
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const pointsOfInterestMarkers = [];
    const popups: Record<string, Popup> = {};

    if (showPointsOfInterest) {
      for (const pointOfInterest of pointsOfInterest) {
        popups[pointOfInterest.id] = getPointOfInterestTooltip(
          pointOfInterest,
          () => onPointOfInterestClick(null),
        );
        pointsOfInterestMarkers.push(
          addMarker(
            getPointOfInterestMarkerElement(pointOfInterest.type, () =>
              onPointOfInterestClick(pointOfInterest.id),
            ),
            pointOfInterest.coordinates,
          ),
        );
      }
    }

    popupsRef.current = popups;
    pointsOfInterestMarkersRef.current = pointsOfInterestMarkers.filter(
      Boolean,
    ) as Marker[];

    return () => {
      pointsOfInterestMarkersRef.current.forEach((marker) => marker.remove());
      Object.values(popupsRef.current).forEach((popup) => popup.remove());
      activePointOfInterestRef.current = null;
      pointsOfInterestMarkersRef.current = [];
      popupsRef.current = {};
    };
  }, [
    isMapLoaded,
    addMarker,
    mapRef,
    showPointsOfInterest,
    pointsOfInterest,
    onPointOfInterestClick,
  ]);

  // React to active point of interest change
  useEffect(() => {
    if (activePointOfInterest === activePointOfInterestRef.current) {
      return;
    }

    if (activePointOfInterestRef.current) {
      popupsRef.current[activePointOfInterestRef.current]?.remove();
    }

    if (!activePointOfInterest && !activeWaypoint) {
      fitToInitialBounds();
    }

    activePointOfInterestRef.current = activePointOfInterest;

    const activePointOfInterestDetails = pointsOfInterest.find(
      (pointOfInterest: PointOfInterest) =>
        pointOfInterest.id === activePointOfInterest,
    );

    if (!activePointOfInterest || !activePointOfInterestDetails) {
      return;
    }

    const popup = popupsRef.current[activePointOfInterest];
    if (popup && mapRef.current) {
      popup
        .setLngLat([
          activePointOfInterestDetails.coordinates.lng,
          activePointOfInterestDetails.coordinates.lat,
        ])
        .addTo(mapRef.current);
    }

    mapRef.current?.flyTo({
      center: [
        activePointOfInterestDetails.coordinates.lng,
        activePointOfInterestDetails.coordinates.lat +
          getTooltipLatOffset(activePointOfInterestDetails),
      ],
      zoom: WAYPOINT_ZOOM,
      duration: FLY_TO_WAYPOINT_DURATION,
    });
  }, [
    activePointOfInterest,
    activeWaypoint,
    fitToInitialBounds,
    mapRef,
    pointsOfInterest,
  ]);
};
