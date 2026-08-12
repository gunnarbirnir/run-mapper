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

interface UseEditRouteProps {
  activeRoute: PublicRoute | undefined;
}

const convertToRouteCoordinates =
  (isControlPoint = false) =>
  (coordinates: CoordinatesWithId): RouteCoordinates => ({
    isControlPoint,
    elevation: 0,
    distance: 0,
    ...coordinates,
  });

// TODO: Handle existing route - Better naming?

export const useEditRoute = ({ _activeRoute }: UseEditRouteProps) => {
  const queryClient = useQueryClient();
  const cachedRouteBetweenPointsRef = useRef<
    Record<string, RouteCoordinates[]>
  >({});

  const [editRouteCoordinates, setEditRouteCoordinates] = useState<
    RouteCoordinates[]
  >([]);
  const [editRouteControlPoints, setEditRouteControlPoints] = useState<
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

  const editRouteCoordinatesValue = useMemo(
    () =>
      !isEditingRouteCoordinates &&
      !isLoadingRouteStats &&
      routeStats?.coordinates
        ? routeStats.coordinates
        : editRouteCoordinates,
    [
      editRouteCoordinates,
      isEditingRouteCoordinates,
      isLoadingRouteStats,
      routeStats,
    ],
  );

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
    (coordinates: CoordinatesWithId[]) => {
      const searchParams = new URLSearchParams({
        coordinates: coordinates
          .map((coordinate) => `${coordinate.lng},${coordinate.lat}`)
          .join(';'),
      });

      return queryClient.fetchQuery<ApiResponse<RouteStats>>({
        queryKey: ['route-stats', coordinates],
        staleTime: 60_000, // 1 minute
        queryFn: () =>
          api.get(`/routing/route-stats?${searchParams.toString()}`),
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
        for (const point of editRouteControlPoints) {
          if (previousPoint) {
            const segmentIdentifier = `${previousPoint.lat};${previousPoint.lng}-${point.lat};${point.lng}`;
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
          setEditRouteCoordinates(updatedEditRouteCoordinates);
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
  }, [editRouteControlPoints, fetchRouteBetweenPoints]);

  useEffect(() => {
    let hasBeenCancelled = false;

    const updateRouteStats = async () => {
      if (!isEditingRouteCoordinates) {
        if (editRouteCoordinates.length > 0) {
          try {
            setIsLoadingRouteStats(true);
            const { data: routeStats } =
              await fetchRouteStats(editRouteCoordinates);

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
  }, [editRouteCoordinates, fetchRouteStats, isEditingRouteCoordinates]);

  return {
    editRouteCoordinates: editRouteCoordinatesValue,
    editRouteControlPoints,
    isEditingRouteCoordinates,
    selectedRoutePoint,
    routeDistance: routeStats?.distance ?? 0,
    routeBoundingBox: routeStats?.boundingBox,
    routeElevationStats: routeStats?.elevationStats,
    isLoadingRouteBetweenPoints,
    isLoadingRouteStats,
    setEditRouteControlPoints,
    setIsEditingRouteCoordinates,
    setSelectedRoutePoint,
  };
};

export type EditRouteState = ReturnType<typeof useEditRoute>;
