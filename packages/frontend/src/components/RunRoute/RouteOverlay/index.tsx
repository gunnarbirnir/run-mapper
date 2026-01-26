import { motion } from 'motion/react';
import { RefObject, useState } from 'react';

import {
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { useElementSize } from '~/hooks/useElementSize';
import type { Coordinates, Elevation, WidgetType } from '~/types';

import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { OptionButton } from '../OptionButton';
import { SettingsDrawer } from '../SettingsDrawer';

type DrawerType = 'settings';

interface RouteOverlayProps {
  coordinates: Coordinates[];
  elevations: Elevation[];
  runRouteRef: RefObject<HTMLDivElement>;
  activeWidget: WidgetType | null;
  isAtInitialBounds: boolean;
  setActiveWidget: (widget: WidgetType | null) => void;
  onFitInitialBounds: () => void;
}

const EXPAND_GRAPH_WIDGETS = ['elevation'];
const SETTINGS_DRAWER_WIDTH = 200;

export const RouteOverlay = ({
  coordinates,
  elevations,
  runRouteRef,
  activeWidget,
  isAtInitialBounds,
  setActiveWidget,
  onFitInitialBounds,
}: RouteOverlayProps) => {
  // From start of open animation to end of close animation
  const [openWidget, setOpenWidget] = useState<WidgetType | null>(null);
  // When the widget is fully expanded, so does not include animations
  const [expandedWidget, setExpandedWidget] = useState<WidgetType | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null);
  const runRouteSize = useElementSize(runRouteRef);

  const isSettingsDrawerOpen = activeDrawer === 'settings';
  const openDrawerSize =
    activeDrawer === 'settings' ? SETTINGS_DRAWER_WIDTH : null;

  const handleWidgetToggleActive = (widget: WidgetType | null) => () => {
    if (!activeWidget) {
      setOpenWidget(widget);
    } else {
      setExpandedWidget(null);
    }
    setActiveWidget(activeWidget ? null : widget);
  };

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
      onToggleActive: handleWidgetToggleActive(widget),
    };
  };

  return (
    <div className="pointer-events-none absolute isolate z-100 h-full w-full overflow-hidden">
      <DistanceWidget
        index={0}
        coordinates={coordinates}
        {...getWidgetProps('distance')}
      />
      <ElevationWidget
        index={1}
        elevations={elevations}
        {...getWidgetProps('elevation')}
      />
      <OptionButton
        index={0}
        icon="settings"
        secondaryIcon="close"
        secondaryIconActive={isSettingsDrawerOpen}
        openDrawerSize={openDrawerSize}
        onClick={() =>
          setActiveDrawer((current) =>
            current === 'settings' ? null : 'settings',
          )
        }
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
        onClick={handleWidgetToggleActive(null)}
        onAnimationComplete={() => {
          if (!activeWidget) {
            setOpenWidget(null);
          } else {
            setExpandedWidget(activeWidget);
          }
        }}
      />
    </div>
  );
};
