import { type ReactNode, useRef } from 'react';

import { useInertAttribute } from '~/hooks/useInertAttribute';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { cn, convertRemToPixels } from '~/utils';

interface SidePanelItemProps {
  isVisible?: boolean;
  showShadow?: boolean;
  children?: ReactNode;
  className?: string;
}

export const PANEL_WIDTH = '17.5rem';
export const SLIDE_IN_DURATION = 0.15;

export const SidePanelItem = ({
  isVisible = true,
  showShadow = true,
  children,
  className,
}: SidePanelItemProps) => {
  const ref = useRef<HTMLElement>(null);
  const { isSmallScreen } = useMediaQuery();
  const { width: windowWidth } = useWindowDimensions();
  const panelWidth = isSmallScreen
    ? windowWidth
    : convertRemToPixels(PANEL_WIDTH);

  useInertAttribute(ref, !isVisible);

  return (
    <aside
      ref={ref}
      className={cn(
        'h-full overflow-y-auto bg-white p-6',
        { 'shadow-lg/20': showShadow },
        className,
      )}
      style={{ width: panelWidth }}
    >
      {children}
    </aside>
  );
};
