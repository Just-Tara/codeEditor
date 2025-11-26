import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function Console ({ isConsoleOpen, onToggle, logs, onClear }) {
     const consoleRef = useRef(null);
     const [isMinimized, setIsMinimized] = useState(false);

    
    useEffect(() => {
       if (consoleRef.current && !isMinimized) {
         consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
       }
     }, [logs, isMinimized]);
   


    const getLogColor = (type) => {
        switch(type) {
            case 'error' :
                return 'text-red-400';
            case 'warn' :
                return 'text-yellow-400';
            case 'info':
                return 'text-blue-400';
            default:
                return 'text-gray-200';
        }
    };

     const getLogIcon = (type) => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '▶';
    }
  };

   
    if (!isConsoleOpen) return null;

    
      return (
        <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t-2 border-gray-700 shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'h-12' : 'h-64 md:h-80'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-green-400" />
              <span className="text-sm font-semibold text-gray-200">Console</span>
              {logs.length > 0 && (
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                  {logs.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={onClear}
                className="p-1.5 hover:bg-gray-700 rounded transition text-gray-400 hover:text-gray-200"
                title="Clear Console"
              >
                <Trash2 size={16} />
              </button>
              
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-gray-700 rounded transition text-gray-400 hover:text-gray-200"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
              <button
                onClick={onToggle}
                className="p-1.5 hover:bg-gray-700 rounded transition text-gray-400 hover:text-red-400"
                title="Close Console"
              >
                <X size={16} />
              </button>
            </div>
          </div>
    
          {/* Console Content */}
          {!isMinimized && (
            <div 
              ref={consoleRef}
              className="h-full overflow-y-auto p-3 font-mono text-sm bg-gray-900"
            >
              {logs.length === 0 ? (
                <div className="text-gray-500 italic text-center mt-8">
                  Console is empty. Run your JavaScript/TypeScript code to see output.
                </div>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`py-1 border-b border-gray-800 ${getLogColor(log.type)}`}
                  >
                    <span className="mr-2">{getLogIcon(log.type)}</span>
                    <span className="text-gray-400 text-xs mr-2">{log.timestamp}</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      );
    }
    
    export default Console;