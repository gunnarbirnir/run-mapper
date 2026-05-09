import { Tooltip, Icon } from '~/primitives';

import { RouteStats } from './components/RouteStats';
import { MapActionButton } from './components/MapActionButton';

export const EditorMap = () => {
  let mapActionButtonIndex = 0;

  return (
    <div className="bg-secondary-200 relative flex h-full w-full items-center justify-center">
      {/* TODO: Use real numbers */}
      <RouteStats distance={42.2} elevationGain={250} />
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
        <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Undo"
          // TODO: Implement undo functionality
          onClick={() => console.log('Undo')}
        >
          <Icon name="undo" className="size-5" />
        </MapActionButton>
        <MapActionButton
          index={mapActionButtonIndex++}
          tooltipLabel="Redo"
          // TODO: Implement redo functionality
          onClick={() => console.log('Redo')}
        >
          <Icon name="undo" className="size-5 rotate-y-180" />
        </MapActionButton>
      </Tooltip.Provider>
    </div>
  );
};
