import { Hono } from 'hono';
import { db } from '../firebase/admin';
import { authMiddleware, type AuthContext } from '../middleware/auth';

const runs = new Hono();

runs.use('*', authMiddleware);

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
    if (runData?.userId !== c.user.uid) {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have access to this run',
        },
        403,
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
    const body = await c.req.json();

    if (!body || typeof body !== 'object') {
      return c.json(
        {
          success: false,
          error: 'Invalid request body',
        },
        400,
      );
    }
    const runData = {
      ...body,
      userId: c.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection('runs').add(runData);

    return c.json(
      {
        success: true,
        data: {
          id: docRef.id,
          ...runData,
        },
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

runs.put('/:id', async (c: AuthContext) => {
  try {
    const runId = c.req.param('id');

    if (!runId) {
      return c.json(
        {
          success: false,
          error: 'Run ID is required',
        },
        400,
      );
    }
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

    const existingData = runDoc.data();
    if (existingData?.userId !== c.user.uid) {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have access to this run',
        },
        403,
      );
    }

    const body = await c.req.json();

    if (!body || typeof body !== 'object') {
      return c.json(
        {
          success: false,
          error: 'Invalid request body',
        },
        400,
      );
    }

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    delete updateData.userId;
    delete updateData.createdAt;

    await db.collection('runs').doc(runId).update(updateData);

    const updatedDoc = await db.collection('runs').doc(runId).get();

    return c.json({
      success: true,
      data: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    console.error('Error updating run:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to update run',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

runs.delete('/:id', async (c: AuthContext) => {
  try {
    const runId = c.req.param('id');

    if (!runId) {
      return c.json(
        {
          success: false,
          error: 'Run ID is required',
        },
        400,
      );
    }
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
    if (runData?.userId !== c.user.uid) {
      return c.json(
        {
          success: false,
          error: 'Forbidden',
          message: 'You do not have access to this run',
        },
        403,
      );
    }

    await db.collection('runs').doc(runId).delete();

    return c.json({
      success: true,
      message: 'Run deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting run:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to delete run',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
});

export default runs;
