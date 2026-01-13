import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { db } from './firebase/admin';
import runs from './routes/runs';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({
    message: 'Run Mapper Backend API',
    version: '0.1.0',
  });
});

app.get('/health', async (c) => {
  try {
    // Test Firebase connection
    await db.collection('_health').limit(1).get();
    return c.json({
      status: 'ok',
      firebase: 'connected',
    });
  } catch (error) {
    return c.json(
      {
        status: 'ok',
        firebase: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      503,
    );
  }
});

// Mount routes
app.route('/runs', runs);

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
