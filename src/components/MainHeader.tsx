/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Role, Language } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { Wifi, WifiOff, RefreshCw, Globe, User, ShieldAlert, Clock, LogOut, Lock } from 'lucide-react';

interface MainHeaderProps {
  activeRole: Role;
  onChangeRole: (role: Role) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  lastSynced: string;
  onSync: () => void;
  isSyncing: boolean;
  onLogout: () => void; // Mandatory logout callback
  centerName?: string;
  centerAddress?: string;
  centerLogo?: string;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  activeRole,
  onChangeRole,
  language,
  onChangeLanguage,
  isOnline,
  onToggleOnline,
  lastSynced,
  onSync,
  isSyncing,
  onLogout,
  centerName,
  centerAddress,
  centerLogo,
}) => {
  const text = LOCALIZED_TEXTS[language];
  
  // Six roles are permitted to utilize the workstation
  const roles: { key: Role; label: string; bg: string; text: string }[] = [
    { key: 'BHW', label: language === 'EN' ? 'BHW' : 'BHW', bg: 'bg-emerald-50 dark:bg-emerald-950/20 shadow-xs', text: 'text-emerald-700' },
    { key: 'MIDWIFE', label: language === 'EN' ? 'Midwife (RM)' : 'Midwife (RM)', bg: 'bg-teal-50 dark:bg-teal-950/20 shadow-xs', text: 'text-teal-700' },
    { key: 'NURSE', label: language === 'EN' ? 'Nurse (RN)' : 'Nars (RN)', bg: 'bg-blue-50 dark:bg-blue-950/20 shadow-xs', text: 'text-blue-705' },
    { key: 'PHARMACIST', label: language === 'EN' ? 'Pharmacist' : 'Farmasista', bg: 'bg-amber-50 dark:bg-amber-950/20 shadow-xs', text: 'text-amber-707' },
    { key: 'MHO', label: language === 'EN' ? 'MHO / Doctor' : 'MHO / Doktor', bg: 'bg-rose-50 dark:bg-rose-950/20 shadow-xs', text: 'text-rose-700' },
    { key: 'ADMIN', label: language === 'EN' ? 'Admin / Captain' : 'Admin / Kapitan', bg: 'bg-purple-50 dark:bg-purple-950/20 shadow-xs', text: 'text-purple-700' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="bhc-header">
      {/* Top micro bar for Connectivity & Security Guidelines */}
      <div className="bg-slate-900 text-white px-4 py-1.5 flex flex-wrap items-center justify-between text-xs gap-2" id="bhc-topbar">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-amber-400" />
            <span className="font-mono tracking-wide">RA 10173 PRIVACY ENCRYPTED</span>
          </div>
          <span className="text-slate-400">|</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock size={12} />
            <span>PST (Philippine Standard Time): 2026-06-01 15:45 (GMT+8)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Connectivity simulation toggle */}
          <button
            onClick={onToggleOnline}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer font-medium ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
            title="Toggle offline-first test mode"
            id="toggle-connectivity-button"
          >
            {isOnline ? (
              <>
                <Wifi size={13} className="animate-pulse" />
                <span>{text.online}</span>
              </>
            ) : (
              <>
                <WifiOff size={13} />
                <span>{text.offline}</span>
              </>
            )}
          </button>

          {/* Sync Trigger */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
            id="sync-button"
          >
            <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : text.syncButton}</span>
            <span className="text-slate-400 font-mono">({lastSynced})</span>
          </button>
        </div>
      </div>

      {/* Main header block */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="bhc-branding">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-600 text-white rounded px-2.5 py-0.5 text-base font-extrabold shadow-sm">
                {centerLogo === 'heart' ? '❤️' :
                 centerLogo === 'shield' ? '🛡️' :
                 centerLogo === 'activity' ? '⚡' :
                 '🏥'}
              </span>
              <span>{centerName || text.title}</span>
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
              {centerAddress || 'Barangay Balong-balong, Pitogo, Zamboanga del Sur'}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>{text.subheading}</span>
          </div>
        </div>

        {/* Action Controls: Language & Manual Lockout */}
        <div className="flex items-center gap-3 self-end md:self-center" id="header-tools-row">
          {/* Language Selection bar */}
          <div className="flex items-center gap-2" id="language-toggles">
            <Globe size={14} className="text-slate-400" />
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              {(['EN', 'TL', 'BY'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onChangeLanguage(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-white shadow-xs text-slate-800 border-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  id={`lang-toggle-${lang}`}
                >
                  {lang === 'EN' ? 'English' : lang === 'TL' ? 'Tagalog' : 'Bisaya'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* Siting / Logout Button */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs uppercase font-mono"
            title="Lock session & log out of workstation"
            id="header-logout-btn"
          >
            <LogOut size={13} />
            <span>{language === 'EN' ? 'Logout' : 'Labas'}</span>
          </button>
        </div>
      </div>

      {/* Authorized Active Session Banner (Security Locked) */}
      <div className="bg-slate-50/50 border-t border-slate-200 px-4 py-3" id="bhc-session-lock-strip">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-900 text-white rounded-lg flex items-center justify-center border border-slate-850">
              <Lock size={13} className="text-amber-450 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                  {language === 'EN' ? 'SECURE ACTIVE WORKSTATION SESSION' : 'LIGTAS NA AKTIBONG SESSION NG WORKSTATION'}
                </span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <span>
                  {activeRole === 'BHW' ? 'Julefe Magwate' :
                   activeRole === 'MIDWIFE' ? 'Arlene Cagas Dayama, RM' :
                   activeRole === 'NURSE' ? 'Yvonne Galang, RN' :
                   'Ericson Padunan'}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide uppercase border ${
                  activeRole === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  activeRole === 'MIDWIFE' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                  activeRole === 'NURSE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {activeRole === 'BHW' ? 'BHW' :
                   activeRole === 'MIDWIFE' ? 'Midwife' :
                   activeRole === 'NURSE' ? 'Nurse' :
                   'Administrator'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-500 max-w-sm font-semibold leading-normal bg-slate-100 p-2 rounded-xl border border-slate-200 md:text-right">
            ⚠️ {language === 'EN' 
              ? 'Authorized personnel only. Other accounts are invisible inside this session. To switch roles, click Logout first.' 
              : 'Mga awtorisadong tauhan lamang. Hindi nakikita ang ibang account sa session na ito. Upang magpalit ng account, mag-Logout muna.'}
          </div>
        </div>
      </div>
    </header>
  );
};
