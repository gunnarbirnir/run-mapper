import { useRef } from 'react';
import { motion } from 'motion/react';

import type { WidgetBaseProps } from '~/types';
import {
  ELEVATION_GRAPH_HEIGHT,
  EXPANDED_ELEVATION_GRAPH_HEIGHT,
  WIDGET_ANIMATION_DURATION,
  DEFAULT_FADE_IN_DURATION,
  DEFAULT_EASING,
} from '~/constants';
import { spacingPx, cn } from '~/utils';
import { RoundButton, Icon } from '~/primitives';
import { useElementSize } from '~/hooks/useElementSize';

import { WidgetContent } from './WidgetContent';

interface WidgetContainerProps extends WidgetBaseProps {
  children?: React.ReactNode;
  label?: string;
  text?: string;
}

// TODO: trap focus while open
// TODO: handle keyboard events, like esc

export const WidgetContainer = ({
  children,
  label,
  text,
  index,
  showGraphWhileActive = false,
  isActive = false,
  isOpen = false,
  isExpanded = false,
  isAnyOpen = false,
  mapContainerSize,
  onToggleActive,
}: WidgetContainerProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const { width: widgetWidth, height: widgetHeight } =
    useElementSize(widgetRef);
  const hasCalculatedSize = widgetWidth > 0 && widgetHeight > 0;

  const activeSpacing = spacingPx(8);
  const baseSpacing = spacingPx(4);
  const top = baseSpacing + index * (widgetHeight + baseSpacing);
  const right = mapContainerSize.width - widgetWidth - baseSpacing;
  const bottom =
    mapContainerSize.height + ELEVATION_GRAPH_HEIGHT - top - widgetHeight;
  const isClickable = onToggleActive && !isAnyOpen;

  return (
    <motion.div
      ref={widgetRef}
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
        type: 'spring',
        bounce: isActive ? 0.2 : 0.1,
      }}
      className={cn(
        `pointer-events-auto absolute min-w-32 rounded-lg bg-white p-4 shadow-md/20`,
        {
          'hover:bg-gray-100': isClickable,
        },
      )}
      style={
        hasCalculatedSize
          ? {
              top,
              left: baseSpacing,
              right,
              bottom,
              zIndex: isOpen ? 1000 : index,
              cursor: isClickable ? 'pointer' : 'default',
            }
          : { visibility: 'hidden' }
      }
      onClick={isClickable ? onToggleActive : undefined}
    >
      <WidgetContent
        label={label}
        text={text}
        isActive={isActive}
        isOpen={isOpen}
        children={children}
      />
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DEFAULT_FADE_IN_DURATION,
            ease: DEFAULT_EASING,
          }}
          className="absolute top-4 right-4"
        >
          <RoundButton onClick={onToggleActive}>
            <Icon name="close" />
          </RoundButton>
        </motion.div>
      )}
    </motion.div>
  );
};
