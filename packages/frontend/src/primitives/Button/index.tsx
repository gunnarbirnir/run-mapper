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
  'inline-block px-6 py-2 bg-black text-white rounded-full active:scale-95 transition-scale duration-100';

export const Button = ({
  children,
  className,
  linkTo,
  disabled,
  ...props
}: ButtonProps) => {
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    { 'bg-gray-400': disabled },
    { 'hover:bg-gray-700 cursor-pointer': !disabled },
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
