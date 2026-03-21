import type { ReactNode } from 'react';

import { Icon, Text } from '~/primitives';

interface VisibleToggleProps {
  children: ReactNode;
  isVisible: boolean;
  tabIndex?: number;
  onToggle: () => void;
}

export const VisibleToggle = ({
  children,
  isVisible,
  tabIndex,
  onToggle,
}: VisibleToggleProps) => {
  return (
    <div
      className="mb-1 flex cursor-pointer items-center gap-2 rounded-md px-1 hover:bg-gray-100"
      onClick={onToggle}
      tabIndex={tabIndex}
    >
      <Icon
        name={isVisible ? 'visible' : 'hidden'}
        className="size-5 text-gray-700"
      />
      <Text className="select-none">{children}</Text>
    </div>
  );
};
