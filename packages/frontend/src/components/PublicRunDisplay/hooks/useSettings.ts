import { useCallback, useState } from 'react';

import type { MapStyle } from '~/types';
import { WidgetType } from '../types';

export interface RunDisplaySettings {
  visibleWidgets: Record<WidgetType, boolean>;
  showWaypoints: boolean;
  showPointsOfInterest: boolean;
  mapStyle: MapStyle;
  toggleVisibleWidget: (widgetType: WidgetType) => void;
  toggleShowWaypoints: () => void;
  toggleShowPointsOfInterest: () => void;
  setMapStyle: (mapStyle: MapStyle) => void;
}

export const useSettings = (): RunDisplaySettings => {
  const [visibleWidgets, setVisibleWidgets] = useState<
    Record<WidgetType, boolean>
  >({
    distance: true,
    elevation: true,
  });
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [showPointsOfInterest, setShowPointsOfInterest] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');

  const toggleShowWaypoints = useCallback(() => {
    setShowWaypoints((currentShowWaypoints) => !currentShowWaypoints);
  }, [setShowWaypoints]);

  const toggleShowPointsOfInterest = useCallback(() => {
    setShowPointsOfInterest(
      (currentShowPointsOfInterest) => !currentShowPointsOfInterest,
    );
  }, [setShowPointsOfInterest]);

  const toggleVisibleWidget = useCallback(
    (widgetType: WidgetType) => {
      setVisibleWidgets((currentVisibleWidgets) => ({
        ...currentVisibleWidgets,
        [widgetType]: !currentVisibleWidgets[widgetType],
      }));
    },
    [setVisibleWidgets],
  );

  return {
    visibleWidgets,
    showWaypoints,
    showPointsOfInterest,
    mapStyle,
    toggleVisibleWidget,
    toggleShowWaypoints,
    toggleShowPointsOfInterest,
    setMapStyle,
  };
};
