import type {
  BoundingBox,
  Coordinates,
  ElevationStats,
} from '../types/index.js';
import {
  ELEVATION_DECIMALS,
  DISTANCE_DECIMALS,
  COORDINATES_DECIMALS,
} from '../config/constants.js';
import { roundNumber } from './index.js';

export const getBoundingBox = (coordinates: Coordinates[]): BoundingBox => {
  const minLat = Math.min(...coordinates.map((c) => c.lat));
  const maxLat = Math.max(...coordinates.map((c) => c.lat));
  const minLng = Math.min(...coordinates.map((c) => c.lng));
  const maxLng = Math.max(...coordinates.map((c) => c.lng));

  return [
    {
      lat: roundNumber(minLat, COORDINATES_DECIMALS),
      lng: roundNumber(minLng, COORDINATES_DECIMALS),
    },
    {
      lat: roundNumber(maxLat, COORDINATES_DECIMALS),
      lng: roundNumber(maxLng, COORDINATES_DECIMALS),
    },
  ];
};

export const haversineDistance = (
  coord1: Coordinates,
  coord2: Coordinates,
): number => {
  const { lng: lng1, lat: lat1 } = coord1;
  const { lng: lng2, lat: lat2 } = coord2;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const calculateDistance = (coordinates: Coordinates[]): number => {
  if (coordinates.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalDistance += haversineDistance(coordinates[i], coordinates[i + 1]);
  }

  return roundNumber(totalDistance, DISTANCE_DECIMALS);
};

export const getCoordinatesFromPosition = (
  position: number,
  coordinates: Coordinates[],
): Coordinates | null => {
  if (coordinates.length === 0) {
    return null;
  }

  let cumulativeDistance = 0;
  let closestCoordinate = coordinates[0];
  let closestDelta = Math.abs(position - cumulativeDistance);

  for (let i = 1; i < coordinates.length; i++) {
    cumulativeDistance += haversineDistance(coordinates[i - 1], coordinates[i]);
    const delta = Math.abs(position - cumulativeDistance);
    if (delta < closestDelta) {
      closestDelta = delta;
      closestCoordinate = coordinates[i];
    }
  }

  return {
    lat: roundNumber(closestCoordinate.lat, COORDINATES_DECIMALS),
    lng: roundNumber(closestCoordinate.lng, COORDINATES_DECIMALS),
  };
};

export const calculateElevationGain = (elevations: number[]): number => {
  if (elevations.length < 2) {
    return 0;
  }

  let totalGain = 0;
  for (let i = 0; i < elevations.length - 1; i++) {
    const diff = elevations[i + 1] - elevations[i];
    if (diff > 0) {
      totalGain += diff;
    }
  }

  return roundNumber(totalGain, ELEVATION_DECIMALS);
};

export const calculateElevationLoss = (elevations: number[]): number => {
  if (elevations.length < 2) {
    return 0;
  }

  let totalLoss = 0;
  for (let i = 0; i < elevations.length - 1; i++) {
    const diff = elevations[i] - elevations[i + 1];
    if (diff > 0) {
      totalLoss += diff;
    }
  }

  return roundNumber(totalLoss, ELEVATION_DECIMALS);
};

export const calculateMaxElevation = (
  elevations: number[],
): { value: number; index: number } => {
  let maxValue = 0;
  let maxIndex = 0;

  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i] > maxValue) {
      maxValue = elevations[i];
      maxIndex = i;
    }
  }

  return { value: roundNumber(maxValue, ELEVATION_DECIMALS), index: maxIndex };
};

export const calculateMinElevation = (
  elevations: number[],
): { value: number; index: number } => {
  let minValue = Infinity;
  let minIndex = 0;

  for (let i = 0; i < elevations.length; i++) {
    if (elevations[i] < minValue) {
      minValue = elevations[i];
      minIndex = i;
    }
  }

  return { value: roundNumber(minValue, ELEVATION_DECIMALS), index: minIndex };
};

export const getElevationStats = (
  coordinates: { elevation?: number }[],
): ElevationStats => {
  const elevations = coordinates.map((c) => c.elevation ?? 0);
  const elevationGain = calculateElevationGain(elevations);
  const elevationLoss = calculateElevationLoss(elevations);
  const netElevation = elevationGain - elevationLoss;
  const maxElevation = calculateMaxElevation(elevations).value;
  const minElevation = calculateMinElevation(elevations).value;

  return {
    elevationGain,
    elevationLoss,
    netElevation,
    maxElevation,
    minElevation,
  };
};
