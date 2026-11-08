import { Drawer, Radio } from '~/primitives';
import type { MapStyle } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';

import { SectionLabel } from './SectionLabel';
import { SettingsRadio } from './SettingsRadio';
import { VisibleToggle } from './VisibleToggle';
import type { RunDisplaySettings } from '../../hooks/useSettings';
import {
  PUBLIC_RUN_DISPLAY_MIN_WIDTH,
  DRAWER_ANIMATION_DURATION,
} from '../../constants';

interface SettingsDrawerProps {
  settings: RunDisplaySettings;
  isOpen: boolean;
  width: number;
  hasInnerWaypoints: boolean;
  hasPointsOfInterest: boolean;
  onClose: () => void;
}

const TAB_INDEX = 25;

export const SettingsDrawer = ({
  settings: {
    visibleWidgets,
    showWaypoints,
    showPointsOfInterest,
    mapStyle,
    toggleVisibleWidget,
    toggleShowWaypoints,
    toggleShowPointsOfInterest,
    setMapStyle,
  },
  isOpen,
  width,
  hasInnerWaypoints,
  hasPointsOfInterest,
  onClose,
}: SettingsDrawerProps) => {
  const { isSmallScreen } = useMediaQuery();

  return (
    <Drawer
      title="Settings"
      isOpen={isOpen}
      width={width}
      minWidth={PUBLIC_RUN_DISPLAY_MIN_WIDTH}
      className="pointer-events-auto z-20"
      titleSectionClassName="mb-0"
      hideCloseButton={!isSmallScreen}
      animationDuration={DRAWER_ANIMATION_DURATION}
      onClose={onClose}
    >
      <SectionLabel>Widgets</SectionLabel>
      <VisibleToggle
        isVisible={visibleWidgets.distance}
        onToggle={() => toggleVisibleWidget('distance')}
        tabIndex={TAB_INDEX}
      >
        Distance
      </VisibleToggle>
      <VisibleToggle
        isVisible={visibleWidgets.elevation}
        onToggle={() => toggleVisibleWidget('elevation')}
        tabIndex={TAB_INDEX}
      >
        Elevation
      </VisibleToggle>
      {(hasPointsOfInterest || hasInnerWaypoints) && (
        <>
          <SectionLabel>Map</SectionLabel>
          {hasPointsOfInterest && (
            <VisibleToggle
              isVisible={showPointsOfInterest}
              onToggle={toggleShowPointsOfInterest}
              tabIndex={TAB_INDEX}
            >
              Points of interest
            </VisibleToggle>
          )}
          {hasInnerWaypoints && (
            <VisibleToggle
              isVisible={showWaypoints}
              onToggle={toggleShowWaypoints}
              tabIndex={TAB_INDEX}
            >
              Waypoints
            </VisibleToggle>
          )}
        </>
      )}
      <SectionLabel>Map style</SectionLabel>
      <Radio.Group
        value={mapStyle}
        onChange={(styleValue) => setMapStyle(styleValue as MapStyle)}
      >
        <SettingsRadio value="standard" tabIndex={TAB_INDEX}>
          Standard
        </SettingsRadio>
        <SettingsRadio value="satellite" tabIndex={TAB_INDEX}>
          Satellite
        </SettingsRadio>
      </Radio.Group>
    </Drawer>
  );
};
