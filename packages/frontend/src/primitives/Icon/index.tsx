import { Trophy } from './Trophy';
import { Elevation } from './Elevation';
import { Close } from './Close';

import { cn } from '~/utils';

export type IconName = 'trophy' | 'elevation' | 'close';

interface IconProps {
  name: IconName;
  className?: string;
}

const IconContent = ({ name }: { name: IconName }) => {
  switch (name) {
    case 'trophy':
      return <Trophy />;
    case 'elevation':
      return <Elevation />;
    case 'close':
      return <Close />;
    default:
      return null;
  }
};

export const Icon = ({ name, className }: IconProps) => {
  return (
    <div className={cn('size-6', className)}>
      <IconContent name={name} />
    </div>
  );
};
