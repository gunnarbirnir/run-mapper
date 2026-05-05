import type { CSSProperties } from 'react';

import { Close } from './Close';
import { Location } from './Location';
import { Settings } from './Settings';
import { Visible } from './Visible';
import { Hidden } from './Hidden';
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
import { Chevron } from './Chevron';
import { Link } from './Link';
import { Info } from './Info';
import { Plus } from './Plus';

import { cn } from '~/utils';

export type IconName =
  | 'close'
  | 'location'
  | 'settings'
  | 'visible'
  | 'hidden'
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
  | 'chevron'
  | 'link'
  | 'info'
  | 'plus';

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
    case 'chevron':
      return <Chevron />;
    case 'link':
      return <Link />;
    case 'info':
      return <Info />;
    case 'plus':
      return <Plus />;
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
