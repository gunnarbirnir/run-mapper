import { SidePanel, useSidePanelItemContext } from '~/primitives';

interface WaypointPanelProps {
  onClose: () => void;
}

export const WaypointPanel = ({ onClose }: WaypointPanelProps) => {
  const { hideCloseButton } = useSidePanelItemContext();

  return (
    <SidePanel.Content
      title="Add waypoint"
      onClose={onClose}
      hideCloseButton={hideCloseButton}
    />
  );
};
