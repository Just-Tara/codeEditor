import React from 'react';
import { Plus, X, Folder} from 'lucide-react';

function MobileTabs({ activeView, onViewChange, files }) {
  const displayFiles = files
  
  return (
    <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
      
     <button
            className='flex items-center text-gray-400  hover:text-gray-200 transition bg-gray-700 pl-2 pr-3' 
            aria-label="Toggle file explorer"
            title='File Explorer'
          >
            <Folder size={20} />
          </button>

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
          {files.length > 1 && (
            <X 
              size={12}   
              className="inline ml-1 hover:text-red-400 cursor-pointer opacity-0 hover:opacity-100 transition "
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          )}
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