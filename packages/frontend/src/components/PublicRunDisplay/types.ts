import type { PublicRun } from '~/types';

export interface PublicRunDisplayProps {
  routeId: string;
  run: PublicRun;
  isFullscreen?: boolean;
}

export interface WidgetBaseProps {
  index: number;
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
  toggleActive?: () => void;
  setWidgetSizes: (sizes: (prev: number[]) => number[]) => void;
}

export type WidgetType = 'distance' | 'elevation';
export type DrawerType = 'settings' | 'waypoints';
