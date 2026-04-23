import { Text, Button, SidePanel } from '~/primitives';

interface RoutePanelProps {
  onClose: () => void;
  handleOpenWaypointPanel: () => void;
}

export const RoutePanel = ({
  onClose,
  handleOpenWaypointPanel,
}: RoutePanelProps) => {
  return (
    <SidePanel.Content title="Add route" onClose={onClose}>
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
