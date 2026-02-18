import { PUBLIC_SLUG_REGEX } from '../config/constants.js';

export const normalizePublicSlug = (value: string) => {
  return value.trim().toLowerCase();
};

export const isValidPublicSlug = (value: string) => {
  return PUBLIC_SLUG_REGEX.test(value);
};
