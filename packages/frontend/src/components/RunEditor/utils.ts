import type { EditorRun, Waypoint } from '~/types';

export const getWaypointsWithStartAndEnd = (
  waypoints: Waypoint[],
  baseId?: string,
) => {
  const updatedWaypoints = [...waypoints];

  if (updatedWaypoints.length === 0 || updatedWaypoints[0].type !== 'start') {
    updatedWaypoints.unshift({
      id: `${baseId ? `${baseId}-` : ''}start-waypoint`,
      type: 'start',
      name: 'Start',
      coordinates: { lat: 0, lng: 0 },
      distance: 0,
    });
  }

  if (updatedWaypoints[updatedWaypoints.length - 1].type !== 'end') {
    updatedWaypoints.push({
      id: `${baseId ? `${baseId}-` : ''}end-waypoint`,
      type: 'end',
      name: 'End',
      coordinates: { lat: 0, lng: 0 },
      distance: 0,
    });
  }

  return updatedWaypoints;
};

// TODO: Remove - only needed for test data
export const getInitialWaypoints = (existingRun?: EditorRun) => {
  return existingRun?.routes.reduce(
    (acc, route) => {
      const routeWaypoints = route.waypoints.map((wp) => ({
        ...wp,
        id: `${route.id}-${wp.id}`,
      }));

      acc[route.id] = getWaypointsWithStartAndEnd(routeWaypoints, route.id);
      return acc;
    },
    {} as Record<string, Waypoint[]>,
  );
};
