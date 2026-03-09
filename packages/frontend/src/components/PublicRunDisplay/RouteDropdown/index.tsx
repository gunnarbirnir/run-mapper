import { motion } from 'motion/react';

import { Dropdown } from '~/primitives';
import { spacingPx } from '~/utils';
import { DRAWER_ANIMATION_DURATION, DEFAULT_EASING } from '~/constants';
import type { PublicRoute } from '~/types';

const NUMBER_OF_OPTIONS = 2;

interface RouteDropdownProps {
  routes: PublicRoute[];
  activeRouteId: string;
  setActiveRoute: (routeId: string) => void;
}

export const RouteDropdown = ({
  routes,
  activeRouteId,
  setActiveRoute,
}: RouteDropdownProps) => {
  // Keep in sync with buttons. Should be moved to a shared constant.
  const buttonSize = spacingPx(10);
  const baseSpacing = spacingPx(3);
  const betweenSpacing = spacingPx(4);
  const top = baseSpacing;
  const right = betweenSpacing + NUMBER_OF_OPTIONS * (buttonSize + baseSpacing);

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
        onChange={setActiveRoute}
        items={routes.map((route) => ({ label: route.name, value: route.id }))}
      />
    </motion.div>
  );
};
