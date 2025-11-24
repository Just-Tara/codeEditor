import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import AddNewFIle from "./components/AddNewFIle.jsx";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";
import Split from "@uiw/react-split";
import { getDefaultContent, getLanguageById } from "./constant/Languages.jsx";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('file-1');
  const [activeMobileView, setActiveMobileView] = useState("html");
  const [outputCode, setOutputCode] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [files, setFiles] = useState([
    {
      id: "file-1",
      name: "index.html",
      language: "html",
      content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>"
    },
    {
      id: "file-2",
      name: "style.css",
      language: "css",
      content: "body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #007acc;\n}"
    },
    {
      id: "file-3",
      name: "script.js",
      language: "javascript",
      content: "console.log('Hello');"
    }
  ]);

  const [fontSize, setFontSize] = useState(14);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [editorInstance, setEditorInstance] = useState(null); 
  const [shareCode, setShareCode] = useState(false);
  const [isAddNewFileOpen, setIsAddNewFileOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem("code-files");
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        
        if (Array.isArray(parsedFiles)) {
          setFiles(parsedFiles);
          console.log("successfully loaded the saved files");
        } else {
          console.log("Converting old file format to new array format");
          const convertedFiles = [
            {
              id: "file-1",
              name: "index.html",
              language: "html",
              content: parsedFiles.html || ""
            },
            {
              id: "file-2",
              name: "style.css",
              language: "css",
              content: parsedFiles.css || ""
            },
            {
              id: "file-3",
              name: "script.js",
              language: "javascript",
              content: parsedFiles.js || ""
            }
          ];
          setFiles(convertedFiles);
          localStorage.setItem('code-files', JSON.stringify(convertedFiles));
        }
      } else {
        console.log("No saved files found");
      }
    } catch(error) {
      console.log("Failed to load saved files", error);
    }
  }, []);

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
        if (Array.isArray(parsedData)) {
          setFiles(parsedData);
        }
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
      try {
        localStorage.setItem('code-files', JSON.stringify(files));
        console.log("Auto-saved code files.");
      } catch (error) {
        console.log("Failed to auto-save:", error);
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
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10));
  };

  const toggleAutoSave = () => {
    setIsAutoSaveEnabled(prev => !prev);
  };

  const handleCodeChange = (newCode) => {
    setFiles(files.map(f => f.id === activeTab ? {...f, content: newCode} : f));
  };

  const handleSaveCode = () => {
    try {
      localStorage.setItem('code-files', JSON.stringify(files));
      console.log("code saved successfully!");
    } catch (error) {
      console.log("failed to save:", error);
    }
  };
  
  const handleShareCode = async () => {
    try {
      const jsonString = JSON.stringify(files);
      const base64Encoded = btoa(jsonString);
      const shareableURL = `${window.location.origin}${window.location.pathname}?code=${base64Encoded}`;
      await navigator.clipboard.writeText(shareableURL);
      console.log("Shareable URL copied to clipboard:", shareableURL);
      setShareCode(true);
    } catch (error) {
      console.log("Failed to generate shareable URL:", error);
      alert("Error generating shareable link. Please try again.");
    }
  };

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);
  };

  const handleFormatCode = () => {
    if (editorInstance) {
      editorInstance.getAction('editor.action.formatDocument').run();
    } else {
      console.log("Editor instance not ready yet.");
    }
  };

 const handleRunCode = () => {
    console.log("Running code...");
    
 
    const htmlFiles = files.filter(f => f.language === 'html');
    const cssFiles = files.filter(f => f.language === 'css');
    const jsFiles = files.filter(f => f.language === 'javascript');
    
    let mainHtmlFile = htmlFiles.find(f => f.name.toLowerCase().includes('index'));
    if (!mainHtmlFile) {
      mainHtmlFile = htmlFiles[0];
    }
    
    if (!mainHtmlFile) {
      console.log("No HTML files found");
      return;
    }
    
   
    const virtualHtmlFiles = {};
    const virtualCssFiles = {};
    const virtualJsFiles = {};
    
    htmlFiles.forEach(file => {
      virtualHtmlFiles[file.name] = file.content;
    });
    
    cssFiles.forEach(file => {
      virtualCssFiles[file.name] = file.content;
      const nameWithoutExt = file.name.replace(/\.(css)$/, '');
      virtualCssFiles[nameWithoutExt] = file.content;
    });
    
    jsFiles.forEach(file => {
      virtualJsFiles[file.name] = file.content;
      const nameWithoutExt = file.name.replace(/\.(js)$/, '');
      virtualJsFiles[nameWithoutExt] = file.content;
    });

  
    const rawScriptContent = `
      window.__virtualHtmlFiles__ = ${JSON.stringify(virtualHtmlFiles)};
      window.__virtualCssFiles__ = ${JSON.stringify(virtualCssFiles)};
      window.__virtualJsFiles__ = ${JSON.stringify(virtualJsFiles)};
      window.__currentPage__ = "${mainHtmlFile.name}";
      window.__loadedResources__ = { css: [], js: [] };
      window.__modules__ = {};
      
      function loadVirtualCSS(filename) {
        let content = window.__virtualCssFiles__[filename];
        if (!content) {
          const nameWithoutExt = filename.replace(/\\.(css)$/, '');
          content = window.__virtualCssFiles__[nameWithoutExt];
        }
        if (!content) {
          console.warn('CSS file not found:', filename);
          return;
        }
        if (window.__loadedResources__.css.includes(filename)) {
          return;
        }
        window.__loadedResources__.css.push(filename);
        const styleElement = document.createElement('style');
        styleElement.setAttribute('data-virtual-css', filename);
        styleElement.textContent = content; 
        document.head.appendChild(styleElement);
        console.log('✅ CSS:', filename);
      }
      
      // Removed complex JSX/TSX/Module functions
      
      function loadVirtualJS(filename) {
        let content = window.__virtualJsFiles__[filename];
        if (!content) {
          const nameWithoutExt = filename.replace(/\\.(js)$/, '');
          content = window.__virtualJsFiles__[nameWithoutExt];
        }
        if (!content) {
          console.warn('JS file not found:', filename);
          return;
        }
        if (window.__loadedResources__.js.includes(filename)) {
          return;
        }
        window.__loadedResources__.js.push(filename);
        
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('data-virtual-js', filename);
        scriptElement.textContent = content;
        document.body.appendChild(scriptElement);
        
        console.log('✅ JS:', filename);
      }
      
      function loadExternalResources(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          const href = link.getAttribute('href');
          if (href && (href.endsWith('.css'))) loadVirtualCSS(href);
        });
        doc.querySelectorAll('script[src]').forEach(script => {
          const src = script.getAttribute('src');
          if (src && /\\.(js)$/.test(src)) loadVirtualJS(src);
        });
      }
      
      function loadVirtualPage(filename) {
        const content = window.__virtualHtmlFiles__[filename];
        if (!content) {
          console.error('❌ HTML not found:', filename);
          return;
        }
        window.__currentPage__ = filename;
        console.log('📄 Loading:', filename);
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        document.body.innerHTML = doc.body.innerHTML; // Set body first
        
        loadExternalResources(content); // Then load resources
    
        attachLinkListeners();
      }
      
      function attachLinkListeners() {
        document.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.endsWith('.html')) {
              e.preventDefault();
              loadVirtualPage(href);
            }
          });
        });
      }
      
      console.log("Ready");
      loadVirtualPage(window.__currentPage__);
    `;


    const encodedScript = btoa(unescape(encodeURIComponent(rawScriptContent)));

    const resourceLoadingScript = `
      (function() {
        try {
          const encoded = '${encodedScript}';
          const decoded = decodeURIComponent(escape(atob(encoded)));
          eval(decoded);
        } catch(e) {
          console.error('Failed to decode and run virtual script:', e);
        }
      })();
    `;
    
    const mainHtml = mainHtmlFile.content;
    const hasFullHtml = mainHtml.includes('<!DOCTYPE') || mainHtml.includes('<html');
    
    let combinedCode;
    
    if (hasFullHtml) {
      const bodyCloseIndex = mainHtml.lastIndexOf('</body>');
      
      if (bodyCloseIndex !== -1) {
        const parts = [
          mainHtml.slice(0, bodyCloseIndex),
          '<script>',
          resourceLoadingScript, 
          '</script>',
          mainHtml.slice(bodyCloseIndex)
        ];
        combinedCode = parts.join('');
      } else {
        combinedCode = [mainHtml, '<script>', resourceLoadingScript, '</script>'].join('');
      }
    } else {
      const parts = [
        '<!DOCTYPE html>\n',
        '<html lang="en">\n',
        '<head>\n',
        '  <meta charset="UTF-8">\n',
        '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
        '  <title>Preview</title>\n',
        '</head>\n',
        '<body>\n',
        mainHtml,
        '\n<script>\n',
        resourceLoadingScript, 
        '\n</script>\n',
        '</body>\n',
        '</html>'
      ];
      combinedCode = parts.join('');
    }
    
    setOutputCode(combinedCode);
};

  const getActiveFile = () => {
    return files.find(f => f.id === activeTab) || files[0];
  };

  const handleFIleCreation = ({ name, language }) => {
    const newFile = {
      id: `file-${Date.now()}`,
      name: name,
      language: language.id,
      content: getDefaultContent(language.id)
    };

    setFiles([...files, newFile]);
    setActiveTab(newFile.id);
    console.log('new file created:', newFile);
  };

  const deleteFiles = (fileId) => {
    if (files.length === 1) {
      alert("Can't delete the last file");
      return;
    }

    if (activeTab === fileId) {
      const fileIndex = files.findIndex(f => f.id === fileId);
      const newIndex = fileIndex > 0 ? fileIndex - 1 : 1;
      setActiveTab(files[newIndex].id);
    }

    setFiles(files.filter(f => f.id !== fileId));
  };

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
        files={files}
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
            onAddFile={() => setIsAddNewFileOpen(true)}
            onDeleteFile={deleteFiles}
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
                onAddFile={() => setIsAddNewFileOpen(true)}
                onDeleteFile={deleteFiles}
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

      <AddNewFIle
        isOpen={isAddNewFileOpen}
        onClose={() => setIsAddNewFileOpen(false)}
        onCreateFIle={handleFIleCreation}
      />
    </div>
  );
}

export default App;