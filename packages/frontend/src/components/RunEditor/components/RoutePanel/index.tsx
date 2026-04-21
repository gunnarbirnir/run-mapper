import { Text, Button } from '~/primitives';

interface RoutePanelProps {
  handleOpenWaypointPanel: () => void;
}

export const RoutePanel = ({ handleOpenWaypointPanel }: RoutePanelProps) => {
  return (
    <div className="space-y-8">
      <Text element="h3" className="mb-4">
        Waypoints
      </Text>
      <Button className="w-full" onClick={handleOpenWaypointPanel}>
        Add Waypoint
      </Button>
    </div>
  );
};
