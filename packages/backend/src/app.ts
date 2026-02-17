import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { API_INFO } from './config/constants';
import { getAllowedOrigins, isOriginAllowed } from './config/env';
import { db } from './firebase/admin';
import auth from './routes/auth';
import runs from './routes/runs';

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

app.route('/auth', auth);
app.route('/runs', runs);
