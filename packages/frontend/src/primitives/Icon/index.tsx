import type { CSSProperties } from 'react';

import { Close } from './Close';
import { Location } from './Location';
import { Settings } from './Settings';
import { Visible } from './Visible';
import { Hidden } from './Hidden';
import { Lightning } from './Lightning';
import { Star } from './Star';
import { Arrow } from './Arrow';
import { Reset } from './Reset';
import { ArrowTrendingUp } from './ArrowTrendingUp';
import { ArrowTrendingDown } from './ArrowTrendingDown';
import { Mountain } from './Mountain';
import { DoubleArrow } from './DoubleArrow';
import { ArrowUpDown } from './ArrowUpDown';
import { Play } from './Play';
import { ExternalLink } from './ExternalLink';
import { Spretta } from './Spretta';
import { Ruler } from './Ruler';
import { Magnifier } from './Magnifier';
import { Drop } from './Drop';
import { Clock } from './Clock';
import { Toilet } from './Toilet';
import { Error } from './Error';
import { Home } from './Home';
import { Bag } from './Bag';
import { Shower } from './Shower';
import { Trophy } from './Trophy';
import { Flame } from './Flame';
import { People } from './People';
import { Information } from './Information';
import { Food } from './Food';
import { Aid } from './Aid';
import { Parking } from './Parking';

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
  | 'arrowTrendingUp'
  | 'arrowTrendingDown'
  | 'mountain'
  | 'doubleArrow'
  | 'arrowUpDown'
  | 'play'
  | 'externalLink'
  | 'spretta'
  | 'ruler'
  | 'magnifier'
  | 'drop'
  | 'clock'
  | 'toilet'
  | 'error'
  | 'home'
  | 'bag'
  | 'shower'
  | 'trophy'
  | 'flame'
  | 'people'
  | 'information'
  | 'food'
  | 'aid'
  | 'parking';

interface IconProps {
  name: IconName;
  style?: CSSProperties;
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
    case 'externalLink':
      return <ExternalLink />;
    case 'spretta':
      return <Spretta />;
    case 'ruler':
      return <Ruler />;
    case 'magnifier':
      return <Magnifier />;
    case 'drop':
      return <Drop />;
    case 'clock':
      return <Clock />;
    case 'toilet':
      return <Toilet />;
    case 'error':
      return <Error />;
    case 'home':
      return <Home />;
    case 'bag':
      return <Bag />;
    case 'shower':
      return <Shower />;
    case 'trophy':
      return <Trophy />;
    case 'flame':
      return <Flame />;
    case 'people':
      return <People />;
    case 'information':
      return <Information />;
    case 'food':
      return <Food />;
    case 'aid':
      return <Aid />;
    case 'parking':
      return <Parking />;
    default:
      return null;
  }
};

export const Icon = ({ name, style, className }: IconProps) => {
  return (
    <div className={cn('size-6', className)} style={style}>
      <IconContent name={name} />
    </div>
  );
};
