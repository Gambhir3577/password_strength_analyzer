import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import type { ActiveTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AnalyzerView } from './components/analyzer/AnalyzerView';
import { CompareView } from './components/compare/CompareView';
import { GeneratorView } from './components/generator/GeneratorView';
import { PrivacyPanel } from './components/privacy/PrivacyPanel';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import type { UserContext } from './types/analyzer';

export const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [password, setPassword] = useState<string>('');
  const [userContext, setUserContext] = useState<UserContext>({});
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);

  const handleUseGeneratedPassword = (newPassword: string) => {
    setPassword(newPassword);
    setActiveTab('analyzer');
  };

  // Keyboard navigation shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        setActiveTab('generator');
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setActiveTab('analyzer');
        setIsAuditModalOpen(true);
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setIsAuditModalOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-800 dark:selection:text-indigo-200 transition-colors duration-200">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 print:hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-400/15 dark:bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="print:hidden">
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          theme={theme}
          onThemeChange={setTheme}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
        />
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'analyzer' && (
          <AnalyzerView
            password={password}
            setPassword={setPassword}
            userContext={userContext}
            setUserContext={setUserContext}
            onNavigateToGenerator={() => setActiveTab('generator')}
            onNavigateToPrivacy={() => setActiveTab('privacy')}
            isAuditModalOpen={isAuditModalOpen}
            setIsAuditModalOpen={setIsAuditModalOpen}
          />
        )}

        {activeTab === 'compare' && <CompareView />}

        {activeTab === 'generator' && (
          <GeneratorView onSelectPassword={handleUseGeneratedPassword} />
        )}

        {activeTab === 'privacy' && <PrivacyPanel />}
      </main>

      <div className="print:hidden">
        <Footer />
      </div>

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default App;
