import type { ReactNode } from 'react';
import { cn } from '~/utils';

interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export const ListItemContainer = ({ children, className }: ListItemProps) => {
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
