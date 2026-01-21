import { motion } from 'motion/react';
import { RefObject, useState } from 'react';

import { DistanceWidget } from '~/components/DistanceWidget';
import { ElevationWidget } from '~/components/ElevationWidget';
import {
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { useElementSize } from '~/hooks/useElementSize';
import type { Coordinates, Elevation, WidgetType } from '~/types';

const EXPAND_GRAPH_WIDGETS = ['elevation'];

interface RouteOverlayProps {
  coordinates: Coordinates[];
  elevations: Elevation[];
  runRouteRef: RefObject<HTMLDivElement>;
  activeWidget: WidgetType | null;
  setActiveWidget: (widget: WidgetType | null) => void;
}

export const RouteOverlay = ({
  coordinates,
  elevations,
  runRouteRef,
  activeWidget,
  setActiveWidget,
}: RouteOverlayProps) => {
  // From start of open animation to end of close animation
  const [openWidget, setOpenWidget] = useState<WidgetType | null>(null);
  // When the widget is fully expanded, so does not include animations
  const [expandedWidget, setExpandedWidget] = useState<WidgetType | null>(null);
  const runRouteSize = useElementSize(runRouteRef);

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
    <div className="pointer-events-none absolute isolate z-100 h-full w-full">
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
