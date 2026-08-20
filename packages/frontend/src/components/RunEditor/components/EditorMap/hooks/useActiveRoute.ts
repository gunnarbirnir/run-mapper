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

const getSegmentIdentifier = (
  previousPoint: RouteCoordinates,
  point: RouteCoordinates,
) => {
  return `${previousPoint.lat};${previousPoint.lng}-${point.lat};${point.lng}`;
};

const getUpdatedCachedRoutes = (activeRouteCoordinates: RouteCoordinates[]) => {
  const updatedCachedRoutes: Record<string, RouteCoordinates[]> = {};
  let segmentCoordinates: RouteCoordinates[] = [];
  let previousControlPoint: RouteCoordinates | null = null;

  for (const coord of activeRouteCoordinates) {
    if (coord.isControlPoint) {
      if (previousControlPoint) {
        const segmentIdentifier = getSegmentIdentifier(
          previousControlPoint,
          coord,
        );
        updatedCachedRoutes[segmentIdentifier] = segmentCoordinates;
        segmentCoordinates = [];
      }
      previousControlPoint = coord;
    } else {
      segmentCoordinates.push(coord);
    }
  }

  return updatedCachedRoutes;
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
    RouteCoordinates[]
  >([]);
  const [isEditingRouteCoordinates, setIsEditingRouteCoordinates] =
    useState(false);
  const [routeHasBeenEdited, setRouteHasBeenEdited] = useState(false);
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
    cachedRouteBetweenPointsRef.current = {};
  }, []);

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
    if (!panelIsOpen) {
      resetActiveRoute();
    }
  }, [panelIsOpen, resetActiveRoute]);

  useEffect(() => {
    resetActiveRoute();

    if (!currentEditRoute) {
      return;
    }

    const currentEditRouteCoordinates = currentEditRoute.coordinates;
    const currentEditRouteControlPoints = currentEditRouteCoordinates.filter(
      (coord) => coord.isControlPoint,
    );

    setRouteData(currentEditRoute);
    setActiveRouteCoordinates(currentEditRouteCoordinates);
    setActiveRouteControlPoints(currentEditRouteControlPoints);
    cachedRouteBetweenPointsRef.current = getUpdatedCachedRoutes(
      currentEditRouteCoordinates,
    );
  }, [currentEditRoute, resetActiveRoute]);

  useEffect(() => {
    if (isEditingRouteCoordinates) {
      setRouteHasBeenEdited(true);
    }
  }, [isEditingRouteCoordinates]);

  useEffect(() => {
    if (routeData) {
      // To get elevation data so it doesn't need to be fetched again
      cachedRouteBetweenPointsRef.current = getUpdatedCachedRoutes(
        routeData.coordinates,
      );
    }
  }, [routeData]);

  useEffect(() => {
    let hasBeenCancelled = false;

    const updateActiveRouteCoordinates = async () => {
      const updatedActiveRouteCoordinates: RouteCoordinates[] = [];
      let previousPoint: RouteCoordinates | null = null;

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
              updatedActiveRouteCoordinates.push(...cachedRouteBetweenPoints);
            } else {
              setIsLoadingRouteBetweenPoints(true);
              const { data: routeBetweenPoints } =
                await fetchRouteBetweenPoints({
                  startLat: previousPoint.lat,
                  startLng: previousPoint.lng,
                  endLat: point.lat,
                  endLng: point.lng,
                });
              const formattedRouteBetweenPoints = routeBetweenPoints.map(
                (coord) => ({
                  ...coord,
                  isControlPoint: false,
                }),
              );

              updatedActiveRouteCoordinates.push(
                ...formattedRouteBetweenPoints,
              );
              cachedRouteBetweenPointsRef.current[segmentIdentifier] =
                formattedRouteBetweenPoints;
            }
          }

          updatedActiveRouteCoordinates.push({
            ...point,
            isControlPoint: true,
          });
          previousPoint = point;
        }

        if (!hasBeenCancelled) {
          setActiveRouteCoordinates(updatedActiveRouteCoordinates);
        }
      } catch {
        // Ignore for now
      } finally {
        if (!hasBeenCancelled) {
          setIsLoadingRouteBetweenPoints(false);
        }
      }
    };

    updateActiveRouteCoordinates();

    return () => {
      hasBeenCancelled = true;
      setIsLoadingRouteBetweenPoints(false);
    };
  }, [activeRouteControlPoints, fetchRouteBetweenPoints]);

  useEffect(() => {
    let hasBeenCancelled = false;

    const updateRouteData = async () => {
      if (isEditingRouteCoordinates || !routeHasBeenEdited) {
        return;
      }

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
    };

    updateRouteData();

    return () => {
      hasBeenCancelled = true;
      setIsLoadingRouteData(false);
    };
  }, [
    activeRouteCoordinates,
    isEditingRouteCoordinates,
    routeHasBeenEdited,
    fetchRouteData,
  ]);

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
