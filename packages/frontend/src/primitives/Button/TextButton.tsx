import type { ButtonHTMLAttributes } from 'react';

import { cn } from '~/utils';

import { Text } from '../Text';

type TextButtonProps = {
  children: string;
  className?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME = 'text-sm underline underline-offset-2';
const ENABLED_CLASS_NAME = 'cursor-pointer hover:text-gray-500';

export const TextButton = ({
  children,
  className,
  disabled = false,
  ...props
}: TextButtonProps) => {
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    { [ENABLED_CLASS_NAME]: !disabled },
    className,
  );

  return (
    <button type="button" {...props}>
      <Text className={combinedClassName}>{children}</Text>
    </button>
  );
};
