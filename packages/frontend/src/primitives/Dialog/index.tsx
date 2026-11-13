import { Dialog as BaseUiDialog } from '@base-ui/react/dialog';
import { useHotkey } from '@tanstack/react-hotkeys';
import { useState, type ReactNode } from 'react';

import { cn } from '~/utils';

import { Text } from '../Text';
import { Button, ButtonProps, RoundButton } from '../Button';
import { Icon } from '../Icon';

interface DialogButton {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
  color?: ButtonProps['color'];
  onClick?: () => void;
}

interface DialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  buttons?: DialogButton[];
  size?: 'small' | 'medium' | 'large';
  children?: ReactNode;
  titleClassName?: string;
  onClose?: () => void;
}

export const Dialog = ({
  title,
  description,
  isOpen,
  buttons,
  size = 'small',
  children,
  titleClassName,
  onClose,
}: DialogProps) => {
  const [popupElement, setPopupElement] = useState<HTMLDivElement | null>(null);

  useHotkey(
    'Enter',
    () => {
      buttons?.[0]?.onClick?.();
    },
    {
      target: popupElement,
      enabled:
        isOpen &&
        buttons &&
        buttons.length > 0 &&
        !buttons[0]?.isLoading &&
        !buttons[0]?.disabled &&
        Boolean(popupElement),
      conflictBehavior: 'allow',
    },
  );

  return (
    <BaseUiDialog.Root open={isOpen} onOpenChange={onClose}>
      <BaseUiDialog.Portal>
        <BaseUiDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-50 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <BaseUiDialog.Popup
          ref={setPopupElement}
          className={cn(
            'fixed top-1/2 left-1/2 -mt-8 w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0',
            {
              'w-120': size === 'medium',
              'w-160': size === 'large',
            },
          )}
        >
          <div
            className={cn('-mt-1.5 mb-2 flex items-start justify-between', {
              'mb-4': onClose,
            })}
          >
            <Text element="h2" className={cn('text-lg', titleClassName)}>
              {title}
            </Text>
            {onClose ? (
              <RoundButton
                onClick={onClose}
                className="-mt-1 -mr-2"
                color="gray"
              >
                <Icon name="close" className="size-5.5" />
              </RoundButton>
            ) : null}
          </div>
          <Text variant="subtle" className="mb-6 text-sm text-gray-600">
            {description}
          </Text>
          {children ? <div className="mb-6">{children}</div> : null}
          <div className="flex justify-end gap-2">
            {buttons?.map(
              ({ label, isLoading, disabled, color, onClick }, index) => (
                <Button
                  key={label}
                  isLoading={isLoading}
                  disabled={disabled}
                  color={color ?? (index === 0 ? 'black' : 'gray')}
                  onClick={onClick}
                >
                  {label}
                </Button>
              ),
            )}
          </div>
        </BaseUiDialog.Popup>
      </BaseUiDialog.Portal>
    </BaseUiDialog.Root>
  );
};
