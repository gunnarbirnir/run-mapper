import type { EditorRun } from '~/types';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  return <div>{existingRun ? existingRun.name : 'New Run'} - Run Editor</div>;
};
