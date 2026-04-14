import { Hono } from 'hono';
import { authMiddleware, type AuthContext } from '../middleware/auth.js';
import { runController } from '../controllers/run-controller.js';

const runs = new Hono();

runs.use('/list/*', authMiddleware);
runs.use('/editor/*', authMiddleware);

// Authenticated list route
runs.get('/list', (c: AuthContext) => runController.getRunsList(c));

// Authenticated editor routes
runs.get('/editor/:id', (c: AuthContext) => runController.getUserRun(c));
runs.post('/editor', (c: AuthContext) => runController.createRun(c));
runs.put('/editor/:id', (c: AuthContext) =>
  runController.updateRunPublicStatus(c),
);
runs.delete('/editor/:id', (c: AuthContext) => runController.deleteRun(c));

// Public read-only route by slug
runs.get('/public/:slug', (c) => runController.getPublicRun(c));

export default runs;
