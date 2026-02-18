import 'dotenv/config';
import { serve } from '@hono/node-server';

import { app } from './app.js';
import { getServerPort } from './config/env.js';

const port = getServerPort();
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
