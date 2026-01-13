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

// POST /runs - Create a new run
runs.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const { name, routeData, ...otherFields } = body;

    // Validate required fields
    if (!name) {
      return c.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Run name is required',
        },
        400,
      );
    }

    if (!routeData) {
      return c.json(
        {
          success: false,
          error: 'Validation error',
          message: 'Route data is required',
        },
        400,
      );
    }

    // Create run document
    const runData = {
      name,
      routeData,
      ...otherFields,
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

// PUT /runs/:id - Update a run
runs.put('/:id', async (c) => {
  try {
    const runId = c.req.param('id');
    const body = await c.req.json();

    // Check if run exists
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

    // Update run
    const updateData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('runs').doc(runId).update(updateData);

    // Fetch updated document
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

// DELETE /runs/:id - Delete a run
runs.delete('/:id', async (c) => {
  try {
    const runId = c.req.param('id');

    // Check if run exists
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
