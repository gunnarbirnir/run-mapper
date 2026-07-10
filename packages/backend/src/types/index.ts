export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
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

export type PointOfInterestType =
  | 'expo'
  | 'bag-drop-off'
  | 'warm-up-area'
  | 'food-and-drinks'
  | 'entertainment'
  | 'spectator-area'
  | 'aid-station'
  | 'showers-and-changing-rooms'
  | 'award-ceremony'
  | 'information'
  | 'restrooms'
  | 'parking';

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: WayPointType;
  position: number;
  amenities?: WayPointType[];
};

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
