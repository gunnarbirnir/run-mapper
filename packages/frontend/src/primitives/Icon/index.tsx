import { Trophy } from './Trophy';
import { Elevation } from './Elevation';

import { cn } from '~/utils';

export type IconName = 'trophy' | 'elevation';

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
