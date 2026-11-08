import { AnimatePresence, motion } from 'motion/react';
import { RefObject, useEffect, useMemo } from 'react';

import { DEFAULT_EASING } from '~/constants';
import { useId } from '~/hooks/useId';
import { Icon, Tooltip } from '~/primitives';
import type { PointOfInterest, PublicRoute } from '~/types';
import { convertRemToPixels, spacingPx } from '~/utils';
import { isInnerWaypoint } from '~/utils/route';

import { WIDGET_ANIMATION_DURATION } from '../../constants';
import { useElevationGraphHeight } from '../../hooks/useElevationGraphHeight';
import type { RunDisplayReducerState } from '../../hooks/useRunDisplayState';
import type { RunDisplaySettings } from '../../hooks/useSettings';
import { OptionButton } from '../OptionButton';
import { PointsOfInterestDrawer } from '../PointsOfInterestDrawer';
import { RouteDropdown } from '../RouteDropdown';
import { SettingsDrawer } from '../SettingsDrawer';
import { WaypointsToolbar } from '../WaypointsToolbar';
import { OverlayWidgets } from './OverlayWidgets';

type RouteOverlayProps = RunDisplayReducerState & {
  routes: PublicRoute[];
  activeRoute: PublicRoute | null;
  pointsOfInterest: PointOfInterest[];
  publicRunDisplayRef: RefObject<HTMLDivElement>;
  settings: RunDisplaySettings;
  setActiveRoute: (routeId: string) => void;
};

export const RouteOverlay = ({
  routes,
  activeRoute,
  pointsOfInterest,
  settings,
  activeWidget,
  openWidget,
  expandedWidget,
  activeDrawer,
  activeWaypoint,
  setActiveRoute,
  setActiveWidget,
  onWidgetAnimationFinished,
  setActiveDrawer,
  setActiveWaypoint,
  setActivePointOfInterest,
  resetState,
  publicRunDisplayRef,
}: RouteOverlayProps) => {
  const elevationWidgetActive = activeWidget === 'elevation';
  const { height: graphHeight } = useElevationGraphHeight(
    elevationWidgetActive,
  );
  const closeButtonId = useId('close-option-button');
  const overlayBackgroundId = useId('overlay-background');

  const drawerIsOpen = activeDrawer !== null;
  const optionItemSize = spacingPx(10);
  const settingsDrawerWidth = convertRemToPixels('14rem');
  const pointsOfInterestDrawerWidth = convertRemToPixels('16rem');
  const openDrawerSize =
    activeDrawer === 'settings'
      ? settingsDrawerWidth
      : activeDrawer === 'points-of-interest'
        ? pointsOfInterestDrawerWidth
        : null;
  let optionsButtonIndex = 0;

  const routeId = activeRoute?.id;
  const waypoints = useMemo(() => activeRoute?.waypoints ?? [], [activeRoute]);
  const hasPointsOfInterest = pointsOfInterest.length > 0;
  const hasWaypoints = waypoints.length > 0;
  const hasInnerWaypoints = waypoints.filter(isInnerWaypoint).length > 0;
  const hasAnyPoiOrWaypoints = hasPointsOfInterest || hasWaypoints;

  // Reset state when route changes
  useEffect(() => {
    resetState();
  }, [routeId, resetState]);

  return (
    <div className="pointer-events-none absolute isolate z-100 h-full w-full overflow-hidden">
      <OverlayWidgets
        publicRunDisplayRef={publicRunDisplayRef}
        activeWidget={activeWidget}
        openWidget={openWidget}
        expandedWidget={expandedWidget}
        visibleWidgets={settings.visibleWidgets}
        distance={activeRoute?.distance ?? 0}
        displayDistance={activeRoute?.displayDistance}
        elevationStats={activeRoute?.elevationStats}
        setActiveWidget={setActiveWidget}
      />

      <Tooltip.Provider>
        <OptionButton
          id={closeButtonId}
          index={optionsButtonIndex++}
          tooltipLabel={drawerIsOpen ? 'Close' : 'Settings'}
          buttonSize={optionItemSize}
          openDrawerSize={openDrawerSize}
          onClick={() => setActiveDrawer(drawerIsOpen ? null : 'settings')}
          buttonClassName={drawerIsOpen ? 'active:scale-100' : ''}
          routeDropdownIsVisible={routes.length > 1}
        >
          {drawerIsOpen ? (
            <Icon name="close" className="size-5.5" />
          ) : (
            <Icon name="settings" className="size-7.5" />
          )}
        </OptionButton>
        {hasAnyPoiOrWaypoints && (
          <OptionButton
            index={optionsButtonIndex++}
            tooltipLabel="Points of interest"
            buttonSize={optionItemSize}
            openDrawerSize={openDrawerSize}
            isInBackground={drawerIsOpen}
            routeDropdownIsVisible={routes.length > 1}
            onClick={() => setActiveDrawer('points-of-interest')}
          >
            <Icon name="location" className="size-6.5" />
          </OptionButton>
        )}
      </Tooltip.Provider>

      <AnimatePresence>
        {!drawerIsOpen && routes.length > 1 && (
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
          <WaypointsToolbar
            waypoints={waypoints}
            activeWaypoint={activeWaypoint}
            setActiveWaypoint={setActiveWaypoint}
          />
        )}
      </AnimatePresence>

      <SettingsDrawer
        settings={settings}
        width={settingsDrawerWidth}
        isOpen={activeDrawer === 'settings'}
        hasInnerWaypoints={hasInnerWaypoints}
        hasPointsOfInterest={hasPointsOfInterest}
        onClose={() => setActiveDrawer(null)}
      />
      {hasAnyPoiOrWaypoints && (
        <PointsOfInterestDrawer
          width={pointsOfInterestDrawerWidth}
          isOpen={activeDrawer === 'points-of-interest'}
          pointsOfInterest={pointsOfInterest}
          waypoints={waypoints}
          showPointsOfInterest={settings.showPointsOfInterest}
          showWaypoints={settings.showWaypoints}
          hasPointsOfInterest={hasPointsOfInterest}
          hasWaypoints={hasWaypoints}
          onClose={() => setActiveDrawer(null)}
          setActivePointOfInterest={setActivePointOfInterest}
          setActiveWaypoint={setActiveWaypoint}
          setShowPointsOfInterest={settings.toggleShowPointsOfInterest}
          setShowWaypoints={settings.toggleShowWaypoints}
        />
      )}

      <motion.div
        id={overlayBackgroundId}
        initial={{ opacity: 0, bottom: 0 }}
        animate={{
          opacity: activeWidget ? 1 : 0,
          bottom: openWidget === 'elevation' ? graphHeight : 0,
        }}
        transition={{
          duration: WIDGET_ANIMATION_DURATION,
          ease: DEFAULT_EASING,
        }}
        className="absolute top-0 right-0 left-0 z-100 bg-black/50"
        style={{
          pointerEvents: activeWidget ? 'auto' : 'none',
        }}
        onClick={activeWidget ? () => setActiveWidget(null) : undefined}
        onAnimationComplete={onWidgetAnimationFinished}
      />
    </div>
  );
};
