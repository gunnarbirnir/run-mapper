import { Hono } from 'hono';
import { db } from '../firebase/admin';
import { authMiddleware, type AuthContext } from '../middleware/auth';

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
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

runs.post('/', async (c: AuthContext) => {
  try {
    const body = await c.req.json();
    const { name, coordinates, boundingBox } = body;

    // Validate required fields
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return c.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Coordinates are required and must be a non-empty array',
        },
        400,
      );
    }

    if (!boundingBox || !Array.isArray(boundingBox) || boundingBox.length !== 2) {
      return c.json(
        {
          success: false,
          error: 'Invalid request',
          message: 'Bounding box is required and must be an array of two coordinates',
        },
        400,
      );
    }

    // Create run document
    const runData = {
      userId: c.user.uid,
      name: name || null,
      coordinates,
      boundingBox,
      waypoints: [],
      createdAt: new Date().toISOString(),
    };

    const runRef = await db.collection('runs').add(runData);
    const createdRun = {
      id: runRef.id,
      ...runData,
    };

    return c.json(
      {
        success: true,
        data: createdRun,
      },
      201,
    );
  } catch (error) {
    console.error('Error creating run:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to create run',
        message: error instanceof Error ? error.message : 'Unknown error',
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
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

runs.post('/', async (c: AuthContext) => {
  try {
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

    const normalizedRouteData = normalizeRouteData(routeData);
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
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

export default runs;
