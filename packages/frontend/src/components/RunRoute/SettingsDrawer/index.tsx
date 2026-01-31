import { Drawer, Text, Radio } from '~/primitives';
import type { WidgetType, MapStyle } from '~/types';

import { SectionLabel } from './SectionLabel';
import { VisibleToggle } from './VisibleToggle';
import { SettingsRadio } from './SettingsRadio';

interface SettingsDrawerProps {
  isOpen: boolean;
  width: number;
  visibleWidgets: Record<WidgetType, boolean>;
  mapStyle: MapStyle;
  toggleVisibleWidget: (widget: WidgetType) => void;
  onMapStyleChange: (style: MapStyle) => void;
}

export const SettingsDrawer = ({
  isOpen,
  width,
  visibleWidgets,
  mapStyle,
  toggleVisibleWidget,
  onMapStyleChange,
}: SettingsDrawerProps) => {
  return (
    <Drawer
      isOpen={isOpen}
      width={width}
      className="pointer-events-auto z-20 px-4 py-6"
    >
      <Text element="h2" className="text-lg font-medium">
        Settings
      </Text>
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
