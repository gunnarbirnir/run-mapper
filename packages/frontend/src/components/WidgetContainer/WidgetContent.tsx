import { Text } from '~/primitives';

type WidgetContentProps = {
  children?: React.ReactNode;
  label?: string;
  text?: string;
};

export const WidgetContent = ({
  children = null,
  label,
  text,
}: WidgetContentProps) => {
  if (label && text) {
    return (
      <div className="flex flex-col gap-1 text-center">
        <Text className="text-xs text-gray-500 uppercase">{label}</Text>
        <Text className="text-xl font-bold text-black">{text}</Text>
      </div>
    );
  }

  return children;
};
