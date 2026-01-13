import { Hono } from 'hono';
import { db } from '../firebase/admin';

const runs = new Hono();

// GET /runs - List all runs
runs.get('/', async (c) => {
  try {
    const runsSnapshot = await db.collection('runs').get();
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

// GET /runs/:id - Get a specific run
runs.get('/:id', async (c) => {
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

    return c.json({
      success: true,
      data: {
        id: runDoc.id,
        ...runDoc.data(),
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

export default runs;
