import React from 'react';
import { HeartPulse, ShieldAlert } from 'lucide-react';
import { translations, Language } from '../i18n/translations';

interface FooterProps {
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  onNavigate?: (view: string) => void;
}

export function Footer({
  language,
  onNavigate
}: FooterProps) {
  const t = translations[language].footer;
  const tn = translations[language].nav;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 sm:px-8 text-slate-500 dark:text-slate-400 text-xs no-print transition-colors">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Main Footer Row: Brand, Description, and Quick Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Brand & Basic Project Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-2xs">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                OA-SMART
              </span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold px-2 py-0.5 bg-teal-50 dark:bg-teal-950/60 rounded-full border border-teal-200 dark:border-teal-800">
                v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md">
              {t.tagline} &bull; Clinical Decision Support System
            </p>
          </div>

          {/* Clean Inline Links */}
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {tn.dashboard}
            </button>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <button
              onClick={() => onNavigate?.('screening-history')}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {tn.history}
            </button>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <button
              onClick={() => onNavigate?.('about-us')}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {tn.aboutUs}
            </button>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <button
              onClick={() => onNavigate?.('settings')}
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {tn.settings}
            </button>
          </nav>

        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>{t.medicalDisclaimer}</span>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <span>&copy; {new Date().getFullYear()} {t.copyright}</span>
          <span>{t.rightsReserved}</span>
        </div>

      </div>
    </footer>
  );
}
