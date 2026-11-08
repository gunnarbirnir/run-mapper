import type { ButtonHTMLAttributes } from 'react';
import { Link } from '@tanstack/react-router';
import { Button as BaseUiButton } from '@base-ui/react/button';

import { cn } from '~/utils';

import { type ButtonColor, getColorClassName } from './utils';
import { TouchableArea } from './TouchableArea';
import { Icon, type IconName } from '../Icon';

type TinyButtonProps = {
  children: string;
  className?: string;
  linkTo?: string;
  disabled?: boolean;
  color?: ButtonColor;
  icon?: IconName;
  iconClassName?: string;
  touchablePadding?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_CLASS_NAME =
  'px-2 py-1 rounded-full transition-scale duration-100 flex items-center justify-center relative text-xs';
const ENABLED_CLASS_NAME = 'cursor-pointer active:scale-90';
const ICON_CLASS_NAME = 'mr-1 size-3';

export const TinyButton = ({
  children,
  className,
  linkTo,
  disabled = false,
  color = 'black',
  touchablePadding,
  icon,
  iconClassName,
  ...props
}: TinyButtonProps) => {
  const combinedClassName = cn(
    BASE_CLASS_NAME,
    getColorClassName(color, { disabled }),
    { [ENABLED_CLASS_NAME]: !disabled },
    className,
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <BaseUiButton
          {...props}
          disabled={disabled}
          className={combinedClassName}
        >
          <TouchableArea touchablePadding={touchablePadding}>
            {icon ? (
              <Icon
                name={icon}
                className={cn(ICON_CLASS_NAME, iconClassName)}
              />
            ) : null}
            {children.toUpperCase()}
          </TouchableArea>
        </BaseUiButton>
      </Link>
    );
  }

  return (
    <BaseUiButton {...props} disabled={disabled} className={combinedClassName}>
      <TouchableArea touchablePadding={touchablePadding}>
        {icon ? (
          <Icon name={icon} className={cn(ICON_CLASS_NAME, iconClassName)} />
        ) : null}
        {children.toUpperCase()}
      </TouchableArea>
    </BaseUiButton>
  );
};
