// src/App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import MobileTabs from "./components/MobileTabs";
import EditorPanel from "./components/EditorPanel.jsx";
import PreviewPanel from "./components/PreviewPanel";
import MobileMenu from "./components/MobileMenu";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("html");
  const [activeMobileView, setActiveMobileView] = useState("html");

  return (
    <div className={`${isDark ? "dark" : ""} h-screen flex flex-col`}>
      <Header
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onMenuOpen={() => setIsMobileMenuOpen(true)}
      />

      <MobileTabs
        activeView={activeMobileView}
        onViewChange={setActiveMobileView}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeMobileView={activeMobileView}
        />
        <PreviewPanel activeMobileView={activeMobileView} />
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

export default App;
