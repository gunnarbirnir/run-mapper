import { RefObject, useState } from 'react';

import { useElementSize } from '~/hooks/useElementSize';
import type { ElevationStats } from '~/types';
import { Tooltip } from '~/primitives';

import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { WidgetType } from '../../types';

interface OverlayWidgetsProps {
  publicRunDisplayRef: RefObject<HTMLDivElement>;
  activeWidget: WidgetType | null;
  openWidget: WidgetType | null;
  expandedWidget: WidgetType | null;
  visibleWidgets: Record<WidgetType, boolean>;
  distance: number;
  displayDistance?: number;
  elevationStats?: ElevationStats;
  setActiveWidget: (widget: WidgetType | null) => void;
}

export const OverlayWidgets = ({
  publicRunDisplayRef,
  activeWidget,
  openWidget,
  expandedWidget,
  visibleWidgets,
  distance,
  displayDistance,
  elevationStats,
  setActiveWidget,
}: OverlayWidgetsProps) => {
  const publicRunDisplaySize = useElementSize(publicRunDisplayRef);
  const [widgetSizes, setWidgetSizes] = useState<number[]>([]);
  let widgetIndex = 0;

  const getWidgetProps = (widget: WidgetType) => {
    return {
      widgetType: widget,
      widgetSizes,
      publicRunDisplaySize,
      isActive: activeWidget === widget,
      isOpen: openWidget === widget,
      isExpanded: expandedWidget === widget,
      isAnyActive: activeWidget !== null,
      isAnyOpen: openWidget !== null,
      isAnyExpanded: expandedWidget !== null,
      onOpen: () => setActiveWidget(widget),
      onClose: () => setActiveWidget(null),
      setWidgetSizes,
    };
  };

  return (
    <Tooltip.Provider>
      {visibleWidgets.distance && (
        <DistanceWidget
          index={widgetIndex++}
          distance={distance}
          displayDistance={displayDistance}
          {...getWidgetProps('distance')}
        />
      )}
      {visibleWidgets.elevation && (
        <ElevationWidget
          index={widgetIndex++}
          elevationStats={elevationStats}
          {...getWidgetProps('elevation')}
        />
      )}
    </Tooltip.Provider>
  );
};
