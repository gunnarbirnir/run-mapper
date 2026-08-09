export const API_INFO = {
  message: 'Spretta Backend API',
  version: '0.1.0',
} as const;

export const DEFAULT_PORT = 3001;
export const DEFAULT_FUNCTION_REGION = 'us-central1';
export const DEFAULT_FUNCTION_MAX_INSTANCES = 1;
export const DEFAULT_FUNCTION_TIMEOUT_SECONDS = 15;
export const DEFAULT_FUNCTION_MEMORY = '128MiB';

export const DEFAULT_ALLOWED_ORIGINS = [
  'https://www.spretta.fit',
  'https://run-mapper-ten.vercel.app',
  'https://run-mapper-git-staging-gunnar-olafssons-projects.vercel.app',
  'http://localhost:3000',
] as const;

export const MAX_RUN_DATA_BYTES = 1024 * 1024;
export const MAX_RUN_NAME_LENGTH = 120;
export const MAX_RUN_POINTS_OF_INTEREST = 1000;
export const MAX_RUN_ROUTES = 100;
export const MAX_ROUTE_COORDINATES = 10_000;
export const MAX_ROUTE_WAYPOINTS = 1000;
export const PUBLIC_SLUG_REGEX = /^[a-z0-9-]{3,64}$/;

export const POINT_OF_INTEREST_VALUES = [
  'expo',
  'bag-drop-off',
  'warm-up-area',
  'food-and-drinks',
  'entertainment',
  'spectator-area',
  'aid-station',
  'showers-and-changing-rooms',
  'award-ceremony',
  'information',
  'restrooms',
  'parking',
] as const;

export const WAYPOINT_VALUES = [
  'start',
  'energy',
  'hydration',
  'entertainment',
  'timing',
  'restrooms',
  'end',
] as const;
