import { useEffect, useState } from 'react';

import { PointOfInterest } from '~/types';
import { SidePanel, useSidePanelItemContext } from '~/primitives';

import { PointOfInterestForm } from './PointOfInterestForm';

interface PointOfInterestPanelProps {
  editPointOfInterestId: string | null;
  currentPointsOfInterest: PointOfInterest[];
  handleUpdatePointsOfInterest: (pointsOfInterest: PointOfInterest[]) => void;
  onClose: () => void;
}

export const PointOfInterestPanel = (props: PointOfInterestPanelProps) => {
  const [refreshPanel, setRefreshPanel] = useState(false);
  const { hideCloseButton } = useSidePanelItemContext();
  const { editPointOfInterestId, onClose } = props;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRefreshPanel(true);
  }, [editPointOfInterestId]);

  useEffect(() => {
    if (refreshPanel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRefreshPanel(false);
    }
  }, [refreshPanel]);

  if (refreshPanel) {
    return null;
  }

  return (
    <SidePanel.Content
      title={editPointOfInterestId ? 'Edit POI' : 'Add POI'}
      onClose={onClose}
      hideCloseButton={hideCloseButton}
    >
      <PointOfInterestForm {...props} />
    </SidePanel.Content>
  );
};
