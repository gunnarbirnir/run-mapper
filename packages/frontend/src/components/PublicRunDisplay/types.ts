import type { SetStateAction } from 'react';

import type { PublicRun } from '~/types';

export interface PublicRunDisplayProps {
  routeId: string;
  run: PublicRun;
  isFullscreen?: boolean;
}

export interface WidgetBaseProps {
  index: number;
  widgetType: WidgetType;
  publicRunDisplaySize: {
    width: number;
    height: number;
  };
  widgetSizes: number[];
  showGraphWhileActive?: boolean;
  isActive?: boolean;
  isOpen?: boolean;
  isExpanded?: boolean;
  isAnyActive?: boolean;
  isAnyOpen?: boolean;
  isAnyExpanded?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  setWidgetSizes: (sizes: SetStateAction<number[]>) => void;
}

export type WidgetType = 'distance' | 'elevation';
export type DrawerType = 'settings' | 'points-of-interest';
