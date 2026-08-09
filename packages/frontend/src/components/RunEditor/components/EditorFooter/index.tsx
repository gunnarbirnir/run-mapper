import { Button } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { cn } from '~/utils';

export const EditorFooter = () => {
  const { isSmallScreen, isMediumScreen } = useMediaQuery();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t border-gray-300 bg-white px-6 py-2',
        { 'justify-end': isMediumScreen },
        { 'pl-4': !isSmallScreen },
      )}
    >
      {!isMediumScreen && (
        <div className="flex items-center gap-2">
          {/* TODO: Preview run */}
          <Button color="gray" onClick={() => console.log('Preview run')}>
            Preview
          </Button>
          {/* TODO: Embed run */}
          <Button color="gray" onClick={() => console.log('Embed run')}>
            Embed
          </Button>
        </div>
      )}
      {/* TODO: Publish/unpublish run */}
      <Button
        color="successOutline"
        onClick={() => console.log('Publish run')}
        className={cn({ 'w-full': isSmallScreen })}
      >
        Publish run
      </Button>
    </div>
  );
};
