import type { ButtonHTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

type ButtonProps = {
  children: string;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'inline-block px-4 py-2 bg-primary-500 text-white rounded';

export const Button = ({
  children,
  className,
  linkTo,
  disabled,
  ...props
}: ButtonProps) => {
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    { 'bg-primary-300': disabled },
    { 'hover:bg-primary-600 cursor-pointer': !disabled },
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
