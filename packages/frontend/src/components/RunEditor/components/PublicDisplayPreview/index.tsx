import { useHotkey } from '@tanstack/react-hotkeys';
import { useEffect } from 'react';

import { Text } from '~/primitives';

interface PublicDisplayPreviewProps {
  runSlug: string;
  hasMadeChanges: boolean;
  lastUpdate?: string;
  onClose: () => void;
}

export const PublicDisplayPreview = ({
  runSlug,
  hasMadeChanges,
  lastUpdate,
  onClose,
}: PublicDisplayPreviewProps) => {
  const iframeId = `${runSlug}-public-display-preview`;

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
    <div className="absolute inset-0 overflow-auto bg-gray-100 p-8">
      {hasMadeChanges && (
        <Text className="text-error-500 pb-4 text-center text-sm">
          You've made changes that are not yet published.
        </Text>
      )}
      <div style={{ height: 600, width: 800 }} className="mx-auto shadow-lg">
        <iframe
          id={iframeId}
          height="600"
          width="800"
          src={`${import.meta.env.VITE_FRONTEND_BASE_URL}/run/${runSlug}`}
        />
      </div>
    </div>
  );
};
