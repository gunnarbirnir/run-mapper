import { useBlocker } from '@tanstack/react-router';

import { Dialog } from '~/primitives';

interface LeavePageDialogProps {
  isDirty: boolean;
}

export const LeavePageDialog = ({ isDirty }: LeavePageDialogProps) => {
  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: isDirty,
  });

  return (
    <Dialog
      title="Leaving page"
      description="Are you sure you want to leave the page without saving your changes?"
      isOpen={status === 'blocked'}
      buttons={[
        {
          label: 'Leave',
          color: 'errorOutline',
          onClick: proceed,
        },
        {
          label: 'Cancel',
          color: 'gray',
          onClick: reset,
        },
      ]}
      onClose={reset}
    />
  );
};
