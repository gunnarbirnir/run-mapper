import type { Map, MapMouseEvent, Marker } from 'mapbox-gl';
import {
  RefObject,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';

import type { Coordinates, PublicRoute } from '~/types';
import {
  getLineFeature,
  getRouteLayer,
  formatBounds,
  getRoutePointElement,
} from '~/utils/map';
import { FIT_INITIAL_BOUNDS_DURATION, BOUNDS_PADDING } from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';

interface UseMapRouteProps {
  activeRoute: PublicRoute | undefined;
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  isMapLoaded: boolean;
  isEditingCoordinates: boolean;
  editCoordinates: Coordinates[];
  selectedRoutePoint: number | null;
  setEditCoordinates: Dispatch<SetStateAction<Coordinates[]>>;
  setSelectedRoutePoint: Dispatch<SetStateAction<number | null>>;
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
  selectedRoutePoint,
  setEditCoordinates,
  setSelectedRoutePoint,
  mapRef,
}: UseMapRouteProps) => {
  const { addMarker } = useMapHandlers({ mapRef });
  const disableMapClickRef = useRef(false);

  // Reset edit coordinates when active route changes
  useEffect(() => {
    setEditCoordinates(activeRoute?.coordinates ?? []);
    setSelectedRoutePoint(null);
  }, [activeRoute, setEditCoordinates, setSelectedRoutePoint]);

  // Reset edit coordinates when panel closes
  useEffect(() => {
    if (!panelIsOpen) {
      setEditCoordinates([]);
      setSelectedRoutePoint(null);
    }
  }, [panelIsOpen, setEditCoordinates, setSelectedRoutePoint]);

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
    let routePointMarkers: (Marker | undefined)[] = [];

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

    const drawRoutePoints = () => {
      // TODO: Only route points
      routePointMarkers = coordinates.map((coordinate, index) =>
        addMarker(
          getRoutePointElement({
            isSelected: selectedRoutePoint === index,
            onClick: () => setSelectedRoutePoint(index),
            onEnter: () => (disableMapClickRef.current = true),
            onLeave: () => (disableMapClickRef.current = false),
          }),
          {
            lng: coordinate.lng,
            lat: coordinate.lat,
          },
        ),
      );
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
      if (isEditingCoordinates) {
        drawRoutePoints();
      }
    }

    map.on('style.load', onStyleLoad);

    return () => {
      map.off('style.load', onStyleLoad);
      routePointMarkers.forEach((marker) => marker?.remove());
    };
  }, [
    isMapLoaded,
    activeRoute?.coordinates,
    isEditingCoordinates,
    editCoordinates,
    selectedRoutePoint,
    addMarker,
    setSelectedRoutePoint,
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
      if (disableMapClickRef.current) {
        return;
      }

      const newCoordinates = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      };

      if (selectedRoutePoint === null) {
        setEditCoordinates((prevCoordinates) => [
          ...prevCoordinates,
          newCoordinates,
        ]);
      } else {
        setEditCoordinates((prevCoordinates) => {
          const updatedCoordinates = [...prevCoordinates];
          updatedCoordinates[selectedRoutePoint] = newCoordinates;
          return updatedCoordinates;
        });
        setSelectedRoutePoint(null);
      }
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [
    isMapLoaded,
    isEditingCoordinates,
    selectedRoutePoint,
    setEditCoordinates,
    setSelectedRoutePoint,
    mapRef,
    disableMapClickRef,
  ]);
};
