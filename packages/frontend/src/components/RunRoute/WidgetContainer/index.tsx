import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import {
  DEFAULT_EASING,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
} from '~/constants';
import { useWindowDimensions } from '~/hooks/useWindowDimensions';
import { type IconName } from '~/primitives';
import type { WidgetBaseProps } from '~/types';
import { spacingPx } from '~/utils';

import { ModalContent } from './ModalContent';
import { WidgetContent } from './WidgetContent';

interface WidgetContainerProps extends WidgetBaseProps {
  children?: ReactNode;
  label?: string;
  text?: string;
  icon: IconName;
  iconClassName?: string;
  customContent?: ReactNode;
}

// TODO: trap focus while open
// TODO: handle keyboard events, like esc

// Create global constant for breakpoints
// Import from Tailwind?
const SMALL_SCREEN_BREAKPOINT = 600;
const MODAL_MAX_HEIGHT = 300;
const MODAL_MAX_WIDTH = 600;

export const WidgetContainer = ({
  children,
  label,
  text,
  icon,
  iconClassName,
  customContent,
  index,
  showGraphWhileActive = false,
  isActive = false,
  isOpen = false,
  isExpanded = false,
  isAnyOpen = false,
  runRouteSize,
  toggleActive,
}: WidgetContainerProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [widgetWidth, setWidgetWidth] = useState(0);
  const [widgetHeight, setWidgetHeight] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const hasCalculatedSize = widgetWidth > 0 && widgetHeight > 0;
  const isSmallScreen = windowWidth < SMALL_SCREEN_BREAKPOINT;
  const activeSpacing = isSmallScreen ? spacingPx(4) : spacingPx(8);
  const baseSpacing = spacingPx(4);
  const top = baseSpacing + index * (widgetHeight + baseSpacing);
  const right = runRouteSize.width - widgetWidth - baseSpacing;
  const bottom = runRouteSize.height - top - widgetHeight;
  const isClickable = Boolean(children && toggleActive && !isAnyOpen);

  const mapHeight =
    runRouteSize.height -
    (showGraphWhileActive ? EXPANDED_ELEVATION_GRAPH_HEIGHT : 0);
  const modalTargetHeight = mapHeight - activeSpacing * 2;
  const modalTargetWidth = runRouteSize.width - activeSpacing * 2;
  const modalY =
    modalTargetHeight > MODAL_MAX_HEIGHT
      ? (mapHeight - MODAL_MAX_HEIGHT) / 2
      : activeSpacing;
  const modalX =
    modalTargetWidth > MODAL_MAX_WIDTH
      ? (runRouteSize.width - MODAL_MAX_WIDTH) / 2
      : activeSpacing;

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWidgetWidth(widgetRef.current ? widgetRef.current.offsetWidth : 0);
      setWidgetHeight(widgetRef.current ? widgetRef.current.offsetHeight : 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (hasCalculatedSize && !isInitialized) {
      // Finish animation before displaying
      const initTimeout = setTimeout(() => {
        setIsInitialized(true);
      }, WIDGET_ANIMATION_DURATION * 1000);

      return () => clearTimeout(initTimeout);
    }
  }, [hasCalculatedSize, isInitialized]);

  return (
    <motion.div
      animate={{
        top: isActive ? modalY : top,
        left: isActive ? modalX : baseSpacing,
        right: isActive ? modalX : right,
        bottom: isActive
          ? showGraphWhileActive
            ? EXPANDED_ELEVATION_GRAPH_HEIGHT + modalY
            : modalY
          : bottom,
      }}
      transition={{
        duration: isInitialized ? WIDGET_ANIMATION_DURATION : 0,
        ease: DEFAULT_EASING,
      }}
      className="pointer-events-auto absolute min-w-34 overflow-hidden rounded-lg bg-white shadow-md/20"
      style={
        isInitialized
          ? {
              // 1000 to be above overlay, which is 100
              zIndex: isOpen ? 1000 : index,
              cursor: isClickable ? 'pointer' : undefined,
            }
          : { visibility: 'hidden' }
      }
      onClick={isClickable ? toggleActive : undefined}
    >
      {!isOpen && (
        <WidgetContent
          ref={widgetRef}
          label={label}
          text={text}
          isClickable={isClickable}
          customContent={customContent}
          icon={icon}
          iconClassName={iconClassName}
        />
      )}
      {isExpanded && (
        <ModalContent
          isOpen={isOpen}
          title={label}
          onClose={toggleActive}
          icon={icon}
          iconClassName={iconClassName}
        >
          {children}
        </ModalContent>
      )}
    </motion.div>
  );
};
