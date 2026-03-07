export type Coordinates = { lat: number; lng: number };
export type BoundingBox = [Coordinates, Coordinates];
// What Mapbox uses
export type Bounds = [[number, number], [number, number]];
export type Elevation = { value: number; distance: number };

export type RunCoordinates = Coordinates & {
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

export interface PublicRun {
  id: string;
  name: string;
  slug?: string;
  boundingBox: BoundingBox;
  coordinates: RunCoordinates[];
  waypoints: Waypoint[];
}

export interface EditorRun extends PublicRun {
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
}

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};

export interface WidgetBaseProps {
  index: number;
  publicRunDisplaySize: {
    width: number;
    height: number;
  };
  widgetSizes: number[];
  showGraphWhileActive?: boolean;
  isActive?: boolean;
  isOpen?: boolean;
  isExpanded?: boolean;
  isAnyActive?: boolean;
  isAnyOpen?: boolean;
  isAnyExpanded?: boolean;
  toggleActive?: () => void;
  setWidgetSizes: (sizes: (prev: number[]) => number[]) => void;
}

export type WidgetType = 'distance' | 'elevation';
export type DrawerType = 'settings' | 'waypoints';
export type MapStyle = 'standard' | 'satellite';
