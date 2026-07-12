import type { Waypoint } from '~/types';
import { generateId } from '~/utils';

export const getWaypointsWithStartAndEnd = (waypoints: Waypoint[]) => {
  const updatedWaypoints = [...waypoints];
  const waypointTypes = waypoints.reduce((types, wp) => {
    types.add(wp.type);
    return types;
  }, new Set<string>());

  if (!waypointTypes.has('start')) {
    updatedWaypoints.unshift({
      id: generateId(),
      type: 'start',
      name: 'Start',
      coordinates: { lat: 0, lng: 0 },
      position: 0,
    });
  }

  if (!waypointTypes.has('end')) {
    updatedWaypoints.push({
      id: generateId(),
      type: 'end',
      name: 'End',
      coordinates: { lat: 0, lng: 0 },
      position: 0,
    });
  }

  return updatedWaypoints;
};

export const isUnchangedDefaultWaypoints = (waypoints: Waypoint[]) => {
  return (
    waypoints.length === 0 ||
    (waypoints.length === 2 &&
      waypoints[0].type === 'start' &&
      waypoints[1].type === 'end' &&
      waypoints[0].name === 'Start' &&
      waypoints[1].name === 'End' &&
      !waypoints[0].description &&
      !waypoints[1].description &&
      !waypoints[0].amenities?.length &&
      !waypoints[1].amenities?.length)
  );
};

export const sortWaypoints =
  (routeDistance: number) => (a: Waypoint, b: Waypoint) => {
    const getSortValue = (w: Waypoint) => {
      return {
        primary:
          w.type === 'start'
            ? 0
            : w.type === 'end'
              ? routeDistance
              : w.position || 0,
        secondary: w.type === 'start' ? -1 : w.type === 'end' ? 1 : 0,
      };
    };
    const aValue = getSortValue(a);
    const bValue = getSortValue(b);

    if (aValue.primary === bValue.primary) {
      return aValue.secondary - bValue.secondary;
    }
    return aValue.primary - bValue.primary;
  };
