import { useMediaQuery } from '~/hooks/useMediaQuery';

const EXPANDED = {
  sm: 180,
  md: 200,
  lg: 200,
  xl: 250,
};

const COMPACT = {
  sm: 120,
  md: 120,
  lg: 120,
  xl: 150,
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

  return {
    height: isExpanded ? EXPANDED[size] : COMPACT[size],
    compactHeight: COMPACT[size],
    expandedHeight: EXPANDED[size],
  };
};
