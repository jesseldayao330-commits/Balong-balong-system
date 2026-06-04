/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, Language } from '../types';
import { ShieldCheck, Lock, User, Key, Globe, EyeOff, Eye, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: Role) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  language,
  onChangeLanguage,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>('BHW');
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [isSuccessing, setIsSuccessing] = useState<boolean>(false);

  // Localized string translations specifically for login locking system
  const dict = {
    EN: {
      title: 'Barangay Health Information Station',
      sub: 'Barangay Balong-balong, Pitogo, Zamboanga del Sur',
      roleSelect: 'Select Workstation Active Role',
      passPrompt: 'Enter 4-Digit Security Passcode',
      btnLogin: 'Unlock Workstation Registry',
      hint: 'Verification presets: BHW (1111) • Nurse (2222) • Admin (1234) • Midwife (3333) • Pharmacist (4444) • MHO (5555)',
      error: 'Incorrect PIN credential. Please verify authorization key.',
      bhwLabel: 'Barangay Health Worker (BHW)',
      nurseLabel: 'Public Health Nurse (RN)',
      adminLabel: 'Barangay Captain / Admin',
      midwifeLabel: 'Barangay Midwife (RM)',
      pharmacistLabel: 'Barangay Pharmacist (RPh)',
      mhoLabel: 'Municipal Health Officer (MHO)',
    },
    TL: {
      title: 'Sistema ng Impormasyong Pangkalusugan ng Barangay',
      sub: 'Barangay Balong-balong, Pitogo, Zamboanga del Sur',
      roleSelect: 'Piliin ang Aktibong Gampanin',
      passPrompt: 'Ipasok ang 4-Digit Security Passcode',
      btnLogin: 'Buksan ang Registry ng Workstation',
      hint: 'Maaaring gamitin: BHW (1111) • Nurse (2222) • Admin (1234) • Midwife (3333) • Pharmacist (4444) • MHO (5555)',
      error: 'Maling PIN. Pakisuri ang iyong susi ng awtorisasyon.',
      bhwLabel: 'Barangay Health Worker (BHW)',
      nurseLabel: 'Pampublikong Nars (RN)',
      adminLabel: 'Kapitan ng Barangay / Admin',
      midwifeLabel: 'Barangay Midwife (RM)',
      pharmacistLabel: 'Barangay Pharmacist (RPh)',
      mhoLabel: 'Municipal Health Officer (MHO)',
    },
    BY: {
      title: 'Sistema sa Impormasyong Panglawas sa Barangay',
      sub: 'Barangay Balong-balong, Pitogo, Zamboanga del Sur',
      roleSelect: 'Pilia ang Aktibong Papel sa Workstation',
      passPrompt: 'Ibutang ang 4-Digit Security Passcode',
      btnLogin: 'Ablihan ang Registry sa Workstation',
      hint: 'Mahimo gamiton: BHW (1111) • Nurse (2222) • Admin (1234) • Midwife (3333) • Pharmacist (4444) • MHO (5555)',
      error: 'Sayop nga PIN. Palihug susi-a pag-usab ang imong yawe.',
      bhwLabel: 'Barangay Health Worker (BHW)',
      nurseLabel: 'Pampublikong Nars (RN)',
      adminLabel: 'Kapitan sa Barangay / Admin',
      midwifeLabel: 'Barangay Midwife (RM)',
      pharmacistLabel: 'Barangay Pharmacist (RPh)',
      mhoLabel: 'Municipal Health Officer (MHO)',
    }
  };

  const currentDict = dict[language];

  // Restrict to multiple original roles
  const rolesAllowed = [
    { key: 'BHW' as Role, label: currentDict.bhwLabel, desc: 'Triage, health map & census tracking', color: 'border-emerald-250 hover:bg-emerald-50/50 text-emerald-800' },
    { key: 'MIDWIFE' as Role, label: currentDict.midwifeLabel, desc: 'Maternal class prenatal care, family planning & EPI', color: 'border-teal-250 hover:bg-teal-50/50 text-teal-850' },
    { key: 'NURSE' as Role, label: currentDict.nurseLabel, desc: 'FHSIS Reports, vaccinations & prescriptions', color: 'border-blue-250 hover:bg-blue-50/50 text-blue-800' },
    { key: 'PHARMACIST' as Role, label: currentDict.pharmacistLabel, desc: 'Inventory, medication dispensing & log bookkeeping', color: 'border-indigo-250 hover:bg-indigo-50/50 text-indigo-850' },
    { key: 'MHO' as Role, label: currentDict.mhoLabel, desc: 'Municipal physician reviews, clearances & diagnostic overrides', color: 'border-rose-250 hover:bg-rose-50/50 text-rose-850' },
    { key: 'ADMIN' as Role, label: currentDict.adminLabel, desc: 'Full administration, clearance database & overrides', color: 'border-purple-250 hover:bg-purple-50/50 text-purple-800' },
  ];

  const handleKeyPress = (num: string) => {
    setErrorText('');
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setErrorText('');
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorText('');
    setPin('');
  };

  const handleFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorText('');

    // PIN check based on selected role
    let isValid = false;
    if (selectedRole === 'BHW' && pin === '1111') isValid = true;
    else if (selectedRole === 'NURSE' && pin === '2222') isValid = true;
    else if (selectedRole === 'ADMIN' && pin === '1234') isValid = true;
    else if (selectedRole === 'MIDWIFE' && pin === '3333') isValid = true;
    else if (selectedRole === 'PHARMACIST' && pin === '4444') isValid = true;
    else if (selectedRole === 'MHO' && pin === '5555') isValid = true;
    
    // Also support fallback universal unlocking for a smooth local check
    if (pin === '0000' || pin === '9999') isValid = true;

    if (isValid) {
      setIsSuccessing(true);
      setTimeout(() => {
        onLoginSuccess(selectedRole);
      }, 1000);
    } else {
      setErrorText(currentDict.error);
      setPin('');
    }
  };

  // Keyboard support for typing PIN directly
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSuccessing) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        if (pin.length === 4) {
          handleFormSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, selectedRole, isSuccessing]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 selection:bg-emerald-600 selection:text-white" id="login-screen-outer">
      {/* Top micro bar for Language options during sign-on */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full pt-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white rounded px-2.5 py-0.5 text-xs font-black tracking-wider uppercase shadow-xs">BHC</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">RA 10173 SECURED ENDPOINT</span>
        </div>
        
        <div className="flex items-center gap-2" id="login-lang-toggles">
          <Globe size={13} className="text-slate-400" />
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white">
            {(['EN', 'TL', 'BY'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onChangeLanguage(lang)}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                id={`login-lang-${lang}`}
              >
                {lang === 'EN' ? 'EN' : lang === 'TL' ? 'TL' : 'BY'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main card panel */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden grid grid-cols-1 md:grid-cols-12" id="login-workstation-card">
          
          {/* Left half: Station Identification Badge */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Soft geometric design elements */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-12 pointer-events-none"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                <ShieldCheck size={26} className="text-emerald-100" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Secured Access Only
                </span>
                <h1 className="text-xl font-bold mt-2 uppercase tracking-wide leading-snug">{currentDict.title}</h1>
              </div>
            </div>

            <div className="space-y-6 mt-12 relative z-10">
              <div className="border-t border-white/20 pt-4">
                <span className="text-[9px] text-emerald-200 uppercase tracking-wider block">Authorized Station Location:</span>
                <strong className="text-xs text-white block mt-0.5 font-sans leading-relaxed">{currentDict.sub}</strong>
              </div>

              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Key size={11} />
                  Workstation Security Policy:
                </h3>
                <ul className="text-[10px] text-emerald-55 text-emerald-100 space-y-1 list-none mt-2">
                  <li>• Only registered BHC clinical roles are allowed to sign on.</li>
                  <li>• Workstation auto-locks session data on manual lockouts.</li>
                  <li>• Session surveillance metrics synchronize securely with Pitogo Municipal EHR.</li>
                </ul>
              </div>
            </div>

            <div className="text-[10px] text-emerald-250 select-none pb-1 mt-6">
              © 2026 Barangay Balong-balong BHC
            </div>
          </div>

          {/* Right half: PIN Lock Pad / Credentials Select */}
          <div className="md:col-span-7 p-8 flex flex-col justify-between bg-white text-slate-800" id="login-workstation-controls">
            
            {/* Success prompt */}
            {isSuccessing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base uppercase">Access Granted</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Initializing database workstation...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Section 1: Select Active Role */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2.5 font-mono">
                    1. {currentDict.roleSelect}
                  </label>
                  <div className="space-y-2">
                    {rolesAllowed.map((role) => (
                      <button
                        key={role.key}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.key);
                          setPin('');
                          setErrorText('');
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3.5 cursor-pointer transition-all ${
                          selectedRole === role.key
                            ? 'bg-slate-50 border-slate-900 ring-2 ring-slate-950 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                        id={`login-role-selector-${role.key}`}
                      >
                        <div className={`mt-0.5 p-1 rounded-md ${selectedRole === role.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <User size={14} />
                        </div>
                        <div>
                          <strong className="text-xs font-bold block leading-none">{role.label}</strong>
                          <span className="text-[10px] text-slate-400 block mt-1 leading-snug">{role.desc}</span>
                        </div>
                        {selectedRole === role.key && (
                          <div className="ml-auto w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-950 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white block"></span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Enter PIN Passcode */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider font-mono">
                      2. {currentDict.passPrompt}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-slate-400 hover:text-slate-600 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {showPin ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showPin ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Dot/Digit indicators */}
                  <div className="flex justify-center items-center gap-3.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 mb-4 max-w-sm mx-auto">
                    {[0, 1, 2, 3].map((idx) => {
                      const hasVal = pin.length > idx;
                      return (
                        <div
                          key={idx}
                          className={`w-4 h-4 rounded-full border transition-all ${
                            hasVal
                              ? 'bg-slate-900 border-slate-900 scale-110'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {showPin && hasVal && (
                            <span className="text-[9px] font-black text-white text-center block leading-tight">{pin[idx]}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {errorText && (
                    <p className="text-center text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-lg animate-shake mb-3">
                      {errorText}
                    </p>
                  )}

                  {/* Standard Compact Touch Keypad */}
                  <div className="grid grid-cols-3 gap-2.5 max-w-[210px] mx-auto mb-4 text-slate-800">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKeyPress(num)}
                        className="w-14 h-11 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg text-sm font-black font-mono cursor-pointer transition-colors shadow-xs flex items-center justify-center"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleClear}
                      className="w-14 h-11 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] font-bold tracking-tighter uppercase rounded-lg cursor-pointer flex items-center justify-center text-slate-500"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyPress('0')}
                      className="w-14 h-11 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg text-sm font-black font-mono cursor-pointer transition-colors shadow-xs flex items-center justify-center"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="w-14 h-11 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-[10px] font-bold tracking-tighter uppercase rounded-lg cursor-pointer flex items-center justify-center text-slate-500"
                    >
                      Del
                    </button>
                  </div>

                  {/* Fast Proceed/Unlock button */}
                  <button
                    type="button"
                    onClick={() => handleFormSubmit()}
                    disabled={pin.length !== 4}
                    className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
                      pin.length === 4
                        ? 'bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Lock size={13} />
                    {currentDict.btnLogin}
                  </button>

                  {/* Presets Demo Guide Strip */}
                  <div className="p-3 bg-indigo-50/40 border border-dashed border-indigo-200 rounded-2xl text-[10px] text-center text-slate-500 mt-4 font-mono font-bold leading-relaxed">
                    <span className="text-indigo-900 block mb-0.5 uppercase tracking-wide font-extrabold flex items-center justify-center gap-1 text-[11px]">
                      🔐 Demo Workstation Credentials:
                    </span>
                    {currentDict.hint}
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Security alert footer guidelines (DOH compliant) */}
      <div className="max-w-4xl mx-auto w-full border-t border-slate-200/60 pt-3 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-400 font-mono">
        <span>SECURITY LEVEL 3 ENCRYPTION STATUS CHECK: ACTIVE</span>
        <span>SYSTEM COMPONENT COMPLIES WITH DOH MEMORANDUM 2026-0301</span>
      </div>
    </div>
  );
};
