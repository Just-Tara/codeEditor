import React from 'react';
import EditorTabs from './EditorTabs';
import CodeEditor from './CodeEditor';
import StatusBar from './StatusBar';

function EditorPanel({ activeTab, onTabChange, activeMobileView }) {
  return (
    <div
      className={`flex-1 md:flex flex-col border-r border-gray-700 ${
        activeMobileView === 'preview' ? 'hidden' : 'flex'
      }`}
    >
      <EditorTabs activeTab={activeTab} onTabChange={onTabChange} />
      <CodeEditor />
      <StatusBar />
    </div>
  );
}

export default EditorPanel;
