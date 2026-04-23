import { SidePanel } from '~/primitives';
import { Waypoint } from '~/types';

import type { PanelState } from '../../hooks/usePanelState';

export const WaypointPanel = ({ onClose }: PanelState<Waypoint>) => {
  return <SidePanel.Content title="Add waypoint" onClose={onClose} />;
};
