import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

type RoundButtonProps = {
  children: ReactElement;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'h-10 w-10 bg-black text-white rounded-full transition-scale duration-100 flex items-center justify-center';
const ENABLED_CLASS_NAME = 'hover:bg-gray-700 cursor-pointer active:scale-90';

export const RoundButton = ({
  children,
  className,
  linkTo,
  disabled,
  ...props
}: RoundButtonProps) => {
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    { 'bg-gray-400': disabled },
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
