import type { ButtonHTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

import { RoundButton } from './RoundButton';
import { type ButtonColor, getColorClassName } from './utils';

type ButtonProps = {
  children: string;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
  isLoading?: boolean;
  color?: ButtonColor;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'inline-block px-6 py-2 rounded-full transition-scale duration-100';
const ENABLED_CLASS_NAME = 'cursor-pointer active:scale-95';

export const Button = ({
  children,
  className,
  linkTo,
  disabled = false,
  isLoading = false,
  color = 'black',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  const buttonContent = isLoading ? 'Loading...' : children;
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    getColorClassName(color, { disabled: isDisabled }),
    { [ENABLED_CLASS_NAME]: !isDisabled },
    className,
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <BaseUiButton
          {...props}
          disabled={isDisabled}
          className={combinedClassName}
        >
          {buttonContent}
        </BaseUiButton>
      </Link>
    );
  }

  return (
    <BaseUiButton
      {...props}
      disabled={isDisabled}
      className={combinedClassName}
    >
      {buttonContent}
    </BaseUiButton>
  );
};

export { RoundButton };
