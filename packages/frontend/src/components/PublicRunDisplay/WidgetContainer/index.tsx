import { motion } from 'motion/react';
import { useRef, type ReactNode } from 'react';

import { DEFAULT_EASING, WIDGET_ANIMATION_DURATION } from '~/constants';
import { type IconName } from '~/primitives';

import type { WidgetBaseProps } from '../types';
import { ModalContent } from './ModalContent';
import { WidgetContent } from './WidgetContent';
import { useWidgetSize } from './useWidgetSize';

interface WidgetContainerProps extends WidgetBaseProps {
  children?: ReactNode;
  title?: string;
  text?: string;
  icon?: IconName;
  iconClassName?: string;
  customContent?: ReactNode;
}

export const WidgetContainer = ({
  children,
  title,
  text,
  icon,
  widgetSizes,
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
  setWidgetSizes,
}: WidgetContainerProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const isClickable = Boolean(children && toggleActive && !isAnyOpen);
  const {
    top,
    left,
    widgetWidth,
    widgetHeight,
    modalTop,
    modalLeft,
    modalWidth,
    modalHeight,
    isInitialized,
  } = useWidgetSize({
    index,
    text,
    isOpen,
    showGraphWhileActive,
    widgetSizes,
    publicRunDisplaySize,
    widgetRef,
    setWidgetSizes,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration:
          // Does not apply on initial render or for last item
          index + 1 < widgetSizes.length ? WIDGET_ANIMATION_DURATION : 0,
        ease: DEFAULT_EASING,
      }}
    >
      <motion.div
        animate={{
          top: isActive ? modalTop : top,
          left: isActive ? modalLeft : left,
          width: isActive ? modalWidth : widgetWidth,
          height: isActive ? modalHeight : widgetHeight,
        }}
        transition={{
          duration: isInitialized ? WIDGET_ANIMATION_DURATION : 0,
          ease: DEFAULT_EASING,
        }}
        className="pointer-events-auto absolute overflow-hidden rounded-xl bg-white shadow-md"
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
    </motion.div>
  );
};
