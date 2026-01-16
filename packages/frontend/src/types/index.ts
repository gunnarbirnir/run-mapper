export type Coordinates = [number, number];
export type Bounds = [Coordinates, Coordinates];
export type Elevation = { value: number; distance: number };

export type BoundingBox = [
  { lat: number; lng: number },
  { lat: number; lng: number },
];

export type RunCoordinates = { lat: number; lng: number; elevation: number };

export interface Run {
  id: string;
  userId: string;
  createdAt: string;
  name: string;
  boundingBox: BoundingBox;
  coordinates: RunCoordinates[];
}

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};
