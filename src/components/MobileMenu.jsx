// src/components/MobileMenu.jsx
import React from "react";
import { Settings, X, Save, Share2 } from "lucide-react";

function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
      />
      <div className="md:hidden fixed right-0 top-0 bottom-0 w-80 bg-gray-800 z-50 overflow-y-auto shadow-xl">
        {/* Menu Header */}
        <div className="bg-gray-900 px-4 py-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-gray-200 font-semibold flex items-center gap-2">
            <Settings size={18} /> Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-3">
          {/* Language */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-500 mb-1">Language</div>
            <div className="text-sm text-gray-200 flex items-center justify-between">
              HTML5 <span className="text-gray-500">›</span>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-500 mb-1">Theme</div>
            <div className="text-sm text-gray-200 flex items-center justify-between">
              🌙 Dark Mode
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-500 mb-1">Font Size</div>
            <div className="text-sm text-gray-200 flex items-center justify-between">
              14px
              <div className="flex gap-2">
                <button className="bg-gray-700 px-2 py-1 rounded text-xs">−</button>
                <button className="bg-gray-700 px-2 py-1 rounded text-xs">+</button>
              </div>
            </div>
          </div>

          {/* Auto Save */}
          <div className="bg-gray-900 rounded p-3">
            <div className="text-xs text-gray-500 mb-1">Auto Save</div>
            <div className="text-sm text-gray-200 flex items-center justify-between">
              Enabled
              <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          {/* Actions */}
          <button className="w-full text-left text-sm text-green-400 hover:text-green-300 py-2 flex items-center gap-2">
            <Save size={16} /> Save Project
          </button>
          <button className="w-full text-left text-sm text-purple-400 hover:text-purple-300 py-2 flex items-center gap-2">
            <Share2 size={16} /> Share Code
          </button>
          <button className="w-full text-left text-sm text-gray-300 hover:text-gray-200 py-2 flex items-center gap-2">
            📥 Export Code
          </button>

          <div className="border-t border-gray-700 my-4"></div>

          <button className="w-full text-left text-sm text-gray-500 hover:text-gray-400 py-2 flex items-center gap-2">
            ℹ️ About
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
