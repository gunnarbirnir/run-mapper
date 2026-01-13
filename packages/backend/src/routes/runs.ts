import { Hono } from 'hono';
import { db } from '../firebase/admin';
// import copenhagenHalf from '../data/copenhagen-half.json';

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
// runs.post('/', async (c) => {
//   try {
//     const body = await c.req.json();
//     const points = copenhagenHalf.points;
//     const coordinates = points.map((point) => point.coordinates);
//     const elevations = points.map((point) => point.elevation);

//     const { name } = body;

//     // // Validate required fields
//     if (!name) {
//       return c.json(
//         {
//           success: false,
//           error: 'Validation error',
//           message: 'Run name is required',
//         },
//         400,
//       );
//     }

//     // Create run document
//     const runData = {
//       name: 'Copenhagen Half',
//       coordinates: coordinates.map((coordinate, index) => {
//         return {
//           lat: coordinate[0],
//           lng: coordinate[1],
//           elevation: elevations[index],
//         };
//       }),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     const docRef = await db.collection('runs').add(runData);
//     console.log(runData);

//     return c.json(
//       {
//         success: true,
//         data: {
//           id: docRef.id,
//           ...runData,
//         },
//       },
//       201,
//     );
//   } catch (error) {
//     console.error('Error creating run:', error);
//     return c.json(
//       {
//         success: false,
//         error: 'Failed to create run',
//         message: error instanceof Error ? error.message : 'Unknown error',
//       },
//       500,
//     );
//   }
// });

export default runs;
