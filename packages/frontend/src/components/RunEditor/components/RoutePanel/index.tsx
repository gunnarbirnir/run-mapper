import { Text, Button, SidePanel } from '~/primitives';
import { PublicRoute } from '~/types';

import type { PanelState } from '../../hooks/usePanelState';

interface RoutePanelProps extends PanelState<PublicRoute> {
  onOpenWaypointPanel: () => void;
}

export const RoutePanel = ({
  onClose,
  onOpenWaypointPanel,
}: RoutePanelProps) => {
  return (
    <SidePanel.Content title="Add route" onClose={onClose}>
      <div className="space-y-8">
        <Text element="h3" className="mb-4">
          Waypoints
        </Text>
        <Button className="w-full" onClick={onOpenWaypointPanel}>
          Add Waypoint
        </Button>
      </div>
    </SidePanel.Content>
  );
};
