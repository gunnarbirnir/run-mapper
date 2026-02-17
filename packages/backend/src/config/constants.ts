export const API_INFO = {
  message: 'Run Mapper Backend API',
  version: '0.1.0',
} as const;

export const DEFAULT_PORT = 3001;
export const DEFAULT_FUNCTION_REGION = 'us-central1';

export const DEFAULT_ALLOWED_ORIGINS = [
  'https://run-mapper-ten.vercel.app',
  'https://runmapper.fit',
  'http://localhost:3000',
  'http://localhost:5173',
] as const;
