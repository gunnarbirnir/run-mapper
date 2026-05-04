import { cn } from '~/utils';

import { Text } from '../Text';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

interface InputLabelProps {
  children: string;
  htmlFor?: string;
  infoText?: string;
  className?: string;
}

export const InputLabel = ({
  children,
  htmlFor,
  infoText,
  className,
}: InputLabelProps) => {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <Text
        element="label"
        htmlFor={htmlFor}
        className={cn('block', className)}
      >
        {children}
      </Text>
      {infoText ? (
        <Tooltip label={infoText}>
          <Icon name="info" className="size-4 text-gray-500" />
        </Tooltip>
      ) : null}
    </div>
  );
};
