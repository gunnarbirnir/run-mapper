export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
// What Mapbox uses
export type Bounds = [[number, number], [number, number]];
export type Elevation = { value: number; distance: number };

export type RouteCoordinates = Coordinates & {
  elevation: number;
};

export type WayPointType =
  | 'energy'
  | 'hydration'
  | 'entertainment'
  | 'timing'
  | 'restrooms'
  | 'start'
  | 'end';

export type InnerWayPointType = Exclude<WayPointType, 'start' | 'end'>;

export type Amenity = {
  type: InnerWayPointType;
  label?: string;
};

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: WayPointType;
  distance: number;
  amenities?: Amenity[];
};

export type PointOfInterestType =
  | 'expo'
  | 'food-and-drink'
  | 'entertainment'
  | 'aid-station'
  | 'parking'
  | 'restrooms'
  | 'information'
  | 'bag-drop-off'
  | 'shower-and-changing-rooms'
  | 'award-ceremony'
  | 'warm-up-area'
  | 'spectator-area';

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

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export type MapStyle = 'standard' | 'satellite';
