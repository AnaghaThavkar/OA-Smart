import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { NewScreeningWorkflow } from './components/NewScreeningWorkflow';
import { ScreeningHistory } from './components/ScreeningHistory';
import { DigitalReport } from './components/DigitalReport';
import { Settings } from './components/Settings';
import { AboutUs } from './components/AboutUs';
import { Footer } from './components/Footer';
import { Chatbot } from './components/Chatbot';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { LocalDB } from './services/storage/db';
import { ApiClient } from './services/api/client';
import { ScreeningRecord } from './types/screening';
import { Language } from './i18n/translations';

export default function App() {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [screenings, setScreenings] = useState<ScreeningRecord[]>([]);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningRecord | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Internationalization (en / hi / mr)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('OASMART_LANG');
    return (saved === 'hi' || saved === 'mr' || saved === 'en') ? saved : 'en';
  });

  // Theme (light / dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('OASMART_THEME');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('OASMART_USER');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI Modals & Drawers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme with <html> classList
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('OASMART_THEME', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('OASMART_LANG', newLang);
  };

  const handleAuthSuccess = (user: any, token: string) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('OASMART_TOKEN');
    localStorage.removeItem('OASMART_USER');
    setCurrentUser(null);
    setActiveView('dashboard');
  };

  const loadScreenings = async () => {
    try {
      const stored = await LocalDB.getScreenings();
      setScreenings(stored || []);
    } catch (err) {
      setScreenings([]);
    }
  };

  const checkBackendHealth = async () => {
    const summary = await ApiClient.getDashboardSummary();
    setIsBackendConnected(summary !== null);
  };

  useEffect(() => {
    loadScreenings();
    checkBackendHealth();
  }, []);

  const handleStartNewScreening = () => {
    setActiveView('new-screening');
  };

  const handleViewReport = (screening: ScreeningRecord) => {
    setSelectedScreening(screening);
    setActiveView('digital-report');
  };

  const handleCompleteScreening = (screening: ScreeningRecord) => {
    setSelectedScreening(screening);
    loadScreenings();
    setActiveView('digital-report');
  };

  const stats = {
    totalScreenings: screenings.length,
    higherRisk: screenings.filter((s) => s.riskLevel === 'Higher Risk').length,
    moderateRisk: screenings.filter((s) => s.riskLevel === 'Moderate Risk').length,
    lowerRisk: screenings.filter((s) => s.riskLevel === 'Lower Risk').length,
  };

  // Requirement 4: The application must show the Login/Signup page first if not authenticated
  if (!currentUser) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onStartNewScreening={handleStartNewScreening}
        language={language}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenChat={() => setIsChatOpen(true)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Universal Header */}
        <Header
          activeView={activeView}
          onStartNewScreening={handleStartNewScreening}
          isBackendConnected={isBackendConnected}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* View Routing */}
        <main className="flex-1 pb-6">
          {activeView === 'dashboard' && (
            <Dashboard
              stats={stats}
              screenings={screenings}
              onStartNewScreening={handleStartNewScreening}
              onViewReport={handleViewReport}
              language={language}
            />
          )}

          {activeView === 'new-screening' && (
            <NewScreeningWorkflow
              onComplete={handleCompleteScreening}
              onCancel={() => setActiveView('dashboard')}
            />
          )}

          {activeView === 'screening-history' && (
            <ScreeningHistory
              screenings={screenings}
              onViewReport={handleViewReport}
              onStartNewScreening={handleStartNewScreening}
            />
          )}

          {activeView === 'about-us' && (
            <AboutUs
              language={language}
              onStartScreening={handleStartNewScreening}
            />
          )}

          {activeView === 'digital-report' && selectedScreening && (
            <DigitalReport
              screening={selectedScreening}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {activeView === 'settings' && <Settings />}
        </main>

        {/* Consistent Branding Footer on Every View */}
        <Footer
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onNavigate={(view) => setActiveView(view)}
        />

      </div>

      {/* Floating Healthcare Worker Chatbot */}
      <Chatbot
        language={language}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(prev => !prev)}
      />

      {/* Auth Modal (Login / Signup) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        language={language}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
