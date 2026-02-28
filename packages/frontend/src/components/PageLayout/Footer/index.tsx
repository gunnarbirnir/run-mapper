import { Text } from '~/primitives';

export const Footer = () => {
  return (
    <footer className="bg-gray-200 p-4 pb-5">
      <div className="container mx-auto flex items-center justify-between">
        <Text className="text-gray-600">
          Spretta © {new Date().getFullYear()}
        </Text>
        <Text className="text-gray-600">contact@spretta.fit</Text>
      </div>
    </footer>
  );
};
