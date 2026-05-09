import { Button } from '~/primitives';

export const EditorFooter = () => {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-300 bg-white py-2 pr-6 pl-3">
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
      {/* TODO: Save run */}
      <Button onClick={() => console.log('Save run')}>Save Run</Button>
    </div>
  );
};
