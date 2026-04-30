import type { Waypoint } from '~/types';

export const getWaypointsWithStartAndEnd = (
  waypoints: Waypoint[],
  baseId?: string,
) => {
  const updatedWaypoints = [...waypoints];
  const waypointTypes = waypoints.reduce((types, wp) => {
    types.add(wp.type);
    return types;
  }, new Set<string>());

  if (!waypointTypes.has('start')) {
    updatedWaypoints.unshift({
      id: `${baseId ? `${baseId}-` : ''}start-waypoint`,
      type: 'start',
      name: 'Start',
      coordinates: { lat: 0, lng: 0 },
      distance: 0,
    });
  }

  if (!waypointTypes.has('end')) {
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
