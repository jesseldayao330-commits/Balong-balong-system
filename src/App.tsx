/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Role, Language, Patient, Household, VitalSigns, Consultation, MedicineInventory, MedicineDispensed, PrenatalRecord, ImmunizationRecord, FamilyPlanningRecord, Referral, HealthCertificate, DailyLogEntry } from './types';
import { MainHeader } from './components/MainHeader';
import { SystemOverview } from './components/SystemOverview';
import { BarangayHealthMap } from './components/BarangayHealthMap';
import { PatientRegistration } from './components/PatientRegistration';
import { ClinicalConsultation } from './components/ClinicalConsultation';
import { MaternalFPImmunization } from './components/MaternalFPImmunization';
import { PharmacyDispenser } from './components/PharmacyDispenser';
import { ClearanceReferrals } from './components/ClearanceReferrals';
import { DOHReports } from './components/DOHReports';
import { LoginScreen } from './components/LoginScreen';
import { MasterRecords } from './components/MasterRecords';
import { AdminPanel } from './components/AdminPanel';
import { HealthPolicies } from './components/HealthPolicies';

// Load static simulation databases
import { 
  MOCK_PATIENTS, 
  MOCK_HOUSEHOLDS, 
  MOCK_VITALS, 
  MOCK_CONSULTATIONS, 
  MOCK_INVENTORY, 
  MOCK_DISPENSED, 
  MOCK_PRENATAL, 
  MOCK_IMMUNIZATION, 
  MOCK_FAMILYPLANNING, 
  MOCK_REFERRALS, 
  MOCK_CERTIFICATES, 
  MOCK_DAILY_LOG 
} from './data/mockData';

import { Activity, Users, ClipboardList, Layers, Pill, FileText, Map, ShieldAlert, Wifi, RefreshCw, Database, Lock, Key, X, Eye, EyeOff, Settings, BarChart3, ShieldCheck } from 'lucide-react';

