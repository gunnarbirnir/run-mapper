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
import { type RootPanelState } from '../../hooks/useRootPanelState';
import { type PanelState } from '../../hooks/usePanelState';

interface SidePanelContainerProps {
  existingRun?: EditorRun;
  rootPanelState: RootPanelState;
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: PanelState<Waypoint>;
}

export const SidePanelContainer = ({
  existingRun,
  rootPanelState,
  routePanelState,
  pointOfInterestPanelState,
  waypointPanelState,
}: SidePanelContainerProps) => {
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
    onAnimationComplete,
  } = rootPanelState;
  const routeDistance = routePanelState.currentItems.find(
    (route) => route.id === routePanelState.editId,
    // TODO: Replace with actual distance
  )?.displayDistance;

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
      className="z-10"
      // To be below route stats
      toggleClassName="top-16"
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
          onAnimationComplete,
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
          onAnimationComplete: pointOfInterestPanelState.onAnimationComplete,
          content: <PointOfInterestPanel {...pointOfInterestPanelState} />,
        },
        {
          id: 'route',
          position: 1,
          isVisible: routePanelState.showPanel,
          disabled: waypointPanelState.hasMadeChanges,
          onAnimationComplete: routePanelState.onAnimationComplete,
          content: (
            <RoutePanel
              {...routePanelState}
              currentWaypoints={waypointPanelState.currentItems}
              routeDistance={routeDistance}
              onAddWaypoint={onAddWaypoint}
              onEditWaypoint={onEditWaypoint}
            />
          ),
        },
        {
          id: 'waypoint',
          position: 2,
          isVisible: waypointPanelState.showPanel,
          onAnimationComplete: waypointPanelState.onAnimationComplete,
          content: (
            <WaypointPanel
              {...waypointPanelState}
              routeDistance={routeDistance}
            />
          ),
        },
      ]}
    />
  );
};
