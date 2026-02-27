import { Text, Icon } from '~/primitives';

const MAPBOX_ATTRIBUTION_WIDTH = 44;
const MAPBOX_ATTRIBUTION_PADDING = 10;

export const PoweredByLabel = () => {
  return (
    <a
      href="https://run-mapper-ten.vercel.app/"
      target="_blank"
      className="absolute flex items-center gap-[4px] rounded-full bg-white px-[8px] py-[3px] hover:bg-gray-100"
      style={{
        bottom: MAPBOX_ATTRIBUTION_PADDING,
        right: MAPBOX_ATTRIBUTION_WIDTH,
      }}
    >
      <Icon name="spretta" style={{ width: 16, height: 16 }} />
      <Text style={{ fontSize: 12 }}>
        Powered by <strong>Spretta</strong>
      </Text>
    </a>
  );
};
