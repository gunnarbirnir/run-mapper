import { Text } from '../Text';

import { cn } from '~/utils';

interface InputLabelProps {
  children: string;
  htmlFor?: string;
  className?: string;
}

export const InputLabel = ({
  children,
  htmlFor,
  className,
}: InputLabelProps) => {
  return (
    <Text
      element="label"
      htmlFor={htmlFor}
      className={cn('block mb-2', className)}
    >
      {children}
    </Text>
  );
};
