import { RefObject, useState } from 'react';

import { useElementSize } from '~/hooks/useElementSize';

import { Coordinates, Elevation } from '~/types';
import { DistanceWidget } from '../DistanceWidget';
import { ElevationWidget } from '../ElevationWidget';
import { WidgetType } from '../types';

interface OverlayWidgetsProps {
  publicRunDisplayRef: RefObject<HTMLDivElement>;
  activeWidget: WidgetType | null;
  openWidget: WidgetType | null;
  expandedWidget: WidgetType | null;
  visibleWidgets: Record<WidgetType, boolean>;
  coordinates: Coordinates[];
  elevations: Elevation[];
  toggleActiveWidget: (widget: WidgetType) => void;
}

export const OverlayWidgets = ({
  publicRunDisplayRef,
  activeWidget,
  openWidget,
  expandedWidget,
  visibleWidgets,
  coordinates,
  elevations,
  toggleActiveWidget,
}: OverlayWidgetsProps) => {
  const publicRunDisplaySize = useElementSize(publicRunDisplayRef);
  const [widgetSizes, setWidgetSizes] = useState<number[]>([]);

  const getWidgetProps = (widget: WidgetType) => {
    return {
      widgetType: widget,
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
    <>
      {visibleWidgets.distance && (
        <DistanceWidget
          index={0}
          coordinates={coordinates}
          {...getWidgetProps('distance')}
        />
      )}
      {visibleWidgets.elevation && (
        <ElevationWidget
          index={1}
          elevations={elevations}
          {...getWidgetProps('elevation')}
        />
      )}
    </>
  );
};
