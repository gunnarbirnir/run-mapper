import type { Map, MapMouseEvent } from 'mapbox-gl';
import {
  RefObject,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react';

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
  editCoordinates: Coordinates[];
  setEditCoordinates: Dispatch<SetStateAction<Coordinates[]>>;
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
  editCoordinates,
  setEditCoordinates,
  mapRef,
}: UseMapRouteProps) => {
  // Reset edit coordinates when active route changes
  useEffect(() => {
    setEditCoordinates(activeRoute?.coordinates ?? []);
  }, [activeRoute, setEditCoordinates]);

  // Reset edit coordinates when panel closes
  useEffect(() => {
    if (!panelIsOpen) {
      setEditCoordinates([]);
    }
  }, [panelIsOpen, setEditCoordinates]);

  // Draw route
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const routeLayer = getRouteLayer();
    const coordinates =
      editCoordinates.length > 0
        ? editCoordinates
        : (activeRoute?.coordinates ?? []);

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
      if (!map.isStyleLoaded() || coordinates.length === 0) {
        return;
      }

      const source = map.getSource(routeLayer.source);
      const routeLineFeature = getLineFeature(coordinates);

      if (source) {
        (source as mapboxgl.GeoJSONSource).setData(routeLineFeature);
      } else {
        map.addSource(routeLayer.source, {
          type: 'geojson',
          data: routeLineFeature,
        });
        map.addLayer(routeLayer);
      }
    };

    const onStyleLoad = () => {
      if (!map.getSource(routeLayer.source)) {
        drawRoute();
      }
    };

    if (coordinates.length === 0) {
      clearRoute();
    } else {
      drawRoute();
    }
    map.on('style.load', onStyleLoad);

    return () => {
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
      setEditCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        newCoordinates,
      ]);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isMapLoaded, isEditingCoordinates, setEditCoordinates, mapRef]);
};
