import { convertRemToPixels } from '~/utils';

import { useWindowDimensions } from '~/hooks/useWindowDimensions';

// Note: not synced with Tailwind containers
const SMALL_SCREEN_WIDTH = '32rem';
const MEDIUM_SCREEN_WIDTH = '48rem';
const LARGE_SCREEN_WIDTH = '64rem';
const X_LARGE_SCREEN_WIDTH = '80rem';

export const useMediaQuery = () => {
  const { width: windowWidth } = useWindowDimensions();

  return {
    isSmallScreen: windowWidth < convertRemToPixels(SMALL_SCREEN_WIDTH),
    isMediumScreen: windowWidth < convertRemToPixels(MEDIUM_SCREEN_WIDTH),
    isLargeScreen: windowWidth < convertRemToPixels(LARGE_SCREEN_WIDTH),
    isXLargeScreen: windowWidth < convertRemToPixels(X_LARGE_SCREEN_WIDTH),
  };
};
