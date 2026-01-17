import { motion } from 'motion/react';
import { useState } from 'react';

import type { WidgetBaseProps } from '~/types';
import { ELEVATION_GRAPH_HEIGHT, WIDGET_ANIMATION_DURATION } from '~/constants';
import { spacingPx, cn } from '~/utils';

import { WidgetContent } from './WidgetContent';

const WIDGET_WIDTH = 130;
const WIDGET_HEIGHT = 80;

interface WidgetContainerProps extends WidgetBaseProps {
  children?: React.ReactNode;
  label?: string;
  text?: string;
}

// TODO: trap focus while open

export const WidgetContainer = ({
  children,
  label,
  text,
  index,
  showGraphWhileActive = false,
  isActive = false,
  mapContainerSize,
  setIsActive,
}: WidgetContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeSpacing = spacingPx(8);
  const baseSpacing = spacingPx(4);
  const top = baseSpacing + index * (WIDGET_HEIGHT + baseSpacing);
  const right = mapContainerSize.width - WIDGET_WIDTH - baseSpacing;
  const bottom =
    mapContainerSize.height + ELEVATION_GRAPH_HEIGHT - top - WIDGET_HEIGHT;
  const isClickable = setIsActive && !isOpen;

  return (
    <motion.div
      animate={
        isActive
          ? {
              top: activeSpacing,
              left: activeSpacing,
              right: activeSpacing,
              bottom: showGraphWhileActive
                ? ELEVATION_GRAPH_HEIGHT + baseSpacing
                : activeSpacing,
            }
          : undefined
      }
      transition={{ duration: WIDGET_ANIMATION_DURATION, ease: 'easeOut' }}
      className={cn(
        'pointer-events-auto absolute flex items-center justify-center rounded-lg bg-white p-4 shadow-md/20',
        {
          'hover:bg-gray-100': isClickable,
        },
      )}
      style={{
        top,
        left: baseSpacing,
        right,
        bottom,
        zIndex: isOpen ? 100 : index + 10,
        cursor: isClickable ? 'pointer' : 'default',
      }}
      onClick={
        setIsActive
          ? () => {
              if (!isActive) {
                setIsOpen(true);
              }
              setIsActive(!isActive);
            }
          : undefined
      }
      onAnimationComplete={() => {
        if (!isActive) {
          setIsOpen(false);
        }
      }}
    >
      <WidgetContent label={label} text={text} children={children} />
    </motion.div>
  );
};
