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

export default runs;
