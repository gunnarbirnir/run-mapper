import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

import { type ButtonColor, getColorClassName } from './utils';
import { TouchableArea } from './TouchableArea';

type RoundButtonProps = {
  children: ReactElement;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
  color?: ButtonColor;
  touchablePadding?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'h-8 w-8 rounded-full transition-scale duration-100 flex items-center justify-center relative';
const ENABLED_CLASS_NAME = 'cursor-pointer active:scale-90';

export const RoundButton = ({
  children,
  className,
  linkTo,
  disabled = false,
  color = 'black',
  touchablePadding,
  ...props
}: RoundButtonProps) => {
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    getColorClassName(color, { disabled }),
    { [ENABLED_CLASS_NAME]: !disabled },
    className,
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <BaseUiButton
          {...props}
          disabled={disabled}
          className={combinedClassName}
        >
          <TouchableArea touchablePadding={touchablePadding}>
            {children}
          </TouchableArea>
        </BaseUiButton>
      </Link>
    );
  }

  return (
    <BaseUiButton {...props} disabled={disabled} className={combinedClassName}>
      <TouchableArea touchablePadding={touchablePadding}>
        {children}
      </TouchableArea>
    </BaseUiButton>
  );
};
