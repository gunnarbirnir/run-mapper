import type { Map, MapMouseEvent, Marker } from 'mapbox-gl';
import {
  RefObject,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
} from 'react';

import type { RouteCoordinates, Bounds, BoundingBox } from '~/types';
import {
  getLineFeature,
  getRouteLayer,
  formatBounds,
  getRoutePointElement,
} from '~/utils/map';
import { FIT_BOUNDS_CONFIG, COORDINATES_DECIMALS } from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { getBoundingBox } from '~/utils/route';
import { generateId, roundNumber } from '~/utils';

interface UseMapRouteProps {
  routePanelIsOpen: boolean;
  routePanelIsAnimating: boolean;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  isMapLoaded: boolean;
  isEditingRouteCoordinates: boolean;
  activeRouteCoordinates: RouteCoordinates[];
  selectedRoutePoint: string | null;
  initialBounds: Bounds;
  activeRouteBoundingBox?: BoundingBox;
  setActiveRouteControlPoints: Dispatch<SetStateAction<RouteCoordinates[]>>;
  setSelectedRoutePoint: Dispatch<SetStateAction<string | null>>;
  mapRef: RefObject<Map>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useDrawRoute = ({
  routePanelIsOpen,
  routePanelIsAnimating,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  isMapLoaded,
  isEditingRouteCoordinates,
  activeRouteCoordinates,
  selectedRoutePoint,
  initialBounds,
  activeRouteBoundingBox,
  setActiveRouteControlPoints,
  setSelectedRoutePoint,
  mapRef,
  isResettingBoundsRef,
}: UseMapRouteProps) => {
  const { addMarker } = useMapHandlers({ mapRef });
  const disableMapClickRef = useRef(false);

  // Draw route
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;
    const routeLayer = getRouteLayer();
    let routePointMarkers: (Marker | undefined)[] = [];

    const drawRoute = () => {
      const source = map.getSource(routeLayer.source);
      const routeLineFeature = getLineFeature(activeRouteCoordinates);

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
      if (map.getLayer(routeLayer.id)) {
        map.removeLayer(routeLayer.id);
      }
      if (map.getSource(routeLayer.source)) {
        map.removeSource(routeLayer.source);
      }
    };

    const drawRoutePoints = () => {
      routePointMarkers = activeRouteCoordinates
        .filter((coordinate) => coordinate.isControlPoint)
        .map((coordinate) =>
          addMarker(
            getRoutePointElement({
              isSelected: selectedRoutePoint === coordinate.id,
              onClick: () => setSelectedRoutePoint(coordinate.id),
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

    if (activeRouteCoordinates.length === 0) {
      clearRoute();
    } else {
      drawRoute();
      if (isEditingRouteCoordinates) {
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
    isEditingRouteCoordinates,
    activeRouteCoordinates,
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
      routePanelIsAnimating ||
      waypointPanelIsAnimating
    ) {
      return;
    }

    const map = mapRef.current;
    const bounds =
      activeRouteCoordinates.length > 0
        ? formatBounds(
            activeRouteBoundingBox || getBoundingBox(activeRouteCoordinates),
          )
        : initialBounds;

    if (!routePanelIsOpen || waypointPanelIsOpen || isEditingRouteCoordinates) {
      return;
    }

    map.fitBounds(bounds, FIT_BOUNDS_CONFIG);
    isResettingBoundsRef.current = true;
  }, [
    isMapLoaded,
    routePanelIsOpen,
    routePanelIsAnimating,
    initialBounds,
    activeRouteBoundingBox,
    isEditingRouteCoordinates,
    activeRouteCoordinates,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
    mapRef,
    isResettingBoundsRef,
  ]);

  // Handle update coordinates click
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isEditingRouteCoordinates) {
      return;
    }

    const map = mapRef.current;
    const handleClick = async (e: MapMouseEvent) => {
      if (disableMapClickRef.current) {
        return;
      }

      const newCoordinates = {
        id: generateId(),
        lng: roundNumber(e.lngLat.lng, COORDINATES_DECIMALS),
        lat: roundNumber(e.lngLat.lat, COORDINATES_DECIMALS),
        isControlPoint: true,
      };

      if (selectedRoutePoint === null) {
        setActiveRouteControlPoints((prevCoordinates) => [
          ...prevCoordinates,
          newCoordinates,
        ]);
      } else {
        setActiveRouteControlPoints((prevCoordinates) => {
          const updatedCoordinates = [...prevCoordinates];
          const index = updatedCoordinates.findIndex(
            (coordinate) => coordinate.id === selectedRoutePoint,
          );
          if (index !== -1) {
            updatedCoordinates[index] = newCoordinates;
          }
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
    isEditingRouteCoordinates,
    selectedRoutePoint,
    activeRouteCoordinates,
    setActiveRouteControlPoints,
    setSelectedRoutePoint,
    mapRef,
    disableMapClickRef,
  ]);
};
