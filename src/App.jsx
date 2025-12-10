import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AddNewFIle from "./components/AddNewFIle.jsx";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";
import Split from "@uiw/react-split";
import Console from "./components/Console.jsx";
import FileExplorer from "./components/FIleExplorer.jsx";
import { Terminal } from "lucide-react";
import { getAllFiles } from "./utils/fileHelpers.jsx"; // Fixed import syntax
import { useProjectManager } from "./hooks/useProjectManager.jsx";
import { useCodeRunner } from "./hooks/useCodeRunner.jsx";

function App() {
  const {
    projects, setProjects, activeTab, setActiveTab, activeProjectId, 
    openTabs, setOpenTabs, isAddNewFileOpen, setIsAddNewFileOpen,
    handleProjectCreate, handleProjectDelete, handleFolderCreate, handleFolderDelete,
    handleFileCreateInLocation, handleFIleCreation, deleteFiles, handleFileDelete,
    handleCodeChange, handleCloseTab, handleFileSelect
  } = useProjectManager();

  const {
    outputCode, pistonOutput, isRunning, consoleLogs, isConsoleOpen, 
    setIsConsoleOpen, setConsoleLogs, handleRunCode, handleClearConsole
  } = useCodeRunner(projects, activeProjectId, activeTab);


  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [activeMobileView, setActiveMobileView] = useState("editor"); // Default to editor
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fontSize, setFontSize] = useState(14);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [editorInstance, setEditorInstance] = useState(null); 
  const [shareCode, setShareCode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 


  const onRunCodeWrapper = async () => {
      const result = await handleRunCode();
      if (result === "preview" && isMobile) {
          setActiveMobileView("preview");
      }
  }


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setActiveMobileView("editor");
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAutoSaveEnabled) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('code-projects', JSON.stringify(projects));
        console.log("Projects auto-saved");
      } catch (error) {
        console.error("Failed to save projects:", error);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [projects, isAutoSaveEnabled]);

  useEffect(() => {
    localStorage.setItem('auto-save-enabled', JSON.stringify(isAutoSaveEnabled));
  }, [isAutoSaveEnabled]);

  
  useEffect(() => {
    if (!shareCode) return;
    const timer = setTimeout(() => setShareCode(false), 3000);
    return () => clearTimeout(timer);
  }, [shareCode]);


  const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 10));
  const toggleAutoSave = () => setIsAutoSaveEnabled(prev => !prev);

  const handleSaveCode = () => {
    try {
      localStorage.setItem('code-files', JSON.stringify(projects));
      console.log("code saved successfully!");
    } catch (error) {
      console.log("failed to save:", error);
    }
  };
  
  const handleShareCode = async () => {
    try {
      const jsonString = JSON.stringify(projects);
      const base64Encoded = btoa(jsonString);
      const shareableURL = `${window.location.origin}${window.location.pathname}?code=${base64Encoded}`;
      await navigator.clipboard.writeText(shareableURL);
      setShareCode(true);
    } catch (error) {
      alert("Error generating shareable link.");
    }
  };

  const handleEditorReady = (editor) => setEditorInstance(editor);

  const handleFormatCode = () => {
    if (editorInstance) editorInstance.getAction('editor.action.formatDocument').run();
  };

  return (
    <div className={`${isDark ? "dark" : ""} h-screen flex flex-col`}>
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
        onRunCode={onRunCodeWrapper} // <--- UPDATED: Uses wrapper now
        isRunning={isRunning}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        onSaveCode={handleSaveCode}
        onFormatCode={handleFormatCode}
        isAutoSaveEnabled={isAutoSaveEnabled}
        onToggleAutoSave={toggleAutoSave}
        onShareCode={handleShareCode}
      />
      
      {shareCode && (
        <div className="fixed top-20 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <span className="font-semibold">✓</span>
          <span>Shareable URL copied to clipboard!</span>
        </div>
      )}

      <MobileTabs
        activeView={activeMobileView === 'preview' ? 'preview' : activeTab}  
        onViewChange={(view) => {
          if (view === 'preview') {
            setActiveMobileView('preview');
          } else {
            setActiveMobileView('editor');
            setActiveTab(view);
          }
        }}
        files={getAllFiles(projects)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        openTabs={openTabs}
        onCloseTab={handleCloseTab}
      />
      {isMobile ? (
        <div className="flex-1 flex overflow-hidden relative">
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsSidebarOpen(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-64 mt-[104px]" onClick={(e) => e.stopPropagation()}>
                <FileExplorer
                  projects={projects}
                  onProjectCreate={handleProjectCreate}
                  onProjectDelete={handleProjectDelete}
                  onFolderCreate={handleFolderCreate}
                  onFolderDelete={handleFolderDelete}
                  onFileCreate={handleFileCreateInLocation}
                  onFileDelete={deleteFiles}
                  onFileSelect={(fileId) => {
                    handleFileSelect(fileId);
                    setIsSidebarOpen(false); // Close sidebar on selection logic
                  }}
                  activeFileId={activeTab}
                  isDark={isDark}
                />
              </div>
            </div>
          )}
          
          {activeMobileView === 'editor' ? (
             <div className="w-full h-full">
               <EditorPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeMobileView={activeMobileView}
                files={getAllFiles(projects)}
                onCodeChange={handleCodeChange}
                isDark={isDark}
                fontSize={fontSize}
                isAutoSaveEnabled={isAutoSaveEnabled}
                onEditorReady={handleEditorReady}
                onAddFile={() => setIsAddNewFileOpen(true)}
                onDeleteFile={deleteFiles}
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                openTabs={openTabs}
                onCloseTab={handleCloseTab}
              />
             </div>
          ) : (
             <div className="w-full h-full bg-white">
               <PreviewPanel 
                activeMobileView={activeMobileView}
                files={getAllFiles(projects)}
                outputCode={outputCode}
                fontSize={fontSize}
                pistonOutput={pistonOutput}
              />
             </div>
          )}
        </div>
      ) : (
      
        <div className="flex-1 flex overflow-hidden">
         {isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/20" onClick={() => setIsSidebarOpen(false)}>
              <div className="absolute left-0 top-24 bottom-8.5 w-64" onClick={(e) => e.stopPropagation()}>
                <FileExplorer
                  projects={projects}
                  onProjectCreate={handleProjectCreate}
                  onProjectDelete={handleProjectDelete}
                  onFolderCreate={handleFolderCreate}
                  onFolderDelete={handleFolderDelete}
                  onFileCreate={handleFileCreateInLocation}
                  onFileDelete={deleteFiles}
                  onFileSelect={handleFileSelect}
                  activeFileId={activeTab}
                  isDark={isDark}
                />
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-hidden">
            <Split style={{ height: '100%', width: '100%' }} mode="horizontal" lineBar>
              <div style={{ width: '50%', height: '100%' }}>
                <EditorPanel
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  activeMobileView={activeMobileView}
                  files={getAllFiles(projects)}
                  onCodeChange={handleCodeChange}
                  isDark={isDark}
                  fontSize={fontSize}
                  isAutoSaveEnabled={isAutoSaveEnabled}
                  onEditorReady={handleEditorReady}
                  onAddFile={() => setIsAddNewFileOpen(true)}
                  onDeleteFile={deleteFiles}
                  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  isSidebarOpen = {isSidebarOpen}
                  openTabs={openTabs}
                  onCloseTab={handleCloseTab}
                />
              </div>
              <div style={{ flex: 1, height: '100%' }}>
                <PreviewPanel 
                  activeMobileView={activeMobileView}
                  files={getAllFiles(projects)}
                  outputCode={outputCode}
                  fontSize={fontSize}
                  pistonOutput={pistonOutput}
                />
              </div>
            </Split>
          </div>
        </div>
      )}

      <MobileMenu
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isOpen={isMobileMenuOpen}
        onSaveCode={handleSaveCode}
        onFormatCode={handleFormatCode}
        onClose={() => setIsMobileMenuOpen(false)}
        onIncreaseFontSize={increaseFontSize}
        onDecreaseFontSize={decreaseFontSize}
        isAutoSaveEnabled={isAutoSaveEnabled}
        onToggleAutoSave={toggleAutoSave}
        onShareCode={handleShareCode}
        fontSize={fontSize}
      />

      <AddNewFIle
        isOpen={isAddNewFileOpen}
        onClose={() => setIsAddNewFileOpen(false)}
        onCreateFIle={handleFIleCreation}
      />

      <Console
        isConsoleOpen={isConsoleOpen}
        onToggle={() => setIsConsoleOpen(!isConsoleOpen)}
        logs={consoleLogs}
        onClear={handleClearConsole}
      />

      {!isConsoleOpen && (
        <button 
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all ${
            isDark
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300'
          }`}
          title="Toggle Console"
        >
          <Terminal size={20}/>
          {consoleLogs.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {consoleLogs.length}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default App;
     
