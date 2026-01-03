import { Link } from '@tanstack/react-router';

import { cn } from '~/utils';

import type { ButtonProps } from './types';

const BASE_CLASS_NAME =
  'inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';

export const Button = ({ children, className, ...props }: ButtonProps) => {
  const combinedClassName = cn(BASE_CLASS_NAME, className);

  if ('linkTo' in props) {
    return (
      <Link to={props.linkTo} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={combinedClassName}>
      {children}
    </button>
  );
};
