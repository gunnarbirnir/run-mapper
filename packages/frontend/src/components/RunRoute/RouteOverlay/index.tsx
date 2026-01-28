import { motion } from 'motion/react';
import { RefObject } from 'react';

import {
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { useElementSize } from '~/hooks/useElementSize';
import type { Coordinates, Elevation, WidgetType } from '~/types';
import { areCssVariablesLoaded } from '~/utils';

import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { OptionButton } from '../OptionButton';
import { SettingsDrawer } from '../SettingsDrawer';
import { useRouteOverlayState, type RouteOverlayReducerState } from './reducer';

type RouteOverlayProps = RouteOverlayReducerState & {
  coordinates: Coordinates[];
  elevations: Elevation[];
  runRouteRef: RefObject<HTMLDivElement>;
  isAtInitialBounds: boolean;
  onFitInitialBounds: () => void;
};

const EXPAND_GRAPH_WIDGETS = ['elevation'];
const SETTINGS_DRAWER_WIDTH = 200;

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
  toggleActiveWidget,
  onWidgetAnimationFinished,
  toggleDrawer,
  onFitInitialBounds,
  toggleVisibleWidget,
}: RouteOverlayProps) => {
  const runRouteSize = useElementSize(runRouteRef);
  const isSettingsDrawerOpen = activeDrawer === 'settings';
  const openDrawerSize =
    activeDrawer === 'settings' ? SETTINGS_DRAWER_WIDTH : null;

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
        icon="settings"
        secondaryIcon="close"
        secondaryIconActive={isSettingsDrawerOpen}
        openDrawerSize={openDrawerSize}
        onClick={() => toggleDrawer('settings')}
      />
      <OptionButton
        index={1}
        icon="location"
        disabled={isAtInitialBounds}
        openDrawerSize={openDrawerSize}
        onClick={onFitInitialBounds}
      />
      <SettingsDrawer
        isOpen={isSettingsDrawerOpen}
        width={SETTINGS_DRAWER_WIDTH}
        visibleWidgets={visibleWidgets}
        toggleVisibleWidget={toggleVisibleWidget}
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
