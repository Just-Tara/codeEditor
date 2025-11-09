import React from 'react';

function CodeEditor() {
  return (
    <div className="flex-1 bg-gray-900 flex overflow-hidden">
      <div className="bg-gray-900 text-gray-600 text-right px-3 py-4 text-sm font-mono select-none border-r border-gray-800">
        {[...Array(10).keys()].map(num => (
          <div key={num}>{num + 1}</div>
        ))}
      </div>

      <div className="flex-1 p-4 text-sm font-mono overflow-auto">
        <div className="text-teal-400">&lt;!DOCTYPE html&gt;</div>
        <div className="text-teal-400">&lt;html&gt;</div>
        <div className="text-teal-400">&lt;head&gt;</div>
        <div className="pl-4">
          <span className="text-teal-400">&lt;title&gt;</span>
          <span className="text-blue-300">My Web Page</span>
          <span className="text-teal-400">&lt;/title&gt;</span>
        </div>
        <div className="text-teal-400">&lt;/head&gt;</div>
        <div className="text-teal-400">&lt;body&gt;</div>
        <div className="pl-4">
          <span className="text-teal-400">&lt;h1&gt;</span>
          <span className="text-blue-300">Hello World!</span>
          <span className="text-teal-400">&lt;/h1&gt;</span>
        </div>
        <div className="pl-4">
          <span className="text-teal-400">&lt;p&gt;</span>
          <span className="text-blue-300">Welcome to my IDE</span>
          <span className="text-teal-400">&lt;/p&gt;</span>
        </div>
        <div className="text-teal-400">&lt;/body&gt;</div>
        <div className="text-teal-400">&lt;/html&gt;</div>
      </div>
    </div>
  );
}

export default CodeEditor;
