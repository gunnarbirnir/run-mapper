import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type {
  CoordinatesWithId,
  RouteCoordinates,
  ApiResponse,
  RouteData,
  PublicRoute,
} from '~/types';
import { api } from '~/service';

interface UseActiveRouteProps {
  panelIsOpen: boolean;
  currentEditRoute: PublicRoute | undefined;
}

const convertToRouteCoordinates =
  (isControlPoint = false) =>
  (coordinates: CoordinatesWithId): RouteCoordinates => ({
    isControlPoint,
    elevation: 0,
    distance: 0,
    ...coordinates,
  });

const getSegmentIdentifier = (
  previousPoint: CoordinatesWithId,
  point: CoordinatesWithId,
) => {
  return `${previousPoint.lat};${previousPoint.lng}-${point.lat};${point.lng}`;
};

export const useActiveRoute = ({
  panelIsOpen,
  currentEditRoute,
}: UseActiveRouteProps) => {
  const queryClient = useQueryClient();
  const cachedRouteBetweenPointsRef = useRef<
    Record<string, RouteCoordinates[]>
  >({});

  const [activeRouteCoordinates, setActiveRouteCoordinates] = useState<
    RouteCoordinates[]
  >([]);
  const [activeRouteControlPoints, setActiveRouteControlPoints] = useState<
    CoordinatesWithId[]
  >([]);
  const [isEditingRouteCoordinates, setIsEditingRouteCoordinates] =
    useState(false);
  const [selectedRoutePoint, setSelectedRoutePoint] = useState<string | null>(
    null,
  );
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [isLoadingRouteBetweenPoints, setIsLoadingRouteBetweenPoints] =
    useState(false);
  const [isLoadingRouteData, setIsLoadingRouteData] = useState(false);

  const activeRouteCoordinatesValue = useMemo(
    () =>
      !isEditingRouteCoordinates &&
      !isLoadingRouteData &&
      routeData?.coordinates
        ? routeData.coordinates
        : activeRouteCoordinates,
    [
      activeRouteCoordinates,
      isEditingRouteCoordinates,
      isLoadingRouteData,
      routeData,
    ],
  );

  const resetActiveRoute = useCallback(() => {
    setActiveRouteCoordinates([]);
    setActiveRouteControlPoints([]);
    setSelectedRoutePoint(null);
    setIsEditingRouteCoordinates(false);
    setRouteData(null);
    setIsLoadingRouteBetweenPoints(false);
    setIsLoadingRouteData(false);
  }, []);

  useEffect(() => {
    const currentEditRouteCoordinates = currentEditRoute?.coordinates ?? [];
    const currentEditRouteControlPoints = currentEditRouteCoordinates
      .filter((coord) => coord.isControlPoint)
      .map((coord) => ({
        id: coord.id,
        lat: coord.lat,
        lng: coord.lng,
      }));

    resetActiveRoute();
    setActiveRouteCoordinates(currentEditRouteCoordinates);
    setActiveRouteControlPoints(currentEditRouteControlPoints);

    const currentEditCachedRoutes: Record<string, RouteCoordinates[]> = {};
    let segmentCoordinates: RouteCoordinates[] = [];
    let previousControlPoint: CoordinatesWithId | null = null;

    for (const coord of currentEditRouteCoordinates) {
      if (coord.isControlPoint) {
        if (previousControlPoint) {
          const segmentIdentifier = getSegmentIdentifier(
            previousControlPoint,
            coord,
          );
          currentEditCachedRoutes[segmentIdentifier] = segmentCoordinates;
          segmentCoordinates = [];
        }
        previousControlPoint = coord;
      } else {
        segmentCoordinates.push(coord);
      }
    }

    cachedRouteBetweenPointsRef.current = currentEditCachedRoutes;
  }, [currentEditRoute, resetActiveRoute]);

  useEffect(() => {
    if (!panelIsOpen) {
      resetActiveRoute();
    }
  }, [panelIsOpen, resetActiveRoute]);

  const fetchRouteBetweenPoints = useCallback(
    (params: {
      startLat: number;
      startLng: number;
      endLat: number;
      endLng: number;
    }) => {
      const searchParams = new URLSearchParams({
        startLat: String(params.startLat),
        startLng: String(params.startLng),
        endLat: String(params.endLat),
        endLng: String(params.endLng),
      });

      return queryClient.fetchQuery<ApiResponse<CoordinatesWithId[]>>({
        queryKey: ['route-between-points', params],
        staleTime: 60_000 * 10, // 10 minutes
        queryFn: () =>
          api.get(`/routing/route-between-points?${searchParams.toString()}`),
      });
    },
    [queryClient],
  );

  const fetchRouteData = useCallback(
    (coordinates: RouteCoordinates[]) => {
      return queryClient.fetchQuery<ApiResponse<RouteData>>({
        queryKey: ['route-data', coordinates],
        staleTime: 60_000, // 1 minute
        queryFn: () => api.post('/routing/route-data', { coordinates }),
      });
    },
    [queryClient],
  );

  useEffect(() => {
    let hasBeenCancelled = false;

    const updateEditRouteCoordinates = async () => {
      const updatedEditRouteCoordinates: RouteCoordinates[] = [];
      let previousPoint: CoordinatesWithId | null = null;
      setIsLoadingRouteBetweenPoints(true);

      try {
        for (const point of activeRouteControlPoints) {
          if (previousPoint) {
            const segmentIdentifier = getSegmentIdentifier(
              previousPoint,
              point,
            );
            const cachedRouteBetweenPoints =
              cachedRouteBetweenPointsRef.current[segmentIdentifier];

            if (cachedRouteBetweenPoints) {
              updatedEditRouteCoordinates.push(...cachedRouteBetweenPoints);
            } else {
              const { data: routeBetweenPoints } =
                await fetchRouteBetweenPoints({
                  startLat: previousPoint.lat,
                  startLng: previousPoint.lng,
                  endLat: point.lat,
                  endLng: point.lng,
                });
              const formattedRouteBetweenPoints = routeBetweenPoints.map(
                convertToRouteCoordinates(false),
              );

              updatedEditRouteCoordinates.push(...formattedRouteBetweenPoints);
              cachedRouteBetweenPointsRef.current[segmentIdentifier] =
                formattedRouteBetweenPoints;
            }
          }

          updatedEditRouteCoordinates.push(
            convertToRouteCoordinates(true)(point),
          );
          previousPoint = point;
        }

        if (!hasBeenCancelled) {
          setActiveRouteCoordinates(updatedEditRouteCoordinates);
        }
      } catch {
        // Ignore for now
      } finally {
        if (!hasBeenCancelled) {
          setIsLoadingRouteBetweenPoints(false);
        }
      }
    };

    updateEditRouteCoordinates();

    return () => {
      hasBeenCancelled = true;
      setIsLoadingRouteBetweenPoints(false);
    };
  }, [activeRouteControlPoints, fetchRouteBetweenPoints]);

  useEffect(() => {
    let hasBeenCancelled = false;

    const updateRouteData = async () => {
      if (!isEditingRouteCoordinates) {
        if (activeRouteCoordinates.length > 0) {
          try {
            setIsLoadingRouteData(true);
            const { data: routeData } = await fetchRouteData(
              activeRouteCoordinates,
            );

            if (!hasBeenCancelled) {
              setRouteData(routeData);
            }
          } catch {
            // Ignore for now
          } finally {
            if (!hasBeenCancelled) {
              setIsLoadingRouteData(false);
            }
          }
        } else {
          setRouteData(null);
        }
      }
    };

    updateRouteData();

    return () => {
      hasBeenCancelled = true;
      setIsLoadingRouteData(false);
    };
  }, [activeRouteCoordinates, fetchRouteData, isEditingRouteCoordinates]);

  return {
    activeRouteCoordinates: activeRouteCoordinatesValue,
    activeRouteDistance: routeData?.distance ?? 0,
    activeRouteBoundingBox: routeData?.boundingBox,
    activeRouteElevationStats: routeData?.elevationStats,
    activeRouteControlPoints,
    isEditingRouteCoordinates,
    selectedRoutePoint,
    isLoadingRouteBetweenPoints,
    isLoadingRouteData,
    setActiveRouteControlPoints,
    setIsEditingRouteCoordinates,
    setSelectedRoutePoint,
  };
};

export type ActiveRouteState = ReturnType<typeof useActiveRoute>;
