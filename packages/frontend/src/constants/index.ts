export const PAGE_MIN_WIDTH = 350;
export const DEFAULT_FADE_IN_DURATION = 0.15;
export const DEFAULT_EASING = 'easeOut';

export const PUBLIC_RUN_DISPLAY_MIN_WIDTH = 300;
export const PUBLIC_RUN_DISPLAY_MIN_HEIGHT = 400;
export const WIDGET_ANIMATION_DURATION = 0.1;
export const DRAWER_ANIMATION_DURATION = 0.1;

// This is also the order they should be displayed in
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

export const INNER_WAYPOINT_VALUES = [
  'energy',
  'hydration',
  'entertainment',
  'timing',
  'restrooms',
] as const;

export const WAYPOINT_VALUES = [
  ...INNER_WAYPOINT_VALUES,
  'start',
  'end',
] as const;
