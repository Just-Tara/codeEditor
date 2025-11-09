import React from 'react';

function PreviewPanel({ activeMobileView, files, outputCode}) {
  return (
    <div
      className={`flex-1 md:flex flex-col ${
        activeMobileView !== 'preview' ? 'hidden md:flex' : 'flex'
      }`}
    >
      <div className="bg-gray-800 border-b border-gray-700 px-4 md:py-0.5 py-2 flex items-center justify-between">
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
       <iframe 
        srcDoc={outputCode} 
        title="Live Preview" 
        className="w-full h-full border-0" 
        sandbox="allow-scripts allow-same-origin">
       </iframe>
      </div>
    </div>
  );
}

export default PreviewPanel;
