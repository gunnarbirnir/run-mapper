import { IdProvider } from '~/context/IdContext';
import type { EditorRun } from '~/types';

import { EditorMap } from './components/EditorMap';
import { SidePanelContainer } from './components/SidePanelContainer';
import { EditorFooter } from './components/EditorFooter';

interface RunEditorProps {
  existingRun?: EditorRun;
}

export const RunEditor = ({ existingRun }: RunEditorProps) => {
  return (
    <IdProvider baseId="run-editor">
      <div className="relative isolate flex flex-1">
        <SidePanelContainer existingRun={existingRun} />
        <div className="z-1 flex flex-1 flex-col">
          <EditorMap />
          <EditorFooter />
        </div>
      </div>
    </IdProvider>
  );
};
