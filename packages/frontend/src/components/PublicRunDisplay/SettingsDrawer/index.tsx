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

  return (
    <Drawer
      title="Settings"
      isOpen={isOpen}
      width={width}
      minWidth={PUBLIC_RUN_DISPLAY_MIN_WIDTH}
      className="pointer-events-auto z-20"
      titleSectionClassName="mb-0"
      onClose={isSmallScreen ? toggleDrawer : undefined}
    >
      <SectionLabel>Widgets</SectionLabel>
      <VisibleToggle
        isVisible={visibleWidgets.distance}
        onToggle={() => toggleVisibleWidget('distance')}
      >
        Distance
      </VisibleToggle>
      <VisibleToggle
        isVisible={visibleWidgets.elevation}
        onToggle={() => toggleVisibleWidget('elevation')}
      >
        Elevation
      </VisibleToggle>
      <SectionLabel>Map</SectionLabel>
      <VisibleToggle isVisible={showWaypoints} onToggle={toggleShowWaypoints}>
        Waypoints
      </VisibleToggle>
      <SectionLabel>Map style</SectionLabel>
      <Radio.Group
        value={mapStyle}
        onChange={(styleValue) => onMapStyleChange(styleValue as MapStyle)}
      >
        <SettingsRadio value="standard">Standard</SettingsRadio>
        <SettingsRadio value="satellite">Satellite</SettingsRadio>
      </Radio.Group>
    </Drawer>
  );
};