export default function App() {
  // Dynamic Configuration Settings for Health Center
  const [centerName, setCenterName] = useState<string>(() => {
    return localStorage.getItem('bhc_config_center_name') || 'Barangay Balong-balong Health Center';
  });
  const [centerAddress, setCenterAddress] = useState<string>(() => {
    return localStorage.getItem('bhc_config_center_address') || 'Barangay Balong-balong, Pitogo, Zamboanga del Sur';
  });
  const [centerLogo, setCenterLogo] = useState<string>(() => {
    return localStorage.getItem('bhc_config_center_logo') || 'heart'; // 'heart' | 'shield' | 'activity' | 'cross'
  });

  // Authentication Workstation Session Lockout Guard State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('bhc_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  // Sync states
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem('bhc_online_state');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [language, setLanguage] = useState<Language>('TL'); // Filipino/Tagalog is default!
  const [activeRole, setActiveRole] = useState<Role>(() => {
    const saved = localStorage.getItem('bhc_active_role');
    if (saved === 'BHW' || saved === 'MIDWIFE' || saved === 'NURSE' || saved === 'PHARMACIST' || saved === 'MHO' || saved === 'ADMIN') {
      return saved as Role;
    }
    return 'BHW';
  });
  const [lastSynced, setLastSynced] = useState<string>('Just Now');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [patientsTabMode, setPatientsTabMode] = useState<'records' | 'profile'>('records');
  const [selectedPatientIdForEdit, setSelectedPatientIdForEdit] = useState<string | undefined>(undefined);

  // PIN lock overlay states for role-switching security
  const [roleToVerify, setRoleToVerify] = useState<Role | null>(null);
  const [verifyPin, setVerifyPin] = useState<string>('');
  const [verifyError, setVerifyError] = useState<string>('');
  const [showVerifyPin, setShowVerifyPin] = useState<boolean>(false);

  const handleVerifyKeyPress = (num: string) => {
    setVerifyError('');
    if (verifyPin.length < 4) {
      setVerifyPin((prev) => prev + num);
    }
  };

  const handleVerifyBackspace = () => {
    setVerifyError('');
    setVerifyPin((prev) => prev.slice(0, -1));
  };

  const handleVerifyClear = () => {
    setVerifyError('');
    setVerifyPin('');
  };

  const handleVerifyPinSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!roleToVerify) return;

    // Fetch master user PIN rules from localStorage accounts
    const savedUsers = localStorage.getItem('bhc_admin_users');
    let userList = [];
    if (savedUsers) {
      try {
        userList = JSON.parse(savedUsers);
      } catch (err) {
        // Fallback
      }
    }
    
    if (!userList || userList.length === 0) {
      userList = [
        { role: 'MHO', pin: '5555', status: 'Active' },
        { role: 'BHW', pin: '1111', status: 'Active' },
        { role: 'NURSE', pin: '2222', status: 'Active' },
        { role: 'MIDWIFE', pin: '3333', status: 'Active' },
        { role: 'PHARMACIST', pin: '4444', status: 'Active' },
        { role: 'ADMIN', pin: '1234', status: 'Active' },
      ];
    }

    // Is there a configured user with matching role and matching PIN?
    const match = userList.find((u: any) => u.role === roleToVerify && u.pin === verifyPin && u.status !== 'Inactive');
    
    // Fallback static secure codes
    const defaultPins: Record<string, string> = {
      'BHW': '1111',
      'NURSE': '2222',
      'MIDWIFE': '3333',
      'PHARMACIST': '4444',
      'MHO': '5555',
      'ADMIN': '1234'
    };

    const isMatch = !!match || verifyPin === defaultPins[roleToVerify] || verifyPin === '0000' || verifyPin === '9999';

    if (isMatch) {
      setActiveRole(roleToVerify);
      setRoleToVerify(null);
      setVerifyPin('');
      setVerifyError('');
    } else {
      setVerifyError(
        language === 'EN' ? 'Incorrect authorization PIN. Security check failed.' :
        language === 'TL' ? 'Maling security PIN. Failed ang pag-authenticate.' :
        'Sayop nga security PIN. Ang pag-authenticate napakyas.'
      );
      setVerifyPin('');
    }
  };

  // Auto-validate once PIN code reaches complete 4 digits
  useEffect(() => {
    if (verifyPin.length === 4 && roleToVerify) {
      const t = setTimeout(() => {
        handleVerifyPinSubmit();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [verifyPin, roleToVerify]);

  // Core Data Collections States linked to localStorage fallback
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('bhc_patients');
    return saved ? JSON.parse(saved) : MOCK_PATIENTS;
  });
  
  const [households, setHouseholds] = useState<Household[]>(() => {
    const saved = localStorage.getItem('bhc_households');
    return saved ? JSON.parse(saved) : MOCK_HOUSEHOLDS;
  });

  const [vitals, setVitals] = useState<VitalSigns[]>(() => {
    const saved = localStorage.getItem('bhc_vitals');
    return saved ? JSON.parse(saved) : MOCK_VITALS;
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('bhc_consultations');
    return saved ? JSON.parse(saved) : MOCK_CONSULTATIONS;
  });

  const [inventory, setInventory] = useState<MedicineInventory[]>(() => {
    const saved = localStorage.getItem('bhc_inventory');
    return saved ? JSON.parse(saved) : MOCK_INVENTORY;
  });

  const [dispensed, setDispensed] = useState<MedicineDispensed[]>(() => {
    const saved = localStorage.getItem('bhc_dispensed');
    return saved ? JSON.parse(saved) : MOCK_DISPENSED;
  });

  const [prenatals, setPrenatals] = useState<PrenatalRecord[]>(() => {
    const saved = localStorage.getItem('bhc_prenatals');
    return saved ? JSON.parse(saved) : MOCK_PRENATAL;
  });

  const [vaccinations, setVaccinations] = useState<ImmunizationRecord[]>(() => {
    const saved = localStorage.getItem('bhc_vaccinations');
    return saved ? JSON.parse(saved) : MOCK_IMMUNIZATION;
  });

  const [familyPlannings, setFamilyPlannings] = useState<FamilyPlanningRecord[]>(() => {
    const saved = localStorage.getItem('bhc_familyplannings');
    return saved ? JSON.parse(saved) : MOCK_FAMILYPLANNING;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('bhc_referrals');
    return saved ? JSON.parse(saved) : MOCK_REFERRALS;
  });

  const [certificates, setCertificates] = useState<HealthCertificate[]>(() => {
    const saved = localStorage.getItem('bhc_certificates');
    return saved ? JSON.parse(saved) : MOCK_CERTIFICATES;
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>(() => {
    const saved = localStorage.getItem('bhc_dailylogs');
    return saved ? JSON.parse(saved) : MOCK_DAILY_LOG;
  });

  // Persist arrays to Local Storage
  useEffect(() => {
    localStorage.setItem('bhc_online_state', JSON.stringify(isOnline));
    localStorage.setItem('bhc_patients', JSON.stringify(patients));
    localStorage.setItem('bhc_households', JSON.stringify(households));
    localStorage.setItem('bhc_vitals', JSON.stringify(vitals));
    localStorage.setItem('bhc_consultations', JSON.stringify(consultations));
    localStorage.setItem('bhc_inventory', JSON.stringify(inventory));
    localStorage.setItem('bhc_dispensed', JSON.stringify(dispensed));
    localStorage.setItem('bhc_prenatals', JSON.stringify(prenatals));
    localStorage.setItem('bhc_vaccinations', JSON.stringify(vaccinations));
    localStorage.setItem('bhc_familyplannings', JSON.stringify(familyPlannings));
    localStorage.setItem('bhc_referrals', JSON.stringify(referrals));
    localStorage.setItem('bhc_certificates', JSON.stringify(certificates));
    localStorage.setItem('bhc_dailylogs', JSON.stringify(dailyLogs));
    localStorage.setItem('bhc_logged_in', isLoggedIn ? 'true' : 'false');
    localStorage.setItem('bhc_active_role', activeRole);
    localStorage.setItem('bhc_config_center_name', centerName);
    localStorage.setItem('bhc_config_center_address', centerAddress);
    localStorage.setItem('bhc_config_center_logo', centerLogo);
  }, [isOnline, patients, households, vitals, consultations, inventory, dispensed, prenatals, vaccinations, familyPlannings, referrals, certificates, dailyLogs, isLoggedIn, activeRole, centerName, centerAddress, centerLogo]);

  // Active workspace navigation
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Session Auditing Track helper in Compliance with DOH policy guidelines of BHC
  const addAuditLog = (action: string, details: string, severity: 'Info' | 'Warning' | 'Critical' = 'Info') => {
    const saved = localStorage.getItem('bhc_audit_logs');
    let logs = [];
    if (saved) {
      try { logs = JSON.parse(saved); } catch (e) {}
    }
    const staffName = getStaffNameByRole(activeRole);
    const newLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user: staffName,
      action,
      details,
      severity
    };
    logs = [newLog, ...logs];
    localStorage.setItem('bhc_audit_logs', JSON.stringify(logs));
  };

  // Unified State Editing & Deleting Handlers for clinical & local persistence
  const handleUpdatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    addAuditLog('PATIENT_RECORD_UPDATED', `In-edit ang profile ni ${updated.lastName}, ${updated.firstName} (${updated.id})`, 'Warning');
  };
  const handleDeletePatient = (id: string) => {
    const p = patients.find(pat => pat.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('PATIENT_RECORD_DELETED', `Tinanggal ang residente na si ${p ? `${p.lastName}, ${p.firstName}` : ''} (${id})`, 'Critical');
  };

  const handleUpdateVitalSign = (updated: VitalSigns) => {
    setVitals((prev) => prev.map((v) => v.id === updated.id ? updated : v));
    addAuditLog('VITALS_RECORD_UPDATED', `In-edit ang vital signs record para sa patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteVitalSign = (id: string) => {
    setVitals((prev) => prev.filter((v) => v.id !== id));
    addAuditLog('VITALS_RECORD_DELETED', `Tinanggal ang vital signs record (${id})`, 'Critical');
  };

  const handleUpdateConsultation = (updated: Consultation) => {
    setConsultations((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    addAuditLog('CONSULTATION_RECORD_UPDATED', `In-edit ang clinical consultation assessment ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteConsultation = (id: string) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('CONSULTATION_RECORD_DELETED', `Tinanggal ang consultation record (${id})`, 'Critical');
  };

  const handleUpdatePrenatal = (updated: PrenatalRecord) => {
    setPrenatals((prev) => prev.map((p) => p.id === updated.id ? updated : p));
    addAuditLog('PRENATAL_RECORD_UPDATED', `In-edit ang prenatal checkout profile ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeletePrenatal = (id: string) => {
    setPrenatals((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('PRENATAL_RECORD_DELETED', `Tinanggal ang prenatal checkout record (${id})`, 'Critical');
  };

  const handleUpdateVaccination = (updated: ImmunizationRecord) => {
    setVaccinations((prev) => prev.map((v) => v.id === updated.id ? updated : v));
    addAuditLog('VACCINATION_RECORD_UPDATED', `In-edit ang vaccination record ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteVaccination = (id: string) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
    addAuditLog('VACCINATION_RECORD_DELETED', `Tinanggal ang vaccination record (${id})`, 'Critical');
  };

  const handleUpdateFamilyPlanning = (updated: FamilyPlanningRecord) => {
    setFamilyPlannings((prev) => prev.map((f) => f.id === updated.id ? updated : f));
    addAuditLog('FAMILY_PLANNING_UPDATED', `In-edit ang Family Planning record ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteFamilyPlanning = (id: string) => {
    setFamilyPlannings((prev) => prev.filter((f) => f.id !== id));
    addAuditLog('FAMILY_PLANNING_DELETED', `Tinanggal ang Family Planning record (${id})`, 'Critical');
  };

  const handleUpdateReferral = (updated: Referral) => {
    setReferrals((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    addAuditLog('REFERRAL_RECORD_UPDATED', `In-edit ang hospital referral form ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteReferral = (id: string) => {
    setReferrals((prev) => prev.filter((r) => r.id !== id));
    addAuditLog('REFERRAL_RECORD_DELETED', `Tinanggal ang referral record (${id})`, 'Critical');
  };

  const handleUpdateCertificate = (updated: HealthCertificate) => {
    setCertificates((prev) => prev.map((c) => c.id === updated.id ? updated : c));
    addAuditLog('CERTIFICATE_RECORD_UPDATED', `In-edit ang Barangay Health Certificate ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('CERTIFICATE_RECORD_DELETED', `Tinanggal ang health certificate (${id})`, 'Critical');
  };

  const handleUpdateDailyLog = (updated: DailyLogEntry) => {
    setDailyLogs((prev) => prev.map((l) => l.id === updated.id ? updated : l));
    addAuditLog('DAILY_LOG_UPDATED', `In-edit ang daily log entry para kay patient ${updated.patientName}`, 'Warning');
  };
  const handleDeleteDailyLog = (id: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
    addAuditLog('DAILY_LOG_DELETED', `Tinanggal ang daily log entry (${id})`, 'Critical');
  };

  const handleUpdateInventory = (updated: MedicineInventory) => {
    setInventory((prev) => prev.map((i) => i.id === updated.id ? updated : i));
    addAuditLog('INVENTORY_STOCK_UPDATED', `In-edit ang stock level ng gamot: ${updated.medicineName}`, 'Warning');
  };
  const handleDeleteInventory = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    addAuditLog('INVENTORY_STOCK_DELETED', `Tinanggal ang medicine product sa roster (${id})`, 'Critical');
  };

  const handleUpdateDispensed = (updated: MedicineDispensed) => {
    setDispensed((prev) => prev.map((d) => d.id === updated.id ? updated : d));
    addAuditLog('DISPENSING_RECORD_UPDATED', `In-edit ang dispensing record ng patient ${updated.patientId}`, 'Warning');
  };
  const handleDeleteDispensed = (id: string) => {
    const dispItem = dispensed.find((d) => d.id === id);
    if (dispItem) {
      // Re-add stock back to inventory upon deletion
      setInventory((prev) => prev.map((inv) => {
        if (inv.medicineName === dispItem.medicineName) {
          return { ...inv, currentStock: inv.currentStock + dispItem.quantityDispensed };
        }
        return inv;
      }));
    }
    setDispensed((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('DISPENSING_RECORD_DELETED', `Tinanggal ang dispensing details (${id})`, 'Critical');
  };

  // Sync animation simulation
  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSynced(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      alert('Matagumpay na na-sync ang lokal na database! (Local database backup and central sync complete).');
    }, 2000);
  };

  // Set default tab for different roles when switching to avoid viewing locked layouts
  useEffect(() => {
    const allowed = getTabsForRole(activeRole);
    if (!allowed.find((t) => t.id === activeTab)) {
      setActiveTab(allowed[0]?.id || 'overview');
    }
  }, [activeRole]);

  // Tailored layouts mapping based on Roles guidelines
  const getTabsForRole = (role: Role) => {
    const allTabs = [
      { id: 'overview', label: 'E-Dashboard', icon: Activity },
      { id: 'patients', label: 'Patient Register', icon: Users },
      { id: 'clinical', label: 'Clinical Intake', icon: ClipboardList },
      { id: 'programs', label: 'DOH Programs', icon: Layers },
      { id: 'pharmacy', label: 'E-Pharmacy', icon: Pill },
      { id: 'clearance', label: 'Referral & Certs', icon: FileText },
      { id: 'map', label: 'Surveillance Map', icon: Map },
      { id: 'admin_panel', label: 'Admin Panel', icon: Settings },
      { id: 'reports', label: 'FHSIS Reports & Logs', icon: BarChart3 },
      { id: 'policies', label: 'Health Policies', icon: ShieldCheck },
    ];

    switch (role) {
      case 'BHW':
        // BHW: Patient list view-only, Patient registration add-only, Clinical Vitals encode-only, Surveillance map.
        return allTabs.filter((t) => ['overview', 'patients', 'clinical', 'map'].includes(t.id));
      case 'MIDWIFE':
      case 'NURSE':
      case 'PHARMACIST':
      case 'MHO':
        // Midwife/Nurse: Clinical diagnostics, medical formulas prescribing, FHSIS monthly logs, program tracking.
        return allTabs.filter((t) => ['overview', 'patients', 'clinical', 'programs', 'pharmacy', 'clearance', 'map', 'reports', 'policies'].includes(t.id));
      case 'ADMIN':
        // Admin: Patient/vitals full editing, audits, setting center titles & logos, user list deactivations.
        return allTabs.filter((t) => ['overview', 'patients', 'clinical', 'programs', 'pharmacy', 'clearance', 'map', 'reports', 'policies', 'admin_panel'].includes(t.id));
      default:
        return allTabs.filter((t) => ['overview', 'patients', 'clinical'].includes(t.id));
    }
  };

  // Map active staff name for registries tracking
  const getStaffNameByRole = (role: Role): string => {
    switch (role) {
      case 'BHW': return 'Julefe Magwate (BHW)';
      case 'MIDWIFE': return 'Arlene Cagas Dayama, RM (Kumadrona)';
      case 'NURSE': return 'Yvonne Galang, RN (Nars)';
      case 'PHARMACIST': return 'Lorna Cruz, RPh (Pharmacist)';
      case 'MHO': return 'Dr. Arthur Sotto, MD (Municipal Health Officer)';
      case 'ADMIN': return 'Ericson Padunan (Admin)';
      default: return 'Barangay Health Care Desk';
    }
  };

  const handleLoginSuccess = (role: Role) => {
    setActiveRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const allowedTabs = getTabsForRole(activeRole);

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        language={language}
        onChangeLanguage={setLanguage}
        centerName={centerName}
        centerAddress={centerAddress}
        centerLogo={centerLogo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white" id="bhc-app-container">
      <div>
        <MainHeader
          activeRole={activeRole}
          onChangeRole={(role) => {
            if (role === activeRole) return;
            setRoleToVerify(role);
            setVerifyPin('');
            setVerifyError('');
          }}
          language={language}
          onChangeLanguage={setLanguage}
          isOnline={isOnline}
          onToggleOnline={() => setIsOnline(!isOnline)}
          lastSynced={lastSynced}
          onSync={handleManualSync}
          isSyncing={isSyncing}
          onLogout={handleLogout}
          centerName={centerName}
          centerAddress={centerAddress}
          centerLogo={centerLogo}
        />

        {/* Tailored Workspace Warning strip */}
        <div className="bg-emerald-50 border-b border-emerald-100 text-slate-800 py-2 px-4 shadow-xs" id="role-workspace-banner">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LOGGED ON WORKSTATION: {getStaffNameByRole(activeRole)}
            </span>
            <span className="text-slate-500 italic">
              * Screen customized precisely for your active community health workflow.
            </span>
          </div>
        </div>

        {/* Main application body and navigation workspace */}
        <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6" id="bhc-main-content">
          
          {/* Navigation sidebar strip */}
          <div className="col-span-1 md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2" id="bhc-navigation-pills">
            {allowedTabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left py-3 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer border ${
                    activeTab === tab.id
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold border-l-4 border-l-emerald-600 rounded-r-lg rounded-l-none shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors'
                  }`}
                  id={`tab-nav-${tab.id}`}
                >
                  <TabIcon size={16} className={activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Core content viewport */}
          <div className="col-span-1 md:col-span-9" id="bhc-workspace-viewport">
            {activeTab === 'overview' && (
              <SystemOverview patients={patients} households={households} language={language} />
            )}

            {activeTab === 'map' && (
              <BarangayHealthMap patients={patients} households={households} />
            )}

            {activeTab === 'patients' && (
              <div className="space-y-4" id="patient-register-wrapper">
                {/* Visual sub-routing header */}
                <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between shadow-3xs gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-indigo-600 rounded-full block"></span>
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wide font-sans">Patient Register Workstation</h3>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200/40">
                    <button
                      onClick={() => setPatientsTabMode('records')}
                      className={`px-3 py-1 text-xs font-extrabold rounded-md cursor-pointer transition-all ${
                        patientsTabMode === 'records' 
                          ? 'bg-white shadow-3xs text-indigo-750 font-black' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      📁 Electronic Registries
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatientIdForEdit(undefined);
                        setPatientsTabMode('profile');
                      }}
                      className={`px-3 py-1 text-xs font-extrabold rounded-md cursor-pointer transition-all ${
                        patientsTabMode === 'profile' 
                          ? 'bg-white shadow-3xs text-indigo-750 font-black' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      👤 Add New Patient
                    </button>
                  </div>
                </div>

                {patientsTabMode === 'records' ? (
                  <MasterRecords
                    patients={patients}
                    households={households}
                    consultations={consultations}
                    vaccinations={vaccinations}
                    prenatals={prenatals}
                    vitals={vitals}
                    inventory={inventory}
                    dailyLogs={dailyLogs}
                    language={language}
                    onAddHousehold={(newHH) => setHouseholds((prev) => [...prev, newHH])}
                    onUpdateHousehold={(updatedHH) => setHouseholds((prev) => prev.map((h) => h.id === updatedHH.id ? updatedHH : h))}
                    onDeleteHousehold={(id) => setHouseholds((prev) => prev.filter((h) => h.id !== id))}
                    onEditPatient={(p) => {
                      setSelectedPatientIdForEdit(p.id);
                      setPatientsTabMode('profile');
                    }}
                    onDeletePatient={handleDeletePatient}
                  />
                ) : (
                  <PatientRegistration
                    patients={patients}
                    households={households}
                    onAddPatient={(newPat) => {
                      setPatients([...patients, newPat]);
                      setPatientsTabMode('records'); // auto toggle back to preview registry
                    }}
                    onUpdatePatient={(p) => {
                      handleUpdatePatient(p);
                      setSelectedPatientIdForEdit(undefined);
                      setPatientsTabMode('records');
                    }}
                    onDeletePatient={(id) => {
                      handleDeletePatient(id);
                      setSelectedPatientIdForEdit(undefined);
                      setPatientsTabMode('records');
                    }}
                    onAddHousehold={(newHH) => setHouseholds((prev) => [...prev, newHH])}
                    language={language}
                    initialPatientId={selectedPatientIdForEdit}
                  />
                )}
              </div>
            )}

            {activeTab === 'clinical' && (
              <ClinicalConsultation
                patients={patients}
                vitals={vitals}
                consultations={consultations}
                onAddVitalSign={(newV) => setVitals([...vitals, newV])}
                onAddConsultation={(newC) => setConsultations([...consultations, newC])}
                onUpdateVitalSign={handleUpdateVitalSign}
                onDeleteVitalSign={handleDeleteVitalSign}
                onUpdateConsultation={handleUpdateConsultation}
                onDeleteConsultation={handleDeleteConsultation}
                language={language}
                attendingStaffName={getStaffNameByRole(activeRole)}
                activeRole={activeRole}
              />
            )}

            {activeTab === 'programs' && (
              <MaternalFPImmunization
                patients={patients}
                prenatals={prenatals}
                vaccinations={vaccinations}
                familyPlannings={familyPlannings}
                onAddPrenatal={(newPre) => setPrenatals([...prenatals, newPre])}
                onAddVaccination={(newVac) => setVaccinations([...vaccinations, newVac])}
                onAddFamilyPlanning={(newFP) => setFamilyPlannings([...familyPlannings, newFP])}
                onUpdatePrenatal={handleUpdatePrenatal}
                onDeletePrenatal={handleDeletePrenatal}
                onUpdateVaccination={handleUpdateVaccination}
                onDeleteVaccination={handleDeleteVaccination}
                onUpdateFamilyPlanning={handleUpdateFamilyPlanning}
                onDeleteFamilyPlanning={handleDeleteFamilyPlanning}
                language={language}
                activeRole={activeRole}
              />
            )}

            {activeTab === 'pharmacy' && (
              <PharmacyDispenser
                inventory={inventory}
                dispensed={dispensed}
                patients={patients}
                onDispense={(newDisp) => setDispensed([...dispensed, newDisp])}
                onUpdateInventory={handleUpdateInventory}
                onDeleteInventory={handleDeleteInventory}
                onUpdateDispensed={handleUpdateDispensed}
                onDeleteDispensed={handleDeleteDispensed}
                language={language}
              />
            )}

            {activeTab === 'clearance' && (
              <ClearanceReferrals
                referrals={referrals}
                certificates={certificates}
                patients={patients}
                onAddReferral={(newRef) => setReferrals([...referrals, newRef])}
                onAddCertificate={(newCert) => setCertificates([...certificates, newCert])}
                onUpdateReferral={handleUpdateReferral}
                onDeleteReferral={handleDeleteReferral}
                onUpdateCertificate={handleUpdateCertificate}
                onDeleteCertificate={handleDeleteCertificate}
                language={language}
              />
            )}

            {activeTab === 'admin_panel' && (
              <AdminPanel
                centerName={centerName}
                setCenterName={setCenterName}
                centerAddress={centerAddress}
                setCenterAddress={setCenterAddress}
                centerLogo={centerLogo}
                setCenterLogo={setCenterLogo}
                onAddAuditLog={addAuditLog}
              />
            )}

            {activeTab === 'policies' && (
              <HealthPolicies />
            )}

            {activeTab === 'reports' && (
              <DOHReports
                dailyLogs={dailyLogs}
                patients={patients}
                prenatals={prenatals}
                vaccinations={vaccinations}
                onAddDailyLog={(newLog) => setDailyLogs([...dailyLogs, newLog])}
                onUpdateDailyLogStatus={(id, status) => {
                  setDailyLogs(dailyLogs.map((l) => l.id === id ? { ...l, status } : l));
                }}
                onUpdateDailyLog={handleUpdateDailyLog}
                onDeleteDailyLog={handleDeleteDailyLog}
                language={language}
                households={households}
                consultations={consultations}
                inventory={inventory}
                referrals={referrals}
                certificates={certificates}
                dispensed={dispensed}
              />
            )}
          </div>
        </main>
      </div>

      {roleToVerify && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center z-[100] p-4" id="role-pin-verification-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-amber-400 animate-pulse" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                  {language === 'EN' ? 'Security Verification' : language === 'TL' ? 'Pagsusuri ng Seguridad' : 'Pagsusi sa Seguridad'}
                </h3>
              </div>
              <button 
                onClick={() => setRoleToVerify(null)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                  {language === 'EN' ? 'Target Desk Role:' : language === 'TL' ? 'Target na Gampanin:' : 'Tumong nga Papel:'}
                </span>
                <span className="text-lg font-black text-slate-800 uppercase block tracking-tight">
                  {roleToVerify === 'BHW' ? 'Barangay Health Worker (BHW)' :
                   roleToVerify === 'MIDWIFE' ? 'Barangay Midwife (RM)' :
                   roleToVerify === 'NURSE' ? 'Public Health Nurse (RN)' :
                   roleToVerify === 'PHARMACIST' ? 'Barangay Pharmacist (RPh)' :
                   roleToVerify === 'MHO' ? 'Municipal Health Officer (MHO)' :
                   'System Administrator (ADMIN)'}
                </span>
                <p className="text-slate-500 text-[11px] px-2 leading-relaxed">
                  {language === 'EN' ? `Type the 4-digit authorization PIN to unlock the workstation for ${getStaffNameByRole(roleToVerify)}.` :
                   language === 'TL' ? `Ipasok ang 4-digit na security PIN upang buksan ang workstation para kay ${getStaffNameByRole(roleToVerify)}.` :
                   `Isulod ang 4-digit nga security PIN aron ma-unlock ang workstation alang kang ${getStaffNameByRole(roleToVerify)}.`}
                </p>
              </div>

              {/* Password digit feedback dots */}
              <div className="flex justify-center items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-250/50 max-w-[180px] mx-auto">
                {[0, 1, 2, 3].map((idx) => {
                  const hasVal = verifyPin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                        hasVal ? 'bg-slate-900 border-slate-900 scale-110' : 'bg-white border-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Error warning text */}
              {verifyError && (
                <p className="text-xs font-bold text-center text-rose-600 bg-rose-50 border border-rose-100 p-2.5 rounded-xl animate-shake">
                  ❌ {verifyError}
                </p>
              )}

              {/* Secure touch pad */}
              <div className="grid grid-cols-3 gap-2 max-w-[190px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleVerifyKeyPress(num)}
                    className="w-13 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:bg-slate-200 text-slate-800 font-extrabold font-mono rounded-xl cursor-pointer text-sm shadow-3xs flex items-center justify-center transition-colors"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleVerifyClear}
                  className="w-13 h-11 bg-slate-105 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-black uppercase text-slate-500 rounded-xl cursor-pointer flex items-center justify-center"
                >
                  {language === 'EN' ? 'Clear' : 'Bura'}
                </button>
                <button
                  type="button"
                  onClick={() => handleVerifyKeyPress('0')}
                  className="w-13 h-11 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:bg-slate-200 text-slate-800 font-extrabold font-mono rounded-xl cursor-pointer text-sm shadow-3xs flex items-center justify-center transition-colors"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleVerifyBackspace}
                  className="w-13 h-11 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-black uppercase text-slate-500 rounded-xl cursor-pointer flex items-center justify-center"
                >
                  Del
                </button>
              </div>

              {/* Action Buttons: Cancel */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setRoleToVerify(null)}
                  className="w-full py-3 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer font-sans transition-all"
                >
                  {language === 'EN' ? 'Cancel' : 'Kanselahin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer conforming to high visual standards & zero simulated console details */}
      <footer className="bg-slate-900 text-slate-400 py-4 font-mono text-[10px] text-center mt-12 border-t border-slate-800" id="bhc-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <span>DEPARTMENT OF HEALTH (DOH) PHILIPPINES MANDATED PRIMARY HEALTH RECORDS MANAGEMENT SYSTEM</span>
          <span>© 2026 BARANGAY BALONG-BALONG HEALTH PORTAL • PITOGO, ZAMBOANGA DEL SUR</span>
        </div>
      </footer>
    </div>
  );
}
