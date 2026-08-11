import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import type { CoordinatesWithId, RouteCoordinates, ApiResponse } from '~/types';
import { api } from '~/service';

interface UseEditRouteCoordinatesProps {
  editRouteControlPoints: CoordinatesWithId[];
}

const convertToRouteCoordinates =
  (isControlPoint = false) =>
  (coordinates: CoordinatesWithId): RouteCoordinates => ({
    isControlPoint,
    elevation: 0,
    distance: 0,
    ...coordinates,
  });

export const useEditRouteCoordinates = ({
  editRouteControlPoints,
}: UseEditRouteCoordinatesProps) => {
  const queryClient = useQueryClient();
  const [editRouteCoordinates, setEditRouteCoordinates] = useState<
    RouteCoordinates[]
  >([]);
  const cachedRouteBetweenPointsRef = useRef<
    Record<string, CoordinatesWithId[]>
  >({});

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

  useEffect(() => {
    const updateEditRouteCoordinates = async () => {
      const updatedEditRouteCoordinates: RouteCoordinates[] = [];
      let previousPoint: CoordinatesWithId | null = null;

      for (const point of editRouteControlPoints) {
        if (previousPoint) {
          const segmentIdentifier = `${previousPoint.lat};${previousPoint.lng}-${point.lat};${point.lng}`;
          if (cachedRouteBetweenPointsRef.current[segmentIdentifier]) {
            updatedEditRouteCoordinates.push(
              ...cachedRouteBetweenPointsRef.current[segmentIdentifier].map(
                convertToRouteCoordinates(false),
              ),
            );
          } else {
            const { data: routeBetweenPoints } = await fetchRouteBetweenPoints({
              startLat: previousPoint.lat,
              startLng: previousPoint.lng,
              endLat: point.lat,
              endLng: point.lng,
            });
            updatedEditRouteCoordinates.push(
              ...routeBetweenPoints.map(convertToRouteCoordinates(false)),
            );
            cachedRouteBetweenPointsRef.current[segmentIdentifier] =
              routeBetweenPoints;
          }
        }

        updatedEditRouteCoordinates.push(
          convertToRouteCoordinates(true)(point),
        );
        previousPoint = point;
      }

      setEditRouteCoordinates(updatedEditRouteCoordinates);
    };

    updateEditRouteCoordinates();
  }, [editRouteControlPoints, fetchRouteBetweenPoints]);

  return {
    editRouteCoordinates,
    // TODO:
    // routeDistance,
    // routeBoundingBox,
    // routeElevationStats
  };
};
