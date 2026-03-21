import { useHotkey } from '@tanstack/react-hotkeys';

import { PUBLIC_RUN_DISPLAY_MIN_WIDTH } from '~/constants';
import { Drawer, Radio } from '~/primitives';
import type { MapStyle } from '~/types';

import { useMediaQuery } from '~/hooks/useMediaQuery';

import type { WidgetType } from '../types';
import { SectionLabel } from './SectionLabel';
import { SettingsRadio } from './SettingsRadio';
import { VisibleToggle } from './VisibleToggle';

interface SettingsDrawerProps {
  isOpen: boolean;
  width: number;
  visibleWidgets: Record<WidgetType, boolean>;
  showWaypoints: boolean;
  mapStyle: MapStyle;
  toggleDrawer: () => void;
  toggleVisibleWidget: (widget: WidgetType) => void;
  toggleShowWaypoints: () => void;
  onMapStyleChange: (style: MapStyle) => void;
}

const TAB_INDEX = 25;

export const SettingsDrawer = ({
  isOpen,
  width,
  visibleWidgets,
  showWaypoints,
  mapStyle,
  toggleDrawer,
  toggleVisibleWidget,
  toggleShowWaypoints,
  onMapStyleChange,
}: SettingsDrawerProps) => {
  const { isSmallScreen } = useMediaQuery();

  useHotkey('S', () => {
    toggleDrawer();
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
      onClose={toggleDrawer}
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
        isVisible={showWaypoints}
        onToggle={toggleShowWaypoints}
        tabIndex={TAB_INDEX}
      >
        Waypoints
      </VisibleToggle>
      <SectionLabel>Map style</SectionLabel>
      <Radio.Group
        value={mapStyle}
        onChange={(styleValue) => onMapStyleChange(styleValue as MapStyle)}
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
