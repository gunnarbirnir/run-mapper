import { type ReactNode, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn, convertRemToPixels } from '~/utils';
import {
  DEFAULT_EASING,
  DEFAULT_FADE_IN_DURATION,
  PAGE_MIN_WIDTH,
} from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { useInertAttribute } from '~/hooks/useInertAttribute';

import { SidePanelItem, PANEL_WIDTH, SLIDE_IN_DURATION } from './SidePanelItem';
import { SidePanelContent } from './SidePanelContent';
import { RoundButton } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import {
  SidePanelItemProvider,
  useSidePanelItemContext,
} from './SidePanelItemContext';

interface SidePanelItem {
  id: string;
  content: ReactNode;
  isVisible?: boolean;
  disabled?: boolean;
  position?: number;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

interface SidePanelProps {
  panels: SidePanelItem[];
  className?: string;
  toggleClassName?: string;
  onOpen?: () => void;
  onItemAnimationStart?: (itemId: string) => void;
  onItemAnimationComplete?: (itemId: string) => void;
}

const TOGGLE_WIDTH = '3.5rem';

const SidePanel = ({
  className,
  toggleClassName,
  onOpen,
  onItemAnimationStart,
  onItemAnimationComplete,
  ...props
}: SidePanelProps) => {
  const toggleRef = useRef<HTMLDivElement>(null);
  const { isSmallScreen, isLargeScreen } = useMediaQuery();
  const { width: windowWidth } = useWindowDimensions();
  const [isAnimating, setIsAnimating] = useState<Record<string, boolean>>({});

  const panels = props.panels.map((panel, index) => ({
    ...panel,
    position: panel.position ?? index,
  }));
  const panelWidth = isSmallScreen
    ? Math.max(windowWidth, PAGE_MIN_WIDTH)
    : convertRemToPixels(PANEL_WIDTH);
  const maxPanelsInView = isLargeScreen ? 1 : 2;
  const visiblePanelsCount = panels.reduce(
    (panelCount, panel) => {
      if (panel.isVisible && !panelCount.seen.has(panel.position)) {
        panelCount.seen.add(panel.position);
        return { ...panelCount, value: panelCount.value + 1 };
      }
      return panelCount;
    },
    { seen: new Set<number>(), value: 0 },
  ).value;
  const inViewPanelsCount = Math.min(visiblePanelsCount, maxPanelsInView);
  const inViewVisibleDiff = visiblePanelsCount - inViewPanelsCount;
  const isAnyAnimating = Object.values(isAnimating).some(
    (animating) => animating,
  );
  const leftOffsets: Record<number, number> = {};
  const statusIds: Record<string, boolean> = {};

  useInertAttribute(toggleRef, visiblePanelsCount > 0);

  return (
    <>
      <motion.div
        initial={false}
        className={cn(
          'relative isolate',
          { 'absolute top-0 bottom-0 left-0': isSmallScreen },
          className,
        )}
        animate={{
          width: panelWidth * inViewPanelsCount,
        }}
        transition={{ duration: SLIDE_IN_DURATION, ease: DEFAULT_EASING }}
      >
        {panels.map(
          ({
            isVisible = true,
            position,
            disabled = false,
            onAnimationStart,
            onAnimationComplete,
            ...panel
          }) => {
            const leftOffset = isLargeScreen
              ? isVisible
                ? 0
                : -panelWidth
              : isVisible
                ? (position - inViewVisibleDiff) * panelWidth
                : (leftOffsets[position - 1] ?? -panelWidth);
            const statusId = `${leftOffset}-${isAnimating[panel.id] ? 'animating' : 'static'}`;
            const isTopVisibleItem =
              isVisible && position === visiblePanelsCount - 1;
            const showShadow = isLargeScreen
              ? isTopVisibleItem || isAnimating[panel.id]
              : // Group panels by offset+isAnimating to determine if they're stacked
                !statusIds[statusId];
            const itemId = `${panel.id}-item`;

            leftOffsets[position] = leftOffset;
            statusIds[statusId] = true;

            return (
              <motion.div
                key={panel.id}
                className="absolute top-0 bottom-0 bg-white"
                style={{
                  zIndex: isLargeScreen ? position : panels.length - position,
                }}
                initial={false}
                animate={{ left: leftOffset }}
                transition={{
                  duration: SLIDE_IN_DURATION,
                  ease: DEFAULT_EASING,
                }}
                onAnimationStart={() => {
                  setIsAnimating((prevIsAnimating) => ({
                    ...prevIsAnimating,
                    [panel.id]: true,
                  }));
                  onAnimationStart?.();
                  onItemAnimationStart?.(itemId);
                }}
                onAnimationComplete={() => {
                  setIsAnimating((prevIsAnimating) => ({
                    ...prevIsAnimating,
                    [panel.id]: false,
                  }));
                  onAnimationComplete?.();
                  onItemAnimationComplete?.(itemId);
                }}
              >
                <SidePanelItem
                  id={itemId}
                  isVisible={isVisible}
                  disabled={disabled}
                  showShadow={showShadow}
                >
                  <SidePanelItemProvider
                    itemId={itemId}
                    isTopVisibleItem={isTopVisibleItem}
                    isAnyAnimating={isAnyAnimating}
                  >
                    {panel.content}
                  </SidePanelItemProvider>
                </SidePanelItem>
                <AnimatePresence>
                  {disabled && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ duration: DEFAULT_FADE_IN_DURATION }}
                      className="pointer-events-none absolute inset-0 bg-black"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          },
        )}
      </motion.div>
      {onOpen && (
        <motion.div
          ref={toggleRef}
          initial={false}
          style={{ width: TOGGLE_WIDTH, zIndex: panels.length + 1 }}
          className={cn(
            'absolute top-5 flex justify-end rounded-r-full bg-white shadow-md',
            toggleClassName,
          )}
          animate={{ left: visiblePanelsCount === 0 ? 0 : `-${TOGGLE_WIDTH}` }}
          transition={{ duration: SLIDE_IN_DURATION, ease: DEFAULT_EASING }}
        >
          <Tooltip label="Open panel" side="right">
            <RoundButton className="m-1" onClick={onOpen}>
              <Icon name="arrow" className="size-5 rotate-90" />
            </RoundButton>
          </Tooltip>
        </motion.div>
      )}
    </>
  );
};

SidePanel.Content = SidePanelContent;

export { SidePanel, useSidePanelItemContext };
