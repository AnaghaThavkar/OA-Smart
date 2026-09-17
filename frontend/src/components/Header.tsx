import React from 'react';
import { Menu, Sun, Moon, Globe, LogIn, User, LogOut } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface HeaderProps {
  activeView: string;
  onStartNewScreening: () => void;
  isBackendConnected?: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  currentUser: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

export function Header({
  activeView,
  onStartNewScreening,
  isBackendConnected = true,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  currentUser,
  onOpenAuth,
  onLogout,
  onToggleMobileMenu
}: HeaderProps) {
  const t = translations[language].nav;
  const tc = translations[language].common;

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return {
          main: language === 'hi' ? 'सामुदायिक स्क्रीनिंग डैशबोर्ड' : language === 'mr' ? 'समुदाय तपासणी डॅशबोर्ड' : 'Community Screening Dashboard',
          sub: language === 'hi' ? 'सामुदायिक स्क्रीनिंग और जोखिम का त्वरित अवलोकन' : language === 'mr' ? 'समुदाय तपासणी आणि जोखीम माहिती' : 'Quick overview of community screening activity'
        };
      case 'new-screening':
        return {
          main: language === 'hi' ? 'नई स्क्रीनिंग मूल्यांकन' : language === 'mr' ? 'नवीन तपासणी मूल्यांकन' : 'New Screening Assessment',
          sub: language === 'hi' ? 'चरण-दर-चरण निर्देशित मरीज मूल्यांकन' : language === 'mr' ? 'टप्प्याटप्प्याने मार्गदर्शित रुग्ण तपासणी' : 'Step-by-step guided patient risk evaluation'
        };
      case 'screening-history':
        return {
          main: language === 'hi' ? 'स्क्रीनिंग इतिहास' : language === 'mr' ? 'तपासणी इतिहास' : 'Screening History',
          sub: language === 'hi' ? 'पूर्ण किए गए मरीज स्क्रीनिंग रिकॉर्ड' : language === 'mr' ? 'पूर्ण झालेल्या तपासण्यांची यादी' : 'Repository of completed patient screening records'
        };
      case 'about-us':
        return {
          main: language === 'hi' ? 'OA-SMART परियोजना विवरण' : language === 'mr' ? 'OA-SMART प्रकल्प माहिती' : 'About OA-SMART',
          sub: language === 'hi' ? '15-फीचर एआई एवं डुअल MPU6050 तकनीक' : language === 'mr' ? '15-घटक एआय व दुहेरी MPU6050 तंत्रज्ञान' : 'Dual-sensor kinematics & calibrated 15-feature AI architecture'
        };
      case 'digital-report':
        return {
          main: language === 'hi' ? 'डिजिटल स्क्रीनिंग रिपोर्ट' : language === 'mr' ? 'डिजिटल तपासणी अहवाल' : 'OA-SMART Screening Report',
          sub: language === 'hi' ? 'आधिकारिक क्लिनिकल मूल्यांकन सारांश' : language === 'mr' ? 'अधिकृत क्लिनिकल मूल्यांकन सारांश' : 'Official clinical screening report summary'
        };
      case 'settings':
        return {
          main: language === 'hi' ? 'सिस्टम सेटिंग्स' : language === 'mr' ? 'प्रणाली सेटिंग्ज' : 'Application & Device Settings',
          sub: language === 'hi' ? 'हार्डवेयर स्थिति और प्राथमिकताएं' : language === 'mr' ? 'हार्डवेअर स्थिती आणि प्राधान्ये' : 'Sensor status and data synchronization preferences'
        };
      default:
        return {
          main: 'OA-SMART Screening System',
          sub: 'Community decision support tool'
        };
    }
  };

  const titleInfo = getHeaderTitle();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs no-print transition-colors">
      
      {/* Left side: Hamburger (Mobile) + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {titleInfo.main}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
            {titleInfo.sub}
          </p>
        </div>
      </div>

      {/* Right side: Controls (Connection, Language, Theme, Auth, and Non-Dashboard CTA) */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Language Selector Dropdown/Pill */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
          {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                language === lang
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'MR'}
            </button>
          ))}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          title={theme === 'light' ? tc.darkMode : tc.lightMode}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Header Auth Profile Button (Mobile/Compact) */}
        {currentUser ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden xl:inline">
              {currentUser.full_name || t.healthcareWorker}
            </span>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">{t.login}</span>
          </button>
        )}

      </div>
    </header>
  );
}
