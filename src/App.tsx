/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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

import { Activity, Users, ClipboardList, Layers, Pill, FileText, Map, ShieldAlert, Wifi, RefreshCw } from 'lucide-react';

export default function App() {
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
  }, [isOnline, patients, households, vitals, consultations, inventory, dispensed, prenatals, vaccinations, familyPlannings, referrals, certificates, dailyLogs, isLoggedIn, activeRole]);

  // Active workspace navigation
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Unified State Editing & Deleting Handlers for clinical & local persistence
  const handleUpdatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  };
  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateVitalSign = (updated: VitalSigns) => {
    setVitals((prev) => prev.map((v) => v.id === updated.id ? updated : v));
  };
  const handleDeleteVitalSign = (id: string) => {
    setVitals((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateConsultation = (updated: Consultation) => {
    setConsultations((prev) => prev.map((c) => c.id === updated.id ? updated : c));
  };
  const handleDeleteConsultation = (id: string) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdatePrenatal = (updated: PrenatalRecord) => {
    setPrenatals((prev) => prev.map((p) => p.id === updated.id ? updated : p));
  };
  const handleDeletePrenatal = (id: string) => {
    setPrenatals((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateVaccination = (updated: ImmunizationRecord) => {
    setVaccinations((prev) => prev.map((v) => v.id === updated.id ? updated : v));
  };
  const handleDeleteVaccination = (id: string) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateFamilyPlanning = (updated: FamilyPlanningRecord) => {
    setFamilyPlannings((prev) => prev.map((f) => f.id === updated.id ? updated : f));
  };
  const handleDeleteFamilyPlanning = (id: string) => {
    setFamilyPlannings((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpdateReferral = (updated: Referral) => {
    setReferrals((prev) => prev.map((r) => r.id === updated.id ? updated : r));
  };
  const handleDeleteReferral = (id: string) => {
    setReferrals((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateCertificate = (updated: HealthCertificate) => {
    setCertificates((prev) => prev.map((c) => c.id === updated.id ? updated : c));
  };
  const handleDeleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateDailyLog = (updated: DailyLogEntry) => {
    setDailyLogs((prev) => prev.map((l) => l.id === updated.id ? updated : l));
  };
  const handleDeleteDailyLog = (id: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleUpdateInventory = (updated: MedicineInventory) => {
    setInventory((prev) => prev.map((i) => i.id === updated.id ? updated : i));
  };
  const handleDeleteInventory = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  const handleUpdateDispensed = (updated: MedicineDispensed) => {
    setDispensed((prev) => prev.map((d) => d.id === updated.id ? updated : d));
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
      { id: 'reports', label: 'FHSIS Reports & Logs', icon: ShieldAlert },
    ];

    switch (role) {
      case 'BHW':
        return allTabs.filter((t) => ['overview', 'patients', 'clinical', 'map'].includes(t.id));
      case 'MIDWIFE':
        return allTabs.filter((t) => ['overview', 'clinical', 'programs', 'clearance', 'map'].includes(t.id));
      case 'NURSE':
        return allTabs.filter((t) => ['overview', 'patients', 'clinical', 'programs', 'clearance', 'reports'].includes(t.id));
      case 'PHARMACIST':
        return allTabs.filter((t) => ['overview', 'pharmacy', 'reports'].includes(t.id));
      case 'MHO':
        return allTabs.filter((t) => ['overview', 'clinical', 'clearance', 'map', 'reports'].includes(t.id));
      case 'ADMIN':
        return allTabs; // Barangay Captain Admin sees all diagnostics
      default:
        return allTabs;
    }
  };

  // Map active staff name for registries tracking
  const getStaffNameByRole = (role: Role): string => {
    switch (role) {
      case 'BHW': return 'Rosalie Abella (BHW)';
      case 'MIDWIFE': return 'Ma. Fe Alcantara, RM (Kumadrona)';
      case 'NURSE': return 'Sarah Genciana, RN (Naras)';
      case 'PHARMACIST': return 'Lorna Cruz, RPh (Pharmacist)';
      case 'MHO': return 'Dr. Arthur Sotto, MD (Municipal Health Officer)';
      case 'ADMIN': return 'Hon. Reynaldo Dela Cruz (Kapitan)';
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
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-emerald-600 selection:text-white" id="bhc-app-container">
      <div>
        <MainHeader
          activeRole={activeRole}
          onChangeRole={setActiveRole}
          language={language}
          onChangeLanguage={setLanguage}
          isOnline={isOnline}
          onToggleOnline={() => setIsOnline(!isOnline)}
          lastSynced={lastSynced}
          onSync={handleManualSync}
          isSyncing={isSyncing}
          onLogout={handleLogout}
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
              <PatientRegistration
                patients={patients}
                households={households}
                onAddPatient={(newPat) => setPatients([...patients, newPat])}
                onUpdatePatient={handleUpdatePatient}
                onDeletePatient={handleDeletePatient}
                language={language}
              />
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
              />
            )}
          </div>
        </main>
      </div>

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
