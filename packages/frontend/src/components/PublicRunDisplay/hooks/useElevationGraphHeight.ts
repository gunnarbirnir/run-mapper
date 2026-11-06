import { useMediaQuery } from '~/hooks/useMediaQuery';
import { convertRemToPixels } from '~/utils';

const EXPANDED = {
  sm: '10rem',
  md: '12rem',
  lg: '12rem',
  xl: '15rem',
};

const COMPACT = {
  sm: '7.5rem',
  md: '7.5rem',
  lg: '7.5rem',
  xl: '10rem',
};

export const useElevationGraphHeight = (isExpanded = false) => {
  const { isSmallScreen, isMediumScreen, isLargeScreen } = useMediaQuery();
  const size = isSmallScreen
    ? 'sm'
    : isMediumScreen
      ? 'md'
      : isLargeScreen
        ? 'lg'
        : 'xl';
  const expandedHeight = convertRemToPixels(EXPANDED[size]);
  const compactHeight = convertRemToPixels(COMPACT[size]);

  return {
    height: isExpanded ? expandedHeight : compactHeight,
    compactHeight,
    expandedHeight,
  };
};
