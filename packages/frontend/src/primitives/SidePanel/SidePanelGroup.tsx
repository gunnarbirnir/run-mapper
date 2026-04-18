import { type ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

import { cn, convertRemToPixels } from '~/utils';
import { DEFAULT_EASING } from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';

import {
  SidePanel,
  type SidePanelProps,
  PANEL_WIDTH,
  SLIDE_IN_DURATION,
} from '.';

type SidePanelItem = Omit<SidePanelProps, 'children'> & {
  id: string;
  content: ReactNode;
  isVisible?: boolean;
};

interface SidePanelGroupProps {
  panels: SidePanelItem[];
  className?: string;
}

export const SidePanelGroup = ({ panels, className }: SidePanelGroupProps) => {
  const { isSmallScreen, isMediumScreen } = useMediaQuery();
  const { width: windowWidth } = useWindowDimensions();
  const [isAnimating, setIsAnimating] = useState<Record<string, boolean>>({});

  const panelWidth = isSmallScreen
    ? windowWidth
    : convertRemToPixels(PANEL_WIDTH);
  const maxPanelsInView = isMediumScreen ? 1 : 2;
  const visiblePanelsCount = panels.filter(
    (panel) => panel.isVisible !== false,
  ).length;
  const inViewPanelsCount = Math.min(visiblePanelsCount, maxPanelsInView);
  const inViewVisibleDiff = visiblePanelsCount - inViewPanelsCount;
  const isAnyAnimating = Object.values(isAnimating).some(
    (animating) => animating,
  );

  return (
    <motion.div
      initial={false}
      className={cn(
        'relative isolate',
        { 'absolute top-0 bottom-0 left-0': isSmallScreen },
        className,
      )}
      animate={{ width: panelWidth * inViewPanelsCount }}
      transition={{ duration: SLIDE_IN_DURATION, ease: DEFAULT_EASING }}
    >
      {panels.map(({ isVisible = true, onClose, ...panel }, index) => {
        const isTopVisibleItem = isVisible && index === visiblePanelsCount - 1;
        const showShadow = isMediumScreen
          ? isTopVisibleItem || isAnimating[panel.id]
          : isVisible;

        return (
          <motion.div
            key={panel.id}
            className="absolute top-0 bottom-0"
            style={{
              zIndex: isMediumScreen ? index : panels.length - index,
            }}
            initial={false}
            animate={{
              left: isMediumScreen
                ? isVisible
                  ? 0
                  : -panelWidth
                : (isVisible
                    ? index - inViewVisibleDiff
                    : inViewPanelsCount - 1) * panelWidth,
            }}
            transition={{
              duration: SLIDE_IN_DURATION,
              ease: DEFAULT_EASING,
            }}
            onAnimationStart={() =>
              setIsAnimating((prevIsAnimating) => ({
                ...prevIsAnimating,
                [panel.id]: true,
              }))
            }
            onAnimationComplete={() =>
              setIsAnimating((prevIsAnimating) => ({
                ...prevIsAnimating,
                [panel.id]: false,
              }))
            }
          >
            <SidePanel
              {...panel}
              animateCloseButton
              onClose={
                isTopVisibleItem && !isAnyAnimating ? onClose : undefined
              }
              className={cn(panel.className, { 'shadow-none': !showShadow })}
            >
              {panel.content}
            </SidePanel>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
