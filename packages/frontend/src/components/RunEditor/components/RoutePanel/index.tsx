import { Text, Button, SidePanel, useSidePanelItemContext } from '~/primitives';

interface RoutePanelProps {
  onClose: () => void;
  handleOpenWaypointPanel: () => void;
}

export const RoutePanel = ({
  onClose,
  handleOpenWaypointPanel,
}: RoutePanelProps) => {
  const { hideCloseButton } = useSidePanelItemContext();

  return (
    <SidePanel.Content
      title="Add route"
      onClose={onClose}
      hideCloseButton={hideCloseButton}
    >
      <div className="space-y-8">
        <Text element="h3" className="mb-4">
          Waypoints
        </Text>
        <Button className="w-full" onClick={handleOpenWaypointPanel}>
          Add Waypoint
        </Button>
      </div>
    </SidePanel.Content>
  );
};
