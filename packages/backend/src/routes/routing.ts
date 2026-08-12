import { Hono } from 'hono';

import { authMiddleware, type AuthContext } from '../middleware/auth.js';
import { routingController } from '../controllers/routing-controller.js';

const routing = new Hono();

routing.use('/*', authMiddleware);

routing.get('/route-between-points', (c: AuthContext) =>
  routingController.getRouteBetweenPoints(c),
);

routing.post('/route-stats', (c: AuthContext) =>
  routingController.getRouteStats(c),
);

export default routing;
