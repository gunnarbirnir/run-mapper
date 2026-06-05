import type { ButtonHTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

import { RoundButton } from './RoundButton';
import { LoadingSpinner } from '../LoadingSpinner';
import { type ButtonColor, getColorClassName } from './utils';

export type ButtonProps = {
  children: string;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
  isLoading?: boolean;
  color?: ButtonColor;
  size?: 'small' | 'regular';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'inline-block px-6 py-2 rounded-full transition-scale duration-100 min-w-20 flex items-center justify-center relative whitespace-nowrap';
const ENABLED_CLASS_NAME = 'cursor-pointer active:scale-95';

export const Button = ({
  children,
  className,
  linkTo,
  disabled = false,
  isLoading = false,
  color = 'black',
  size = 'regular',
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    getColorClassName(color, { disabled: isDisabled }),
    { [ENABLED_CLASS_NAME]: !isDisabled },
    { 'px-4 py-1.5 text-sm': size === 'small' },
    className,
  );

  const buttonContent = (
    <>
      <div className={cn({ invisible: isLoading })}>{children}</div>
      {isLoading && (
        <div className="absolute top-0 left-0 flex size-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block rounded-full">
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
