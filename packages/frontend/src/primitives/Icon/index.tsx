import { Close } from './Close';
import { Location } from './Location';
import { Settings } from './Settings';
import { Visible } from './Visible';
import { Hidden } from './Hidden';
import { Lightning } from './Lightning';
import { Star } from './Star';
import { Arrow } from './Arrow';
import { Reset } from './Reset';
import { Trophy } from './Trophy';
import { ArrowTrendingUp } from './ArrowTrendingUp';
import { ArrowTrendingDown } from './ArrowTrendingDown';
import { Mountain } from './Mountain';
import { DoubleArrow } from './DoubleArrow';
import { ArrowUpDown } from './ArrowUpDown';
import { Play } from './Play';

import { cn } from '~/utils';

export type IconName =
  | 'close'
  | 'location'
  | 'settings'
  | 'visible'
  | 'hidden'
  | 'lightning'
  | 'star'
  | 'arrow'
  | 'reset'
  | 'trophy'
  | 'arrowTrendingUp'
  | 'arrowTrendingDown'
  | 'mountain'
  | 'doubleArrow'
  | 'arrowUpDown'
  | 'play';

interface IconProps {
  name: IconName;
  className?: string;
}

const IconContent = ({ name }: { name: IconName }) => {
  switch (name) {
    case 'close':
      return <Close />;
    case 'location':
      return <Location />;
    case 'settings':
      return <Settings />;
    case 'visible':
      return <Visible />;
    case 'hidden':
      return <Hidden />;
    case 'lightning':
      return <Lightning />;
    case 'star':
      return <Star />;
    case 'arrow':
      return <Arrow />;
    case 'reset':
      return <Reset />;
    case 'trophy':
      return <Trophy />;
    case 'arrowTrendingUp':
      return <ArrowTrendingUp />;
    case 'arrowTrendingDown':
      return <ArrowTrendingDown />;
    case 'mountain':
      return <Mountain />;
    case 'doubleArrow':
      return <DoubleArrow />;
    case 'arrowUpDown':
      return <ArrowUpDown />;
    case 'play':
      return <Play />;
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
