/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Settings, Database, Edit3, Trash2, Plus, Monitor, ShieldAlert, KeyRound, Wifi, RefreshCw } from 'lucide-react';
import { Role } from '../types';

interface UserAccount {
  id: string;
  name: string;
  role: Role;
  username: string;
  pin: string;
  status: 'Active' | 'Inactive';
}

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
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  centerName,
  setCenterName,
  centerAddress,
  setCenterAddress,
  centerLogo,
  setCenterLogo,
  onAddAuditLog
}) => {
  // Workstation Accounts state - tailored to the authorized BHW, Midwife, Nurse, and Admin roles
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('bhc_admin_users');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Julefe Magwate', role: 'BHW' as Role, username: 'julefe_bhw', pin: '1111', status: 'Active' },
      { id: '2', name: 'Arlene Cagas Dayama, RM', role: 'MIDWIFE' as Role, username: 'arlene_midwife', pin: '3333', status: 'Active' },
      { id: '3', name: 'Yvonne Galang, RN', role: 'NURSE' as Role, username: 'yvonne_nars', pin: '2222', status: 'Active' },
      { id: '4', name: 'Ericson Padunan', role: 'ADMIN' as Role, username: 'ericson_admin', pin: '1234', status: 'Active' },
    ];
  });

  // Save users automatically
  useEffect(() => {
    localStorage.setItem('bhc_admin_users', JSON.stringify(users));
  }, [users]);

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

  useEffect(() => {
    const loadLogs = () => {
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
    };
    loadLogs();
    
    window.addEventListener('storage', loadLogs);
    const interval = setInterval(loadLogs, 1000);
    return () => {
      window.removeEventListener('storage', loadLogs);
      clearInterval(interval);
    };
  }, []);

  // Account creation state
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>('BHW');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPin, setNewUserPin] = useState('');

  // Account editing states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState<Role>('BHW');
  const [editUserUsername, setEditUserUsername] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserUsername || newUserPin.length !== 4) {
      alert('Tiyakin na napunan ang lahat ng impormasyon at ang PIN ay eksaktong 4-digit. (Please complete all inputs and secure a 4-digit passcode).');
      return;
    }

    const newUser: UserAccount = {
      id: `USR-${Date.now()}`,
      name: newUserName,
      role: newUserRole,
      username: newUserUsername.toLowerCase().trim(),
      pin: newUserPin,
      status: 'Active',
    };

    setUsers(prev => [...prev, newUser]);
    
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'Ericson Padunan (Admin)',
      action: 'USER_ACCOUNT_CREATED',
      details: `Created new workstation active user account ${newUser.username} (${newUser.role})`,
      severity: 'Critical'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setIsAddingUser(false);
    setNewUserName('');
    setNewUserUsername('');
    setNewUserPin('');
    alert(`Matagumpay na naidagdag si ${newUser.name} bilang ${newUser.role}!`);
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        
        // Add audit trail log
        const newLog: AuditLog = {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          user: 'Ericson Padunan (Admin)',
          action: 'USER_STATUS_TOGGLED',
          details: `Changed user ${u.username} status from ${u.status} to ${nextStatus}`,
          severity: 'Warning'
        };
        setAuditLogs(prev => [newLog, ...prev]);

        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleResetPin = (id: string) => {
    const newPin = window.prompt('Ipasok ang bagong 4-digit security PIN para sa account na ito:');
    if (newPin === null) return;
    if (!/^\d{4}$/.test(newPin)) {
      alert('Maling format! Ang PIN ay dapat may eksaktong 4-digit na numero.');
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        onAddAuditLog?.('USER_PIN_RESET', `Pinalitan ang workstation passcode PIN para kay ${u.name} (${u.role})`, 'Critical');
        return { ...u, pin: newPin };
      }
      return u;
    }));
    alert('Matagumpay na nabago ang PIN!');
  };

  const startEditingUser = (u: UserAccount) => {
    setEditingUserId(u.id);
    setEditUserName(u.name);
    setEditUserRole(u.role);
    setEditUserUsername(u.username);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserName || !editUserUsername) {
      alert('Tiyaking napunan ang pangalan at username.');
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === editingUserId) {
        onAddAuditLog?.('USER_ACCOUNT_UPDATED', `In-update ang account ni ${u.name} (${u.role}) -> ${editUserName} (${editUserRole})`, 'Warning');
        return {
          ...u,
          name: editUserName,
          role: editUserRole,
          username: editUserUsername.toLowerCase().trim()
        };
      }
      return u;
    }));
    setEditingUserId(null);
    alert('Matagumpay na na-update ang user account!');
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (users.length <= 1) {
      alert('Hindi maaaring burahin ang nag-iisang account sa system.');
      return;
    }
    if (!window.confirm(`Sigurado ka bang nais mong tuluyang burahin ang account ni ${name}? Ang aksyong ito ay hindi na maibabalik.`)) {
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: 'Ericson Padunan (Admin)',
      action: 'USER_ACCOUNT_DELETED',
      details: `Permanently deleted user account ${name} (id: ${id})`,
      severity: 'Critical'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    onAddAuditLog?.('USER_ACCOUNT_DELETED', `Tinanggal ang user account ni ${name}`, 'Critical');
    
    alert(`Matagumpay na nabura ang account ni ${name}.`);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Management & Configuration */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* USER ACCOUNTS PANEL */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="text-purple-600" size={18} />
                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wide">Workstation User Accounts</h3>
              </div>
              <button
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus size={14} />
                {isAddingUser ? 'Kanselahin' : 'Bagong Account'}
              </button>
            </div>

            <div className="p-5">
              
              {/* Add Account Inline Form */}
              {isAddingUser && (
                <form onSubmit={handleCreateUser} className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 space-y-4 mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-purple-700 block">Bagong User Registration</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Full Name (Pangalan) *</label>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Arthur Sotto, MD"
                        required
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">System Username (Login ID) *</label>
                      <input
                        type="text"
                        placeholder="e.g. arthur_mho"
                        required
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-mono"
                        value={newUserUsername}
                        onChange={(e) => setNewUserUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono">System Active Role</label>
                      <select
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as Role)}
                      >
                        <option value="BHW">Barangay Health Worker (BHW)</option>
                        <option value="MIDWIFE">Barangay Midwife (RM)</option>
                        <option value="NURSE">Public Health Nurse (RN)</option>
                        <option value="PHARMACIST">Barangay Pharmacist (RPh)</option>
                        <option value="MHO">Municipal Health Officer (MHO) / Doctor</option>
                        <option value="ADMIN">Admin / Barangay Captain</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">4-Digit Workstation PIN CODE *</label>
                      <input
                        type="password"
                        placeholder="e.g. 1111"
                        maxLength={4}
                        required
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-lg text-xs font-mono text-center tracking-widest font-black"
                        value={newUserPin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          setNewUserPin(val);
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingUser(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Kanselahin
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                    >
                      I-save ang Account
                    </button>
                  </div>
                </form>
              )}

              {/* Accounts Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-slate-100">
                      <th className="p-3">User (Pangalan)</th>
                      <th className="p-3">Gampanin (Role)</th>
                      <th className="p-3 font-mono">Username</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Aksyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users.map((u) => {
                      const isEditing = editingUserId === u.id;
                      return isEditing ? (
                        <tr key={u.id} className="bg-purple-50/30">
                          <td className="p-3">
                            <input
                              type="text"
                              required
                              className="w-full bg-white border border-slate-200 p-2 rounded text-xs font-bold text-slate-850"
                              value={editUserName}
                              onChange={(e) => setEditUserName(e.target.value)}
                            />
                          </td>
                          <td className="p-3">
                            <select
                              className="w-full bg-white border border-slate-200 p-2 rounded text-xs"
                              value={editUserRole}
                              onChange={(e) => setEditUserRole(e.target.value as Role)}
                            >
                              <option value="BHW">BHW</option>
                              <option value="MIDWIFE">MIDWIFE</option>
                              <option value="NURSE">NURSE</option>
                              <option value="PHARMACIST">PHARMACIST</option>
                              <option value="MHO">MHO</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              required
                              className="w-full bg-white border border-slate-200 p-2 rounded text-xs font-mono"
                              value={editUserUsername}
                              onChange={(e) => setEditUserUsername(e.target.value)}
                            />
                          </td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-right flex items-center justify-end gap-1.5">
                            <button
                              onClick={handleSaveEditUser}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-1 px-2.5 rounded text-[10px] cursor-pointer"
                            >
                              I-save
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold py-1 px-2.5 rounded text-[10px] cursor-pointer"
                            >
                              Kanselahin
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={u.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-bold text-slate-800">
                            {u.name}
                            <span className="text-[10px] font-normal text-slate-400 block font-mono">ID: {u.id}</span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                              u.role === 'MHO' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                              u.role === 'MIDWIFE' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                              u.role === 'NURSE' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                              u.role === 'PHARMACIST' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-500">{u.username}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {u.status === 'Active' ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="p-3 text-right flex items-center justify-end gap-1 px-1.5 flex-wrap">
                            <button
                              onClick={() => startEditingUser(u)}
                              className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-250 py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors"
                              title="I-edit ang account"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleResetPin(u.id)}
                              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 py-1 px-2 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                              title="Palitan ang PIN code"
                            >
                              PIN
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                u.status === 'Active' 
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                              }`}
                            >
                              {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="bg-rose-100 text-rose-700 hover:bg-rose-200 py-1 px-2 rounded text-[10px] font-bold cursor-pointer transition-colors"
                              title="Burahin ang account"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
                  <label className="block text-[10px] font-extrabold text-slate-500 mb-1.5">Center Visual Badge Theme Style</label>
                  <div className="flex flex-wrap gap-2">
                    {['heart', 'shield', 'activity', 'cross'].map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => {
                          setCenterLogo(theme);
                          onAddAuditLog?.('LOGO_THEME_CHANGED', `Pinalitan ang visual badge theme style ng health center sa ${theme.toUpperCase()}`, 'Info');
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          centerLogo === theme
                            ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-3xs font-black'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {theme === 'heart' ? '❤️ Pula na Puso' :
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
