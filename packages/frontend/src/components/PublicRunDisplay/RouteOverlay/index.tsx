import { motion } from 'motion/react';
import { RefObject, useMemo } from 'react';

import { WIDGET_ANIMATION_DURATION, DEFAULT_EASING } from '~/constants';
import { useElementSize } from '~/hooks/useElementSize';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import type {
  Coordinates,
  Elevation,
  WidgetType,
  MapStyle,
  Waypoint,
} from '~/types';
import { Icon } from '~/primitives';
import { areCssVariablesLoaded, convertRemToPixels } from '~/utils';
import { getStartWaypoint, getEndWaypoint } from '~/utils/route';

import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { OptionButton } from '../OptionButton';
import { SettingsDrawer } from '../SettingsDrawer';
import { WaypointsDrawer } from '../WaypointsDrawer';
import { useRouteOverlayState, type RouteOverlayReducerState } from './reducer';

type RouteOverlayProps = Omit<RouteOverlayReducerState, 'setActiveWaypoint'> & {
  routeId: string;
  isFullscreen: boolean;
  coordinates: Coordinates[];
  elevations: Elevation[];
  waypoints: Waypoint[];
  publicRunDisplayRef: RefObject<HTMLDivElement>;
  isAtInitialBounds: boolean;
  showWaypoints: boolean;
  mapStyle: MapStyle;
  routeIsAnimating: boolean;
  animateRoute: () => void;
  fitInitialBounds: () => void;
  toggleShowWaypoints: () => void;
  setActiveWaypoint: (waypoint: Waypoint) => void;
  onMapStyleChange: (style: MapStyle) => void;
};

const EXPAND_GRAPH_WIDGETS = ['elevation'];
const SETTINGS_DRAWER_WIDTH = convertRemToPixels('13rem');
const WAYPOINTS_DRAWER_WIDTH = convertRemToPixels('15rem');

export const RouteOverlay = ({
  routeId,
  isFullscreen,
  activeWidget,
  openWidget,
  expandedWidget,
  activeDrawer,
  visibleWidgets,
  coordinates,
  elevations,
  publicRunDisplayRef,
  isAtInitialBounds,
  showWaypoints,
  mapStyle,
  waypoints,
  activeWaypoint,
  routeIsAnimating,
  animateRoute,
  toggleActiveWidget,
  onWidgetAnimationFinished,
  toggleDrawer,
  fitInitialBounds,
  onMapStyleChange,
  toggleVisibleWidget,
  toggleShowWaypoints,
  setActiveWaypoint,
}: RouteOverlayProps) => {
  const publicRunDisplaySize = useElementSize(publicRunDisplayRef);
  const { expandedHeight: graphHeight } = useElevationGraphHeight();
  const openDrawerSize =
    activeDrawer === 'settings'
      ? SETTINGS_DRAWER_WIDTH
      : activeDrawer === 'waypoints'
        ? WAYPOINTS_DRAWER_WIDTH
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
      publicRunDisplaySize,
      showGraphWhileActive: EXPAND_GRAPH_WIDGETS.includes(widget),
      isActive: activeWidget === widget,
      isOpen: openWidget === widget,
      isExpanded: expandedWidget === widget,
      isAnyActive: activeWidget !== null,
      isAnyOpen: openWidget !== null,
      isAnyExpanded: expandedWidget !== null,
      toggleActive: () => toggleActiveWidget(widget),
    };
  };

  if (!areCssVariablesLoaded()) {
    return null;
  }

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
      <OptionButton
        index={optionsButtonIndex++}
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
        disabled={routeIsAnimating}
        openDrawerSize={openDrawerSize}
        onClick={animateRoute}
      >
        <Icon name="play" className="size-6" />
      </OptionButton>
      {!isFullscreen && (
        <OptionButton
          index={optionsButtonIndex++}
          openDrawerSize={openDrawerSize}
          onClick={() =>
            window.open(`/run/${routeId}?isFullscreen=true`, '_blank')
          }
        >
          <Icon name="externalLink" className="size-6" />
        </OptionButton>
      )}
      <OptionButton
        index={optionsButtonIndex++}
        disabled={isAtInitialBounds}
        openDrawerSize={openDrawerSize}
        onClick={fitInitialBounds}
      >
        <Icon name="reset" className="size-6" />
      </OptionButton>
      <SettingsDrawer
        isOpen={activeDrawer === 'settings'}
        width={SETTINGS_DRAWER_WIDTH}
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
        width={WAYPOINTS_DRAWER_WIDTH}
        waypoints={extendedWaypoints}
        activeWaypoint={activeWaypoint}
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
          bottom: EXPAND_GRAPH_WIDGETS.includes(openWidget || '')
            ? graphHeight
            : 0,
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
