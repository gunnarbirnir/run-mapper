import type { ReactNode } from 'react';
import { cn } from '~/utils';

interface ListItemContainerProps {
  children: ReactNode;
  className?: string;
}

export const ListItemContainer = ({
  children,
  className,
}: ListItemContainerProps) => {
  return (
    <div
      className={cn(
        'flex flex-col [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-gray-300',
        className,
      )}
    >
      {children}
    </div>
  );
};
