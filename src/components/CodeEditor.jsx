import React, {useRef} from 'react';
import Editor from '@monaco-editor/react';

function CodeEditor({ value, onChange, language, theme, fontSize, onEditorMount }) {
  
  const editorRef = useRef(null);
  
  const handleEditorChange = (newValue) => {
    if (typeof newValue === 'string') {
      onChange(newValue);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    if (onEditorMount) {
    onEditorMount(editor);
  }
  };

  
  return (
    <Editor
      height="100%"
      language={language}
      value={value || ''}  
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
      loading={
        <div className="flex items-center justify-center h-full bg-gray-900 text-gray-400">
          <div className="text-center">
           <div>Loading...</div>
          </div>
        </div>
      }
      options={{
        fontSize: fontSize,
        fontFamily: 'Consolas, Monaco, monospace',
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: true,
        automaticLayout: true,
        tabSize: 2,
        hideCursorInOverviewRuler: true,
        matchBrackets: 'always',
        minimap: {
          enabled:true
        },
        wordWrap: 'on',
        padding: { top: 16 },
        renderLineHighlight: 'all',
        readOnly: false,
        domReadOnly: false,
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        suggestOnTriggerCharacters: true,
        selectOnLineNumbers: true,
        automaticLayout: true,
        quickSuggestions: true,
        formatOnPaste: true,
        formatOnType: true,
      }}
    />
  );
}

export default CodeEditor;