import { IdProvider } from '~/context/IdContext';
import type { EditorRun } from '~/types';

import { EditorMap } from './components/EditorMap';
import { SidePanelContainer } from './components/SidePanelContainer';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  return (
    <IdProvider baseId="run-editor">
      <div className="relative flex flex-1">
        <SidePanelContainer existingRun={existingRun} />
        <div className="flex-1">
          <EditorMap />
        </div>
      </div>
    </IdProvider>
  );
};
