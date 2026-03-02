import { Link } from '@tanstack/react-router';

import { cn } from '~/utils';

import type { TextProps } from './types';
import { pGetVariantClassName } from './utils';

export const Text = ({
  children,
  element = 'p',
  className,
  style,
  ...props
}: TextProps) => {
  switch (element) {
    case 'h1':
      return (
        <h1 className={cn('mb-6 text-3xl font-bold', className)} style={style}>
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2
          className={cn('text-lg font-medium text-gray-900', className)}
          style={style}
        >
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3 className={className} style={style}>
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4 className={className} style={style}>
          {children}
        </h4>
      );
    case 'h5':
      return (
        <h5 className={className} style={style}>
          {children}
        </h5>
      );
    case 'h6':
      return (
        <h6 className={className} style={style}>
          {children}
        </h6>
      );
    case 'a':
      return (
        <Link
          to={'to' in props ? props.to : undefined}
          className={cn('text-secondary-600 hover:underline', className)}
        >
          {children}
        </Link>
      );
    case 'label':
      return (
        <label
          htmlFor={'htmlFor' in props ? props.htmlFor : undefined}
          className={cn('block text-xs text-gray-500 uppercase', className)}
          style={style}
        >
          {children}
        </label>
      );
    default:
      return (
        <p
          className={cn(
            pGetVariantClassName(
              'variant' in props ? props.variant : undefined,
            ),
            className,
          )}
          style={style}
        >
          {children}
        </p>
      );
  }
};
