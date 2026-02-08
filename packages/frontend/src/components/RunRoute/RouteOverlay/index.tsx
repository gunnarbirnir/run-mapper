import { motion } from 'motion/react';
import { RefObject, useMemo } from 'react';

import {
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { useElementSize } from '~/hooks/useElementSize';
import type {
  Coordinates,
  Elevation,
  WidgetType,
  MapStyle,
  Waypoint,
} from '~/types';
import { Icon } from '~/primitives';
import {
  areCssVariablesLoaded,
  getStartWaypoint,
  getEndWaypoint,
} from '~/utils';

import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { OptionButton } from '../OptionButton';
import { SettingsDrawer } from '../SettingsDrawer';
import { WaypointsDrawer } from '../WaypointsDrawer';
import { useRouteOverlayState, type RouteOverlayReducerState } from './reducer';

type RouteOverlayProps = RouteOverlayReducerState & {
  coordinates: Coordinates[];
  elevations: Elevation[];
  waypoints: Waypoint[];
  runRouteRef: RefObject<HTMLDivElement>;
  isAtInitialBounds: boolean;
  showWaypoints: boolean;
  mapStyle: MapStyle;
  onFitInitialBounds: () => void;
  toggleShowWaypoints: () => void;
  onMapStyleChange: (style: MapStyle) => void;
  onSetActiveWaypoint: (waypoint: Waypoint) => void;
};

const EXPAND_GRAPH_WIDGETS = ['elevation'];
const SETTINGS_DRAWER_WIDTH = 200;
const WAYPOINTS_DRAWER_WIDTH = 250;

export const RouteOverlay = ({
  activeWidget,
  openWidget,
  expandedWidget,
  activeDrawer,
  visibleWidgets,
  coordinates,
  elevations,
  runRouteRef,
  isAtInitialBounds,
  showWaypoints,
  mapStyle,
  waypoints,
  activeWaypoint,
  toggleActiveWidget,
  onWidgetAnimationFinished,
  toggleDrawer,
  onFitInitialBounds,
  onMapStyleChange,
  toggleVisibleWidget,
  toggleShowWaypoints,
  onSetActiveWaypoint,
}: RouteOverlayProps) => {
  const runRouteSize = useElementSize(runRouteRef);
  const openDrawerSize =
    activeDrawer === 'settings'
      ? SETTINGS_DRAWER_WIDTH
      : activeDrawer === 'waypoints'
        ? WAYPOINTS_DRAWER_WIDTH
        : null;
  const extendedWaypoints = useMemo(
    () => [
      getStartWaypoint(coordinates),
      ...waypoints,
      getEndWaypoint(coordinates),
    ],
    [coordinates, waypoints],
  );

  const getWidgetProps = (widget: WidgetType) => {
    return {
      runRouteSize,
      showGraphWhileActive: EXPAND_GRAPH_WIDGETS.includes(widget),
      isActive: activeWidget === widget,
      isOpen: openWidget === widget,
      isExpanded: expandedWidget === widget,
      isAnyActive: activeWidget !== null,
      isAnyOpen: openWidget !== null,
      isAnyExpanded: expandedWidget !== null,
      onToggleActive: () => toggleActiveWidget(widget),
    };
  };

  if (!areCssVariablesLoaded()) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute isolate z-100 h-full w-full overflow-hidden">
      {visibleWidgets.distance && (
        <DistanceWidget
          index={0}
          coordinates={coordinates}
          {...getWidgetProps('distance')}
        />
      )}
      {visibleWidgets.elevation && (
        <ElevationWidget
          index={visibleWidgets.distance ? 1 : 0}
          elevations={elevations}
          {...getWidgetProps('elevation')}
        />
      )}
      <OptionButton
        index={0}
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
        index={1}
        disabled={isAtInitialBounds}
        openDrawerSize={openDrawerSize}
        onClick={onFitInitialBounds}
      >
        <Icon name="reset" className="size-6" />
      </OptionButton>
      <SettingsDrawer
        isOpen={activeDrawer === 'settings'}
        width={SETTINGS_DRAWER_WIDTH}
        visibleWidgets={visibleWidgets}
        showWaypoints={showWaypoints}
        mapStyle={mapStyle}
        toggleVisibleWidget={toggleVisibleWidget}
        toggleShowWaypoints={toggleShowWaypoints}
        onMapStyleChange={onMapStyleChange}
      />
      <WaypointsDrawer
        isOpen={activeDrawer === 'waypoints'}
        width={WAYPOINTS_DRAWER_WIDTH}
        waypoints={extendedWaypoints}
        activeWaypoint={activeWaypoint}
        setActiveWaypoint={onSetActiveWaypoint}
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
            ? EXPANDED_ELEVATION_GRAPH_HEIGHT
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
