import 'dotenv/config';
import { onRequest } from 'firebase-functions/v2/https';
import { getRequestListener } from '@hono/node-server';
import { app } from './app';
import { getFunctionMaxInstances, getFunctionRegion } from './config/env';

const listener = getRequestListener(app.fetch);

export const api = onRequest(
  {
    region: getFunctionRegion(),
    maxInstances: getFunctionMaxInstances(),
  },
  listener,
);
