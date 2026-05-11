import { useHotkey } from '@tanstack/react-hotkeys';
import { useCallback, useLayoutEffect } from 'react';

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
import { type PanelState } from '../../hooks/usePanelState';

interface SidePanelContainerProps {
  existingRun?: EditorRun;
  routePanelState: PanelState<PublicRoute>;
  pointOfInterestPanelState: PanelState<PointOfInterest>;
  waypointPanelState: PanelState<Waypoint>;
  setIsAnimatingPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidePanelContainer = ({
  existingRun,
  routePanelState,
  pointOfInterestPanelState,
  waypointPanelState,
  setIsAnimatingPanel,
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
  } = useRootPanelState({
    routePanelState,
    pointOfInterestPanelState,
    waypointPanelState,
  });
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

  const onPanelAnimationComplete = useCallback(() => {
    setIsAnimatingPanel(false);
  }, [setIsAnimatingPanel]);

  useLayoutEffect(() => {
    setIsAnimatingPanel(true);
  }, [
    showRootPanel,
    routePanelState.showPanel,
    pointOfInterestPanelState.showPanel,
    waypointPanelState.showPanel,
    setIsAnimatingPanel,
  ]);

  return (
    <SidePanel
      onOpen={onOpen}
      className="z-10"
      // To be below route stats
      toggleClassName="top-16"
      onItemAnimationComplete={onPanelAnimationComplete}
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
          disabled: waypointPanelState.hasMadeChanges,
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
