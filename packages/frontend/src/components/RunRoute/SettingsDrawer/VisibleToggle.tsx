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
      className="mb-1 flex cursor-pointer items-center gap-2 rounded-md px-1 hover:bg-gray-100"
      onClick={onToggle}
    >
      <Icon
        name={isVisible ? 'visible' : 'hidden'}
        className="size-5 text-gray-800"
      />
      <Text className="select-none">{children}</Text>
    </div>
  );
};
