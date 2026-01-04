export type RouteFeature = GeoJSON.Feature;
export type LineFeature = GeoJSON.Feature<GeoJSON.LineString>;

export interface MapContainerProps {
  routeId: string;
  bounds: [number, number, number, number];
  routeFeatures: RouteFeature[];
}
