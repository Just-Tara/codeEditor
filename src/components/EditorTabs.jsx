import React from 'react';
import { X, Plus } from 'lucide-react';

function EditorTabs({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'html', name: 'index.html' },
    { id: 'css', name: 'style.css' },
    { id: 'js', name: 'script.js' },
  ];

  return (
    <div className="hidden md:flex bg-gray-800 border-b border-gray-700 px-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === tab.id
              ? 'text-gray-200 border-blue-500'
              : 'text-gray-500 border-transparent'
          }`}
        >
          {tab.name}
          <X size={14} className="hover:text-gray-300" />
        </button>
      ))}
      <button className="px-3 py-2 text-green-500 hover:text-green-400 transition">
        <Plus size={16} />
      </button>
    </div>
  );
}

export default EditorTabs;
