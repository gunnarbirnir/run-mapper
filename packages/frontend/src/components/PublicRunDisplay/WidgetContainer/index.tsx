import { motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { DEFAULT_EASING, WIDGET_ANIMATION_DURATION } from '~/constants';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { useElevationGraphHeight } from '~/hooks/useElevationGraphHeight';
import { type IconName } from '~/primitives';
import type { WidgetBaseProps } from '~/types';
import { spacingPx, cn } from '~/utils';

import { ModalContent } from './ModalContent';
import { WidgetContent } from './WidgetContent';

interface WidgetContainerProps extends WidgetBaseProps {
  children?: ReactNode;
  title?: string;
  text?: string;
  icon?: IconName;
  iconClassName?: string;
  customContent?: ReactNode;
}

const MODAL_MAX_HEIGHT = 300;
const MODAL_MAX_WIDTH = 600;

export const WidgetContainer = ({
  children,
  title,
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
  publicRunDisplaySize,
  toggleActive,
}: WidgetContainerProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const { isSmallScreen } = useMediaQuery();
  const { expandedHeight: graphHeight } = useElevationGraphHeight();
  const [isInitialized, setIsInitialized] = useState(false);

  const widgetHeight = spacingPx(10);
  const widgetWidth = spacingPx(30);
  const activeSpacing = isSmallScreen ? spacingPx(4) : spacingPx(8);
  const outsideSpacing = spacingPx(4);
  const betweenSpacing = spacingPx(3);
  const top = outsideSpacing + index * (widgetHeight + betweenSpacing);
  const isClickable = Boolean(children && toggleActive && !isAnyOpen);

  const mapHeight =
    publicRunDisplaySize.height - (showGraphWhileActive ? graphHeight : 0);
  const modalTargetHeight = mapHeight - activeSpacing * 2;
  const modalTargetWidth = publicRunDisplaySize.width - activeSpacing * 2;
  const modalTop =
    modalTargetHeight > MODAL_MAX_HEIGHT
      ? (mapHeight - MODAL_MAX_HEIGHT) / 2
      : activeSpacing;
  const modalLeft =
    modalTargetWidth > MODAL_MAX_WIDTH
      ? (publicRunDisplaySize.width - MODAL_MAX_WIDTH) / 2
      : activeSpacing;
  const modalWidth = Math.min(modalTargetWidth, MODAL_MAX_WIDTH);
  const modalHeight = Math.min(modalTargetHeight, MODAL_MAX_HEIGHT);

  useEffect(() => {
    if (!isInitialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return (
    <motion.div
      animate={{
        top: isActive ? modalTop : top,
        left: isActive ? modalLeft : outsideSpacing,
        width: isActive ? modalWidth : widgetWidth,
        height: isActive ? modalHeight : widgetHeight,
      }}
      transition={{
        duration: isInitialized ? WIDGET_ANIMATION_DURATION : 0,
        ease: DEFAULT_EASING,
      }}
      className={cn(
        'pointer-events-auto absolute overflow-hidden bg-white shadow-md/20',
        {
          'rounded-full': !isActive,
          'rounded-xl': isActive,
        },
      )}
      style={{
        // 1000 to be above overlay, which is 100
        zIndex: isOpen ? 1000 : index,
        cursor: isClickable ? 'pointer' : undefined,
      }}
      onClick={isClickable ? toggleActive : undefined}
    >
      {!isOpen && (
        <WidgetContent
          ref={widgetRef}
          text={text}
          height={widgetHeight}
          width={widgetWidth}
          isClickable={isClickable}
          customContent={customContent}
          icon={icon}
          iconClassName={iconClassName}
        />
      )}
      {isExpanded && (
        <ModalContent
          isOpen={isOpen}
          title={title}
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
