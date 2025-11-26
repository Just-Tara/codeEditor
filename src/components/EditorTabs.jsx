import React from 'react';
import { Plus, X, Folder } from 'lucide-react';

function EditorTabs({ activeTab, onTabChange, onAddFile, files, onDeleteFile }) {
  return (
    <div className="hidden md:flex bg-gray-800 border-b border-gray-700  overflow-x-auto">
      <button
        className='flex items-center text-gray-400  hover:text-gray-200 transition bg-gray-700 pl-2 pr-3' 
        aria-label="Toggle file explorer"
        title='File Explorer'
      >
        <Folder size={20} />
      </button>
      {files.map(file => (
        <div 
          key={file.id}
          className={`flex items-center gap-2 px-4 py-2 text-sm cursor-pointer group ${
            activeTab === file.id
              ? 'text-gray-200 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <span onClick={() => onTabChange(file.id)}>
            {file.name}
          </span>
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFile(file.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      
      <button 
        onClick={onAddFile} 
        className="px-3 py-2 text-green-500 hover:text-green-400 cursor-pointer transition"
        title="Add new file"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export default EditorTabs;