import { PUBLIC_SLUG_REGEX } from '../config/constants.js';

export const normalizePublicSlug = (value: string) => value.trim().toLowerCase();

export const isValidPublicSlug = (value: string) => PUBLIC_SLUG_REGEX.test(value);
