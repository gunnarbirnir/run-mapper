import { useState } from 'react';

import { Button, Dialog } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { cn } from '~/utils';
import { EditorRun } from '~/types';

interface EditorFooterProps {
  existingRun?: EditorRun;
  isUpdatingPublicStatus: boolean;
  onPublishRun?: () => Promise<unknown>;
  onUnpublishRun?: () => Promise<unknown>;
}

export const EditorFooter = ({
  existingRun,
  isUpdatingPublicStatus,
  onPublishRun,
  onUnpublishRun,
}: EditorFooterProps) => {
  const { isSmallScreen, isMediumScreen } = useMediaQuery();
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false);

  const isPublic = Boolean(existingRun?.isPublic);
  const isEditingRun = Boolean(existingRun);
  const showLeftSection = isEditingRun && !isMediumScreen;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t border-gray-300 bg-white px-6 py-2',
        { 'justify-end': !showLeftSection },
        { 'pl-4': !isSmallScreen },
      )}
    >
      {showLeftSection && (
        <div className="flex items-center gap-2">
          {/* TODO: Preview run */}
          <Button
            color="gray"
            disabled
            onClick={() => console.log('Preview run')}
          >
            Preview
          </Button>
          {/* TODO: Embed run */}
          <Button color="gray" onClick={() => console.log('Embed run')}>
            Embed
          </Button>
        </div>
      )}
      <Button
        color={isPublic ? 'errorOutline' : 'successOutline'}
        isLoading={isUpdatingPublicStatus}
        onClick={isPublic ? () => setIsUnpublishDialogOpen(true) : onPublishRun}
        className={cn({ 'w-full': isSmallScreen })}
      >
        {isPublic ? 'Unpublish run' : 'Publish run'}
      </Button>
      {onUnpublishRun ? (
        <Dialog
          title="Unpublish run"
          description="Are you sure you want to unpublish the run? All public displays of this run will break."
          isOpen={isUnpublishDialogOpen}
          buttons={[
            {
              label: 'Unpublish',
              color: 'errorOutline',
              isLoading: isUpdatingPublicStatus,
              onClick: async () => {
                await onUnpublishRun();
                setIsUnpublishDialogOpen(false);
              },
            },
            {
              label: 'Cancel',
              disabled: isUpdatingPublicStatus,
              onClick: () => {
                setIsUnpublishDialogOpen(false);
              },
            },
          ]}
          onClose={() =>
            isUpdatingPublicStatus ? null : setIsUnpublishDialogOpen(false)
          }
        />
      ) : null}
    </div>
  );
};
