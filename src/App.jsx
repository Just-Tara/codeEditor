import React, { use, useEffect, useState } from "react";
import Header from "./components/Header";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";
import Split from "@uiw/react-split";


function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("html");
  const [activeMobileView, setActiveMobileView] = useState("html");
  const [outputCode, setOutputCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [files, setFiles] = useState({
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #007acc;\n}',
    js: 'console.log("Hello from JavaScript!");\n\ndocument.addEventListener("DOMContentLoaded", () => {\n  console.log("Page loaded!");\n});'
  });
  const [fontSize, setFontSize] = useState(14);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [editorInstance, setEditorInstance] = useState(null); 
  const [shareCode, setShareCode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try{
      const savedFiles = localStorage.getItem("code-files");
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        setFiles(parsedFiles);
        console.log("successfully loaded the saved files");
      } else{
        console.log("No saved files found");
      }
    }catch(error) {
      console.log("Failed to load saved files", error)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('auto-save-enabled', JSON.stringify(isAutoSaveEnabled));
    console.log('Auto-save preference saved:', isAutoSaveEnabled);
  }, [isAutoSaveEnabled]);


     useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get('code');
      if (codeParam) {
        try {
          const jsonString = atob(codeParam);
          const parsedData = JSON.parse(jsonString);
          setFiles({
            html: parsedData.html || '',
            css: parsedData.css || '',
            js: parsedData.js || ''
          });
          console.log("Code loaded from URL parameter.");
        } catch (error) {
          console.log("Failed to load code from URL parameter:", error);
        }
      }
    }, []);


  useEffect(() => {
    if (!isAutoSaveEnabled) {
      console.log("Auto-save is disabled.");
      return;
    }   
    const timer = setTimeout(() => {
      try{
        localStorage.setItem('code-files', JSON.stringify(files));
        console.log("Auto-saved code files.");
      } catch (error){
        console.log("Failed to auto-save:", error)
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [files, isAutoSaveEnabled]);

 useEffect(() => {
  if (!shareCode) return;

  const timer = setTimeout(() => {
    setShareCode(false);
  }, 3000);

  return () => clearTimeout(timer);
}, [shareCode]);


  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  }

  const toggleAutoSave = () => {
    setIsAutoSaveEnabled(prev => !prev);
  };

  const handleCodeChange = (newCode) => {
    setFiles(prev => ({
      ...prev,
      [activeTab]: newCode
    }));
  };

  const handleSaveCode = () => {
    try{
      localStorage.setItem('code-files', JSON.stringify(files));
      console.log("code saved successfully!");
    } catch (error){
      console.log("failed to save:", error)
    }
  }
  
  const handleShareCode = async () => {
    try{
      const  shareData = {
        html: files.html,
        css: files.css,
        js: files.js
      }
      const jsonString = JSON.stringify(shareData);
      const base64Encoded = btoa(jsonString);
      const shareableURL = `${window.location.origin}${window.location.pathname}?code=${base64Encoded}`;
      await navigator.clipboard.writeText(shareableURL);
      console.log("Shareable URL copied to clipboard:", shareableURL);

    setTimeout(() => {
      setShareCode("false");
    }, 3000); 
    } catch (error) {
      console.log("Failed to generate shareable URL:", error);
      alert("Error generating shareable link. Please try again.");
    }
  } 

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  }

  const handleFormatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
    }else {
      console.log("Editor instance not ready yet.");
    }
  }

  const handleRunCode = () => {
    console.log("Running code...");
    console.log(files);
    const combinedCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
      ${files.css}
    </style>
  </head>
  <body>
    ${files.html}
    <script>
      ${files.js}
    </script>
  </body>
</html>
`;
    setOutputCode(combinedCode);
  }

  return (
    <div className={`${isDark ? "dark" : ""} h-screen flex flex-col`}>
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
        onRunCode={handleRunCode}
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
        activeView={activeMobileView}
        onViewChange={(view) => {
          setActiveMobileView(view);
          if (view !== "preview") setActiveTab(view); 
        }}
      />

      {isMobile ? (
       
        <div className="flex-1 flex overflow-hidden">
          <EditorPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activeMobileView={activeMobileView}
            files={files}
            onCodeChange={handleCodeChange}
            isDark={isDark}
            fontSize={fontSize}
            isAutoSaveEnabled={isAutoSaveEnabled}
            onEditorReady={handleEditorReady}
          />
          <PreviewPanel 
            activeMobileView={activeMobileView}
            files={files}
            outputCode={outputCode}
            fontSize={fontSize}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <Split
            style={{ height: '100%', width: '100%' }}
            mode="horizontal"
            lineBar
            renderBar={({ onMouseDown, ...props }) => (
              <div
                {...props}
                style={{
                  width: '1px',
                  background: isDark ? '#3a3a3a' : '#d0d0d0',
                  cursor: 'col-resize',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3b82f6';
                  e.currentTarget.style.width = '3px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark ? '#3a3a3a' : '#d0d0d0';
                  e.currentTarget.style.width = '1px';
                }} 
              >
                <div 
                  onMouseDown={onMouseDown}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            )}
          >
           
            <div style={{   
                    minWidth: 300, 
                    width: '50%', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}>
              <EditorPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeMobileView={activeMobileView}
                files={files}
                onCodeChange={handleCodeChange}
                isDark={isDark}
                fontSize={fontSize}
                isAutoSaveEnabled={isAutoSaveEnabled}
                 onEditorReady={handleEditorReady}
              />
            </div>

            
            <div style={{ 
                    minWidth: 300, 
                    flex: 1, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}>
              <PreviewPanel 
                activeMobileView={activeMobileView}
                files={files}
                outputCode={outputCode}
                fontSize={fontSize}
              />
            </div>
          </Split>
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
      />
    </div>
  );
}

export default App;