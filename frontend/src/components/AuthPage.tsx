import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, Mail, User, AlertCircle, Loader2, 
  Sun, Moon, Globe, HeartPulse, CheckCircle2, ArrowRight
} from 'lucide-react';
import { ApiClient } from '../services/api/client';
import { translations, Language } from '../i18n/translations';

interface AuthPageProps {
  onAuthSuccess: (user: any, token: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function AuthPage({
  onAuthSuccess,
  language,
  onLanguageChange,
  theme,
  onThemeToggle
}: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const t = translations[language].auth;
  const tc = translations[language].common;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.split('@')[1].includes('.')) {
      setError(t.invalidEmail);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordShort);
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await ApiClient.login({ email: cleanEmail, password });
        localStorage.setItem('OASMART_TOKEN', res.token);
        localStorage.setItem('OASMART_USER', JSON.stringify(res.user));
        onAuthSuccess(res.user, res.token);
      } else {
        const payload: { email: string; password: string; full_name?: string } = {
          email: cleanEmail,
          password
        };
        if (fullName.trim()) {
          payload.full_name = fullName.trim();
        }
        const res = await ApiClient.signup(payload);
        localStorage.setItem('OASMART_TOKEN', res.token);
        localStorage.setItem('OASMART_USER', JSON.stringify(res.user));
        onAuthSuccess(res.user, res.token);
      }
    } catch (err: any) {
      setError(err.message || (isLogin ? t.loginFailed : 'Registration failed.'));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* Top Bar: Brand + Controls (Language & Theme) */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
              OA-SMART
            </span>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block uppercase tracking-wider">
              Clinical Screening
            </span>
          </div>
        </div>

        {/* Preferences: Language Switcher & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
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
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={theme === 'light' ? tc.darkMode : tc.lightMode}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-indigo-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200">
          
          {/* Card Hero Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-teal-50/70 to-transparent dark:from-teal-950/20 dark:to-transparent border-b border-slate-100 dark:border-slate-700/60 text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isLogin ? t.loginTitle : t.signupTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              {isLogin ? t.loginSubtitle : t.signupSubtitle}
            </p>

            {/* Login / Signup Toggle Tabs */}
            <div className="pt-2 flex rounded-xl bg-slate-100 dark:bg-slate-700/60 p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  isLogin
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.loginBtn}
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  !isLogin
                    ? 'bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.signupBtn}
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.fullName} <span className="text-slate-400 font-normal">{t.fullNameOptional}</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder={t.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.email} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="healthcare.worker@oasmart.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.password} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>{isLogin ? t.loginBtn : t.signupBtn}</span>
            </button>



            {/* Switch between Login and Signup */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              {isLogin ? (
                <>
                  <span>{t.noAccount} </span>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError(null); }}
                    className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                  >
                    {t.signUpLink}
                  </button>
                </>
              ) : (
                <>
                  <span>{t.haveAccount} </span>
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError(null); }}
                    className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                  >
                    {t.logInLink}
                  </button>
                </>
              )}
            </div>
          </form>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/60">
        <span>&copy; {new Date().getFullYear()} OA-SMART &bull; Portable AI-Assisted Osteoarthritis Risk Screening System</span>
      </footer>

    </div>
  );
}
