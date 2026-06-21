import type { Map, MapMouseEvent, Marker } from 'mapbox-gl';
import { useEffect, type RefObject, useState } from 'react';

import { FLY_TO_WAYPOINT_DURATION, WAYPOINT_ZOOM } from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import type {
  Coordinates,
  PointOfInterest,
  PointOfInterestType,
} from '~/types';
import { getPointOfInterestMarkerElement } from '~/utils/map';

interface UsePointsOfInterestProps {
  isMapLoaded: boolean;
  pointsOfInterest: PointOfInterest[];
  activePointOfInterest: string | null;
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  hasMadeAnyChanges: boolean;
  isEditingCoordinates: boolean;
  isEditingRouteCoordinates: boolean;
  editPointOfInterestType: PointOfInterestType | null;
  onEditPointOfInterest: (pointOfInterestId: string) => void;
  onUpdatePoiCoordinates: (coordinates: Coordinates) => void;
  setEditPointOfInterestType: (type: PointOfInterestType | null) => void;
  mapRef: RefObject<Map>;
}

export const usePointsOfInterest = ({
  isMapLoaded,
  pointsOfInterest,
  activePointOfInterest,
  panelIsOpen,
  isAnimatingPanel,
  hasMadeAnyChanges,
  isEditingRouteCoordinates,
  isEditingCoordinates,
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
  const isEditingInMap = isEditingRouteCoordinates || isEditingCoordinates;

  // Reset edit point of interest when active point of interest changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditCoordinates(null);
    setEditPointOfInterestType(null);
  }, [activePointOfInterest, setEditCoordinates, setEditPointOfInterestType]);

  // Draw points of interest
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    let pointsOfInterestMarkers = [];

    for (const pointOfInterest of pointsOfInterest) {
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
    if (editCoordinates && !activePointOfInterest && panelIsOpen) {
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
    pointsOfInterest,
    hasMadeAnyChanges,
    editPointOfInterestType,
    panelIsOpen,
    editCoordinates,
    isEditingInMap,
    addMarker,
    onEditPointOfInterest,
    mapRef,
  ]);

  // Zoom into active point of interest
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || isAnimatingPanel) {
      return;
    }

    const map = mapRef.current;
    const activePointOfInterestDetails = pointsOfInterest.find(
      (pointOfInterest: PointOfInterest) =>
        pointOfInterest.id === activePointOfInterest,
    );

    if (
      !activePointOfInterest ||
      !activePointOfInterestDetails ||
      !panelIsOpen
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
    pointsOfInterest,
    panelIsOpen,
    isAnimatingPanel,
    mapRef,
  ]);

  // Handle update coordinates click
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isEditingCoordinates) {
      return;
    }

    const map = mapRef.current;
    const handleClick = (e: MapMouseEvent) => {
      const newCoordinates = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      };
      setEditCoordinates(newCoordinates);
      onUpdatePoiCoordinates(newCoordinates);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isMapLoaded, isEditingCoordinates, onUpdatePoiCoordinates, mapRef]);
};
