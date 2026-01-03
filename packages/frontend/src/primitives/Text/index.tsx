import { cn } from '~/utils';

import type { TextProps } from './types';
import { pGetVariantClassName } from './utils';

export const Text = ({
  children,
  element = 'p',
  className,
  ...props
}: TextProps) => {
  switch (element) {
    case 'h1':
      return (
        <h1 className={cn('text-3xl font-bold', className)}>{children}</h1>
      );
    case 'h2':
      return <h2 className={className}>{children}</h2>;
    case 'h3':
      return <h3 className={className}>{children}</h3>;
    case 'h4':
      return <h4 className={className}>{children}</h4>;
    case 'h5':
      return <h5 className={className}>{children}</h5>;
    case 'h6':
      return <h6 className={className}>{children}</h6>;
    case 'label':
      return (
        <label
          htmlFor={'htmlFor' in props ? props.htmlFor : undefined}
          className={cn('font-medium', className)}
        >
          {children}
        </label>
      );
    default:
      return (
        <p
          className={cn(
            pGetVariantClassName(
              'variant' in props ? props.variant : undefined
            ),
            className
          )}
        >
          {children}
        </p>
      );
  }
};
