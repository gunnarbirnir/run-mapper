export type Coordinates = [number, number];
export type Bounds = [Coordinates, Coordinates];
export type Elevation = { value: number; distance: number };

export type BaseCoordinate = {
  lat: number;
  lng: number;
};

export type RunCoordinates = BaseCoordinate & {
  elevation: number;
};

export type WayPointType = 'energy' | 'entertainment';

export type Waypoint = {
  id: string;
  name: string;
  description?: string;
  coordinates: BaseCoordinate;
  type: WayPointType;
};

export interface Run {
  id: string;
  userId: string;
  createdAt: string;
  name: string;
  boundingBox: [BaseCoordinate, BaseCoordinate];
  coordinates: RunCoordinates[];
  waypoints: Waypoint[];
}

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export interface WidgetBaseProps {
  index: number;
  runRouteSize: {
    width: number;
    height: number;
  };
  showGraphWhileActive?: boolean;
  isActive?: boolean;
  isOpen?: boolean;
  isExpanded?: boolean;
  isAnyActive?: boolean;
  isAnyOpen?: boolean;
  isAnyExpanded?: boolean;
  onToggleActive?: () => void;
}

export type WidgetType = 'distance' | 'elevation';
export type DrawerType = 'settings';
