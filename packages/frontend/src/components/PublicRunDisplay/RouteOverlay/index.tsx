import { AnimatePresence, motion } from 'motion/react';
import { RefObject, useMemo, useState } from 'react';

import { WIDGET_ANIMATION_DURATION, DEFAULT_EASING } from '~/constants';
import { useElementSize } from '~/hooks/useElementSize';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import type {
  Coordinates,
  Elevation,
  MapStyle,
  PublicRoute,
  Waypoint,
} from '~/types';
import { Icon } from '~/primitives';
import { convertRemToPixels, spacingPx } from '~/utils';
import { getStartWaypoint, getEndWaypoint } from '~/utils/route';

import type { WidgetType } from '../types';
import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { OptionButton } from '../OptionButton';
import { SettingsDrawer } from '../SettingsDrawer';
import { RouteDropdown } from '../RouteDropdown';
import { WaypointsDrawer } from '../WaypointsDrawer';
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
  const publicRunDisplaySize = useElementSize(publicRunDisplayRef);
  const elevationWidgetActive = activeWidget === 'elevation';
  const { height: graphHeight } = useElevationGraphHeight(
    elevationWidgetActive,
  );
  const [widgetSizes, setWidgetSizes] = useState<number[]>([]);

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
  let widgetIndex = 0;
  let optionsButtonIndex = 0;

  const getWidgetProps = (widget: WidgetType) => {
    return {
      widgetSizes,
      publicRunDisplaySize,
      showGraphWhileActive: widget === 'elevation',
      isActive: activeWidget === widget,
      isOpen: openWidget === widget,
      isExpanded: expandedWidget === widget,
      isAnyActive: activeWidget !== null,
      isAnyOpen: openWidget !== null,
      isAnyExpanded: expandedWidget !== null,
      toggleActive: () => toggleActiveWidget(widget),
      setWidgetSizes,
    };
  };

  return (
    <div className="pointer-events-none absolute isolate z-100 h-full w-full overflow-hidden">
      {visibleWidgets.distance && (
        <DistanceWidget
          index={widgetIndex++}
          coordinates={coordinates}
          {...getWidgetProps('distance')}
        />
      )}
      {visibleWidgets.elevation && (
        <ElevationWidget
          index={widgetIndex++}
          elevations={elevations}
          {...getWidgetProps('elevation')}
        />
      )}

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
