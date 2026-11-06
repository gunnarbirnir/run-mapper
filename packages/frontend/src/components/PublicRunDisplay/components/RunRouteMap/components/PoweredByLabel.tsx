import { Text, Icon } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';

const MAPBOX_ATTRIBUTION_WIDTH = 44;
const MAPBOX_ATTRIBUTION_PADDING = 10;

export const PoweredByLabel = () => {
  const { isSmallScreen } = useMediaQuery();

  return (
    <a
      href="/"
      target="_blank"
      className="absolute flex items-center gap-[4px] rounded-full bg-white px-[8px] py-[3px] hover:bg-gray-100"
      style={{
        bottom: MAPBOX_ATTRIBUTION_PADDING,
        right: MAPBOX_ATTRIBUTION_WIDTH,
      }}
      // Should come after map action buttons
      tabIndex={40}
    >
      <Icon name="spretta" style={{ width: 16, height: 16 }} />
      <Text style={{ fontSize: 12 }}>
        {isSmallScreen ? '' : 'Powered by '}
        <strong>Spretta</strong>
      </Text>
    </a>
  );
};
