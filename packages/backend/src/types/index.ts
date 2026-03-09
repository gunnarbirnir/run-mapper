export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
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
  routes: PublicRoute[];
}

export type PublicRunRecord = Omit<PublicRun, 'id'>;

export interface EditorRun extends PublicRun {
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
  publicSlug?: string;
}

export type EditorRunRecord = Omit<EditorRun, 'id'>;
