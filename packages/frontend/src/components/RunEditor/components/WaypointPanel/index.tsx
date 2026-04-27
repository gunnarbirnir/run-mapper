import { SidePanel } from '~/primitives';
import { Waypoint } from '~/types';

import { RecordPanelState } from '../../hooks/useRecordPanelState';

export const WaypointPanel = ({ onClose }: RecordPanelState<Waypoint>) => {
  return <SidePanel.Content title="Add waypoint" onClose={onClose} />;
};
