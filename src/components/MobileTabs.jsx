import React from 'react';

function MobileTabs({ activeView, onViewChange, files }) {
  const displayFiles = files
  
  return (
    <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
      
      {displayFiles.map(file => (
         <button key={file.id} 
         onClick={() => onViewChange(file.id)}
         
          className={`flex-1 py-3 text-xs font-medium border-b-2 transition ${
            activeView === file.id
              ? 'text-gray-200 border-blue-500'
              : 'text-gray-500 border-transparent'
          }`}
        >
          {file.name}
        </button>
      ))}
      
  
      <button
        onClick={() => onViewChange('preview')}
        className={`flex-1 py-3 text-xs font-medium border-b-2 transition uppercase ${
          activeView === 'preview'
            ? 'text-gray-200 border-blue-500'
            : 'text-gray-500 border-transparent'
        }`}
      >
        Preview
      </button>
    </div>
  );
}

export default MobileTabs;