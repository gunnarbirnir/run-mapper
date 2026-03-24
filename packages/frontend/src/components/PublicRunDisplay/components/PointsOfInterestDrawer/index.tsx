import { useHotkey } from '@tanstack/react-hotkeys';
import { useMemo, useCallback } from 'react';

import { PUBLIC_RUN_DISPLAY_MIN_WIDTH } from '~/constants';
import { Drawer } from '~/primitives';
import type { PointOfInterest, Waypoint } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { PointOfInterestGroup } from './PointOfInterestGroup';

interface SettingsDrawerProps {
  isOpen: boolean;
  width: number;
  pointsOfInterest: PointOfInterest[];
  waypoints: Waypoint[];
  showPointsOfInterest: boolean;
  showWaypoints: boolean;
  toggleDrawer: () => void;
  setActivePointOfInterest: (poiId: string, fromDrawer: boolean) => void;
  setActiveWaypoint: (waypointId: string) => void;
}

// const TAB_INDEX = 25;
// const ALL_EXPANDED_MAX = 10;

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
  // waypoints,
  showPointsOfInterest,
  // showWaypoints,
  toggleDrawer,
  setActivePointOfInterest,
  // setActiveWaypoint,
}: SettingsDrawerProps) => {
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

  // const allExpanded = poiGroups.length <= ALL_EXPANDED_MAX;

  const handleSetActivePointOfInterest = useCallback(
    (poiId: string) => {
      setActivePointOfInterest(poiId, true);
    },
    [setActivePointOfInterest],
  );

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
      <div className="flex flex-col gap-1">
        {poiGroups.map((poiGroup) => (
          <PointOfInterestGroup
            key={poiGroup[0].type}
            pointsOfInterest={poiGroup}
            isClickable={showPointsOfInterest}
            setActivePointOfInterest={handleSetActivePointOfInterest}
          />
        ))}
      </div>
    </Drawer>
  );
};
