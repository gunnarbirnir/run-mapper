import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { cn, getCssVariableValue } from '~/utils';
import { DEFAULT_EASING, DEFAULT_FADE_IN_DURATION } from '~/constants';

import { SidePanel, type SidePanelProps } from '.';

type SidePanelItem = Omit<SidePanelProps, 'children'> & {
  id: string;
  content: ReactNode;
  isVisible?: boolean;
};

interface SidePanelGroupProps {
  panels: SidePanelItem[];
  className?: string;
}

const SLIDE_IN_DURATION = 0.1;
const MAX_PANELS_IN_VIEW = 2;

export const SidePanelGroup = ({ panels, className }: SidePanelGroupProps) => {
  const panelWidth = (getCssVariableValue('--w-70') || 280) as number;
  const visiblePanelsCount = panels.filter(
    (panel) => panel.isVisible !== false,
  ).length;
  const inViewPanelsCount = Math.min(visiblePanelsCount, MAX_PANELS_IN_VIEW);
  const inViewVisibleDiff = visiblePanelsCount - inViewPanelsCount;

  return (
    <motion.div
      className={cn('relative isolate', className)}
      animate={{ width: panelWidth * inViewPanelsCount }}
      transition={{ duration: DEFAULT_FADE_IN_DURATION, ease: DEFAULT_EASING }}
    >
      {[...panels].reverse().map(({ isVisible = true, ...panel }, index) => (
        <motion.div
          key={panel.id}
          className="absolute top-0 bottom-0"
          animate={{
            left:
              (isVisible
                ? panels.length - index - inViewVisibleDiff - 1
                : visiblePanelsCount - 1) * panelWidth,
          }}
          transition={{
            duration: SLIDE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
        >
          <SidePanel
            {...panel}
            className={cn(panel.className, { 'shadow-none': !isVisible })}
          >
            {panel.content}
          </SidePanel>
        </motion.div>
      ))}
    </motion.div>
  );
};
