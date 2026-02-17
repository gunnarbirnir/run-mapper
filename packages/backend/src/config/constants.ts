export const API_INFO = {
  message: 'Run Mapper Backend API',
  version: '0.1.0',
} as const;

export const DEFAULT_PORT = 3001;
export const DEFAULT_FUNCTION_REGION = 'us-central1';
export const DEFAULT_FUNCTION_MAX_INSTANCES = 1;
export const DEFAULT_FUNCTION_TIMEOUT_SECONDS = 15;
export const DEFAULT_FUNCTION_MEMORY = '128MiB';

export const DEFAULT_ALLOWED_ORIGINS = [
  'https://run-mapper-ten.vercel.app',
  'https://runmapper.fit',
  'http://localhost:3000',
  'http://localhost:5173',
] as const;

export const MAX_RUN_NAME_LENGTH = 120;
export const MAX_ROUTE_DATA_BYTES = 256 * 1024;
export const MAX_ROUTE_COORDINATES = 5000;
export const MAX_ROUTE_WAYPOINTS = 100;
