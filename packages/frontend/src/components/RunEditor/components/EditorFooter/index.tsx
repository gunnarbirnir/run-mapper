import { useState } from 'react';

import { Button, Dialog, Tooltip } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { cn } from '~/utils';
import { EditorRun } from '~/types';
import { EmbedRunDialog } from '~/components/EmbedRunDialog';

interface EditorFooterProps {
  existingRun?: EditorRun;
  hasMadeChanges: boolean;
  isUpdatingPublicStatus: boolean;
  hidePreviewButton: boolean;
  showPublicDisplayPreview: boolean;
  isRootPanelOpen: boolean;
  onPublishRun?: () => Promise<unknown>;
  onUnpublishRun?: () => Promise<unknown>;
  setShowPublicDisplayPreview: (show: boolean) => void;
}

export const EditorFooter = ({
  existingRun,
  hasMadeChanges,
  isUpdatingPublicStatus,
  hidePreviewButton,
  showPublicDisplayPreview,
  isRootPanelOpen,
  onPublishRun,
  onUnpublishRun,
  setShowPublicDisplayPreview,
}: EditorFooterProps) => {
  const { isSmallScreen, isMediumScreen } = useMediaQuery();
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false);
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);

  const isPublic = Boolean(existingRun?.isPublic);
  const isEditingRun = Boolean(existingRun);
  const showLeftSection =
    isEditingRun && !isSmallScreen && !(isMediumScreen && isRootPanelOpen);
  const disablePreview = !showPublicDisplayPreview && hasMadeChanges;

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between gap-4 border-t border-gray-300 bg-white px-6 py-2',
          { 'justify-end': !showLeftSection },
          { 'pl-4': !isSmallScreen },
        )}
      >
        {showLeftSection && (
          <Tooltip.Provider>
            <div className="flex items-center gap-2">
              {!hidePreviewButton && (
                <Tooltip
                  disabled={showPublicDisplayPreview}
                  label={
                    disablePreview
                      ? 'Save changes to preview'
                      : 'Preview public display of run'
                  }
                >
                  <Button
                    color={showPublicDisplayPreview ? 'black' : 'gray'}
                    disabled={disablePreview}
                    onClick={() =>
                      setShowPublicDisplayPreview(!showPublicDisplayPreview)
                    }
                  >
                    {showPublicDisplayPreview ? 'Close preview' : 'Preview'}
                  </Button>
                </Tooltip>
              )}
              <Tooltip
                label={
                  isPublic ? 'Embed run on your site' : 'Publish run to embed'
                }
              >
                <Button
                  color="gray"
                  disabled={!isPublic}
                  onClick={() => setIsEmbedDialogOpen(true)}
                >
                  Embed
                </Button>
              </Tooltip>
            </div>
          </Tooltip.Provider>
        )}
        <Button
          color={isPublic ? 'errorOutline' : 'successOutline'}
          isLoading={isUpdatingPublicStatus}
          onClick={
            isPublic ? () => setIsUnpublishDialogOpen(true) : onPublishRun
          }
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
      {existingRun && (
        <EmbedRunDialog
          runSlug={existingRun.publicSlug}
          runName={existingRun.name}
          isOpen={isEmbedDialogOpen}
          routes={existingRun.routes}
          onClose={() => setIsEmbedDialogOpen(false)}
        />
      )}
    </>
  );
};
