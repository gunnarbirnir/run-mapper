import { SidePanel } from '~/primitives';

interface WaypointPanelProps {
  onClose: () => void;
}

export const WaypointPanel = ({ onClose }: WaypointPanelProps) => {
  return <SidePanel.Content title="Add waypoint" onClose={onClose} />;
};
