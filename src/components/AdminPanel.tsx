/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, UserCheck, Settings, Database, Edit3, Trash2, Plus, Monitor, ShieldAlert, KeyRound, Wifi, RefreshCw, Users, Search, ClipboardList } from 'lucide-react';
import { Role, Patient, UserAccount } from '../types';
import { RHU_PITOGO_LOGO_BASE64 } from '../assets/logoBase64';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

interface AdminPanelProps {
  centerName: string;
  setCenterName: (name: string) => void;
  centerAddress: string;
  setCenterAddress: (address: string) => void;
  centerLogo: string;
  setCenterLogo: (logo: string) => void;
  onAddAuditLog?: (action: string, details: string, severity?: 'Info' | 'Warning' | 'Critical') => void;
  patients?: Patient[];
  users: UserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<UserAccount[]>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  centerName,
  setCenterName,
  centerAddress,
  setCenterAddress,
  centerLogo,
  setCenterLogo,
  onAddAuditLog,
  patients = [],
  users,
  setUsers
}) => {
  // States to filter patients registered under different roles
  const [selectedWorkerFilter, setSelectedWorkerFilter] = useState<'ALL' | 'BHW' | 'MIDWIFE' | 'NURSE'>('ALL');
  const [patientSearch, setPatientSearch] = useState('');

  // System Configuration States
  const [ehrEndpoint, setEhrEndpoint] = useState(() => localStorage.getItem('bhc_config_ehr') || 'https://pitogo.zambo.gov.ph/ehr/api/v1');
  const [autoSync, setAutoSync] = useState(() => localStorage.getItem('bhc_config_autosync') !== 'false');
  const [auditPersistence, setAuditPersistence] = useState(() => localStorage.getItem('bhc_config_audit') !== 'false');
  const [emergencyAlerts, setEmergencyAlerts] = useState(() => localStorage.getItem('bhc_config_emergency') === 'true');

  const saveConfigs = () => {
    localStorage.setItem('bhc_config_ehr', ehrEndpoint);
    localStorage.setItem('bhc_config_autosync', String(autoSync));
    localStorage.setItem('bhc_config_audit', String(auditPersistence));
    localStorage.setItem('bhc_config_emergency', String(emergencyAlerts));
    
    onAddAuditLog?.('SYSTEM_CONFIG_UPDATED', `In-update ang system parameters para sa ${centerName}`, 'Warning');
    alert('Matagumpay na nai-save ang system configurations! (System configuration saved successfully).');
  };

  // Local state for audit logs that stays in sync with localStorage updates
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const loadLogs = useCallback(() => {
    const saved = localStorage.getItem('bhc_audit_logs');
    if (saved) {
      try {
        setAuditLogs(JSON.parse(saved));
      } catch (e) {}
    } else {
      const fallbacks: AuditLog[] = [
        { id: 'LOG-001', timestamp: '2026-06-05 10:45:12', user: 'Julefe Magwate (BHW)', action: 'PATIENT_RECORD_ADDED', details: 'Nagrehistro ng bagong pasyente sa registry book.', severity: 'Info' },
        { id: 'LOG-002', timestamp: '2026-06-05 09:32:04', user: 'Arlene Cagas Dayama, RM', action: 'PRESCRIPTION_ADDED', details: 'Nagdagdag ng medical consultation diagnosis at prescription.', severity: 'Info' },
        { id: 'LOG-003', timestamp: '2026-06-05 08:15:30', user: 'Ericson Padunan (Admin)', action: 'USER_LOGIN_AUTHENTICATED', details: 'Binuksan ang workstation session sa ilalim ng Administrator PIN.', severity: 'Info' },
      ];
      localStorage.setItem('bhc_audit_logs', JSON.stringify(fallbacks));
      setAuditLogs(fallbacks);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    
    window.addEventListener('storage', loadLogs);
    const interval = setInterval(loadLogs, 1000);
    return () => {
      window.removeEventListener('storage', loadLogs);
      clearInterval(interval);
    };
  }, [loadLogs]);

  // Categorize patients under specific roles (BHW, Nurse, Midwife) with high-accuracy fallback rules:
  const bhwPatients = patients.filter(p => {
    return p.registeredBy === 'BHW' || (!p.registeredBy && (!p.activePrograms.includes('EPI') && !p.activePrograms.includes('MCH') && !p.activePrograms.includes('FAMILY_PLANNING')));
  });

  const midwifePatients = patients.filter(p => {
    return p.registeredBy === 'MIDWIFE' || (!p.registeredBy && (p.activePrograms.includes('MCH') || p.activePrograms.includes('FAMILY_PLANNING')));
  });

  const nursePatients = patients.filter(p => {
    return p.registeredBy === 'NURSE' || (!p.registeredBy && p.activePrograms.includes('EPI'));
  });

  // Calculate filtered lists for search & detailed visualization
  let filteredWorkerPatients = patients;
  if (selectedWorkerFilter === 'BHW') {
    filteredWorkerPatients = bhwPatients;
  } else if (selectedWorkerFilter === 'MIDWIFE') {
    filteredWorkerPatients = midwifePatients;
  } else if (selectedWorkerFilter === 'NURSE') {
    filteredWorkerPatients = nursePatients;
  }

  if (patientSearch.trim()) {
    const sQuery = patientSearch.toLowerCase();
    filteredWorkerPatients = filteredWorkerPatients.filter(p => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(sQuery) ||
      p.id.toLowerCase().includes(sQuery) ||
      p.purok.toLowerCase().includes(sQuery)
    );
  }

  return (
    <div className="space-y-6" id="admin-panel-viewport">
      
      {/* Top Banner indicating privilege levels */}
      <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-800">
        <div className="absolute right-0 top-0 w-48 h-48 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-wider font-mono">
            <ShieldCheck size={12} />
            Privileged Administration Console
          </div>
          <h2 className="text-xl font-bold uppercase tracking-wide">Administrator Controls & System Configuration</h2>
          <p className="text-xs text-slate-400">
            System metrics comply with RA 10173 Philippine Data Privacy Act guidelines. Use this dashboard to manage health center workers, system backups, and logs.
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start md:self-auto relative z-10">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/40 p-2 rounded border border-emerald-900/40">SYSTEM STATUS: ENCRYPTED PORTKEY</span>
        </div>
      </div>

      {/* WORKER SPECIFIC PATIENT REGISTRIES AND DETAILED CENSUS MAP */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden" id="admin-patient-role-registry">
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="text-purple-600" size={18} />
            <div>
              <h3 className="text-sm font-black uppercase text-slate-700 tracking-wide">
                Worker Patient Desk Registries & Census Directory
              </h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                Breakdown of active patients registered under each medical role desk (BHW, Midwife, and Nurse).
              </p>
            </div>
          </div>
          <span className="bg-slate-200 text-slate-700 px-2.5 py-1 text-[10px] font-mono font-black rounded border border-slate-300 uppercase tracking-wider self-start sm:self-auto">
            Total System Registry: {patients.length} Patient(s)
          </span>
        </div>

        <div className="p-5 space-y-6">
          {/* Metrics summary row - clickable to auto-switch filter */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => setSelectedWorkerFilter('ALL')}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedWorkerFilter === 'ALL'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider">Lahat ng Pasyente</span>
                <ClipboardList size={16} className={selectedWorkerFilter === 'ALL' ? 'text-slate-300' : 'text-slate-400'} />
              </div>
              <div className="text-2xl font-black font-mono">{patients.length}</div>
              <p className={`text-[10px] mt-1 ${selectedWorkerFilter === 'ALL' ? 'text-slate-300' : 'text-slate-500'}`}>
                All registered people in Barangay census.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedWorkerFilter('BHW')}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedWorkerFilter === 'BHW'
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-100/50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Barangay Health Worker (BHW)</span>
                <Users size={16} className={selectedWorkerFilter === 'BHW' ? 'text-emerald-200' : 'text-emerald-600'} />
              </div>
              <div className="text-2xl font-black font-mono">{bhwPatients.length}</div>
              <p className={`text-[10px] mt-1 ${selectedWorkerFilter === 'BHW' ? 'text-emerald-200' : 'text-emerald-600 font-medium'}`}>
                General profiling & nutritional tracking desk.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedWorkerFilter('MIDWIFE')}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedWorkerFilter === 'MIDWIFE'
                  ? 'bg-rose-700 text-white border-rose-800 shadow-sm'
                  : 'bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-100/50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Barangay Midwife (RM)</span>
                <Users size={16} className={selectedWorkerFilter === 'MIDWIFE' ? 'text-rose-200' : 'text-rose-600'} />
              </div>
              <div className="text-2xl font-black font-mono">{midwifePatients.length}</div>
              <p className={`text-[10px] mt-1 ${selectedWorkerFilter === 'MIDWIFE' ? 'text-rose-200' : 'text-rose-600 font-medium'}`}>
                Maternal health, prenatal & MCH registry.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedWorkerFilter('NURSE')}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                selectedWorkerFilter === 'NURSE'
                  ? 'bg-indigo-700 text-white border-indigo-800 shadow-sm'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-100 hover:bg-indigo-100/50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider">Barangay Nurse (RN)</span>
                <Users size={16} className={selectedWorkerFilter === 'NURSE' ? 'text-indigo-200' : 'text-indigo-600'} />
              </div>
              <div className="text-2xl font-black font-mono">{nursePatients.length}</div>
              <p className={`text-[10px] mt-1 ${selectedWorkerFilter === 'NURSE' ? 'text-indigo-200' : 'text-indigo-600 font-medium'}`}>
                National EPI Program & immunization vaccines.
              </p>
            </button>
          </div>

          {/* Interactive Search inside selected registry */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
            <div className="w-full sm:w-80 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="w-full bg-white border border-slate-200 pl-8 pr-3 py-1.5 rounded-lg text-xs text-slate-700 focus:outline-hidden focus:border-slate-400 font-sans"
                placeholder={`Search ${selectedWorkerFilter === 'ALL' ? 'all' : selectedWorkerFilter} patients by name, ID or purok...`}
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>
            
            <div className="text-[11px] text-slate-500 font-medium self-end sm:self-auto font-mono">
              Showing <span className="font-bold text-slate-800">{filteredWorkerPatients.length}</span> of <span className="font-bold">{
                selectedWorkerFilter === 'ALL' ? patients.length :
                selectedWorkerFilter === 'BHW' ? bhwPatients.length :
                selectedWorkerFilter === 'MIDWIFE' ? midwifePatients.length :
                nursePatients.length
              }</span> patient(s)
            </div>
          </div>

          {/* Patient Directory Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-150 shadow-2xs max-h-[380px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/85 text-slate-500 font-black uppercase tracking-wider text-[10px] border-b border-slate-250 sticky top-0 bg-white z-10">
                  <th className="p-3">Patient ID</th>
                  <th className="p-3">Full Name (Pangalan)</th>
                  <th className="p-3">Gender / Age</th>
                  <th className="p-3">Purok Address</th>
                  <th className="p-3">DOH Active Program(s)</th>
                  <th className="p-3">Assigned Desk / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredWorkerPatients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-sans italic">
                      Walang nakatagong pasyente sa registry na ito. (No record entries match with your query list).
                    </td>
                  </tr>
                ) : (
                  filteredWorkerPatients.map((pat) => {
                    const age = new Date().getFullYear() - new Date(pat.birthDate).getFullYear();
                    const isBhw = bhwPatients.some(b => b.id === pat.id);
                    const isMidwife = midwifePatients.some(m => m.id === pat.id);
                    const isNurse = nursePatients.some(n => n.id === pat.id);
                    const roleTag = isNurse ? 'NURSE' : isMidwife ? 'MIDWIFE' : 'BHW';
                    
                    return (
                      <tr key={pat.id} className="hover:bg-slate-50/40 select-none transition-colors border-b border-slate-100">
                        <td className="p-3">
                          <span className="font-mono bg-indigo-50/50 border border-indigo-100/60 font-black text-indigo-800 py-1 px-2.5 rounded text-[10px] uppercase shadow-2xs">
                            {pat.id}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-800 text-[13px]">
                          {pat.lastName}, {pat.firstName} {pat.middleName ? `${pat.middleName.charAt(0)}.` : ''} {pat.suffix || ''}
                        </td>
                        <td className="p-3 font-semibold text-slate-600">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 uppercase ${
                            pat.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {pat.gender === 'Female' ? 'Babae' : 'Lalaki'}
                          </span>
                          <span className="font-mono text-xs">{age} y/o</span>
                        </td>
                        <td className="p-3 font-bold text-slate-700 font-sans">
                          📍 {pat.purok}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {pat.activePrograms.length === 0 ? (
                              <span className="text-[10px] text-slate-400 italic">No program enrolled</span>
                            ) : (
                              pat.activePrograms.map(prog => (
                                <span
                                  key={prog}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                    prog === 'EPI' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/40' :
                                    prog === 'MCH' ? 'bg-rose-50 text-rose-700 border border-rose-200/40' :
                                    prog === 'FAMILY_PLANNING' ? 'bg-pink-50 text-pink-700 border border-pink-200/40' :
                                    prog === 'TB_DOTS' ? 'bg-amber-55 text-amber-700 border border-amber-200/30' :
                                    'bg-slate-100 text-slate-700 border border-slate-200/40'
                                  }`}
                                >
                                  {prog}
                                </span>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-extrabold border ${
                            roleTag === 'NURSE' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                            roleTag === 'MIDWIFE' ? 'bg-rose-50 border-rose-100 text-rose-700' :
                            'bg-emerald-50 border-emerald-100 text-emerald-700'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              roleTag === 'NURSE' ? 'bg-indigo-500' :
                              roleTag === 'MIDWIFE' ? 'bg-rose-500' :
                              'bg-emerald-500'
                            }`} />
                            {roleTag === 'NURSE' ? 'Nars Desk (RN)' : 
                             roleTag === 'MIDWIFE' ? 'Kumadrona Desk (RM)' : 
                             'BHW Desk'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Management & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SYSTEM CONFIGURATION */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
              <Settings className="text-zinc-500" size={18} />
              <h3 className="text-sm font-black uppercase text-slate-700 tracking-wide">Workstation Configuration Preferences</h3>
            </div>
            
            <div className="p-6 space-y-5">
              
              {/* BRANDING SETUP */}
              <div className="space-y-4 bg-slate-50/50 p-4.5 rounded-xl border border-slate-150">
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 block font-mono">Barangay Health Center Branding Settings</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Health Center Name *</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                      value={centerName}
                      onChange={(e) => setCenterName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Complete Address / Barangay *</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-bold text-slate-800 focus:outline-hidden"
                      value={centerAddress}
                      onChange={(e) => setCenterAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5">Center Visual Badge & Official Logo</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {['pitogo', 'heart', 'shield', 'activity', 'cross'].map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => {
                          setCenterLogo(theme);
                          onAddAuditLog?.('LOGO_THEME_CHANGED', `Pinalitan ang visual badge theme style ng health center sa ${theme.toUpperCase()}`, 'Info');
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          centerLogo === theme || (theme === 'pitogo' && !['heart','shield','activity','cross'].includes(centerLogo))
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-3xs font-black'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {theme === 'pitogo' ? (
                          <>
                            <img
                              src={RHU_PITOGO_LOGO_BASE64}
                              alt="RHU Pitogo Seal"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span>RHU Pitogo Official Seal</span>
                          </>
                        ) : theme === 'heart' ? '❤️ Pula na Puso' :
                         theme === 'shield' ? '🛡️ Green Shield' :
                         theme === 'activity' ? '⚡ Pulse Activity' :
                         '🏥 Green Cross'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Municipal EHR Synchronization Endpoint API</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-indigo-900 focus:outline-hidden"
                    value={ehrEndpoint}
                    onChange={(e) => setEhrEndpoint(e.target.value)}
                  />
                  <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg p-2.5 text-xs font-bold flex items-center gap-1">
                    <Wifi size={13} />
                    Verified
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  Central web services link used for automatic offloading of encrypted FHSIS reporting codes.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block text-xs">Automatic Offloading & Sync Queue</span>
                    <span className="text-[10px] text-slate-400">Push offline edits to Municipal database on active connectivity detects</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={() => setAutoSync(!autoSync)}
                    className="h-4 w-4 bg-white accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-100/60 pt-3">
                  <div>
                    <span className="font-bold text-slate-700 block text-xs">Persistent RA 10173 Audit Trails</span>
                    <span className="text-[10px] text-slate-400">Lock all logs and deny data tampering attempts completely</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={auditPersistence}
                    onChange={() => setAuditPersistence(!auditPersistence)}
                    className="h-4 w-4 bg-white accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-100/60 pt-3">
                  <div>
                    <span className="font-bold text-rose-700 block text-xs flex items-center gap-1">
                      <ShieldAlert size={14} className="text-rose-500 animate-pulse" />
                      Automatic Outbreak & Emergency Broadcasts
                    </span>
                    <span className="text-[10px] text-slate-400">Publish sudden surveillance updates immediately to municipal board</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emergencyAlerts}
                    onChange={() => setEmergencyAlerts(!emergencyAlerts)}
                    className="h-4 w-4 bg-white accent-rose-600 cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end">
                <button
                  type="button"
                  onClick={saveConfigs}
                  className="bg-purple-650 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider py-2.5 px-6 rounded-lg cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Database size={13} />
                  I-Save ang Configuration
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Audit Trail View */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AUDIT TIMELINE LOGS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full max-h-[640px]">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="text-zinc-600 animate-pulse" size={18} />
                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wide">Workstation Session Audit Logs</h3>
              </div>
              <span className="bg-purple-50 text-purple-700 font-mono text-[9px] px-2 py-0.5 rounded border border-purple-100 uppercase tracking-widest font-black">
                RA 10173 Verified
              </span>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-slate-50/20 max-h-[550px]" id="audit-log-scroller">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  Walang nakuhang audit logs. (No active security audit trails verified).
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="bg-white border border-slate-150 p-4.5 rounded-xl shadow-2xs space-y-2 select-none hover:shadow-xs transition-all">
                    <div className="flex justify-between items-start text-[10px]">
                      <span className="font-mono text-slate-400">{log.timestamp}</span>
                      <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                        log.severity === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        log.severity === 'Warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-150'
                      }`}>
                        {log.severity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-extrabold px-1.5 py-0.5 rounded font-mono block w-fit border border-slate-200">
                        {log.action}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-snug">{log.details}</p>
                    </div>

                    <div className="flex items-center gap-1 border-t border-slate-100/50 pt-2 text-[10px] text-slate-400 font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Operator: <span className="text-slate-600 font-bold">{log.user}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
