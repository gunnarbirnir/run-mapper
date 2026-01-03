import type { ButtonHTMLAttributes } from 'react';

type ButtonBaseProps = {
  children: string;
  className?: string;
};

export type ButtonProps =
  | (ButtonBaseProps & {
      linkTo: string;
    })
  | (ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement>);
