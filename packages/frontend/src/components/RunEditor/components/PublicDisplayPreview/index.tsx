import { useHotkey } from '@tanstack/react-hotkeys';
import { useEffect } from 'react';

import { Text } from '~/primitives';
import { cn } from '~/utils';

import { WarningBanner } from './WarningBanner';

const PREVIEW_HEIGHT = 600;
const PREVIEW_WIDTH = 800;

interface PublicDisplayPreviewProps {
  runId: string;
  hasMadeChanges: boolean;
  isPublic: boolean;
  lastUpdate?: string;
  onClose: () => void;
}

const getStatus = ({
  hasMadeChanges,
  isPublic,
}: {
  hasMadeChanges: boolean;
  isPublic: boolean;
}): { text: string; color: string } | null => {
  if (hasMadeChanges) {
    return {
      text: `You've made changes that have not been saved`,
      color: 'var(--color-error-500)',
    };
  }
  if (!isPublic) {
    return {
      text: `The run is not yet published`,
      color: 'var(--color-warning-500)',
    };
  }
  return null;
};

export const PublicDisplayPreview = ({
  runId,
  hasMadeChanges,
  isPublic,
  lastUpdate,
  onClose,
}: PublicDisplayPreviewProps) => {
  const iframeId = `public-display-preview-${runId}`;
  const status = getStatus({
    hasMadeChanges,
    isPublic,
  });

  useEffect(() => {
    const iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.location.reload();
    }
  }, [lastUpdate, iframeId]);

  useHotkey('Escape', onClose, {
    conflictBehavior: 'replace',
  });

  return (
    <div className="absolute inset-0 flex flex-col">
      <WarningBanner onClose={onClose} />
      <div className="flex flex-1 overflow-auto bg-gray-100 p-8 pt-14">
        <div className="m-auto">
          {status ? (
            <Text
              className="pb-4 text-center text-sm"
              style={{ color: status.color }}
            >
              {status.text}
            </Text>
          ) : null}
          <div
            style={{
              height: PREVIEW_HEIGHT,
              width: PREVIEW_WIDTH,
              outlineColor: status?.color,
            }}
            className={cn('shadow-lg', {
              outline: status,
            })}
          >
            <iframe
              id={iframeId}
              height={PREVIEW_HEIGHT}
              width={PREVIEW_WIDTH}
              src={`${import.meta.env.VITE_FRONTEND_BASE_URL}/run/preview/${runId}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
