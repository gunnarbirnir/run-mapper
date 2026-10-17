import type { Map, MapMouseEvent, Marker } from 'mapbox-gl';
import { useEffect, type RefObject, useState } from 'react';

import {
  FLY_TO_WAYPOINT_DURATION,
  WAYPOINT_ZOOM,
  COORDINATES_DECIMALS,
} from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import type {
  Coordinates,
  PointOfInterest,
  PointOfInterestType,
} from '~/types';
import { getPointOfInterestMarkerElement } from '~/utils/map';
import { roundNumber } from '~/utils';

interface UsePointsOfInterestProps {
  isMapLoaded: boolean;
  currentPointsOfInterest: PointOfInterest[];
  activePointOfInterest: string | null;
  pointOfInterestPanelIsOpen: boolean;
  pointOfInterestPanelIsAnimating: boolean;
  hasMadeAnyChanges: boolean;
  isEditingPoiCoordinates: boolean;
  isEditingRouteCoordinates: boolean;
  editPointOfInterestType: PointOfInterestType | null;
  onEditPointOfInterest: (pointOfInterestId: string) => void;
  onUpdatePoiCoordinates: (coordinates: Coordinates) => void;
  setEditPointOfInterestType: (type: PointOfInterestType | null) => void;
  mapRef: RefObject<Map>;
}

export const usePointsOfInterest = ({
  isMapLoaded,
  currentPointsOfInterest,
  activePointOfInterest,
  pointOfInterestPanelIsOpen,
  pointOfInterestPanelIsAnimating,
  hasMadeAnyChanges,
  isEditingRouteCoordinates,
  isEditingPoiCoordinates,
  editPointOfInterestType,
  onEditPointOfInterest,
  onUpdatePoiCoordinates,
  setEditPointOfInterestType,
  mapRef,
}: UsePointsOfInterestProps) => {
  const { addMarker } = useMapHandlers({ mapRef });
  const [editCoordinates, setEditCoordinates] = useState<Coordinates | null>(
    null,
  );
  const isEditingInMap = isEditingRouteCoordinates || isEditingPoiCoordinates;

  // Reset edit point of interest when active point of interest changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditCoordinates(null);
    setEditPointOfInterestType(null);
  }, [activePointOfInterest, setEditCoordinates, setEditPointOfInterestType]);

  // Reset edit point of interest when panel closes
  useEffect(() => {
    if (!pointOfInterestPanelIsOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditCoordinates(null);
      setEditPointOfInterestType(null);
    }
  }, [
    pointOfInterestPanelIsOpen,
    setEditCoordinates,
    setEditPointOfInterestType,
  ]);

  // Draw points of interest
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    let pointsOfInterestMarkers = [];

    for (const pointOfInterest of currentPointsOfInterest) {
      const isActive = pointOfInterest.id === activePointOfInterest;
      pointsOfInterestMarkers.push(
        addMarker(
          getPointOfInterestMarkerElement({
            type:
              isActive && editPointOfInterestType
                ? editPointOfInterestType
                : pointOfInterest.type,
            onClick:
              hasMadeAnyChanges || isEditingInMap
                ? undefined
                : () => onEditPointOfInterest(pointOfInterest.id),
            isFocused: isActive,
            isEditingInMap,
          }),
          isActive && editCoordinates
            ? editCoordinates
            : pointOfInterest.coordinates,
        ),
      );
    }

    // New point of interest
    if (
      editCoordinates &&
      !activePointOfInterest &&
      pointOfInterestPanelIsOpen
    ) {
      pointsOfInterestMarkers.push(
        addMarker(
          getPointOfInterestMarkerElement({
            type: editPointOfInterestType || 'expo',
            isFocused: true,
            isEditingInMap,
          }),
          editCoordinates,
        ),
      );
    }

    pointsOfInterestMarkers = pointsOfInterestMarkers.filter(
      Boolean,
    ) as Marker[];

    return () => {
      pointsOfInterestMarkers.forEach((marker) => marker.remove());
    };
  }, [
    isMapLoaded,
    activePointOfInterest,
    currentPointsOfInterest,
    hasMadeAnyChanges,
    editPointOfInterestType,
    pointOfInterestPanelIsOpen,
    editCoordinates,
    isEditingInMap,
    addMarker,
    onEditPointOfInterest,
    mapRef,
  ]);

  // Zoom into active point of interest
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || pointOfInterestPanelIsAnimating) {
      return;
    }

    const map = mapRef.current;
    const activePointOfInterestDetails = currentPointsOfInterest.find(
      (pointOfInterest: PointOfInterest) =>
        pointOfInterest.id === activePointOfInterest,
    );

    if (
      !activePointOfInterest ||
      !activePointOfInterestDetails ||
      !pointOfInterestPanelIsOpen
    ) {
      return;
    }

    map.flyTo({
      center: [
        activePointOfInterestDetails.coordinates.lng,
        activePointOfInterestDetails.coordinates.lat,
      ],
      zoom: WAYPOINT_ZOOM,
      duration: FLY_TO_WAYPOINT_DURATION,
    });
  }, [
    isMapLoaded,
    activePointOfInterest,
    currentPointsOfInterest,
    pointOfInterestPanelIsOpen,
    pointOfInterestPanelIsAnimating,
    mapRef,
  ]);

  // Handle update coordinates click
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isEditingPoiCoordinates) {
      return;
    }

    const map = mapRef.current;
    const handleClick = (e: MapMouseEvent) => {
      const newCoordinates = {
        lng: roundNumber(e.lngLat.lng, COORDINATES_DECIMALS),
        lat: roundNumber(e.lngLat.lat, COORDINATES_DECIMALS),
      };
      setEditCoordinates(newCoordinates);
      onUpdatePoiCoordinates(newCoordinates);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isMapLoaded, isEditingPoiCoordinates, onUpdatePoiCoordinates, mapRef]);
};
