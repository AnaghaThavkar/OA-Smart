import React from 'react';
import { 
  LayoutDashboard, UserPlus, History, Settings as SettingsIcon, 
  Activity, HeartPulse, Info, Bot, LogIn, LogOut, User, X 
} from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onStartNewScreening: () => void;
  language: Language;
  currentUser: any;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenChat: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  activeView,
  setActiveView,
  onStartNewScreening,
  language,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenChat,
  isOpenMobile = false,
  onCloseMobile
}: SidebarProps) {
  const t = translations[language].nav;

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'new-screening', label: t.newScreening, icon: UserPlus },
    { id: 'screening-history', label: t.history, icon: History },
    { id: 'about-us', label: t.aboutUs, icon: Info },
    { id: 'settings', label: t.settings, icon: SettingsIcon },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'new-screening') {
      onStartNewScreening();
    } else {
      setActiveView(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between select-none no-print transition-all duration-200 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Branding Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  OA-SMART
                </h1>
                <p className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wider mt-1 uppercase">
                  Risk Screening System
                </p>
              </div>
            </div>
            {/* Mobile close button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* AI Assistant Trigger Button */}
            <button
              onClick={() => {
                onOpenChat();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>{t.assistant}</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </nav>
        </div>

        {/* User Auth Profile / Footer in Sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
          {currentUser ? (
            <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.full_name || t.healthcareWorker}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.login} / {t.signup}</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
            <span>OA-SMART v2.0</span>
            <span className="font-mono font-semibold">15-Feature ML</span>
          </div>
        </div>
      </aside>
    </>
  );
}
