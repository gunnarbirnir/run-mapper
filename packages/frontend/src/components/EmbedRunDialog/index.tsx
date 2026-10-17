import { useEffect, useState } from 'react';

import { Dialog, Form } from '~/primitives';
import { copyToClipboard } from '~/utils';

import { IframeElement } from './IframeElement';

const DEFAULT_IFRAME_HEIGHT = 600;
const DEFAULT_IFRAME_WIDTH = 800;
const COPIED_MESSAGE_TIMEOUT = 2000;

interface EmbedRunDialogProps {
  runSlug: string;
  runName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedRunDialog = ({
  runSlug,
  runName,
  isOpen,
  onClose,
}: EmbedRunDialogProps) => {
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [iframeWidth, setIframeWidth] = useState(DEFAULT_IFRAME_WIDTH);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const iframeSrc = `${import.meta.env.VITE_FRONTEND_BASE_URL}/run/${runSlug}`;
  const iframeId = `spretta-${runSlug}`;
  const iframeTitle = `Spretta - ${runName}`;
  const iframeCode = `
    <iframe
      src="${iframeSrc}"
      id="${iframeId}"
      title="${iframeTitle}"
      height="${iframeHeight}"
      width="${iframeWidth}"
    ></iframe>
  `;

  const copyIframeCode = () => {
    copyToClipboard(iframeCode);
    setShowCopiedMessage(true);
  };

  useEffect(() => {
    if (!showCopiedMessage) {
      return;
    }

    const copiedTimeout = setTimeout(() => {
      setShowCopiedMessage(false);
    }, COPIED_MESSAGE_TIMEOUT);

    return () => clearTimeout(copiedTimeout);
  }, [showCopiedMessage]);

  return (
    <Dialog
      title="Embed run"
      description="Copy the element below and place it on your site."
      isOpen={isOpen}
      size="medium"
      buttons={[
        {
          label: 'Copy',
          onClick: copyIframeCode,
        },
        {
          label: 'Close',
          color: 'gray',
          onClick: onClose,
        },
      ]}
      onClose={onClose}
    >
      <div className="mb-8 flex items-center gap-4">
        <Form.TextInput
          id="iframeHeight"
          name="iframeHeight"
          label="Height"
          placeholder={DEFAULT_IFRAME_HEIGHT.toString()}
          unit="px"
          value={iframeHeight}
          type="number"
          onChange={(value) => setIframeHeight(Number(value))}
        />
        <Form.TextInput
          id="iframeWidth"
          name="iframeWidth"
          label="Width"
          placeholder={DEFAULT_IFRAME_WIDTH.toString()}
          unit="px"
          value={iframeWidth}
          type="number"
          onChange={(value) => setIframeWidth(Number(value))}
        />
      </div>
      <IframeElement
        iframeSrc={iframeSrc}
        iframeId={iframeId}
        iframeTitle={iframeTitle}
        height={iframeHeight}
        width={iframeWidth}
        showCopiedMessage={showCopiedMessage}
      />
    </Dialog>
  );
};
