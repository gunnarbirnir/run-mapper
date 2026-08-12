import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type {
  CoordinatesWithId,
  RouteCoordinates,
  ApiResponse,
  RouteStats,
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
  const [routeStats, setRouteStats] = useState<RouteStats | null>(null);
  const [isLoadingRouteBetweenPoints, setIsLoadingRouteBetweenPoints] =
    useState(false);
  const [isLoadingRouteStats, setIsLoadingRouteStats] = useState(false);

  const activeRouteCoordinatesValue = useMemo(
    () =>
      !isEditingRouteCoordinates &&
      !isLoadingRouteStats &&
      routeStats?.coordinates
        ? routeStats.coordinates
        : activeRouteCoordinates,
    [
      activeRouteCoordinates,
      isEditingRouteCoordinates,
      isLoadingRouteStats,
      routeStats,
    ],
  );

  const resetActiveRoute = useCallback(() => {
    setActiveRouteCoordinates([]);
    setActiveRouteControlPoints([]);
    setSelectedRoutePoint(null);
    setIsEditingRouteCoordinates(false);
    setRouteStats(null);
    setIsLoadingRouteBetweenPoints(false);
    setIsLoadingRouteStats(false);
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

  const fetchRouteStats = useCallback(
    (coordinates: RouteCoordinates[]) => {
      return queryClient.fetchQuery<ApiResponse<RouteStats>>({
        queryKey: ['route-stats', coordinates],
        staleTime: 60_000, // 1 minute
        queryFn: () => api.post('/routing/route-stats', { coordinates }),
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
        // Ignore cancelled requests
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

    const updateRouteStats = async () => {
      if (!isEditingRouteCoordinates) {
        if (activeRouteCoordinates.length > 0) {
          try {
            setIsLoadingRouteStats(true);
            const { data: routeStats } = await fetchRouteStats(
              activeRouteCoordinates,
            );

            if (!hasBeenCancelled) {
              setRouteStats(routeStats);
            }
          } catch {
            // Ignore cancelled requests
          } finally {
            if (!hasBeenCancelled) {
              setIsLoadingRouteStats(false);
            }
          }
        } else {
          setRouteStats(null);
        }
      }
    };

    updateRouteStats();

    return () => {
      hasBeenCancelled = true;
      setIsLoadingRouteStats(false);
    };
  }, [activeRouteCoordinates, fetchRouteStats, isEditingRouteCoordinates]);

  return {
    activeRouteCoordinates: activeRouteCoordinatesValue,
    activeRouteDistance: routeStats?.distance ?? 0,
    activeRouteBoundingBox: routeStats?.boundingBox,
    activeRouteElevationStats: routeStats?.elevationStats,
    activeRouteControlPoints,
    isEditingRouteCoordinates,
    selectedRoutePoint,
    isLoadingRouteBetweenPoints,
    isLoadingRouteStats,
    setActiveRouteControlPoints,
    setIsEditingRouteCoordinates,
    setSelectedRoutePoint,
  };
};

export type ActiveRouteState = ReturnType<typeof useActiveRoute>;
