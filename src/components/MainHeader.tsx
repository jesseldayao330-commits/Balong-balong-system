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
}) => {
  const text = LOCALIZED_TEXTS[language];
  
  // Six roles are permitted to utilize the workstation
  const roles: { key: Role; label: string; bg: string; text: string }[] = [
    { key: 'BHW', label: text.bhw, bg: 'bg-emerald-50 dark:bg-emerald-950/20 shadow-xs', text: 'text-emerald-700' },
    { key: 'MIDWIFE', label: text.midwife, bg: 'bg-teal-50 dark:bg-teal-950/20 shadow-xs', text: 'text-teal-700' },
    { key: 'NURSE', label: text.nurse, bg: 'bg-blue-50 dark:bg-blue-950/20 shadow-xs', text: 'text-blue-700' },
    { key: 'PHARMACIST', label: text.pharmacist, bg: 'bg-indigo-50 dark:bg-indigo-950/20 shadow-xs', text: 'text-indigo-700' },
    { key: 'MHO', label: text.mho, bg: 'bg-rose-50 dark:bg-rose-950/20 shadow-xs', text: 'text-rose-700' },
    { key: 'ADMIN', label: text.admin, bg: 'bg-purple-50 dark:bg-purple-950/20 shadow-xs', text: 'text-purple-700' },
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
            <span className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5 flex-wrap">
              <span className="bg-emerald-600 text-white rounded px-2 py-0.5 text-xl font-extrabold shadow-sm">BHC</span>
              {text.title}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
              Barangay Balong-balong, Pitogo, Zamboanga del Sur
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

      {/* User Roles Selection strip (Tailored Large Buttons for Touch and Mouse) */}
      <div className="bg-slate-50 border-t border-slate-150 px-4 py-2.5" id="bhc-roles-strip">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <User size={15} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{text.activeRole}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2" id="role-selector-buttons">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => onChangeRole(role.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                  activeRole === role.key
                    ? `${role.bg} ${role.text} border-current ring-1 ring-offset-1 ring-current scale-[1.02] font-semibold`
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
                id={`role-btn-${role.key}`}
              >
                <div className={`w-2 h-2 rounded-full ${activeRole === role.key ? 'bg-current animate-pulse' : 'bg-slate-300'}`} />
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
