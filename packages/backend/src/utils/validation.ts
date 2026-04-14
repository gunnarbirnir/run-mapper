import type {
  Coordinates,
  RouteCoordinates,
  BoundingBox,
} from '../types/index.js';

export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const isValidCoordinates = (value: unknown): value is Coordinates => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const coordinate = value as Coordinates;
  return (
    isFiniteNumber(coordinate.lat) &&
    isFiniteNumber(coordinate.lng) &&
    coordinate.lat >= -90 &&
    coordinate.lat <= 90 &&
    coordinate.lng >= -180 &&
    coordinate.lng <= 180
  );
};

export const isValidBoundingBox = (value: unknown): value is BoundingBox => {
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }
  return isValidCoordinates(value[0]) && isValidCoordinates(value[1]);
};

export const isValidRouteCoordinates = (
  value: unknown,
): value is RouteCoordinates => {
  if (!isValidCoordinates(value)) {
    return false;
  }
  return isFiniteNumber((value as RouteCoordinates).elevation);
};
