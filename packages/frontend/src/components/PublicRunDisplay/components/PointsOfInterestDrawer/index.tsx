import { useHotkey } from '@tanstack/react-hotkeys';
import { useMemo, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { PUBLIC_RUN_DISPLAY_MIN_WIDTH } from '~/constants';
import { Drawer, Text } from '~/primitives';
import type { PointOfInterest, Waypoint } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';

import { PointOfInterestGroup } from './PointOfInterestGroup';
import { NotVisibleWarning } from './NotVisibleWarning';
import { WaypointsTimeline } from './WaypointsTimeline';

interface SettingsDrawerProps {
  isOpen: boolean;
  width: number;
  pointsOfInterest: PointOfInterest[];
  waypoints: Waypoint[];
  showPointsOfInterest: boolean;
  showWaypoints: boolean;
  toggleDrawer: () => void;
  setActivePointOfInterest: (poiId: string, fromDrawer: boolean) => void;
  setActiveWaypoint: (waypointId: string, fromDrawer: boolean) => void;
  setShowPointsOfInterest: () => void;
  setShowWaypoints: () => void;
}

const TAB_INDEX = 25;

const POI_ORDER = [
  'expo',
  'bag-drop-off',
  'warm-up-area',
  'food-and-drinks',
  'entertainment',
  'spectator-area',
  'aid-station',
  'showers-and-changing-rooms',
  'award-ceremony',
  'information',
  'restrooms',
  'parking',
];

export const PointsOfInterestDrawer = ({
  isOpen,
  width,
  pointsOfInterest,
  waypoints,
  showPointsOfInterest,
  showWaypoints,
  toggleDrawer,
  setActivePointOfInterest,
  setActiveWaypoint,
  setShowPointsOfInterest,
  setShowWaypoints,
}: SettingsDrawerProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const { isSmallScreen } = useMediaQuery();

  const poiGroups = useMemo(() => {
    const groups = pointsOfInterest.reduce(
      (acc: Record<string, PointOfInterest[]>, poi) => {
        const group = acc[poi.type] || [];
        group.push(poi);
        acc[poi.type] = group;
        return acc;
      },
      {},
    );
    return Object.values(groups).sort(
      (a, b) => POI_ORDER.indexOf(a[0].type) - POI_ORDER.indexOf(b[0].type),
    );
  }, [pointsOfInterest]);

  const handleSetActivePointOfInterest = useCallback(
    (poiId: string) => {
      setActivePointOfInterest(poiId, true);
    },
    [setActivePointOfInterest],
  );

  const handleSetActiveWaypoint = useCallback(
    (waypointId: string) => {
      setActiveWaypoint(waypointId, true);
    },
    [setActiveWaypoint],
  );

  const handleSetExpanded = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const newExpandedGroups = { ...prev };
      newExpandedGroups[groupId] = !newExpandedGroups[groupId];
      return newExpandedGroups;
    });
  }, []);

  useHotkey('I', () => {
    toggleDrawer();
  });

  return (
    <Drawer
      title="Points of interest"
      isOpen={isOpen}
      width={width}
      minWidth={PUBLIC_RUN_DISPLAY_MIN_WIDTH}
      className="pointer-events-auto z-20"
      hideCloseButton={!isSmallScreen}
      onClose={toggleDrawer}
    >
      <AnimatePresence>
        {!showPointsOfInterest && (
          <NotVisibleWarning
            className="mb-3"
            tabIndex={TAB_INDEX}
            onShowClick={setShowPointsOfInterest}
          >
            Points of interest are not visible. Click to show.
          </NotVisibleWarning>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-1">
        {poiGroups.map((poiGroup) => (
          <PointOfInterestGroup
            key={poiGroup[0].type}
            pointsOfInterest={poiGroup}
            isClickable={showPointsOfInterest}
            isExpanded={Boolean(expandedGroups[poiGroup[0].type])}
            tabIndex={TAB_INDEX}
            toggleExpanded={handleSetExpanded}
            setActivePointOfInterest={handleSetActivePointOfInterest}
          />
        ))}
      </div>
      <Text variant="label" className="mt-6 mb-2">
        Waypoints
      </Text>
      <AnimatePresence>
        {!showWaypoints && (
          <NotVisibleWarning
            className="mb-3"
            tabIndex={TAB_INDEX}
            onShowClick={setShowWaypoints}
          >
            Waypoints are not visible. Click to show.
          </NotVisibleWarning>
        )}
      </AnimatePresence>
      <WaypointsTimeline
        waypoints={waypoints}
        isClickable={showWaypoints}
        tabIndex={TAB_INDEX}
        setActiveWaypoint={handleSetActiveWaypoint}
      />
    </Drawer>
  );
};
