import { Text } from '~/primitives';

export const SectionLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text className="mt-4 mb-2 text-xs whitespace-nowrap text-gray-600 uppercase">
      {children}
    </Text>
  );
};
