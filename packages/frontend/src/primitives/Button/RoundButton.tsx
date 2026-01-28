import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

import { type ButtonColor, getColorClassName } from './utils';

type RoundButtonProps = {
  children: ReactElement;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
  color?: ButtonColor;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'h-8 w-8 rounded-full transition-scale duration-100 flex items-center justify-center';
const ENABLED_CLASS_NAME = 'cursor-pointer active:scale-90';

export const RoundButton = ({
  children,
  className,
  linkTo,
  disabled = false,
  color = 'black',
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
          {children}
        </BaseUiButton>
      </Link>
    );
  }

  return (
    <BaseUiButton {...props} disabled={disabled} className={combinedClassName}>
      {children}
    </BaseUiButton>
  );
};
