import { db } from '../firebase/admin.js';
import type {
  BoundingBox,
  Coordinates,
  RouteCoordinates,
  Waypoint,
  PublicRoute,
} from '../types/index.js';
import { randomBytes } from 'crypto';

const RUN_ID = 'N4zQOJc8HpKLfxz3KgvS';

const generateId = () => randomBytes(12).toString('hex');

function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function computeCumulativeDistances(coords: RouteCoordinates[]): number[] {
  const distances = [0];
  for (let i = 1; i < coords.length; i++) {
    distances.push(distances[i - 1] + haversineDistance(coords[i - 1], coords[i]));
  }
  return distances;
}

function sliceRouteByDistance(
  coords: RouteCoordinates[],
  cumulativeDistances: number[],
  targetMeters: number,
): RouteCoordinates[] {
  const endIndex = cumulativeDistances.findIndex((d) => d >= targetMeters);
  if (endIndex === -1) return coords;
  return coords.slice(0, endIndex + 1);
}

function computeBoundingBox(coords: RouteCoordinates[]): BoundingBox {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;

  for (const c of coords) {
    if (c.lat < minLat) minLat = c.lat;
    if (c.lat > maxLat) maxLat = c.lat;
    if (c.lng < minLng) minLng = c.lng;
    if (c.lng > maxLng) maxLng = c.lng;
  }

  return [
    { lat: minLat, lng: minLng },
    { lat: maxLat, lng: maxLng },
  ];
}

function filterWaypointsForDistance(
  waypoints: Waypoint[],
  maxDistance: number,
): Waypoint[] {
  return waypoints.filter((wp) => {
    if (wp.type === 'start') return true;
    if (wp.type === 'end') return false;
    return wp.distance <= maxDistance;
  });
}

function createEndWaypoint(coords: RouteCoordinates[], totalDistance: number): Waypoint {
  const last = coords[coords.length - 1];
  return {
    id: generateId(),
    name: 'Finish',
    coordinates: { lat: last.lat, lng: last.lng },
    type: 'end',
    distance: totalDistance,
  };
}

function buildRoute(
  name: string,
  coords: RouteCoordinates[],
  waypoints: Waypoint[],
  boundingBox: BoundingBox,
): PublicRoute {
  return {
    id: generateId(),
    name,
    boundingBox,
    coordinates: coords,
    waypoints,
  };
}

async function migrate() {
  console.log(`Reading document runs/${RUN_ID}...`);
  const docRef = db.collection('runs').doc(RUN_ID);
  const doc = await docRef.get();

  if (!doc.exists) {
    console.error(`Document runs/${RUN_ID} not found`);
    process.exit(1);
  }

  const data = doc.data()!;

  const existingCoordinates: RouteCoordinates[] = data.coordinates ?? [];
  const existingWaypoints: Waypoint[] = data.waypoints ?? [];
  const existingBoundingBox: BoundingBox = data.boundingBox ?? [
    { lat: 0, lng: 0 },
    { lat: 0, lng: 0 },
  ];

  if (existingCoordinates.length === 0) {
    console.error('No coordinates found on the document — nothing to migrate');
    process.exit(1);
  }

  console.log(`Found ${existingCoordinates.length} coordinates, ${existingWaypoints.length} waypoints`);

  const cumulativeDistances = computeCumulativeDistances(existingCoordinates);
  const totalDistance = cumulativeDistances[cumulativeDistances.length - 1];
  console.log(`Total route distance: ${(totalDistance / 1000).toFixed(2)} km`);

  // Full 21km route — use existing data as-is
  const fullRoute = buildRoute(
    '21 km',
    existingCoordinates,
    existingWaypoints,
    existingBoundingBox,
  );
  console.log(`Full route: ${existingCoordinates.length} coords, ${existingWaypoints.length} waypoints`);

  // 10km route
  const coords10k = sliceRouteByDistance(existingCoordinates, cumulativeDistances, 10_000);
  const dist10k = computeCumulativeDistances(coords10k);
  const actualDist10k = dist10k[dist10k.length - 1];
  const waypoints10k = [
    ...filterWaypointsForDistance(existingWaypoints, actualDist10k),
    createEndWaypoint(coords10k, actualDist10k),
  ];
  const route10k = buildRoute('10 km', coords10k, waypoints10k, computeBoundingBox(coords10k));
  console.log(`10km route: ${coords10k.length} coords, ${waypoints10k.length} waypoints, actual distance: ${(actualDist10k / 1000).toFixed(2)} km`);

  // 5km route
  const coords5k = sliceRouteByDistance(existingCoordinates, cumulativeDistances, 5_000);
  const dist5k = computeCumulativeDistances(coords5k);
  const actualDist5k = dist5k[dist5k.length - 1];
  const waypoints5k = [
    ...filterWaypointsForDistance(existingWaypoints, actualDist5k),
    createEndWaypoint(coords5k, actualDist5k),
  ];
  const route5k = buildRoute('5 km', coords5k, waypoints5k, computeBoundingBox(coords5k));
  console.log(`5km route: ${coords5k.length} coords, ${waypoints5k.length} waypoints, actual distance: ${(actualDist5k / 1000).toFixed(2)} km`);

  const routes = [fullRoute, route10k, route5k];

  const update: Record<string, unknown> = {
    routes,
    defaultRouteId: fullRoute.id,
  };

  // Move slug to publicSlug if it exists and publicSlug doesn't
  if (data.slug && !data.publicSlug) {
    update.publicSlug = data.slug;
  }

  console.log('\nUpdating document...');
  await docRef.update({
    ...update,
    // Remove old top-level fields
    coordinates: admin.firestore.FieldValue.delete(),
    waypoints: admin.firestore.FieldValue.delete(),
    boundingBox: admin.firestore.FieldValue.delete(),
    slug: admin.firestore.FieldValue.delete(),
  });

  console.log('Migration complete!');
  console.log(`  Routes: ${routes.map((r) => r.name).join(', ')}`);
  console.log(`  Default route: ${fullRoute.name} (${fullRoute.id})`);
}

// Need the admin import for FieldValue
import admin from 'firebase-admin';

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
