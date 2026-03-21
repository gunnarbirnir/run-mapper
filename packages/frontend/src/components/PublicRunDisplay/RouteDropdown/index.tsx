import { motion } from 'motion/react';

import { Dropdown, Tooltip } from '~/primitives';
import { spacingPx, cn } from '~/utils';
import { DRAWER_ANIMATION_DURATION, DEFAULT_EASING } from '~/constants';
import type { PublicRoute } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';

interface RouteDropdownProps {
  routes: PublicRoute[];
  activeRouteId: string;
  size: number;
  buttonCount: number;
  setActiveRoute: (routeId: string) => void;
}

export const RouteDropdown = ({
  routes,
  activeRouteId,
  size,
  buttonCount,
  setActiveRoute,
}: RouteDropdownProps) => {
  const { isSmallScreen, isMediumScreen } = useMediaQuery();
  const baseSpacing = spacingPx(3);
  const betweenSpacing = spacingPx(4);
  const top = baseSpacing;
  const right = isSmallScreen
    ? baseSpacing
    : betweenSpacing + buttonCount * (size + baseSpacing);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: DRAWER_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
      // z-16 to be below option buttons
      className="pointer-events-auto absolute z-16"
      style={{ top, right }}
    >
      <Tooltip label="Routes">
        <Dropdown
          // Should come after widgets
          tabIndex={10}
          value={activeRouteId}
          onChange={(value) => (value ? setActiveRoute(value) : null)}
          items={routes.map((route) => ({
            label: route.name,
            value: route.id,
          }))}
          className={cn('w-40 rounded-xl shadow-md', {
            'w-32 min-w-32': isMediumScreen,
          })}
          popupClassName="shadow-md"
          style={{ height: size }}
        />
      </Tooltip>
    </motion.div>
  );
};
