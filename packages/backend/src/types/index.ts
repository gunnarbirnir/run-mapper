import {
  WAYPOINT_VALUES,
  POINT_OF_INTEREST_VALUES,
} from '../config/constants.js';

export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
export type Elevation = { value: number };

export type RouteCoordinates = Coordinates & {
  id: string;
  isRoutePoint: boolean;
  elevation: number;
};

export interface ElevationStats {
  elevationGain: number;
  elevationLoss: number;
  netElevation: number;
  maxElevation: number;
  minElevation: number;
}

export type WaypointType = (typeof WAYPOINT_VALUES)[number];

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: WaypointType;
  position: number;
  amenities?: WaypointType[];
};

export type PointOfInterestType = (typeof POINT_OF_INTEREST_VALUES)[number];

export type PointOfInterest = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: PointOfInterestType;
};

export interface PublicRoute {
  id: string;
  name: string;
  boundingBox: BoundingBox;
  coordinates: RouteCoordinates[];
  waypoints: Waypoint[];
  distance: number;
  displayDistance?: number;
  elevationStats: ElevationStats;
}

export interface PublicRun {
  id: string;
  name: string;
  defaultRouteId?: string;
  publicSlug: string;
  routes: PublicRoute[];
  pointsOfInterest: PointOfInterest[];
}

export interface RunRecordWithId extends PublicRun {
  userId: string;
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
  imageSeed?: number;
}

export type RunRecord = Omit<RunRecordWithId, 'id'>;

export type EditorRun = Omit<RunRecordWithId, 'userId'>;

export interface ListRun {
  id: string;
  name: string;
  isPublic: boolean;
  publicSlug: string;
  createdAt: string;
  updatedAt?: string;
  imageSeed: number;
}

export interface RouteBetweenPoints {
  distance: number;
  elevationStats: ElevationStats;
  coordinates: RouteCoordinates[];
}

export interface DirectionsResponse {
  routes: {
    geometry: {
      coordinates: number[][];
    };
    distance: number;
  }[];
}
