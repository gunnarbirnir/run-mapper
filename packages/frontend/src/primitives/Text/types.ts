import type { CSSProperties, ReactNode } from 'react';

type BaseTextProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export type PVariant =
  | 'default'
  | 'label'
  | 'bold'
  | 'medium'
  | 'subtle'
  | 'paragraph';

export type TextProps =
  | (BaseTextProps & {
      element?: 'p';
      variant?: PVariant;
    })
  | (BaseTextProps & {
      element?: 'label';
      htmlFor?: string;
    })
  | (BaseTextProps & {
      element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    });
