import { AnimatePresence, motion } from 'motion/react';
import { RefObject, useMemo } from 'react';

import { DEFAULT_EASING, WIDGET_ANIMATION_DURATION } from '~/constants';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import { Icon } from '~/primitives';
import type {
  Coordinates,
  Elevation,
  MapStyle,
  PublicRoute,
  Waypoint,
} from '~/types';
import { convertRemToPixels, spacingPx } from '~/utils';
import { getEndWaypoint, getStartWaypoint } from '~/utils/route';

import { OptionButton } from '../OptionButton';
import { RouteDropdown } from '../RouteDropdown';
import { SettingsDrawer } from '../SettingsDrawer';
import { WaypointsDrawer } from '../WaypointsDrawer';
import { OverlayWidgets } from './OverlayWidgets';
import { useRouteOverlayState, type RouteOverlayReducerState } from './reducer';

type RouteOverlayProps = Omit<RouteOverlayReducerState, 'setActiveWaypoint'> & {
  routes: PublicRoute[];
  routeId: string;
  coordinates: Coordinates[];
  elevations: Elevation[];
  waypoints: Waypoint[];
  publicRunDisplayRef: RefObject<HTMLDivElement>;
  showWaypoints: boolean;
  mapStyle: MapStyle;
  toggleShowWaypoints: () => void;
  setActiveWaypoint: (waypoint: Waypoint) => void;
  onMapStyleChange: (style: MapStyle) => void;
  setActiveRoute: (routeId: string) => void;
};

export const RouteOverlay = ({
  activeWidget,
  openWidget,
  expandedWidget,
  activeDrawer,
  visibleWidgets,
  routes,
  routeId,
  coordinates,
  elevations,
  publicRunDisplayRef,
  showWaypoints,
  mapStyle,
  waypoints,
  activeWaypoint,
  toggleActiveWidget,
  onWidgetAnimationFinished,
  toggleDrawer,
  onMapStyleChange,
  toggleVisibleWidget,
  toggleShowWaypoints,
  setActiveWaypoint,
  setActiveRoute,
}: RouteOverlayProps) => {
  const elevationWidgetActive = activeWidget === 'elevation';
  const { height: graphHeight } = useElevationGraphHeight(
    elevationWidgetActive,
  );

  const optionItemSize = spacingPx(10);
  const settingsDrawerWidth = convertRemToPixels('13rem');
  const waypointsDrawerWidth = convertRemToPixels('15rem');

  const openDrawerSize =
    activeDrawer === 'settings'
      ? settingsDrawerWidth
      : activeDrawer === 'waypoints'
        ? waypointsDrawerWidth
        : null;
  const extendedWaypoints = useMemo(
    () =>
      coordinates.length > 0
        ? [
            getStartWaypoint(coordinates),
            ...waypoints,
            getEndWaypoint(coordinates),
          ]
        : [],
    [coordinates, waypoints],
  );
  let optionsButtonIndex = 0;

  return (
    <div className="pointer-events-none absolute isolate z-100 h-full w-full overflow-hidden">
      <OverlayWidgets
        publicRunDisplayRef={publicRunDisplayRef}
        activeWidget={activeWidget}
        openWidget={openWidget}
        expandedWidget={expandedWidget}
        visibleWidgets={visibleWidgets}
        coordinates={coordinates}
        elevations={elevations}
        toggleActiveWidget={toggleActiveWidget}
      />

      <AnimatePresence>
        {activeDrawer === null && (
          <RouteDropdown
            routes={routes}
            activeRouteId={routeId}
            size={optionItemSize}
            setActiveRoute={setActiveRoute}
          />
        )}
      </AnimatePresence>

      <OptionButton
        index={optionsButtonIndex++}
        buttonSize={optionItemSize}
        openDrawerSize={openDrawerSize}
        onClick={() => toggleDrawer('settings')}
        buttonClassName={activeDrawer !== null ? 'active:scale-100' : ''}
      >
        {activeDrawer === null ? (
          <Icon name="settings" className="size-7" />
        ) : (
          <Icon name="close" className="size-6" />
        )}
      </OptionButton>
      <OptionButton
        index={optionsButtonIndex++}
        buttonSize={optionItemSize}
        openDrawerSize={openDrawerSize}
        onClick={() => setActiveWaypoint(getStartWaypoint(coordinates))}
      >
        <Icon name="location" className="size-7" />
      </OptionButton>

      <SettingsDrawer
        isOpen={activeDrawer === 'settings'}
        width={settingsDrawerWidth}
        visibleWidgets={visibleWidgets}
        showWaypoints={showWaypoints}
        mapStyle={mapStyle}
        toggleDrawer={() => toggleDrawer('settings')}
        toggleVisibleWidget={toggleVisibleWidget}
        toggleShowWaypoints={toggleShowWaypoints}
        onMapStyleChange={onMapStyleChange}
      />
      <WaypointsDrawer
        isOpen={activeDrawer === 'waypoints'}
        width={waypointsDrawerWidth}
        waypoints={extendedWaypoints}
        activeWaypoint={activeWaypoint}
        toggleDrawer={() => toggleDrawer('waypoints')}
        setActiveWaypoint={setActiveWaypoint}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: activeWidget ? 1 : 0 }}
        transition={{
          duration: WIDGET_ANIMATION_DURATION,
          ease: DEFAULT_EASING,
        }}
        className="absolute top-0 right-0 left-0 z-100 bg-black/50"
        style={{
          pointerEvents: activeWidget ? 'auto' : 'none',
          bottom: openWidget === 'elevation' ? graphHeight : 0,
        }}
        onClick={
          activeWidget ? () => toggleActiveWidget(activeWidget) : undefined
        }
        onAnimationComplete={onWidgetAnimationFinished}
      />
    </div>
  );
};

export { useRouteOverlayState };
