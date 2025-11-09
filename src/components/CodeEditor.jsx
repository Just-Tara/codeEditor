import React from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ value, onChange, language, theme }) {
  const handleEditorChange = (newValue) => {
    if (typeof newValue === 'string') {
      onChange(newValue);
    }
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value || ''}  
      onChange={handleEditorChange}
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      loading={
        <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
          <div className="text-center">
           <div>Loading...</div>
          </div>
        </div>
      }
      options={{
        fontSize: 14,
        fontFamily: 'Consolas, Monaco, monospace',
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 16 },
        renderLineHighlight: 'all',
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}

export default CodeEditor;