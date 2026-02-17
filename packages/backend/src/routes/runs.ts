import { Hono } from 'hono';
import {
  MAX_ROUTE_COORDINATES,
  MAX_ROUTE_DATA_BYTES,
  MAX_ROUTE_WAYPOINTS,
  MAX_RUN_NAME_LENGTH,
} from '../config/constants.js';
import { db } from '../firebase/admin.js';
import { authMiddleware, type AuthContext } from '../middleware/auth.js';

const runs = new Hono();

runs.use('*', authMiddleware);

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

interface RouteDataPayload {
  boundingBox?: [BaseCoordinate, BaseCoordinate];
  coordinates?: RunCoordinate[];
  waypoints?: Waypoint[];
}

const defaultBoundingBox: [BaseCoordinate, BaseCoordinate] = [
  { lat: 0, lng: 0 },
  { lat: 0, lng: 0 },
];

const normalizeRouteData = (routeData?: RouteDataPayload) => {
  return {
    boundingBox: routeData?.boundingBox ?? defaultBoundingBox,
    coordinates: routeData?.coordinates ?? [],
    waypoints: routeData?.waypoints ?? [],
  };
};

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

runs.get('/', async (c: AuthContext) => {
  try {
    const runsSnapshot = await db
      .collection('runs')
      .where('userId', '==', c.user.uid)
      .get();
    const runsList = runsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return c.json({
      success: true,
      data: runsList,
      count: runsList.length,
    });
  } catch (error) {
    console.error('Error fetching runs:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch runs',
        message: 'An unexpected error occurred',
      },
      500,
    );
  }
});

runs.get('/:id', async (c: AuthContext) => {
  try {
    const runId = c.req.param('id');
    const runDoc = await db.collection('runs').doc(runId).get();

    if (!runDoc.exists) {
      return c.json(
        {
          success: false,
          error: 'Run not found',
        },
        404,
      );
    }

    const runData = runDoc.data();
    if (!runData) {
      return c.json(
        {
          success: false,
          error: 'Run not found',
        },
        404,
      );
    }

    if (runData.userId !== c.user?.uid) {
      // Return 404 to avoid leaking whether a run exists for another user.
      return c.json(
        {
          success: false,
          error: 'Run not found',
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: {
        id: runDoc.id,
        ...runData,
      },
    });
  } catch (error) {
    console.error('Error fetching run:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch run',
        message: 'An unexpected error occurred',
      },
      500,
    );
  }
});

runs.post('/', async (c: AuthContext) => {
  try {
    const contentLength = c.req.header('content-length');
    if (contentLength && Number(contentLength) > MAX_ROUTE_DATA_BYTES) {
      return c.json(
        {
          success: false,
          error: 'Payload too large',
          message: `Payload exceeds ${MAX_ROUTE_DATA_BYTES} bytes`,
        },
        413,
      );
    }

    const body = await c.req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'Request body must be a JSON object',
        },
        400,
      );
    }

    const { name, routeData } = body as {
      name?: unknown;
      routeData?: RouteDataPayload;
    };

    if (name !== undefined && typeof name !== 'string') {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'name must be a string',
        },
        400,
      );
    }

    if (
      typeof name === 'string' &&
      name.trim().length > MAX_RUN_NAME_LENGTH
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: `name must be at most ${MAX_RUN_NAME_LENGTH} characters`,
        },
        400,
      );
    }

    if (
      routeData !== undefined &&
      (typeof routeData !== 'object' || routeData === null)
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'routeData must be an object',
        },
        400,
      );
    }

    if (routeData?.coordinates && !Array.isArray(routeData.coordinates)) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'routeData.coordinates must be an array',
        },
        400,
      );
    }

    if (routeData?.waypoints && !Array.isArray(routeData.waypoints)) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'routeData.waypoints must be an array',
        },
        400,
      );
    }

    if (
      routeData?.coordinates &&
      routeData.coordinates.length > MAX_ROUTE_COORDINATES
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: `routeData.coordinates must contain at most ${MAX_ROUTE_COORDINATES} points`,
        },
        400,
      );
    }

    if (routeData?.waypoints && routeData.waypoints.length > MAX_ROUTE_WAYPOINTS) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: `routeData.waypoints must contain at most ${MAX_ROUTE_WAYPOINTS} entries`,
        },
        400,
      );
    }

    if (
      routeData?.boundingBox &&
      (!Array.isArray(routeData.boundingBox) ||
        routeData.boundingBox.length !== 2 ||
        !isValidCoordinate(routeData.boundingBox[0]) ||
        !isValidCoordinate(routeData.boundingBox[1]))
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message:
            'routeData.boundingBox must contain exactly two valid coordinates',
        },
        400,
      );
    }

    if (
      routeData?.coordinates &&
      !routeData.coordinates.every((coordinate) => isValidRunCoordinate(coordinate))
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'routeData.coordinates contains invalid coordinates',
        },
        400,
      );
    }

    if (
      routeData?.waypoints &&
      !routeData.waypoints.every(
        (waypoint) =>
          waypoint &&
          typeof waypoint.id === 'string' &&
          typeof waypoint.name === 'string' &&
          isValidCoordinate(waypoint.coordinates),
      )
    ) {
      return c.json(
        {
          success: false,
          error: 'Invalid payload',
          message: 'routeData.waypoints contains invalid entries',
        },
        400,
      );
    }

    const normalizedRouteData = normalizeRouteData(routeData);
    const payloadBytes = Buffer.byteLength(
      JSON.stringify(normalizedRouteData),
      'utf8',
    );
    if (payloadBytes > MAX_ROUTE_DATA_BYTES) {
      return c.json(
        {
          success: false,
          error: 'Payload too large',
          message: `routeData exceeds ${MAX_ROUTE_DATA_BYTES} bytes`,
        },
        413,
      );
    }

    const normalizedName =
      typeof name === 'string' && name.trim() ? name.trim() : 'Untitled Run';
    const runToCreate = {
      userId: c.user?.uid,
      name: normalizedName,
      createdAt: new Date().toISOString(),
      ...normalizedRouteData,
    };

    const runRef = await db.collection('runs').add(runToCreate);

    return c.json(
      {
        success: true,
        data: { id: runRef.id },
      },
      201,
    );
  } catch (error) {
    console.error('Error creating run:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to create run',
        message: 'An unexpected error occurred',
      },
      500,
    );
  }
});

export default runs;
