/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Role, Language } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { Globe, LogOut } from 'lucide-react';
import { RHU_PITOGO_LOGO_BASE64 } from '../assets/logoBase64';

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
  
  // Five roles are permitted to utilize the workstation
  const roles: { key: Role; label: string; bg: string; text: string }[] = [
    { key: 'BHW', label: language === 'EN' ? 'BHW' : 'BHW', bg: 'bg-emerald-50 dark:bg-emerald-950/20 shadow-xs', text: 'text-emerald-700' },
    { key: 'MIDWIFE', label: language === 'EN' ? 'Midwife & Nurse (RM/RN)' : 'Midwife at Nars (RM/RN)', bg: 'bg-teal-50 dark:bg-teal-950/20 shadow-xs', text: 'text-teal-700' },
    { key: 'PHARMACIST', label: language === 'EN' ? 'Pharmacist' : 'Farmasista', bg: 'bg-amber-50 dark:bg-amber-950/20 shadow-xs', text: 'text-amber-700' },
    { key: 'MHO', label: language === 'EN' ? 'MHO / Doctor' : 'MHO / Doktor', bg: 'bg-rose-50 dark:bg-rose-950/20 shadow-xs', text: 'text-rose-700' },
    { key: 'ADMIN', label: language === 'EN' ? 'Admin / Captain' : 'Admin / Kapitan', bg: 'bg-purple-50 dark:bg-purple-950/20 shadow-xs', text: 'text-purple-700' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="bhc-header">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="bhc-branding">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2.5 flex-wrap">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-600 shadow-xs bg-white flex-shrink-0 flex items-center justify-center p-0.5">
                <img
                  src={RHU_PITOGO_LOGO_BASE64}
                  alt="RHU Pitogo Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
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
            {(['EN', 'TL'] as Language[]).map((lang) => (
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
                  {lang === 'EN' ? 'English' : 'Tagalog'}
                </button>
              ))}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 hover:text-rose-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs uppercase font-mono"
            title="Log out"
            id="header-logout-btn"
          >
            <LogOut size={13} />
            <span>{language === 'EN' ? 'Logout' : 'Labas'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
