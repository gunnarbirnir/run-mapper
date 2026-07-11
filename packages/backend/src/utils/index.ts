import type {
  Coordinates,
  RouteCoordinates,
  BoundingBox,
  WaypointType,
  PointOfInterestType,
} from '../types/index.js';
import {
  PUBLIC_SLUG_REGEX,
  WAYPOINT_VALUES,
  POINT_OF_INTEREST_VALUES,
} from '../config/constants.js';

export const generateImageSeed = (): number => {
  return Math.round(Math.random() * 100);
};

export const normalizePublicSlug = (value: string) => {
  return value.trim().toLowerCase();
};

export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const isValidPublicSlug = (value: string) => {
  return PUBLIC_SLUG_REGEX.test(value);
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

export const isValidWaypointType = (value: unknown): value is WaypointType => {
  return WAYPOINT_VALUES.includes(value as WaypointType);
};

export const isValidPointOfInterestType = (
  value: unknown,
): value is PointOfInterestType => {
  return POINT_OF_INTEREST_VALUES.includes(value as PointOfInterestType);
};

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};
