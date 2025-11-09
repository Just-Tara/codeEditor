import React from 'react';

function MobileTabs({ activeView, onViewChange }) {
  const tabs = ['html', 'css', 'js', 'preview'];

  return (
    <div className="md:hidden bg-gray-800 border-b border-gray-700 flex">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onViewChange(tab)}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition uppercase ${
            activeView === tab
              ? 'text-gray-200 border-blue-500'
              : 'text-gray-500 border-transparent'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default MobileTabs;
