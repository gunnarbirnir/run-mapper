import { WidgetContent } from './WidgetContent';

const WIDGET_WIDTH = 150;
const WIDGET_HEIGHT = 80;

type WidgetContainerProps = {
  children?: React.ReactNode;
  label?: string;
  text?: string;
};

export const WidgetContainer = ({
  children,
  label,
  text,
}: WidgetContainerProps) => {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-white p-4 shadow-md"
      style={{ width: WIDGET_WIDTH, height: WIDGET_HEIGHT }}
    >
      <WidgetContent label={label} text={text} children={children} />
    </div>
  );
};
