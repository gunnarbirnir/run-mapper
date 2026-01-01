import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
// import { firebaseAdmin } from './firebase/admin';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => {
  return c.json({
    message: 'Run Mapper Backend API',
    version: '0.1.0',
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
