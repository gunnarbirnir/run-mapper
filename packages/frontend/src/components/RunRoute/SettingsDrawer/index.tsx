import { Drawer, Text } from '~/primitives';
import type { WidgetType } from '~/types';

import { SectionLabel } from './SectionLabel';
import { VisibleToggle } from './VisibleToggle';

interface SettingsDrawerProps {
  isOpen: boolean;
  width: number;
  visibleWidgets: Record<WidgetType, boolean>;
  toggleVisibleWidget: (widget: WidgetType) => void;
}

export const SettingsDrawer = ({
  isOpen,
  width,
  visibleWidgets,
  toggleVisibleWidget,
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
    </Drawer>
  );
};
