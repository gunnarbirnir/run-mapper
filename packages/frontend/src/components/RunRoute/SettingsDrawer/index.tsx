import { Drawer, Text, Radio } from '~/primitives';
import type { WidgetType, MapStyle } from '~/types';
import { RUN_ROUTE_MIN_WIDTH } from '~/constants';

import { useMediaQuery } from '~/hooks/useMediaQuery';
import { RoundButton, Icon } from '~/primitives';

import { SectionLabel } from './SectionLabel';
import { VisibleToggle } from './VisibleToggle';
import { SettingsRadio } from './SettingsRadio';

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
      isOpen={isOpen}
      width={width}
      minWidth={RUN_ROUTE_MIN_WIDTH}
      className="pointer-events-auto z-20 px-4 py-6"
    >
      <div className="flex items-center justify-between">
        <Text element="h2">Settings</Text>
        {isSmallScreen && (
          <RoundButton onClick={toggleDrawer}>
            <Icon name="close" className="size-6" />
          </RoundButton>
        )}
      </div>
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
