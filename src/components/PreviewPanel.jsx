import React from 'react';

function PreviewPanel({ activeMobileView }) {
  return (
    <div
      className={`flex-1 md:flex flex-col ${
        activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
          🖥️ Live Preview
        </span>
        <div className="hidden md:flex items-center gap-2">
          <select className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs border border-gray-600">
            <option>Desktop</option>
            <option>Tablet</option>
            <option>Mobile</option>
          </select>
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded border border-gray-600 transition">
            ↻
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 p-1 rounded border border-gray-600 transition">
            ⊗
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white overflow-auto p-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello World!</h1>
        <p className="text-gray-700 mb-4">Welcome to my IDE</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default PreviewPanel;
