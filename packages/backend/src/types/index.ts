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

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  type: WayPointType;
  distance: number;
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

export interface EditorRun extends Omit<
  RunRecordWithId,
  'publicSlug' | 'userId'
> {
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
