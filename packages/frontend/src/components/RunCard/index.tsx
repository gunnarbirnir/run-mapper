import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

import type { ListRun } from '~/types';
import { Text, Icon, RoundButton, Tooltip } from '~/primitives';
import { formatDate, cn } from '~/utils';
import { DEFAULT_FADE_IN_DURATION } from '~/constants';

import { ShaderBackground } from '../ShaderBackground';

interface RunCardProps {
  run: ListRun;
}

const CHEVRON_TRANSLATE_X = 20;

export const RunCard = ({
  run: { id, name, createdAt, updatedAt, isPublic, imageSeed },
}: RunCardProps) => {
  const infoRef = useRef<HTMLDivElement>(null);
  const [infoIsHovered, setInfoIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setInfoIsHovered(true);
    const handleMouseLeave = () => setInfoIsHovered(false);

    const infoElement = infoRef.current;
    infoElement?.addEventListener('mouseenter', handleMouseEnter);
    infoElement?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      infoElement?.removeEventListener('mouseenter', handleMouseEnter);
      infoElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [id]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-white shadow-md transition-shadow duration-200',
        { 'shadow-md/20': infoIsHovered },
      )}
    >
      <ShaderBackground
        seed={imageSeed}
        speed={0}
        lineWidth={1}
        className="rounded-t-xl bg-gray-100"
      />
      <div className="absolute top-4 left-4">
        <div
          className={cn('rounded-full bg-gray-600 px-2 py-0.5', {
            'bg-success-500': isPublic,
          })}
        >
          <Text variant="label" className="text-white">
            {isPublic ? 'Public' : 'Draft'}
          </Text>
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <Tooltip label="Embed">
          <RoundButton
            color="white"
            className="h-10 w-10 shadow-md/20"
            // TODO: Open embed modal
            onClick={() => console.log('Embed run')}
          >
            <Icon name="link" className="size-6" />
          </RoundButton>
        </Tooltip>
      </div>
      <Link to="/editor/run/$runId" params={{ runId: id }}>
        <div
          ref={infoRef}
          className="flex items-center justify-between gap-4 p-4"
        >
          <div className="flex flex-col gap-0.5 rounded-b-xl">
            <Text variant="bold">{name}</Text>
            <Text variant="subtle" className="text-sm">
              {updatedAt
                ? `Updated ${formatDate(updatedAt)}`
                : `Created ${formatDate(createdAt)}`}
            </Text>
          </div>
          {infoIsHovered && (
            <motion.div
              initial={{ opacity: 0, x: -CHEVRON_TRANSLATE_X }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: DEFAULT_FADE_IN_DURATION }}
            >
              <Icon
                name="chevron"
                className="h-6 w-6 rotate-90 text-gray-400"
              />
            </motion.div>
          )}
        </div>
      </Link>
    </div>
  );
};
