import { AnimatePresence, motion } from 'motion/react';
import { RefObject, useMemo, useEffect } from 'react';
import { useHotkey } from '@tanstack/react-hotkeys';

import { DEFAULT_EASING, WIDGET_ANIMATION_DURATION } from '~/constants';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
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

  const optionItemSize = spacingPx(10);
  const settingsDrawerWidth = convertRemToPixels('13rem');
  const openDrawerSize =
    activeDrawer === 'settings' ? settingsDrawerWidth : null;
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
  const startWaypointId = getStartWaypoint(coordinates).id;

  // Reset state when route changes
  useEffect(() => {
    resetState();
  }, [routeId, resetState]);

  useHotkey('W', () =>
    setActiveWaypoint(activeWaypoint ? null : startWaypointId),
  );

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
            isInBackground={activeDrawer !== null}
            onClick={() => setActiveWaypoint(startWaypointId)}
          >
            <Icon name="location" className="size-6.5" />
          </OptionButton>
        )}
      </Tooltip.Provider>

      <AnimatePresence>
        {activeDrawer === null && (
          <RouteDropdown
            routes={routes}
            activeRouteId={routeId}
            size={optionItemSize}
            buttonCount={optionsButtonIndex}
            setActiveRoute={setActiveRoute}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeWaypoint !== null && (
          <WaypointsButtons
            waypoints={extendedWaypoints}
            activeWaypoint={activeWaypoint}
            setActiveWaypoint={setActiveWaypoint}
            resetState={resetState}
          />
        )}
      </AnimatePresence>

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
