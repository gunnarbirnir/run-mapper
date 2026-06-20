import { Icon, Tooltip } from '~/primitives';

import { MapActionButton } from './MapActionButton';

export const ActionButtonsContainer = () => {
  let mapActionButtonIndex = 0;

  return (
    <Tooltip.Provider>
      <MapActionButton
        index={mapActionButtonIndex++}
        tooltipLabel="Back to start"
        // TODO: Implement back to start functionality
        onClick={() => console.log('Back to start')}
      >
        <Icon name="location" className="size-5.5" />
      </MapActionButton>
      <MapActionButton
        index={mapActionButtonIndex++}
        tooltipLabel="Your location"
        // TODO: Implement your location functionality
        onClick={() => console.log('To your location')}
      >
        <Icon name="userLocation" className="size-5" />
      </MapActionButton>
    </Tooltip.Provider>
  );
};
