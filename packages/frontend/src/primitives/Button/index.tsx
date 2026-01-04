import type { ButtonHTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

type ButtonProps = {
  children: string;
  className?: string;
  linkTo?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'inline-block px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 cursor-pointer';

export const Button = ({
  children,
  className,
  linkTo,
  ...props
}: ButtonProps) => {
  const combinedClassName = cn(BASE_CLASS_NAME, className);

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <BaseUiButton {...props} className={combinedClassName}>
          {children}
        </BaseUiButton>
      </Link>
    );
  }

  return (
    <BaseUiButton {...props} className={combinedClassName}>
      {children}
    </BaseUiButton>
  );
};
