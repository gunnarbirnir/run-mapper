import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl, { type Map } from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import { api } from '~/service';
import { PageLayout } from '~/components/PageLayout';
import { Text, Button, Form } from '~/primitives';
import type { ApiResponse } from '~/types';
import { MAP_STYLES } from '~/components/RunRouteMap/constants';

const MAX_ROUTE_PAYLOAD_BYTES = 1024 * 1024;

export const Route = createFileRoute('/editor/run/new')({
  component: NewEditorRun,
});

interface Point {
  id: string;
  lng: number;
  lat: number;
  elevation: number;
}

function NewEditorRun() {
  const [name, setName] = useState('');
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPointIds, setSelectedPointIds] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);
  const [fetchingElevation, setFetchingElevation] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const isMapLoadedRef = useRef(false);
  const shouldKeepDrawingRef = useRef(true);

  const fetchElevationForPoints = useCallback(
    async (pointsToFetch: Point[]) => {
      if (pointsToFetch.length === 0) return;
      if (!mapRef.current) return;

      setFetchingElevation(true);

      try {
        // Wait a bit for terrain to be ready if needed
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use Mapbox's queryTerrainElevation method
        const updatedPoints = await Promise.all(
          pointsToFetch.map(async (point) => {
            try {
              // Try querying elevation, with retries if needed
              let elevation: number | null = null;
              for (let attempt = 0; attempt < 3; attempt++) {
                elevation =
                  mapRef.current?.queryTerrainElevation([
                    point.lng,
                    point.lat,
                  ]) ?? null;

                if (elevation !== null && elevation !== undefined) {
                  break;
                }

                // Wait a bit before retrying
                if (attempt < 2) {
                  await new Promise((resolve) => setTimeout(resolve, 200));
                }
              }

              if (elevation !== null && elevation !== undefined) {
                return { ...point, elevation };
              } else {
                console.warn(
                  `Elevation not available for point ${point.id} after retries`,
                );
                return { ...point, elevation: 0 };
              }
            } catch (err) {
              console.warn(
                `Error querying elevation for point ${point.id}:`,
                err,
              );
              return { ...point, elevation: 0 };
            }
          }),
        );

        // Update points with fetched elevations
        const pointIds = pointsToFetch.map((p) => p.id);
        setPoints((prev) => {
          return prev.map((p) => {
            if (pointIds.includes(p.id)) {
              const updatedPoint = updatedPoints.find((up) => up.id === p.id);
              return updatedPoint || p;
            }
            return p;
          });
        });
      } catch (err) {
        // Log error for debugging
        console.error('Failed to fetch elevation:', err);
      } finally {
        setFetchingElevation(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLES.standard,
      center: [-21.9426, 64.1466], // Reykjavik, Iceland
      zoom: 12,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    // Add terrain source for elevation queries
    const addTerrain = () => {
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
      }
    };

    // Add terrain when style loads
    map.on('style.load', addTerrain);

    // Also try to add terrain immediately if style is already loaded
    if (map.isStyleLoaded()) {
      addTerrain();
    }

    // Initialize Mapbox Draw - only allow point drawing
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      defaultMode: 'draw_point',
      controls: {
        point: true,
        line_string: false,
        polygon: false,
        trash: true,
        combine_features: false,
        uncombine_features: false,
      },
      modes: {
        ...MapboxDraw.modes,
      },
    });

    map.addControl(draw as unknown as mapboxgl.IControl);

    map.on('load', () => {
      isMapLoadedRef.current = true;
    });

    // Handle draw events
    map.on('draw.create', (e: MapboxDraw.DrawCreateEvent) => {
      const features = e.features || [];
      const newPoints: Point[] = [];

      features.forEach((feature) => {
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates as [number, number];
          const newPoint: Point = {
            id: feature.id as string,
            lng,
            lat,
            elevation: 0, // Default elevation, will be fetched
          };
          newPoints.push(newPoint);
        }
      });

      if (newPoints.length > 0) {
        setPoints((prev) => [...prev, ...newPoints]);

        // Fetch elevation for new points automatically
        fetchElevationForPoints(newPoints);

        // Keep draw mode active for continuous drawing
        // Use setTimeout to ensure this happens after Mapbox Draw's default mode change
        setTimeout(() => {
          if (drawRef.current) {
            drawRef.current.changeMode('draw_point');
          }
        }, 0);
      }
    });

    map.on('draw.delete', (e: MapboxDraw.DrawDeleteEvent) => {
      const features = e.features || [];
      const deletedIds = features.map((f) => f.id as string);
      setPoints((prev) => prev.filter((p) => !deletedIds.includes(p.id)));
    });

    map.on('draw.update', (e: MapboxDraw.DrawUpdateEvent) => {
      const features = e.features || [];
      features.forEach((feature) => {
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates as [number, number];
          setPoints((prev) =>
            prev.map((p) => (p.id === feature.id ? { ...p, lng, lat } : p)),
          );
        }
      });
    });

    // Keep draw mode active after mode changes (unless Enter was pressed)
    map.on('draw.modechange', (e: MapboxDraw.DrawModeChangeEvent) => {
      const mode = e.mode as string;
      // Reset shouldKeepDrawing when user manually enters draw_point mode
      if (mode === 'draw_point') {
        shouldKeepDrawingRef.current = true;
      }
      // If mode changed to something other than draw_point and we want to keep drawing,
      // switch back to draw_point mode
      else if (
        shouldKeepDrawingRef.current &&
        mode !== 'draw_point' &&
        drawRef.current
      ) {
        setTimeout(() => {
          if (drawRef.current && shouldKeepDrawingRef.current) {
            drawRef.current.changeMode('draw_point');
          }
        }, 0);
      }
    });

    mapRef.current = map;
    drawRef.current = draw;

    // Handle Enter key to exit draw mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && drawRef.current) {
        // Stop continuous drawing
        shouldKeepDrawingRef.current = false;
        // Exit draw mode
        drawRef.current.changeMode('simple_select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      map.remove();
    };
  }, [fetchElevationForPoints]);

  const togglePointSelection = (id: string) => {
    setSelectedPointIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAllPoints = () => {
    setSelectedPointIds(new Set(points.map((p) => p.id)));
  };

  const deselectAllPoints = () => {
    setSelectedPointIds(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (points.length === 0) {
        setError('Please add at least one point on the map');
        setLoading(false);
        return;
      }

      // Calculate bounding box from points
      const lngs = points.map((p) => p.lng);
      const lats = points.map((p) => p.lat);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      const routeData = {
        boundingBox: [
          { lat: minLat, lng: minLng },
          { lat: maxLat, lng: maxLng },
        ] as [{ lat: number; lng: number }, { lat: number; lng: number }],
        coordinates: points.map((p) => ({
          lat: p.lat,
          lng: p.lng,
          elevation: p.elevation,
        })),
      };

      const payloadSize = new TextEncoder().encode(
        JSON.stringify(routeData),
      ).length;
      if (payloadSize > MAX_ROUTE_PAYLOAD_BYTES) {
        setError(
          `Route data is too large (${Math.ceil(payloadSize / 1024)} KB). Max allowed is ${Math.floor(MAX_ROUTE_PAYLOAD_BYTES / 1024)} KB.`,
        );
        setLoading(false);
        return;
      }

      const response = await api.post<ApiResponse<{ id: string }>>(
        '/runs/editor',
        {
          name: name || undefined,
          routeData,
        },
      );

      if (response.success) {
        navigate({ to: `/editor/run/${response.data.id}` });
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('Payload exceeds')) {
        setError(
          `Route data is too large. Max allowed is ${Math.floor(MAX_ROUTE_PAYLOAD_BYTES / 1024)} KB.`,
        );
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create run');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageLayout.MainContent>
        <Text element="h1">Create New Run</Text>
        <Form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}
          <Form.TextInput
            id="name"
            name="name"
            label="Run Name"
            placeholder="Enter run name"
            value={name}
            onChange={setName}
          />

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Map Editor</label>
            <div className="h-96 w-full rounded border border-gray-300">
              <div ref={mapContainerRef} className="h-full w-full" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Click on the map to add points. Keep clicking to add more points.
              Press Enter to stop adding points. Elevation is automatically
              fetched.
            </p>
          </div>

          {points.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Points ({points.length})
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllPoints}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={deselectAllPoints}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {fetchingElevation && (
                <div className="mb-3 rounded border border-gray-300 bg-gray-50 p-3">
                  <span className="text-sm text-gray-600">
                    Fetching elevation...
                  </span>
                </div>
              )}

              <div className="max-h-64 space-y-2 overflow-y-auto rounded border border-gray-300 p-3">
                {points.map((point, index) => {
                  const isSelected = selectedPointIds.has(point.id);
                  return (
                    <div
                      key={point.id}
                      className={`flex items-center gap-2 rounded p-2 ${
                        isSelected
                          ? 'border-2 border-blue-400 bg-blue-100'
                          : 'bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => togglePointSelection(point.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium">
                        Point {index + 1}:
                      </span>
                      <span className="text-sm text-gray-600">
                        {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                      </span>
                      <span className="ml-auto text-sm text-gray-600">
                        Elevation: {point.elevation.toFixed(1)} m
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Creating...' : 'Create Run'}
          </Button>
        </Form>
      </PageLayout.MainContent>
    </PageLayout>
  );
}
