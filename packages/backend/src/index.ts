import 'dotenv/config';
import { serve } from '@hono/node-server';
import { app } from './app';
import { getServerPort } from './config/env';

const port = getServerPort();
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
