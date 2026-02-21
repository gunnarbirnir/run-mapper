import {
  DEFAULT_ALLOWED_ORIGINS,
  DEFAULT_FUNCTION_REGION,
  DEFAULT_FUNCTION_MAX_INSTANCES,
  DEFAULT_FUNCTION_TIMEOUT_SECONDS,
  DEFAULT_PORT,
} from './constants.js';

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/$/, '');

export const getAllowedOrigins = () => {
  if (!process.env.CORS_ALLOWED_ORIGINS) {
    return [...DEFAULT_ALLOWED_ORIGINS].map(normalizeOrigin);
  }

  return process.env.CORS_ALLOWED_ORIGINS.split(',').map(normalizeOrigin);
};

export const isOriginAllowed = (
  origin: string,
  allowedOrigins: readonly string[],
) => {
  const normalizedOrigin = normalizeOrigin(origin);
  if (allowedOrigins.includes('*')) {
    return true;
  }
  return allowedOrigins.includes(normalizedOrigin);
};

export const getServerPort = () => {
  if (!process.env.PORT) {
    return DEFAULT_PORT;
  }
  const parsedPort = Number(process.env.PORT);
  return Number.isFinite(parsedPort) ? parsedPort : DEFAULT_PORT;
};

export const getFunctionRegion = () => {
  return process.env.FUNCTION_REGION || DEFAULT_FUNCTION_REGION;
};

export const getFunctionMaxInstances = () => {
  if (!process.env.FUNCTION_MAX_INSTANCES) {
    return DEFAULT_FUNCTION_MAX_INSTANCES;
  }
  const parsedMaxInstances = Number(process.env.FUNCTION_MAX_INSTANCES);
  if (!Number.isFinite(parsedMaxInstances) || parsedMaxInstances < 1) {
    return DEFAULT_FUNCTION_MAX_INSTANCES;
  }
  return Math.floor(parsedMaxInstances);
};

export const getFunctionTimeoutSeconds = () => {
  if (!process.env.FUNCTION_TIMEOUT_SECONDS) {
    return DEFAULT_FUNCTION_TIMEOUT_SECONDS;
  }
  const parsedTimeout = Number(process.env.FUNCTION_TIMEOUT_SECONDS);
  if (!Number.isFinite(parsedTimeout) || parsedTimeout < 1) {
    return DEFAULT_FUNCTION_TIMEOUT_SECONDS;
  }
  return Math.floor(parsedTimeout);
};

export const shouldCheckRevokedTokens = () => {
  return process.env.AUTH_CHECK_REVOKED === 'true';
};
