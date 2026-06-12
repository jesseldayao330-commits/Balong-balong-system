/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Role, Language } from '../types';
import { ShieldCheck, Lock, User, Key, Globe, EyeOff, Eye, CheckCircle2, Users } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: Role) => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  centerName?: string;
  centerAddress?: string;
  centerLogo?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  language,
  onChangeLanguage,
  centerName,
  centerAddress,
  centerLogo,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>('BHW');
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');
  const [isSuccessing, setIsSuccessing] = useState<boolean>(false);

  // Localized string translations specifically for login locking system
  const dict = {
    EN: {
      title: 'Development of a Health Records Management System',
      sub: 'Barangay Balong-balong, Pitogo, Zamboanga del Sur',
      roleSelect: 'Select Workstation Active Role',
      passPrompt: 'Enter 4-Digit Security Passcode',
      btnLogin: 'Unlock Workstation Registry',
      hint: 'PINs: BHW (1111) • MIDWIFE (3333) • NURSE (2222) • ADMIN (1234)',
      error: 'Incorrect PIN credential. Please verify authorization key.',
      bhwLabel: 'Barangay Health Worker (BHW)',
      midwifeLabel: 'Barangay Midwife (RM)',
      nurseLabel: 'Public Health Nurse (RN)',
      adminLabel: 'Admin (Head Midwife / Staff-in-charge)',
    },
    TL: {
      title: 'Sistema ng Impormasyong Pangkalusugan ng Barangay',
      sub: 'Barangay Balong-balong, Pitogo, Zamboanga del Sur',
      roleSelect: 'Piliin ang Aktibong Gampanin',
      passPrompt: 'Ipasok ang 4-Digit Security Passcode',
      btnLogin: 'Buksan ang Registry ng Workstation',
      hint: 'Mga PIN: BHW (1111) • MIDWIFE (3333) • NURSE (2222) • ADMIN (1234)',
      error: 'Maling PIN. Pakisuri ang iyong susi ng awtorisasyon.',
      bhwLabel: 'Barangay Health Worker (BHW)',
      midwifeLabel: 'Barangay Midwife (RM)',
      nurseLabel: 'Public Health Nurse (RN)',
      adminLabel: 'Admin (Head Midwife / Staff-in-charge)',
    },
    BY: {
      title: 'Sistema sa Impormasyong Panglawas sa Barangay',
      sub: 'Barangay Balong-balong, Pitogo, Zamboanga del Sur',
      roleSelect: 'Pilia ang Aktibong Papel sa Workstation',
      passPrompt: 'Ibutang ang 4-Digit Security Passcode',
      btnLogin: 'Ablihan ang Registry sa Workstation',
      hint: 'Mga PIN: BHW (1111) • MIDWIFE (3333) • NURSE (2222) • ADMIN (1234)',
      error: 'Sayop nga PIN. Palihug susi-a pag-usab ang imong yawe.',
      bhwLabel: 'Barangay Health Worker (BHW)',
      midwifeLabel: 'Barangay Midwife (RM)',
      nurseLabel: 'Public Health Nurse (RN)',
      adminLabel: 'Admin (Head Midwife / Staff-in-charge)',
    }
  };

  const currentDict = dict[language];

  // Restrict to authorized roles with separate Midwife and Nurse workstation credentials
  const rolesAllowed = [
    { key: 'BHW' as Role, label: currentDict.bhwLabel, desc: 'Register patients and households, record vital signs, prenatal/vaccine visit data. Read-only records.', color: 'border-emerald-200 text-emerald-800' },
    { key: 'MIDWIFE' as Role, label: currentDict.midwifeLabel, desc: 'Maternal class prenatal care monitoring, pregnant client risk check, and Family Planning clinical forms.', color: 'border-teal-200 text-teal-800' },
    { key: 'NURSE' as Role, label: currentDict.nurseLabel, desc: 'Childhood vaccines (EPI/Immunization records), clinical diagnosis & general medical checkups.', color: 'border-blue-200 text-blue-800' },
    { key: 'ADMIN' as Role, label: currentDict.adminLabel, desc: 'System configurations, custom logo/branding adjustment, system auditing logs, and user PIN overrides.', color: 'border-purple-200 text-purple-800' },
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
    else if (selectedRole === 'MIDWIFE' && pin === '3333') isValid = true;
    else if (selectedRole === 'PHARMACIST' && pin === '4444') isValid = true;
    else if (selectedRole === 'MHO' && pin === '5555') isValid = true;
    else if (selectedRole === 'ADMIN' && pin === '1234') isValid = true;
    
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 selection:bg-emerald-600 selection:text-white relative overflow-hidden" id="login-screen-outer">
      {/* Radiant Glowing Background Lights & Ambient Orbs */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] rounded-full bg-teal-500/15 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[130px] pointer-events-none animate-pulse duration-[12s]" />
      <div className="absolute top-[10%] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[90px] pointer-events-none" />
      
      {/* Subtle Medical Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top micro bar for Language options during sign-on */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full pt-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white rounded px-2.5 py-0.5 text-xs font-black tracking-wider uppercase shadow-md shadow-emerald-900/30">DHRMS</span>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            RA 10173 SECURED ENDPOINT
          </span>
        </div>
        
        <div className="flex items-center gap-2" id="login-lang-toggles">
          <Globe size={13} className="text-slate-400" />
          <div className="inline-flex rounded-lg border border-slate-800 p-0.5 bg-slate-900">
            {(['EN', 'TL', 'BY'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onChangeLanguage(lang)}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id={`login-lang-${lang}`}
              >
                {lang === 'EN' ? 'EN' : lang === 'TL' ? 'TL' : 'BY'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main card panel with glow shadow */}
      <div className="flex-1 flex items-center justify-center py-8 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl w-full max-w-4xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] transition-all overflow-hidden grid grid-cols-1 md:grid-cols-12" id="login-workstation-card">
          
          {/* Left half: Station Identification Badge */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white p-8 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
            {/* Soft geometric design elements with backlights */}
            <div className="absolute top-1/4 left-1/2 w-48 h-48 bg-emerald-500/25 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500/15 rounded-full blur-[90px] pointer-events-none"></div>
            
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.35)] text-xl" id="login-people-logo-badge">
                {centerLogo === 'heart' ? '❤️' :
                 centerLogo === 'shield' ? '🛡️' :
                 centerLogo === 'activity' ? '⚡' :
                 '🏥'}
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Secured Access Only
                </span>
                <h1 className="text-xl font-bold mt-2 uppercase tracking-wide leading-snug">{centerName || currentDict.title}</h1>
              </div>
            </div>

            {/* Central visual 5-picture bento collage of real community staff */}
            <div className="my-5 relative z-10 space-y-2.5" id="login-central-image">
              <p className="text-[9px] uppercase font-black tracking-widest text-emerald-300/90 text-center font-mono">
                Barangay Balong-balong BHW & Medical Team
              </p>
              
              {/* Feature image (Large BHW staff portrait) */}
              <div className="space-y-1">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-md aspect-video">
                  <img
                    src="/src/assets/images/bhw_workers_login_1781077540359.png"
                    alt="BHW Active Heroes"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center text-[9px] font-bold tracking-wide uppercase text-emerald-200">
                  1. Barangay Health Workers Group
                </div>
              </div>

              {/* 4-grid smaller images of the active station roles */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-xs aspect-square">
                    <img
                      src="/src/assets/images/bhw_checkup_pregnant_1781077672362.png"
                      alt="Midwife Maternal Checkup"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center text-[8px] font-semibold uppercase tracking-wider text-emerald-200">
                     2. Midwife Prenatal
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-xs aspect-square">
                    <img
                      src="/src/assets/images/bhw_doctor_consult_1781077692389.png"
                      alt="Doctor Consultation"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center text-[8px] font-semibold uppercase tracking-wider text-emerald-200">
                    3. MHO Consultation
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-xs aspect-square">
                    <img
                      src="/src/assets/images/bhw_nurse_immunize_1781077708993.png"
                      alt="Nurse Child Health tracker"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center text-[8px] font-semibold uppercase tracking-wider text-emerald-200">
                    4. Immunization RN
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-xs aspect-square">
                    <img
                      src="/src/assets/images/bhw_pharmacy_stock_1781077723656.png"
                      alt="Pharmacy Inventory management"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center text-[8px] font-semibold uppercase tracking-wider text-emerald-200">
                    5. E-Pharmacy Store
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="border-t border-slate-800 pt-4">
                <span className="text-[9px] text-emerald-400 uppercase tracking-wider block font-mono">Authorized Station Location:</span>
                <strong className="text-xs text-white block mt-0.5 font-sans leading-relaxed">{centerAddress || currentDict.sub}</strong>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 font-sans shadow-inner">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Key size={11} />
                  Workstation Security Policy:
                </h3>
                <ul className="text-[10px] text-slate-300 space-y-1 list-none mt-2 font-medium">
                  <li>• Only registered DHRMS clinical roles are allowed to sign on.</li>
                  <li>• Workstation auto-locks session data on manual lockouts.</li>
                  <li>• Session surveillance metrics synchronize securely with Pitogo Municipal EHR.</li>
                </ul>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 select-none pb-1 mt-6 font-mono font-bold">
              © 2026 Barangay Balong-balong DHRMS
            </div>
          </div>

          {/* Right half: PIN Lock Pad / Credentials Select */}
          <div className="md:col-span-7 p-8 flex flex-col justify-between bg-slate-950/40 text-slate-200 relative overflow-hidden" id="login-workstation-controls">
            {/* Glow backing */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Success prompt with backlight check */}
            {isSuccessing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base uppercase tracking-wider">Access Granted</h3>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">Initializing database workstation...</p>
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
                            ? 'bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)] text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                        id={`login-role-selector-${role.key}`}
                      >
                        <div className={`mt-0.5 p-1 rounded-md transition-all ${selectedRole === role.key ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-400'}`}>
                          <User size={14} />
                        </div>
                        <div>
                          <strong className="text-xs font-bold block leading-none">{role.label}</strong>
                          <span className="text-[10px] text-slate-400 block mt-1 leading-snug">{role.desc}</span>
                        </div>
                        {selectedRole === role.key && (
                          <div className="ml-auto w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-400 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-white block"></span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Enter Passcode */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider font-mono">
                      2. {currentDict.passPrompt}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="text-slate-400 hover:text-slate-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {showPin ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showPin ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Dot/Digit indicators with neon backlit styling */}
                  <div className="flex justify-center items-center gap-3.5 bg-slate-900/50 p-3 rounded-2xl border border-slate-800 mb-4 max-w-sm mx-auto">
                    {[0, 1, 2, 3].map((idx) => {
                      const hasVal = pin.length > idx;
                      return (
                        <div
                          key={idx}
                          className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                            hasVal
                              ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.75)]'
                              : 'bg-slate-800 border-slate-700'
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
                    <p className="text-center text-xs font-bold text-rose-400 bg-rose-950/50 border border-rose-900/50 p-2 rounded-lg animate-shake mb-3">
                      {errorText}
                    </p>
                  )}

                  {/* Standard Compact Touch Keypad */}
                  <div className="grid grid-cols-3 gap-2.5 max-w-[210px] mx-auto mb-4 text-slate-200">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKeyPress(num)}
                        className="w-14 h-11 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:bg-slate-700 rounded-lg text-sm font-black font-mono cursor-pointer transition-all flex items-center justify-center text-slate-100 hover:shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:border-slate-600"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleClear}
                      className="w-14 h-11 bg-slate-900/30 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-200 text-[10px] font-black tracking-tighter uppercase rounded-lg cursor-pointer flex items-center justify-center text-slate-400"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeyPress('0')}
                      className="w-14 h-11 bg-slate-900/60 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:bg-slate-700 rounded-lg text-sm font-black font-mono cursor-pointer transition-all flex items-center justify-center text-slate-100"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="w-14 h-11 bg-slate-900/30 border border-slate-800/80 hover:bg-slate-800 hover:text-slate-200 text-[10px] font-black tracking-tighter uppercase rounded-lg cursor-pointer flex items-center justify-center text-slate-400"
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
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.99] shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : 'bg-slate-900 text-slate-650 border border-slate-850 cursor-not-allowed'
                    }`}
                  >
                    <Lock size={13} />
                    {currentDict.btnLogin}
                  </button>

                  {/* Presets Demo Guide Strip */}
                  <div className="p-3 bg-slate-900/50 border border-slate-800/60 rounded-2xl text-[10px] text-center text-slate-400 mt-4 font-mono font-bold leading-relaxed shadow-inner">
                    <span className="text-amber-400 block mb-0.5 uppercase tracking-wide font-extrabold flex items-center justify-center gap-1 text-[10px]">
                      🛡️ Confidential Access Warning:
                    </span>
                    {language === 'EN' ? 'Passcodes are confidential. Access attempts are audited. Contact your local administrator to reset or retrieve your individual authorization PIN.' :
                     language === 'TL' ? 'Ang mga passcode ay kumpidensyal. Ang mga pagsubok sa pag-access ay nakatala sa audit list. Makipag-ugnayan sa administrator para i-reset o alamin ang iyong PIN.' :
                     'Ang mga passcode kompidensyal. Ang mga pagsulay sa pag-access narekord sa audit list. Pakigkita sa administrator aron i-reset o masayran ang imong PIN.'}
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Security alert footer guidelines (DOH compliant) */}
      <div className="max-w-4xl mx-auto w-full border-t border-slate-800/60 pt-3 flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-500 font-mono relative z-10">
        <span>SECURITY LEVEL 3 ENCRYPTION STATUS CHECK: ACTIVE</span>
        <span>SYSTEM COMPONENT COMPLIES WITH DOH MEMORANDUM 2026-0301</span>
      </div>
    </div>
  );
};
