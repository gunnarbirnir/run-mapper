import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { API_INFO } from './config/constants.js';
import { getAllowedOrigins, isOriginAllowed } from './config/env.js';
import { db } from './firebase/admin.js';
import auth from './routes/auth.js';
import publicRuns from './routes/public-runs.js';
import runs from './routes/runs.js';

const allowedOrigins = getAllowedOrigins();

export const app = new Hono();

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return '*';
      return isOriginAllowed(origin, allowedOrigins) ? origin : null;
    },
  }),
);

app.get('/', (c) => {
  return c.json(API_INFO);
});

app.get('/health', async (c) => {
  try {
    await db.collection('_health').limit(1).get();
    return c.json({
      status: 'ok',
      firebase: 'connected',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json(
      {
        status: 'error',
        firebase: 'error',
      },
      503,
    );
  }
});

app.route('/auth', auth);
app.route('/runs', runs);
app.route('/public-runs', publicRuns);
