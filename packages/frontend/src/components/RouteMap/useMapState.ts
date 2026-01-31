import { useState } from 'react';

import type { MapStyle } from '~/types';

export const useMapState = () => {
  const [style, setStyle] = useState<MapStyle>('standard');
  const [isAtInitialBounds, setIsAtInitialBounds] = useState(true);

  return { style, isAtInitialBounds, setStyle, setIsAtInitialBounds };
};
