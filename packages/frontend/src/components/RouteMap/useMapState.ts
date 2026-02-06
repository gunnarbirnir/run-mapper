import { useState } from 'react';

import type { MapStyle } from '~/types';

export const useMapState = () => {
  const [style, setStyle] = useState<MapStyle>('standard');
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);
  const [showWaypoints, setShowWaypoints] = useState(true);

  return {
    style,
    isAtInitialBounds,
    showWaypoints,
    setStyle,
    setIsAtInitialBounds,
    setShowWaypoints,
  };
};
