import { AnimatePresence, motion } from 'motion/react';
import { RefObject, useMemo } from 'react';

import { DEFAULT_EASING, WIDGET_ANIMATION_DURATION } from '~/constants';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { Icon, Tooltip } from '~/primitives';
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
import { WaypointsButtons } from '../WaypointsButtons';
import { useRouteOverlayState, type RouteOverlayReducerState } from './reducer';

type RouteOverlayProps = RouteOverlayReducerState & {
  routes: PublicRoute[];
  routeId: string;
  coordinates: Coordinates[];
  elevations: Elevation[];
  waypoints: Waypoint[];
  publicRunDisplayRef: RefObject<HTMLDivElement>;
  showWaypoints: boolean;
  mapStyle: MapStyle;
  toggleShowWaypoints: () => void;
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
  resetState,
}: RouteOverlayProps) => {
  const elevationWidgetActive = activeWidget === 'elevation';
  const { height: graphHeight } = useElevationGraphHeight(
    elevationWidgetActive,
  );
  const { isSmallScreen } = useMediaQuery();

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

      <Tooltip.Provider>
        <OptionButton
          index={optionsButtonIndex++}
          tooltipLabel={activeDrawer === null ? 'Settings' : undefined}
          buttonSize={optionItemSize}
          openDrawerSize={openDrawerSize}
          onClick={() => toggleDrawer('settings')}
          buttonClassName={activeDrawer !== null ? 'active:scale-100' : ''}
        >
          {activeDrawer === null ? (
            <Icon name="settings" className="size-7.5" />
          ) : (
            <Icon name="close" className="size-5.5" />
          )}
        </OptionButton>
        {showWaypoints && (
          <OptionButton
            index={optionsButtonIndex++}
            tooltipLabel="Points of interest"
            buttonSize={optionItemSize}
            openDrawerSize={openDrawerSize}
            onClick={() => setActiveWaypoint(getStartWaypoint(coordinates).id)}
          >
            <Icon name="location" className="size-6.5" />
          </OptionButton>
        )}
      </Tooltip.Provider>

      {activeWaypoint !== null && activeDrawer === null && isSmallScreen && (
        <WaypointsButtons
          waypoints={extendedWaypoints}
          activeWaypoint={activeWaypoint}
          setActiveWaypoint={(waypoint) => setActiveWaypoint(waypoint, false)}
          toggleDrawer={() => toggleDrawer('waypoints')}
          resetState={resetState}
        />
      )}

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
        toggleDrawer={() => toggleDrawer('waypoints', !isSmallScreen)}
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
