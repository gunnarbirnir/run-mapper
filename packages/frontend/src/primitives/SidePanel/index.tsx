import { type ReactNode } from 'react';

import { cn } from '~/utils';
import { Text } from '../Text';

export interface SidePanelProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}

export const SidePanel = ({ title, children, className }: SidePanelProps) => {
  return (
    <aside className={cn('h-full w-70 bg-white shadow-lg/20', className)}>
      {title && (
        <Text element="h2" className="mb-4">
          {title}
        </Text>
      )}
      {children}
    </aside>
  );
};
