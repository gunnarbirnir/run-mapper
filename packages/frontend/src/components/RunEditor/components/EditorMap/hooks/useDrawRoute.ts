import type { Map, MapMouseEvent, Marker } from 'mapbox-gl';
import {
  RefObject,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
  type MutableRefObject,
} from 'react';

import type { CoordinatesWithId, RouteCoordinates } from '~/types';
import {
  getLineFeature,
  getRouteLayer,
  formatBounds,
  getRoutePointElement,
} from '~/utils/map';
import { FIT_INITIAL_BOUNDS_DURATION, BOUNDS_PADDING } from '~/constants/map';
import { useMapHandlers } from '~/hooks/useMapHandlers';
import { getBoundingBox } from '~/utils/route';
import { generateId } from '~/utils';

interface UseMapRouteProps {
  panelIsOpen: boolean;
  isAnimatingPanel: boolean;
  waypointPanelIsOpen: boolean;
  waypointPanelIsAnimating: boolean;
  isMapLoaded: boolean;
  isEditingCoordinates: boolean;
  editCoordinates: RouteCoordinates[];
  selectedRoutePoint: string | null;
  setEditControlPoints: Dispatch<SetStateAction<CoordinatesWithId[]>>;
  setSelectedRoutePoint: Dispatch<SetStateAction<string | null>>;
  mapRef: RefObject<Map>;
  isResettingBoundsRef: MutableRefObject<boolean>;
}

export const useDrawRoute = ({
  panelIsOpen,
  isAnimatingPanel,
  waypointPanelIsOpen,
  waypointPanelIsAnimating,
  isMapLoaded,
  isEditingCoordinates,
  editCoordinates,
  selectedRoutePoint,
  setEditControlPoints,
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
      const routeLineFeature = getLineFeature(editCoordinates);

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
      routePointMarkers = editCoordinates
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

    if (editCoordinates.length === 0) {
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
    const bounds =
      editCoordinates.length > 0
        ? formatBounds(getBoundingBox(editCoordinates))
        : null;

    if (
      !bounds ||
      !panelIsOpen ||
      waypointPanelIsOpen ||
      isEditingCoordinates
    ) {
      return;
    }

    map.fitBounds(bounds, {
      duration: FIT_INITIAL_BOUNDS_DURATION,
      padding: BOUNDS_PADDING,
    });
    isResettingBoundsRef.current = true;
  }, [
    isMapLoaded,
    panelIsOpen,
    isAnimatingPanel,
    isEditingCoordinates,
    editCoordinates,
    waypointPanelIsOpen,
    waypointPanelIsAnimating,
    mapRef,
    isResettingBoundsRef,
  ]);

  // Handle update coordinates click
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !isEditingCoordinates) {
      return;
    }

    const map = mapRef.current;
    const handleClick = async (e: MapMouseEvent) => {
      if (disableMapClickRef.current) {
        return;
      }

      const newCoordinates = {
        id: generateId(),
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      };

      if (selectedRoutePoint === null) {
        setEditControlPoints((prevCoordinates) => [
          ...prevCoordinates,
          newCoordinates,
        ]);
      } else {
        setEditControlPoints((prevCoordinates) => {
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
    isEditingCoordinates,
    selectedRoutePoint,
    editCoordinates,
    setEditControlPoints,
    setSelectedRoutePoint,
    mapRef,
    disableMapClickRef,
  ]);
};
