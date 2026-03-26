import { useHotkey } from '@tanstack/react-hotkeys';

import { PUBLIC_RUN_DISPLAY_MIN_WIDTH } from '~/constants';
import { Drawer, Radio } from '~/primitives';
import type { MapStyle } from '~/types';
import { useMediaQuery } from '~/hooks/useMediaQuery';

import { SectionLabel } from './SectionLabel';
import { SettingsRadio } from './SettingsRadio';
import { VisibleToggle } from './VisibleToggle';
import type { RunDisplaySettings } from '../../hooks/useSettings';

interface SettingsDrawerProps {
  settings: RunDisplaySettings;
  isOpen: boolean;
  width: number;
  onOpen: () => void;
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
  onOpen,
  onClose,
}: SettingsDrawerProps) => {
  const { isSmallScreen } = useMediaQuery();

  useHotkey('S', () => {
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  });

  return (
    <Drawer
      title="Settings"
      isOpen={isOpen}
      width={width}
      minWidth={PUBLIC_RUN_DISPLAY_MIN_WIDTH}
      className="pointer-events-auto z-20"
      titleSectionClassName="mb-0"
      hideCloseButton={!isSmallScreen}
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
      <SectionLabel>Map</SectionLabel>
      <VisibleToggle
        isVisible={showPointsOfInterest}
        onToggle={toggleShowPointsOfInterest}
        tabIndex={TAB_INDEX}
      >
        Points of interest
      </VisibleToggle>
      <VisibleToggle
        isVisible={showWaypoints}
        onToggle={toggleShowWaypoints}
        tabIndex={TAB_INDEX}
      >
        Waypoints
      </VisibleToggle>
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
