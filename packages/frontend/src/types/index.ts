export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
// What Mapbox uses
export type Bounds = [[number, number], [number, number]];
export type Elevation = { value: number; distance: number };

export type RouteCoordinates = Coordinates & {
  elevation: number;
};

export type WayPointType = 'energy' | 'entertainment' | 'start' | 'end';

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: WayPointType;
  distance: number;
};

export interface PublicRoute {
  id: string;
  name: string;
  boundingBox: BoundingBox;
  coordinates: RouteCoordinates[];
  waypoints: Waypoint[];
}

export interface PublicRun {
  id: string;
  name: string;
  defaultRouteId?: string;
  publicSlug: string;
  routes: PublicRoute[];
}

export interface EditorRun extends Omit<PublicRun, 'publicSlug'> {
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
  publicSlug?: string;
}

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export type MapStyle = 'standard' | 'satellite';
