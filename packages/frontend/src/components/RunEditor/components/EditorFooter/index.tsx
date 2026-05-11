import { Button } from '~/primitives';
import { useMediaQuery } from '~/hooks/useMediaQuery';

export const EditorFooter = () => {
  const { isSmallScreen } = useMediaQuery();

  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-300 bg-white px-6 py-2">
      <div className="flex items-center gap-2">
        {/* TODO: Preview run */}
        <Button color="gray" onClick={() => console.log('Preview run')}>
          Preview
        </Button>
        {/* TODO: Embed run */}
        {!isSmallScreen && (
          <Button color="gray" onClick={() => console.log('Embed run')}>
            Embed
          </Button>
        )}
      </div>
      {/* TODO: Save run */}
      <Button onClick={() => console.log('Save run')}>Save Run</Button>
    </div>
  );
};
