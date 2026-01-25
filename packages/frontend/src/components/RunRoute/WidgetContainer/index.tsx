import { motion } from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import {
  DEFAULT_EASING,
  DEFAULT_FADE_IN_DURATION,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
} from '~/constants';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { Icon, RoundButton } from '~/primitives';
import type { WidgetBaseProps } from '~/types';
import { spacingPx } from '~/utils';

import { ModalContent } from './ModalContent';
import { WidgetContent } from './WidgetContent';

interface WidgetContainerProps extends WidgetBaseProps {
  children?: ReactNode;
  label?: string;
  text?: string;
  customContent?: ReactNode;
}

// TODO: trap focus while open
// TODO: handle keyboard events, like esc

// Create global constant for breakpoints
// Import from Tailwind?
const SMALL_SCREEN_BREAKPOINT = 600;

export const WidgetContainer = ({
  children,
  label,
  text,
  customContent,
  index,
  showGraphWhileActive = false,
  isActive = false,
  isOpen = false,
  isExpanded = false,
  isAnyOpen = false,
  runRouteSize,
  onToggleActive,
}: WidgetContainerProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [widgetWidth, setWidgetWidth] = useState(0);
  const [widgetHeight, setWidgetHeight] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const hasCalculatedSize = widgetWidth > 0 && widgetHeight > 0;
  const isSmallScreen = windowWidth < SMALL_SCREEN_BREAKPOINT;
  const activeSpacing = isSmallScreen ? spacingPx(4) : spacingPx(8);
  const baseSpacing = spacingPx(4);
  const top = baseSpacing + index * (widgetHeight + baseSpacing);
  const right = runRouteSize.width - widgetWidth - baseSpacing;
  const bottom = runRouteSize.height - top - widgetHeight;
  const isClickable = Boolean(children && onToggleActive && !isAnyOpen);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWidgetWidth(widgetRef.current ? widgetRef.current.offsetWidth : 0);
      setWidgetHeight(widgetRef.current ? widgetRef.current.offsetHeight : 0);
    }
  }, [isOpen]);

  return (
    <motion.div
      animate={
        isActive
          ? {
              top: activeSpacing,
              left: activeSpacing,
              right: activeSpacing,
              bottom: showGraphWhileActive
                ? EXPANDED_ELEVATION_GRAPH_HEIGHT + activeSpacing
                : activeSpacing,
            }
          : undefined
      }
      transition={{
        duration: WIDGET_ANIMATION_DURATION,
        ease: DEFAULT_EASING,
      }}
      className="pointer-events-auto absolute min-w-32 overflow-hidden rounded-lg bg-white shadow-md/20"
      style={
        hasCalculatedSize
          ? {
              top,
              left: baseSpacing,
              right,
              bottom,
              // 1000 to be above overlay, which is 100
              zIndex: isOpen ? 1000 : index,
              cursor: isClickable ? 'pointer' : undefined,
            }
          : { visibility: 'hidden' }
      }
      onClick={isClickable ? onToggleActive : undefined}
    >
      <WidgetContent
        ref={widgetRef}
        label={label}
        text={text}
        isActive={isActive}
        isOpen={isOpen}
        isExpanded={isExpanded}
        isClickable={isClickable}
        customContent={customContent}
        hasScrolled={hasScrolled}
      />
      {isExpanded && (
        <motion.div
          className="absolute top-4 right-4 z-20"
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            duration: DEFAULT_FADE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
        >
          <RoundButton onClick={onToggleActive}>
            <Icon name="close" />
          </RoundButton>
        </motion.div>
      )}
      {isExpanded && (
        <ModalContent isOpen={isOpen} setHasScrolled={setHasScrolled}>
          {children}
        </ModalContent>
      )}
    </motion.div>
  );
};
