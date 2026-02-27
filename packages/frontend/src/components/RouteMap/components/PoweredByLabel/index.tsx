import { Text, Icon } from '~/primitives';

const MAPBOX_ATTRIBUTION_WIDTH = 44;
const MAPBOX_ATTRIBUTION_PADDING = 10;

export const PoweredByLabel = () => {
  return (
    <a
      href="https://run-mapper-ten.vercel.app/"
      target="_blank"
      className="absolute flex items-center gap-1 rounded-full bg-white px-2 py-1 hover:bg-gray-100"
      style={{
        bottom: MAPBOX_ATTRIBUTION_PADDING,
        right: MAPBOX_ATTRIBUTION_WIDTH,
      }}
    >
      <Icon name="spretta" className="size-4" />
      <Text className="text-xs">
        Powered by <strong>Spretta</strong>
      </Text>
    </a>
  );
};
