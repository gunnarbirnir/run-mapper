import { type ReactNode, useEffect, useState } from 'react';

import { Icon, RoundButton, Text, type IconName } from '~/primitives';
import { cn } from '~/utils';
import { useFocusTrap } from '~/hooks/useFocusTrap';

interface ModalContentProps {
  isOpen: boolean;
  children: ReactNode;
  title?: string;
  icon?: IconName;
  iconClassName?: string;
  onClose?: () => void;
}

export const ModalContent = ({
  isOpen,
  children,
  title = '',
  icon,
  iconClassName,
  onClose,
}: ModalContentProps) => {
  const containerRef = useFocusTrap(isOpen);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasScrolled(false);
    }
  }, [isOpen]);

  return (
    <div className="relative flex h-full flex-col" ref={containerRef}>
      <div
        className={cn(
          'absolute top-0 left-0 flex w-full items-center justify-between rounded-t-lg bg-white p-4 pb-2',
          {
            'shadow-md': hasScrolled,
          },
        )}
      >
        {/* Dummy item for spacing */}
        <div className="size-8" />
        <div className="flex items-center gap-2">
          {icon && (
            <Icon
              name={icon}
              className={cn('text-primary-500 size-7', iconClassName)}
            />
          )}
          <Text element="h2" className="text-lg font-medium">
            {title}
          </Text>
        </div>
        <RoundButton onClick={onClose}>
          <Icon name="close" className="size-5.5" />
        </RoundButton>
      </div>
      {/* Dummy item for spacing */}
      <div className="p-3">
        <div className="size-8" />
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto pt-2 pb-6"
        onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          setHasScrolled(target.scrollTop > 0);
        }}
      >
        {children}
      </div>
    </div>
  );
};
