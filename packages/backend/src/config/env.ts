import {
  DEFAULT_ALLOWED_ORIGINS,
  DEFAULT_FUNCTION_REGION,
  DEFAULT_PORT,
} from './constants';

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, '');

export const getAllowedOrigins = () => {
  if (!process.env.CORS_ALLOWED_ORIGINS) {
    return [...DEFAULT_ALLOWED_ORIGINS];
  }

  return process.env.CORS_ALLOWED_ORIGINS.split(',').map(normalizeOrigin);
};

export const isOriginAllowed = (
  origin: string,
  allowedOrigins: readonly string[],
) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.includes('*')) return true;
  return allowedOrigins.includes(normalizedOrigin);
};

export const getServerPort = () => {
  if (!process.env.PORT) return DEFAULT_PORT;
  const parsedPort = Number(process.env.PORT);
  return Number.isFinite(parsedPort) ? parsedPort : DEFAULT_PORT;
};

export const getFunctionRegion = () =>
  process.env.FUNCTION_REGION || DEFAULT_FUNCTION_REGION;

export const getFunctionMaxInstances = () => {
  if (!process.env.FUNCTION_MAX_INSTANCES) return undefined;
  const parsedMaxInstances = Number(process.env.FUNCTION_MAX_INSTANCES);
  return Number.isFinite(parsedMaxInstances) ? parsedMaxInstances : undefined;
};
