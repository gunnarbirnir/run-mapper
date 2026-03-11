import { motion } from 'motion/react';

import { Dropdown } from '~/primitives';
import { spacingPx, cn } from '~/utils';
import { DRAWER_ANIMATION_DURATION, DEFAULT_EASING } from '~/constants';
import type { PublicRoute } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';

const NUMBER_OF_OPTIONS = 2;

interface RouteDropdownProps {
  routes: PublicRoute[];
  activeRouteId: string;
  size: number;
  setActiveRoute: (routeId: string) => void;
}

export const RouteDropdown = ({
  routes,
  activeRouteId,
  size,
  setActiveRoute,
}: RouteDropdownProps) => {
  const { isSmallScreen, isMediumScreen } = useMediaQuery();
  const baseSpacing = spacingPx(3);
  const betweenSpacing = spacingPx(4);
  const top = baseSpacing;
  const right = isSmallScreen
    ? baseSpacing
    : betweenSpacing + NUMBER_OF_OPTIONS * (size + baseSpacing);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: DRAWER_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
      className="pointer-events-auto absolute"
      style={{ top, right }}
    >
      <Dropdown
        value={activeRouteId}
        onChange={(value) => (value ? setActiveRoute(value) : null)}
        items={routes.map((route) => ({ label: route.name, value: route.id }))}
        className={cn(
          'w-40 rounded-xl bg-gray-100 shadow-md hover:bg-white data-popup-open:bg-white',
          {
            'w-32 min-w-32': isMediumScreen,
          },
        )}
        popupClassName="shadow-md"
        style={{ height: size }}
      />
    </motion.div>
  );
};
