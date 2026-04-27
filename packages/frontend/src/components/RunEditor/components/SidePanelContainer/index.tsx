import { useHotkey } from '@tanstack/react-hotkeys';

import { SidePanel } from '~/primitives';
import type {
  EditorRun,
  PointOfInterest,
  PublicRoute,
  Waypoint,
} from '~/types';

import { PointOfInterestPanel } from '../PointOfInterestPanel';
import { RootPanel } from '../RootPanel';
import { RoutePanel } from '../RoutePanel';
import { WaypointPanel } from '../WaypointPanel';
import { useRootPanelState } from '../../hooks/useRootPanelState';
import { usePanelState } from '../../hooks/usePanelState';
import { useRecordPanelState } from '../../hooks/useRecordPanelState';

interface SidePanelContainerProps {
  existingRun?: EditorRun;
}

export const SidePanelContainer = ({
  existingRun,
}: SidePanelContainerProps) => {
  const routePanelState = usePanelState<PublicRoute>({
    existingItems: existingRun?.routes,
  });
  const pointOfInterestPanelState = usePanelState<PointOfInterest>({
    existingItems: existingRun?.pointsOfInterest,
  });
  const waypointPanelState = useRecordPanelState<Waypoint>({
    existingItems: existingRun?.routes.reduce(
      (acc, route) => {
        acc[route.id] = route.waypoints;
        return acc;
      },
      {} as Record<string, Waypoint[]>,
    ),
  });
  const {
    showRootPanel,
    onOpen,
    onClose,
    onAddRoute,
    onEditRoute,
    onAddPointOfInterest,
    onEditPointOfInterest,
    onAddWaypoint,
    onEditWaypoint,
  } = useRootPanelState({
    routePanelState,
    pointOfInterestPanelState,
    waypointPanelState,
  });

  useHotkey('P', () => {
    if (showRootPanel) {
      onClose();
    } else {
      onOpen();
    }
  });

  return (
    <SidePanel
      onOpen={onOpen}
      panels={[
        {
          id: 'root',
          position: 0,
          isVisible: showRootPanel,
          disabled: [
            routePanelState,
            pointOfInterestPanelState,
            waypointPanelState,
          ].some((state) => state.hasMadeChanges),
          content: (
            <RootPanel
              existingRun={existingRun}
              currentRoutes={routePanelState.currentItems}
              currentPointsOfInterest={pointOfInterestPanelState.currentItems}
              onClose={onClose}
              onAddRoute={onAddRoute}
              onEditRoute={onEditRoute}
              onAddPointOfInterest={onAddPointOfInterest}
              onEditPointOfInterest={onEditPointOfInterest}
            />
          ),
        },
        {
          id: 'point-of-interest',
          position: 1,
          isVisible: pointOfInterestPanelState.showPanel,
          content: <PointOfInterestPanel {...pointOfInterestPanelState} />,
        },
        {
          id: 'route',
          position: 1,
          isVisible: routePanelState.showPanel,
          content: (
            <RoutePanel
              {...routePanelState}
              currentWaypoints={waypointPanelState.currentItems}
              onAddWaypoint={onAddWaypoint}
              onEditWaypoint={onEditWaypoint}
            />
          ),
        },
        {
          id: 'waypoint',
          position: 2,
          isVisible: waypointPanelState.showPanel,
          content: <WaypointPanel {...waypointPanelState} />,
        },
      ]}
    />
  );
};
