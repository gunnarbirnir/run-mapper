import type { ReactNode } from 'react';

import { Icon, Text } from '~/primitives';

interface VisibleToggleProps {
  children: ReactNode;
  isVisible: boolean;
  onToggle: () => void;
}

export const VisibleToggle = ({
  children,
  isVisible,
  onToggle,
}: VisibleToggleProps) => {
  return (
    <div
      className="mb-1 flex cursor-pointer items-center gap-2"
      onClick={onToggle}
    >
      <Icon name={isVisible ? 'visible' : 'hidden'} className="size-5" />
      <Text className="select-none">{children}</Text>
    </div>
  );
};
