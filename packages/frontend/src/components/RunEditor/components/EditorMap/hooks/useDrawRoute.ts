import type { Map, MapMouseEvent } from 'mapbox-gl';
import { RefObject, useEffect, useState, useRef } from 'react';

import type { Coordinates, PublicRoute } from '~/types';
import { getLineFeature, getRouteLayer, formatBounds } from '~/utils/map';
import { FIT_INITIAL_BOUNDS_DURATION, BOUNDS_PADDING } from '~/constants/map';

interface UseMapRouteProps {
  activeRoute: PublicRoute | undefined;
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  isMapLoaded: boolean;
  isEditingCoordinates: boolean;
  onUpdateRouteCoordinates: (coordinates: Coordinates, index?: number) => void;
  mapRef: RefObject<Map>;
}

export const useDrawRoute = ({
  activeRoute,
  panelIsOpen,
  isAnimatingPanel,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  isMapLoaded,
  isEditingCoordinates,
  onUpdateRouteCoordinates,
  mapRef,
}: UseMapRouteProps) => {
  const [editCoordinates, setEditCoordinates] = useState<
    Record<number, Coordinates>
  >({});
  const coordinatesIndexRef = useRef(activeRoute?.coordinates.length ?? 0);

  // Reset edit coordinates when active route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditCoordinates({});
    coordinatesIndexRef.current = activeRoute?.coordinates.length ?? 0;
  }, [activeRoute, setEditCoordinates]);

  // Reset edit coordinates when panel closes
  useEffect(() => {
    if (!panelIsOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditCoordinates({});
      coordinatesIndexRef.current = 0;
    }
  }, [panelIsOpen, setEditCoordinates]);

  // Draw route
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const coordinates: Coordinates[] = [];

    for (let i = 0; i < coordinatesIndexRef.current; i++) {
      const coordinate = editCoordinates[i] ?? activeRoute?.coordinates[i];
      if (coordinate) {
        coordinates.push(coordinate);
      }
    }

    (activeRoute?.coordinates ?? []).map(
      (coordinates, index) => editCoordinates[index] ?? coordinates,
    );
    const routeLayer = getRouteLayer();

    const clearRoute = () => {
      if (!map.isStyleLoaded() || !map.getStyle()) {
        return;
      }

      if (map.getLayer(routeLayer.id)) {
        map.removeLayer(routeLayer.id);
      }
      if (map.getSource(routeLayer.source)) {
        map.removeSource(routeLayer.source);
      }
    };

    const drawRoute = () => {
      if (map.isStyleLoaded() && coordinates.length !== 0) {
        map.addSource(routeLayer.source, {
          type: 'geojson',
          data: getLineFeature(coordinates),
        });
        map.addLayer(routeLayer);
      }
    };

    const onStyleLoad = () => {
      if (!map.getSource(routeLayer.source)) {
        drawRoute();
      }
    };

    drawRoute();
    map.on('style.load', onStyleLoad);

    return () => {
      clearRoute();
      map.off('style.load', onStyleLoad);
    };
  }, [
    isMapLoaded,
    activeRoute?.coordinates,
    isEditingCoordinates,
    editCoordinates,
    mapRef,
  ]);

  // Fit to bounds
  useEffect(() => {
    if (
      !isMapLoaded ||
      !mapRef.current ||
      isAnimatingPanel ||
      waypointPanelIsAnimating
    ) {
      return;
    }

    const map = mapRef.current;
    const bounds = activeRoute?.boundingBox
      ? formatBounds(activeRoute.boundingBox)
      : null;

    if (!bounds || !panelIsOpen || waypointPanelIsOpen) {
      return;
    }

    map.fitBounds(bounds, {
      padding: BOUNDS_PADDING,
      duration: FIT_INITIAL_BOUNDS_DURATION,
    });
  }, [
    isMapLoaded,
    activeRoute?.boundingBox,
    panelIsOpen,
    isAnimatingPanel,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
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
      setEditCoordinates((prevCoordinates) => ({
        ...prevCoordinates,
        [coordinatesIndexRef.current++]: newCoordinates,
      }));
      onUpdateRouteCoordinates(newCoordinates);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isMapLoaded, isEditingCoordinates, onUpdateRouteCoordinates, mapRef]);
};
