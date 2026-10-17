import { type PropsWithChildren } from 'react';

import { Text } from '~/primitives';

interface IframeElementProps {
  iframeSrc: string;
  iframeId: string;
  iframeTitle: string;
  height: number;
  width: number;
  showCopiedMessage: boolean;
}

const Tag = ({ children }: PropsWithChildren) => {
  return <span className="text-gray-700">{children}</span>;
};

const ElementName = ({ name }: { name: string }) => {
  return <span className="text-error-800">{name}</span>;
};

const ElementAttribute = ({ name, value }: { name: string; value: string }) => {
  return (
    <>
      <span className="text-success-700"> {name}=</span>
      <span className="text-secondary-700">"{value}"</span>
    </>
  );
};

export const IframeElement = ({
  iframeSrc,
  iframeId,
  iframeTitle,
  height,
  width,
  showCopiedMessage,
}: IframeElementProps) => {
  return (
    <>
      <div className="w-full rounded-r-md border-l-4 border-gray-500 bg-gray-200 px-4 py-2">
        <Text style={{ fontFamily: 'monospace' }} className="monospace text-sm">
          <Tag>&lt;</Tag>
          <ElementName name="iframe" />
          <ElementAttribute name="src" value={iframeSrc} />
          <ElementAttribute name="id" value={iframeId} />
          <ElementAttribute name="title" value={iframeTitle} />
          <ElementAttribute name="height" value={height.toString()} />
          <ElementAttribute name="width" value={width.toString()} />
          <Tag>&gt;&lt;/</Tag>
          <ElementName name="iframe" />
          <Tag>&gt;</Tag>
        </Text>
      </div>
      {showCopiedMessage && (
        <Text className="mt-2 text-xs text-gray-600">
          Code copied to clipboard!
        </Text>
      )}
    </>
  );
};
