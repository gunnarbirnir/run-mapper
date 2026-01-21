import { Trophy } from './Trophy';
import { Elevation } from './Elevation';
import { Close } from './Close';
import { ElevationDown } from './ElevationDown';
import { DoubleArrow } from './DoubleArrow';
import { ArrowUpDown } from './ArrowUpDown';

import { cn } from '~/utils';

export type IconName =
  | 'trophy'
  | 'elevation'
  | 'elevation-down'
  | 'close'
  | 'double-arrow'
  | 'arrow-up-down';

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
    case 'elevation-down':
      return <ElevationDown />;
    case 'close':
      return <Close />;
    case 'double-arrow':
      return <DoubleArrow />;
    case 'arrow-up-down':
      return <ArrowUpDown />;
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
