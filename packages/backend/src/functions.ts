import 'dotenv/config';
import { onRequest } from 'firebase-functions/v2/https';
import { getRequestListener } from '@hono/node-server';

import { app } from './app.js';
import { DEFAULT_FUNCTION_MEMORY } from './config/constants.js';
import {
  getFunctionMaxInstances,
  getFunctionRegion,
  getFunctionTimeoutSeconds,
} from './config/env.js';

const listener = getRequestListener(app.fetch);

export const api = onRequest(
  {
    region: getFunctionRegion(),
    maxInstances: getFunctionMaxInstances(),
    minInstances: 0,
    timeoutSeconds: getFunctionTimeoutSeconds(),
    memory: DEFAULT_FUNCTION_MEMORY,
  },
  listener,
);
