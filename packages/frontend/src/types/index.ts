import { POINT_OF_INTEREST_VALUES, WAYPOINT_VALUES } from '~/constants';

export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
// What Mapbox uses
export type Bounds = [[number, number], [number, number]];
export type Elevation = { value: number; distance: number };

export type RouteCoordinates = Coordinates & {
  elevation: number;
};

export type WaypointType = (typeof WAYPOINT_VALUES)[number];

export type InnerWaypointType = Exclude<WaypointType, 'start' | 'end'>;

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: WaypointType;
  position: number;
  amenities?: InnerWaypointType[];
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
  displayDistance?: number;
}

export interface PublicRun {
  id: string;
  name: string;
  defaultRouteId?: string;
  publicSlug: string;
  routes: PublicRoute[];
  pointsOfInterest: PointOfInterest[];
}

export interface EditorRun extends Omit<PublicRun, 'publicSlug'> {
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
  publicSlug?: string;
}

export interface ListRun {
  id: string;
  name: string;
  isPublic: boolean;
  publicSlug: string;
  createdAt: string;
  updatedAt?: string;
  imageSeed: number;
}

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export type MapStyle = 'standard' | 'satellite';
