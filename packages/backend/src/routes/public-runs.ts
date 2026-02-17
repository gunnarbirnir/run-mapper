import { Hono } from 'hono';
import { db } from '../firebase/admin.js';
import { isValidPublicSlug, normalizePublicSlug } from '../utils/publicSlug.js';

const publicRuns = new Hono();

interface BaseCoordinate {
  lat: number;
  lng: number;
}

interface RunCoordinate extends BaseCoordinate {
  elevation: number;
}

interface Waypoint {
  id: string;
  name: string;
  description?: string;
  coordinates: BaseCoordinate;
  type: 'energy' | 'entertainment' | 'start' | 'end';
}

interface PublicRun {
  id: string;
  name: string;
  boundingBox: [BaseCoordinate, BaseCoordinate];
  coordinates: RunCoordinate[];
  waypoints: Waypoint[];
}

const defaultBoundingBox: [BaseCoordinate, BaseCoordinate] = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 0 },
];

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isValidCoordinate = (value: unknown): value is BaseCoordinate => {
  if (!value || typeof value !== 'object') return false;
  const coordinate = value as BaseCoordinate;
  return (
    isFiniteNumber(coordinate.lat) &&
    isFiniteNumber(coordinate.lng) &&
    coordinate.lat >= -90 &&
    coordinate.lat <= 90 &&
    coordinate.lng >= -180 &&
    coordinate.lng <= 180
  );
};

const isValidRunCoordinate = (value: unknown): value is RunCoordinate => {
  if (!isValidCoordinate(value)) return false;
  return isFiniteNumber((value as RunCoordinate).elevation);
};

const isValidWaypoint = (value: unknown): value is Waypoint => {
  if (!value || typeof value !== 'object') return false;
  const waypoint = value as Waypoint;
  return (
    typeof waypoint.id === 'string' &&
    typeof waypoint.name === 'string' &&
    isValidCoordinate(waypoint.coordinates) &&
    ['energy', 'entertainment', 'start', 'end'].includes(
      waypoint.type as string,
    )
  );
};

publicRuns.get('/:slug', async (c) => {
  try {
    const slug = normalizePublicSlug(c.req.param('slug'));
    if (!isValidPublicSlug(slug)) {
      return c.json(
        {
          success: false,
          error: 'Invalid slug',
          message:
            'Slug must contain only lowercase letters, numbers, or hyphens and be 3-64 characters long',
        },
        400,
      );
    }

    const runsSnapshot = await db
      .collection('runs')
      .where('publicSlug', '==', slug)
      .limit(1)
      .get();
    const runDoc = runsSnapshot.docs[0];
    if (!runDoc) {
      return c.json(
        {
          success: false,
          error: 'Run not found',
        },
        404,
      );
    }

    const runData = runDoc.data();
    if (!runData || runData.isPublic !== true) {
      return c.json(
        {
          success: false,
          error: 'Run not found',
        },
        404,
      );
    }

    const publicRun: PublicRun = {
      id: runDoc.id,
      name: typeof runData.name === 'string' ? runData.name : 'Untitled Run',
      boundingBox:
        Array.isArray(runData.boundingBox) &&
        runData.boundingBox.length === 2 &&
        isValidCoordinate(runData.boundingBox[0]) &&
        isValidCoordinate(runData.boundingBox[1])
          ? ([
              runData.boundingBox[0],
              runData.boundingBox[1],
            ] as [BaseCoordinate, BaseCoordinate])
          : defaultBoundingBox,
      coordinates: Array.isArray(runData.coordinates)
        ? runData.coordinates.filter((coordinate) => isValidRunCoordinate(coordinate))
        : [],
      waypoints: Array.isArray(runData.waypoints)
        ? runData.waypoints.filter((waypoint) => isValidWaypoint(waypoint))
        : [],
    };

    return c.json({
      success: true,
      data: publicRun,
    });
  } catch (error) {
    console.error('Error fetching public run:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch public run',
        message: 'An unexpected error occurred',
      },
      500,
    );
  }
});

export default publicRuns;
