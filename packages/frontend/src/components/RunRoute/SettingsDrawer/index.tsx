import { Drawer } from '~/primitives';

interface SettingsDrawerProps {
  isOpen: boolean;
  width: number;
}

export const SettingsDrawer = ({ isOpen, width }: SettingsDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} width={width} className="z-20 p-4">
      SettingsDrawer
    </Drawer>
  );
};
