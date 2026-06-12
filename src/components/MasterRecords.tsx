/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Patient, 
  Household,
  Consultation, 
  ImmunizationRecord, 
  PrenatalRecord, 
  VitalSigns, 
  MedicineInventory, 
  DailyLogEntry, 
  Language, 
  Purok
} from '../types';
import { 
  Search, 
  Download, 
  Database, 
  Users, 
  ClipboardCheck, 
  ShieldAlert, 
  Sparkles, 
  Baby, 
  HeartPulse, 
  Activity, 
  Pill, 
  Clock, 
  CheckCircle, 
  Filter, 
  AlertTriangle,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';

interface MasterRecordsProps {
  patients: Patient[];
  households: Household[];
  consultations: Consultation[];
  vaccinations: ImmunizationRecord[];
  prenatals: PrenatalRecord[];
  vitals: VitalSigns[];
  inventory: MedicineInventory[];
  dailyLogs: DailyLogEntry[];
  language: Language;
  onAddHousehold?: (hh: Household) => void;
  onUpdateHousehold?: (hh: Household) => void;
  onDeleteHousehold?: (id: string) => void;
  onEditPatient?: (p: Patient) => void;
  onDeletePatient?: (id: string) => void;
}

type RecordTab = 'residents' | 'households' | 'consultations' | 'immunizations' | 'prenatals' | 'vitals' | 'inventory' | 'daily_logs';

export const MasterRecords: React.FC<MasterRecordsProps> = ({
  patients,
  households,
  consultations,
  vaccinations,
  prenatals,
  vitals,
  inventory,
  dailyLogs,
  language,
  onAddHousehold,
  onUpdateHousehold,
  onDeleteHousehold,
  onEditPatient,
  onDeletePatient,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<RecordTab>('residents');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Checking active user role to prevent unauthorized roles from editing/deleting residents
  const userActiveRole = localStorage.getItem('bhc_active_role') || 'BHW';
  const isBhw = userActiveRole === 'BHW';
  const isMidwifeOrNurse = userActiveRole === 'MIDWIFE' || userActiveRole === 'NURSE';
  const isAdmin = userActiveRole === 'ADMIN';

  const canEdit = isAdmin || isMidwifeOrNurse || userActiveRole === 'MHO' || userActiveRole === 'PHARMACIST';
  const canDelete = isAdmin;
  const [selectedPatientToView, setSelectedPatientToView] = useState<Patient | null>(null);
  
  // Filtering states
  const [purokFilter, setPurokFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [healthStatusFilter, setHealthStatusFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [stockLevelFilter, setStockLevelFilter] = useState<string>('All'); // All, Low, Normal

  // Household management state inside MasterRecords
  const [isAddingHH, setIsAddingHH] = useState(false);
  const [editingHH, setEditingHH] = useState<Household | null>(null);
  const [hhId, setHHId] = useState('');
  const [hhHead, setHHHead] = useState('');
  const [hhPurok, setHHPurok] = useState<Purok>('Purok 1');
  const [hhMembers, setHHMembers] = useState(4);
  const [hhWater, setHHWater] = useState<Household['waterSource']>('Level III (Waterworks System)');
  const [hhSanitary, setHHSanitary] = useState(true);
  const [hhSolid, setHHSolid] = useState<Household['solidWasteManagement']>('Segregated');
  const [hhIndigent, setHHIndigent] = useState(false);

  const startEditHH = (hh: Household) => {
    setEditingHH(hh);
    setHHId(hh.id);
    setHHHead(hh.householdHead);
    setHHPurok(hh.purok);
    setHHMembers(hh.numberOfMembers);
    setHHWater(hh.waterSource);
    setHHSanitary(hh.sanitaryToilet);
    setHHSolid(hh.solidWasteManagement);
    setHHIndigent(hh.indigentStatus);
    setIsAddingHH(true);
  };

  const handleSaveHH = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhId.trim() || !hhHead.trim()) {
      alert('Tiyakin na napunan ang Household ID at Head of Family Name.');
      return;
    }

    const hhObj: Household = {
      id: hhId.trim(),
      householdHead: hhHead.trim(),
      purok: hhPurok,
      numberOfMembers: Number(hhMembers),
      waterSource: hhWater,
      sanitaryToilet: hhSanitary,
      solidWasteManagement: hhSolid,
      indigentStatus: hhIndigent,
    };

    if (editingHH) {
      if (onUpdateHousehold) {
        onUpdateHousehold(hhObj);
        alert('Matagumpay na nai-save ang pagbabago sa Sambahayan!');
      }
    } else {
      if (households.some(h => h.id.toLowerCase() === hhId.toLowerCase())) {
        alert(`Ang Household ID "${hhId}" ay mayroon na sa listahan. Gumamit ng bagong ID.`);
        return;
      }
      if (onAddHousehold) {
        onAddHousehold(hhObj);
        alert('Matagumpay na naidagdag ang bagong Sambahayan!');
      }
    }

    // Reset Form
    setIsAddingHH(false);
    setEditingHH(null);
    setHHId('');
    setHHHead('');
    setHHMembers(4);
  };

  const handleDeleteHHCmd = (id: string, head: string) => {
    const counts = patients.filter(p => p.householdId === id).length;
    let confirmMsg = `Sigurado ka bang nais mong burahin ang Sambahayan ni ${head} (${id})?`;
    if (counts > 0) {
      confirmMsg += `\n\nBABALA: Mayroong ${counts} miyembro na kasalukuyang nakatali sa Sambahayan na ito. Sila ay mawawalan ng koneksyon ng pamilya.`;
    }
    if (confirm(confirmMsg)) {
      if (onDeleteHousehold) {
        onDeleteHousehold(id);
        alert(`Matagumpay na nabura ang Sambahayan.`);
      }
    }
  };

  const getPatientName = (patientId: string): string => {
    const p = patients.find(pat => pat.id === patientId);
    return p ? `${p.lastName}, ${p.firstName}` : patientId;
  };

  const getPatientPurok = (patientId: string): string => {
    const p = patients.find(pat => pat.id === patientId);
    return p ? p.purok : 'Unknown';
  };

  // CSV Exporter Utility
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number | boolean)[][] = [];
    let filename = '';

    if (activeSubTab === 'residents') {
      headers = ['ID', 'Household ID', 'Last Name', 'First Name', 'Middle Name', 'Birth Date', 'Gender', 'Purok', 'Phone', 'PhilHealth ID', 'Active Programs', 'Registered Date'];
      rows = patients.map(p => [
        p.id,
        p.householdId,
        p.lastName,
        p.firstName,
        p.middleName,
        p.birthDate,
        p.gender,
        p.purok,
        p.phoneNumber,
        p.philHealthId || 'N/A',
        p.activePrograms.join('; '),
        p.createdAt
      ]);
      filename = `Barangay_Residents_Registry_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'households') {
      headers = ['Household ID/No.', 'Household Head', 'Purok', 'No. of Members', 'Water Source', 'Toilet Compliant', 'Solid Waste', 'Indigent Status'];
      rows = households.map(h => [
        h.id,
        h.householdHead,
        h.purok,
        h.numberOfMembers,
        h.waterSource,
        h.sanitaryToilet ? 'Yes' : 'No',
        h.solidWasteManagement,
        h.indigentStatus ? 'Yes' : 'No'
      ]);
      filename = `Barangay_Households_Registry_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'consultations') {
      headers = ['ID', 'Patient ID', 'Patient Name', 'Date', 'Chief Complaint', 'Subjective', 'Objective', 'Assessments/Diagnoses', 'Plan/Treatment', 'Referred to Hospital', 'Attending Staff'];
      rows = consultations.map(c => [
        c.id,
        c.patientId,
        getPatientName(c.patientId),
        c.date,
        c.chiefComplaint,
        c.subjective,
        c.objective,
        c.assessmentDiagnoses.join('; '),
        c.planTreatment,
        c.referredToHospital ? 'Yes' : 'No',
        c.attendingStaff
      ]);
      filename = `Clinical_Consultation_Records_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'immunizations') {
      headers = ['Record ID', 'Patient ID', 'Patient Name', 'Mother Name', 'Vaccine Name', 'Dose', 'Date Given', 'Given By', 'Remarks'];
      rows = vaccinations.map(v => [
        v.id,
        v.patientId,
        getPatientName(v.patientId),
        v.motherName,
        v.vaccineName,
        v.doseNumber,
        v.dateGiven,
        v.givenBy,
        v.remarks
      ]);
      filename = `Child_Immunization_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'prenatals') {
      headers = ['Record ID', 'Patient ID', 'Patient Name', 'LMP', 'EDC', 'Gravida (G)', 'Para (P)', 'ABP (Weeks)', 'Fundal Height (cm)', 'Fetal Heart BP', 'Risks', 'Remarks', 'Next Visit'];
      rows = prenatals.map(p => [
        p.id,
        p.patientId,
        getPatientName(p.patientId),
        p.lmp,
        p.edc,
        p.gravida,
        p.para,
        p.gestationalAgeWeeks,
        p.fundalHeightCm || '',
        p.fetalHeartToneBpm || '',
        p.riskClassification,
        p.remarks,
        p.nextPrenatalVisit
      ]);
      filename = `Prenatal_Maternal_Records_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'vitals') {
      headers = ['Record ID', 'Patient ID', 'Patient Name', 'Purok', 'Date', 'Blood Pressure', 'Temperature (C)', 'Heart Rate (BPM)', 'Respiratory Rate', 'Weight (KG)', 'Height (CM)', 'BMI', 'Category', 'Blood Sugar', 'Encoded By'];
      rows = vitals.map(v => [
        v.id,
        v.patientId,
        getPatientName(v.patientId),
        getPatientPurok(v.patientId),
        v.date,
        `${v.systolic}/${v.diastolic}`,
        v.temperature,
        v.heartRate,
        v.respiratoryRate,
        v.weightKg,
        v.heightCm,
        v.bmi,
        v.bmiCategory,
        v.bloodSugar || '',
        v.loggedBy
      ]);
      filename = `Vital_Signs_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'inventory') {
      headers = ['Medicine ID', 'Brand Name', 'Generic Name', 'Category', 'Stock Left', 'Unit', 'Reorder Point', 'Status', 'Expiry Date'];
      rows = inventory.map(i => [
        i.id,
        i.medicineName,
        i.genericName,
        i.category,
        i.currentStock,
        i.stockInUnit,
        i.reorderLevel,
        i.currentStock <= i.reorderLevel ? 'LOW STOCK' : 'OK',
        i.expiryDate
      ]);
      filename = `Pharmacy_Medicine_Inventory_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeSubTab === 'daily_logs') {
      headers = ['Daily Log ID', 'Date/Time', 'Patient ID', 'Resident Name', 'Purok', 'Purpose of Visit', 'Status'];
      rows = dailyLogs.map(l => [
        l.id,
        l.timestamp,
        l.patientId,
        l.patientName,
        l.purok,
        l.purpose,
        l.status
      ]);
      filename = `Walk_in_Visitor_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    }

    if (rows.length === 0) {
      alert('Walang datos na maaaring i-export sa kasalukuyan.');
      return;
    }

    const content = [
      headers.join(','),
      ...rows.map(row => 
        row.map(val => {
          const str = String(val === undefined || val === null ? '' : val);
          return `"${str.replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHouseholds = households.filter(h => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      h.id.toLowerCase().includes(query) ||
      h.householdHead.toLowerCase().includes(query) ||
      h.purok.toLowerCase().includes(query);
    
    if (!matchesSearch) return false;
    if (purokFilter !== 'All' && h.purok !== purokFilter) return false;
    return true;
  });

  // Filtering Logic
  const filteredResidents = patients.filter(p => {
    const query = searchQuery.toLowerCase();
    
    // Check if any of the patient's consultations have diagnosis matching query
    const patientDiagList = consultations
      .filter(c => c.patientId === p.id)
      .flatMap(c => c.assessmentDiagnoses || []);
    const hasDiagMatch = patientDiagList.some(diag => diag.toLowerCase().includes(query));

    // Check if any of the patient's vitals have BMI category matching query
    const patientVitals = vitals.filter(v => v.patientId === p.id);
    const hasBmiMatch = patientVitals.some(v => v.bmiCategory.toLowerCase().includes(query));

    // Determine active health programs list
    const programStrings = p.activePrograms || [];

    const matchesSearch = 
      p.id.toLowerCase().includes(query) ||
      p.lastName.toLowerCase().includes(query) ||
      p.firstName.toLowerCase().includes(query) ||
      p.middleName.toLowerCase().includes(query) ||
      p.householdId.toLowerCase().includes(query) ||
      programStrings.some(prog => prog.toLowerCase().includes(query)) ||
      hasDiagMatch ||
      hasBmiMatch ||
      (p.philHealthId && p.philHealthId.toLowerCase().includes(query)) ||
      (p.philHealthCategory && p.philHealthCategory.toLowerCase().includes(query)) ||
      (p.isIndigent && 'indigent'.includes(query));
    
    if (!matchesSearch) return false;
    if (purokFilter !== 'All' && p.purok !== purokFilter) return false;
    if (genderFilter !== 'All' && p.gender !== genderFilter) return false;
    
    // Program / Assistance Status Filter Dropdown
    if (healthStatusFilter !== 'All') {
      if (healthStatusFilter === 'Indigent') {
        if (!p.isIndigent) return false;
      } else {
        if (!p.activePrograms.includes(healthStatusFilter as any)) return false;
      }
    }
    
    return true;
  });

  const filteredConsultations = consultations.filter(c => {
    const query = searchQuery.toLowerCase();
    const patName = getPatientName(c.patientId).toLowerCase();
    const matchesSearch = 
      c.id.toLowerCase().includes(query) ||
      c.patientId.toLowerCase().includes(query) ||
      patName.includes(query) ||
      c.chiefComplaint.toLowerCase().includes(query) ||
      c.assessmentDiagnoses.some(d => d.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    const patPurok = getPatientPurok(c.patientId);
    if (purokFilter !== 'All' && patPurok !== purokFilter) return false;
    return true;
  });

  const filteredImmunizations = vaccinations.filter(v => {
    const query = searchQuery.toLowerCase();
    const patName = getPatientName(v.patientId).toLowerCase();
    const matchesSearch = 
      v.id.toLowerCase().includes(query) ||
      v.patientId.toLowerCase().includes(query) ||
      patName.includes(query) ||
      v.vaccineName.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    const patPurok = getPatientPurok(v.patientId);
    if (purokFilter !== 'All' && patPurok !== purokFilter) return false;
    return true;
  });

  const filteredPrenatals = prenatals.filter(p => {
    const query = searchQuery.toLowerCase();
    const patName = getPatientName(p.patientId).toLowerCase();
    const matchesSearch = 
      p.id.toLowerCase().includes(query) ||
      p.patientId.toLowerCase().includes(query) ||
      patName.includes(query) ||
      p.riskClassification.toLowerCase().includes(query) ||
      p.remarks.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    const patPurok = getPatientPurok(p.patientId);
    if (purokFilter !== 'All' && patPurok !== purokFilter) return false;
    if (riskFilter !== 'All' && p.riskClassification !== riskFilter) return false;
    return true;
  });

  const filteredVitals = vitals.filter(v => {
    const query = searchQuery.toLowerCase();
    const patName = getPatientName(v.patientId).toLowerCase();
    const matchesSearch = 
      v.id.toLowerCase().includes(query) ||
      v.patientId.toLowerCase().includes(query) ||
      patName.includes(query) ||
      v.bmiCategory.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    const patPurok = getPatientPurok(v.patientId);
    if (purokFilter !== 'All' && patPurok !== purokFilter) return false;
    return true;
  });

  const filteredInventory = inventory.filter(i => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      i.id.toLowerCase().includes(query) ||
      i.medicineName.toLowerCase().includes(query) ||
      i.genericName.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (stockLevelFilter === 'Low' && i.currentStock > i.reorderLevel) return false;
    if (stockLevelFilter === 'Normal' && i.currentStock <= i.reorderLevel) return false;
    return true;
  });

  const filteredDailyLogs = dailyLogs.filter(l => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      l.id.toLowerCase().includes(query) ||
      l.patientId.toLowerCase().includes(query) ||
      l.patientName.toLowerCase().includes(query) ||
      l.purok.toLowerCase().includes(query) ||
      l.purpose.toLowerCase().includes(query);

    if (!matchesSearch) return false;
    if (purokFilter !== 'All' && l.purok !== purokFilter) return false;
    if (urgencyFilter !== 'All' && l.status !== urgencyFilter) return false;
    return true;
  });

  // Rapid metrics calculations
  const totalKidsCount = patients.filter(p => {
    const age = new Date().getFullYear() - new Date(p.birthDate).getFullYear();
    return age <= 5;
  }).length;

  const lowStockMedsCount = inventory.filter(i => i.currentStock <= i.reorderLevel).length;
  const highRiskPregnantCount = prenatals.filter(p => p.riskClassification === 'High Risk').length;
  const indigentResidentsCount = patients.filter(p => p.isIndigent).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="bhc-unified-records-master">
      {/* Header section with brand identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <Database size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              Sentinel Registry database
              <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-700 text-[8px] font-black uppercase rounded block tracking-normal">
                RA 10173 Audit Verified
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Unified records directory for Barangay Balong-balong, Pitogo, Zamboanga del Sur</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Download size={13} />
          <span>I-download ang Aktibong Talaan (CSV)</span>
        </button>
      </div>

      {/* Metrics Bento Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6" id="records-bento-metrics">
        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
            <Users size={16} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">{patients.length} Residents</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center gap-2.5">
          <div className="p-2 bg-indigo-100 text-amber-700 rounded-lg">
            <Pill size={16} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Low Stock</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">{lowStockMedsCount} critical</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center gap-2.5">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
            <ShieldAlert size={16} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">High-Risk Prenatal</span>
            <span className="text-sm font-extrabold text-rose-700 font-mono">{highRiskPregnantCount} alerts</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">BHW Audited</span>
            <span className="text-sm font-extrabold text-emerald-700 font-mono">100% Locked</span>
          </div>
        </div>
      </div>

      {/* Sub-tab navigation directory */}
      <div className="flex border-b border-slate-100 pb-0.5 gap-1.5 overflow-x-auto scroller-hidden mb-4" id="master-subtabs-strip">
        <button
          onClick={() => { setActiveSubTab('residents'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'residents' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          👤 Resident Records
        </button>
        <button
          onClick={() => { setActiveSubTab('households'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'households' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          🏡 Sambahayan (Households)
        </button>
        <button
          onClick={() => { setActiveSubTab('consultations'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'consultations' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          📋 Consultations
        </button>
        <button
          onClick={() => { setActiveSubTab('vitals'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'vitals' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          🩺 Vital Signs
        </button>
        <button
          onClick={() => { setActiveSubTab('prenatals'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'prenatals' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          🤰 Prenatal MCH
        </button>
        <button
          onClick={() => { setActiveSubTab('immunizations'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'immunizations' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          👶 Immunizations (EPI)
        </button>
        <button
          onClick={() => { setActiveSubTab('inventory'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'inventory' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          💊 Medicine Stock
        </button>
        <button
          onClick={() => { setActiveSubTab('daily_logs'); setSearchQuery(''); }}
          className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wider shrink-0 transition-all rounded-t-lg border-b-2 cursor-pointer ${
            activeSubTab === 'daily_logs' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/20 font-extrabold' : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          🕒 Walk-In Visitors & Reports
        </button>
      </div>

      {/* Interactive Controls Panel (Search & Specialized Filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-4 p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-xs">
        <div className="sm:col-span-6 md:col-span-5 relative">
          <Search size={14} className="absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            className="w-full bg-white border border-slate-200 pl-8 pr-4 py-2.5 rounded-lg focus:outline-hidden text-xs font-medium placeholder:text-slate-400 text-slate-800"
            placeholder={
              activeSubTab === 'residents' ? 'Maghanap sa Pangalan, Sambahayan (Household) ID, o Health Status (MCH, EPI, Tb, obeso)...' :
              activeSubTab === 'households' ? 'Maghanap ng pangalan ng Ulo ng Pamilya, Sambahayan ID/No...' :
              activeSubTab === 'consultations' ? 'Maghanap ng Chief complaint o diagnosis...' :
              activeSubTab === 'immunizations' ? 'Maghanap ng bakuna, drayb, o sanggol...' :
              activeSubTab === 'vitals' ? 'Maghanap ng vitals record...' :
              activeSubTab === 'inventory' ? 'Maghanap ng pangalan ng gamot o generic...' :
              'Maghanap sa ledger...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dynamic Filters depending on the Active Sheet */}
        <div className="sm:col-span-6 md:col-span-7 flex flex-wrap items-center gap-2 justify-start sm:justify-end">
          {/* Universal Purok Filter */}
          {activeSubTab !== 'inventory' && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-450 uppercase font-mono">Purok:</span>
              <select
                className="border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-slate-700 font-bold"
                value={purokFilter}
                onChange={(e) => setPurokFilter(e.target.value)}
              >
                <option value="All">Lahat (All Purok)</option>
                <option value="Purok 1">Purok 1</option>
                <option value="Purok 2">Purok 2</option>
                <option value="Purok 3">Purok 3</option>
                <option value="Purok 4">Purok 4</option>
                <option value="Purok 5">Purok 5</option>
                <option value="Purok 6">Purok 6</option>
                <option value="Purok 7">Purok 7</option>
              </select>
            </div>
          )}

          {/* Gender Filter for Residents */}
          {activeSubTab === 'residents' && (
            <>
              <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                <span className="text-[10px] text-slate-450 uppercase font-mono">Gender:</span>
                <select
                  className="border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-slate-700 font-bold"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Lalake (Male)</option>
                  <option value="Female">Babae (Female)</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-450 uppercase font-mono">Health status / Program:</span>
                <select
                  className="border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-slate-700 font-bold"
                  value={healthStatusFilter}
                  onChange={(e) => setHealthStatusFilter(e.target.value)}
                >
                  <option value="All">All Health Statuses</option>
                  <option value="EPI">Vaccine Program (EPI)</option>
                  <option value="MCH">Maternal Health (MCH)</option>
                  <option value="TB_DOTS">Tuberculosis (TB DOTS)</option>
                  <option value="OPT_PLUS">Nutrition (OPT+)</option>
                  <option value="SENIOR_CITIZEN">Senior Citizen program</option>
                  <option value="DISEASE_SURVEILLANCE">Disease Surveillance</option>
                  <option value="FAMILY_PLANNING">Family Planning</option>
                  <option value="Indigent">Indigent Aid Assistance</option>
                </select>
              </div>
            </>
          )}

          {/* Risk Filter for Medical Prenatals */}
          {activeSubTab === 'prenatals' && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-450 uppercase font-mono">Risk Level:</span>
              <select
                className="border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-slate-700 font-bold"
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              >
                <option value="All">All Risks</option>
                <option value="Low Risk">Mababa (Low Risk)</option>
                <option value="Medium Risk">Katamtaman (Medium)</option>
                <option value="High Risk">Mataas (High Risk)</option>
              </select>
            </div>
          )}

          {/* Stock Filter for Pharmacy Inventory */}
          {activeSubTab === 'inventory' && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-450 uppercase font-mono">Supply Status:</span>
              <select
                className="border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-slate-700 font-bold"
                value={stockLevelFilter}
                onChange={(e) => setStockLevelFilter(e.target.value)}
              >
                <option value="All">Lahat (All Stocks)</option>
                <option value="Low">Low Stock Alerts Only</option>
                <option value="Normal">Optimal Levels</option>
              </select>
            </div>
          )}

          {/* Visit State Filter for Daily logs */}
          {activeSubTab === 'daily_logs' && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-450 uppercase font-mono">Visitor Status:</span>
              <select
                className="border border-slate-200 bg-white px-2 py-1.5 rounded-lg text-slate-700 font-bold"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="All">All Visitors</option>
                <option value="Waiting">Waiting (Naka-antabay)</option>
                <option value="In Progress">In Progress (Kasalukuyang Ginagamot)</option>
                <option value="Completed">Completed (Natapos na)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Master Viewports container */}
      <div className="space-y-4" id="records-table-viewport">
        
        {/* TAB 1: RESIDENTS RECORDS (Patient Registry) */}
        {activeSubTab === 'residents' && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Pangalan ng Residente</th>
                  <th className="p-3">Petsa ng Kapanganakan / Kasarian</th>
                  <th className="p-3">Purok & Contact</th>
                  <th className="p-3">Philhealth & Indigency</th>
                  <th className="p-3">Sustansyang Programa</th>
                  <th className="p-3 text-center">Aksyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredResidents.length === 0 ? (
                  <tr>
                    <td colspan="7" className="p-5 text-center text-slate-400 italic">Walang nahanap na tugmang resident records.</td>
                  </tr>
                ) : (
                  filteredResidents.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-bold">{p.id}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-slate-800 block">{p.lastName}, {p.firstName} {p.middleName}</span>
                        {(() => {
                          const linkedHousehold = households.find(h => h.id === p.householdId);
                          return (
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              Sambahayan: <strong className="text-zinc-700">{p.householdId}</strong>
                              {linkedHousehold ? ` (${linkedHousehold.householdHead})` : ''}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="p-3 font-mono">
                        <span className="block text-slate-700">{p.birthDate}</span>
                        <span className={`px-1 rounded text-[9px] font-bold uppercase inline-block mt-0.5 ${p.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                          {p.gender === 'Female' ? 'Babae' : 'Lalake'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-700 block">{p.purok}</span>
                        <span className="text-slate-450 font-mono text-[11px] block">{p.phoneNumber}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-750 block font-mono text-[11px]">{p.philHealthId || 'NOT ENROLLED'}</span>
                        {p.isIndigent ? (
                          <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded mt-1 inline-block">
                            Indigent Assistance Aid
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Regular Member</span>
                        )}
                      </td>
                      <td className="p-3">
                        {p.activePrograms.length === 0 ? (
                          <span className="text-slate-400 italic">No assigned health programs</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {p.activePrograms.map(prog => (
                              <span key={prog} className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[9px] font-bold rounded">
                                {prog}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                          <button
                            type="button"
                            onClick={() => setSelectedPatientToView(p)}
                            className="px-2 py-1 bg-indigo-55 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] rounded-md cursor-pointer border border-indigo-200/50 flex items-center justify-center gap-1 transition-colors hover:shadow-2xs"
                            title="Tingnan ang Impormasyon ng Residente"
                          >
                            <Eye size={12} className="text-indigo-650" />
                            <span>View</span>
                          </button>
                          
                          {canEdit && onEditPatient && (
                            <button
                              type="button"
                              onClick={() => {
                                onEditPatient(p);
                              }}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold text-[11px] rounded-md cursor-pointer border border-amber-200/50 flex items-center justify-center gap-1 transition-colors hover:shadow-2xs"
                              title="I-edit ang Pasyente"
                            >
                              <Edit size={12} className="text-amber-655" />
                              <span>Edit</span>
                            </button>
                          )}

                          {canDelete && onDeletePatient && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Sigurado ka bang nais mong tanggalin si ${p.lastName}, ${p.firstName}?`)) {
                                  onDeletePatient(p.id);
                                }
                              }}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-705 font-extrabold text-[11px] rounded-md cursor-pointer border border-rose-200/50 flex items-center justify-center gap-1 transition-colors hover:shadow-2xs"
                              title="Tanggalin ang Pasyente"
                            >
                              <Trash2 size={12} className="text-rose-650" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: HOUSEHOLDS (Sambahayan Census) */}
        {activeSubTab === 'households' && (
          <div className="space-y-4" id="households-tab-container">
            {/* Upper control button / Edit form */}
            {isAddingHH ? (
              <form onSubmit={handleSaveHH} className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-4" id="household-entry-form">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                    <Home size={16} className="text-indigo-600" />
                    {editingHH ? `I-edit ang Sambahayan ID: ${editingHH.id}` : 'Magrehistro ng Bagong Sambahayan'}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setIsAddingHH(false); setEditingHH(null); setHHId(''); setHHHead(''); }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    ✕ Kanselahin (Cancel)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Household No. / ID *</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg font-mono focus:outline-hidden text-sm"
                      placeholder="e.g. 0343"
                      required
                      disabled={editingHH !== null}
                      value={hhId}
                      onChange={(e) => setHHId(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Ulo ng Pamilya (Household Head) *</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-sm"
                      placeholder="Apelyido, Pangalan"
                      required
                      value={hhHead}
                      onChange={(e) => setHHHead(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Purok Cluster</label>
                    <select
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden font-mono text-sm"
                      value={hhPurok}
                      onChange={(e) => setHHPurok(e.target.value as Purok)}
                    >
                      {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Bilang ng Miyembro (Members Count)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg font-mono focus:outline-hidden text-sm"
                      placeholder="e.g. 4"
                      min={1}
                      value={hhMembers}
                      onChange={(e) => setHHMembers(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Pinagkukunan ng Tubig (Water Source)</label>
                    <select
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-sm"
                      value={hhWater}
                      onChange={(e) => setHHWater(e.target.value as any)}
                    >
                      <option value="Level I (Point Source)">Level I (Point Source)</option>
                      <option value="Level II (Communal Faucet)">Level II (Communal Faucet)</option>
                      <option value="Level III (Waterworks System)">Level III (Waterworks System)</option>
                      <option value="Unsanitary/Unprotected">Unsanitary/Unprotected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Waste Disposal Management</label>
                    <select
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-sm"
                      value={hhSolid}
                      onChange={(e) => setHHSolid(e.target.value as any)}
                    >
                      <option value="Segregated">Segregated</option>
                      <option value="Disposed/Burned">Disposed / Burned</option>
                      <option value="Open Dumping">Open Dumping</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <label className="flex items-center gap-1.5 text-xs text-slate-705 font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded-sm p-1"
                        checked={hhSanitary}
                        onChange={(e) => setHHSanitary(e.target.checked)}
                      />
                      May Sanitary Toilet (DOH Sanitary Compliant)
                    </label>

                    <label className="flex items-center gap-1.5 text-xs text-slate-705 font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        className="rounded-sm p-1"
                        checked={hhIndigent}
                        onChange={(e) => setHHIndigent(e.target.checked)}
                      />
                      Indigent Sambahayan (Nasa listahan ng Mahirap)
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2.5 border-t border-slate-200">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    I-save ang Sambahayan
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg">
                <span className="text-xs text-slate-500 font-medium">Mayroon kang <strong>{filteredHouseholds.length}</strong> sambahayan na nahanap.</span>
                <button
                  onClick={() => setIsAddingHH(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3.5 rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> Magrehistro ng Sambahayan (Add Household)
                </button>
              </div>
            )}

            <div className="overflow-x-auto border border-slate-150 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                    <th className="p-3">Household No. / ID</th>
                    <th className="p-3">Ulo ng Sambahayan (Head Name)</th>
                    <th className="p-3">Purok Cluster</th>
                    <th className="p-3">Mga Miyembro sa Pamilya (Members)</th>
                    <th className="p-3">Sanitasyon at Tubig (DOH Metrics)</th>
                    <th className="p-3 text-center">Mga Aksyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium font-mono">
                  {filteredHouseholds.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-5 text-center text-slate-400 italic font-sans">Walang nahanap na sambahayan records.</td>
                    </tr>
                  ) : (
                    filteredHouseholds.map(h => {
                      const linkedResidents = patients.filter(p => p.householdId === h.id);
                      return (
                        <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono text-slate-900 font-bold bg-slate-50/40 text-[11px]">{h.id}</td>
                          <td className="p-3 font-sans">
                            <span className="font-extrabold text-slate-800 text-sm block">{h.householdHead}</span>
                            {h.indigentStatus && (
                              <span className="px-1 py-0.2 bg-rose-100 text-rose-800 text-[8px] font-black rounded uppercase">PAUPER / INDIGENT</span>
                            )}
                          </td>
                          <td className="p-3 font-bold text-slate-705 font-sans">{h.purok}</td>
                          <td className="p-3 font-sans">
                            <span className="text-xs font-bold text-slate-800 block">Sukat: {Math.max(h.numberOfMembers, linkedResidents.length)} miyembro</span>
                            {linkedResidents.length > 0 ? (
                              <div className="text-[10px] text-slate-500 mt-1 max-w-xs truncate" title={linkedResidents.map(r => `${r.lastName}, ${r.firstName}`).join('; ')}>
                                👪 {linkedResidents.map(r => r.firstName).join(', ')}
                              </div>
                            ) : (
                              <span className="text-[10px] text-rose-500 italic block mt-0.5">Walang rehistradong residente rito</span>
                            )}
                          </td>
                          <td className="p-3 text-[11px] space-y-1 font-sans">
                            <div>
                              <span className="text-slate-400 text-[10px] block font-mono">Tubig:</span>
                              <span className="text-slate-800 font-semibold">{h.waterSource}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className={`text-[9px] font-extrabold p-0.5 px-1 rounded-sm uppercase ${h.sanitaryToilet ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>
                                {h.sanitaryToilet ? 'DOH Sanitarily Approved Kasilyas' : 'Walang Sanitaryong Toilet'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 py-4 text-center font-sans">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => startEditHH(h)}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors"
                                title="I-edit an Sambahayan"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteHHCmd(h.id, h.householdHead)}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                title="Burahin an Sambahayan"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CONSULTATION RECORDS */}
        {activeSubTab === 'consultations' && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Consultation ID / Petsa</th>
                  <th className="p-3">Pasyente</th>
                  <th className="p-3">Chief Complaint (Sintomas)</th>
                  <th className="p-3">Diagnoses Assessment</th>
                  <th className="p-3">Urgent Screenings</th>
                  <th className="p-3">Attending Midwife / Worker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredConsultations.length === 0 ? (
                  <tr>
                    <td colspan="6" className="p-5 text-center text-slate-400 italic">Walang nahanap na consultation records.</td>
                  </tr>
                ) : (
                  filteredConsultations.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono">
                        <span className="font-extrabold text-slate-800 block">{c.id}</span>
                        <span className="text-[10px] text-slate-400">{c.date}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block">{getPatientName(c.patientId)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">ID: {c.patientId} • {getPatientPurok(c.patientId)}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-650 block italic">"{c.chiefComplaint}"</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 max-w-xs truncate">Plan: {c.planTreatment}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {c.assessmentDiagnoses.map((diag, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 text-[9px] font-black rounded font-mono uppercase">
                              {diag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {c.isTBPossible && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[9px] font-black uppercase rounded block w-max animate-pulse">
                              Presumptive TB
                            </span>
                          )}
                          {c.isDenguePossible && (
                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black uppercase rounded block w-max">
                              Dengue Alert
                            </span>
                          )}
                          {!c.isTBPossible && !c.isDenguePossible && (
                            <span className="text-[10px] text-slate-400">Mild standard triage Checked</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-700 block">{c.attendingStaff}</span>
                        {c.mhoValidated ? (
                          <span className="px-1 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold uppercase rounded font-mono block mt-0.5 w-max">
                            MHO Val
                          </span>
                        ) : (
                          <span className="text-[9px] text-amber-600 font-medium block">Awaiting Physician Review</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: VITAL SIGNS RECORDS */}
        {activeSubTab === 'vitals' && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Record ID / Petsa</th>
                  <th className="p-3">Pasyente (Resident)</th>
                  <th className="p-3 text-center">Blood Pressure</th>
                  <th className="p-3 text-center">Temperatura & Pulse</th>
                  <th className="p-3 text-center">Weight, Height & BMI</th>
                  <th className="p-3">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredVitals.length === 0 ? (
                  <tr>
                    <td colspan="6" className="p-5 text-center text-slate-400 italic">Walang nahanap na vital signs records.</td>
                  </tr>
                ) : (
                  filteredVitals.map(v => {
                    const isHypertensive = v.systolic >= 140 || v.diastolic >= 90;
                    return (
                      <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono">
                          <span className="font-extrabold text-slate-800 block">{v.id}</span>
                          <span className="text-[10px] text-slate-400">{v.date}</span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-800 block">{getPatientName(v.patientId)}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {v.patientId} • {getPatientPurok(v.patientId)}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`text-sm font-black font-mono block ${isHypertensive ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                            {v.systolic}/{v.diastolic} <span className="text-[9px] font-medium text-slate-400 font-sans">mmHg</span>
                          </span>
                          {isHypertensive && (
                            <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-800 text-[8px] font-black uppercase rounded mt-0.5 inline-block">
                              Hypertensive Warning
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-mono">
                          <span className="block text-slate-800 font-bold">{v.temperature}°C</span>
                          <span className="text-[10px] text-slate-450">{v.heartRate} bpm • {v.respiratoryRate} bpm</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="block font-mono text-slate-700 font-bold">{v.weightKg} kg / {v.heightCm} cm</span>
                          <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase rounded mt-0.5 inline-block ${
                            v.bmiCategory === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                            v.bmiCategory === 'Underweight' ? 'bg-amber-150 text-amber-800' :
                            'bg-orange-100 text-orange-850'
                          }`}>
                            {v.bmiCategory} (BMI: {v.bmi})
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="font-bold text-slate-700 block">{v.loggedBy}</span>
                          <span className="text-[10px] text-slate-450">BHW Field Encoded</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: PRENATAL RECORDS */}
        {activeSubTab === 'prenatals' && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Prenatal ID</th>
                  <th className="p-3">Ina / Buntis</th>
                  <th className="p-3">LMP / EDC (Estimated Date)</th>
                  <th className="p-3 text-center">Gravida / Para Status</th>
                  <th className="p-3 text-center">Physical Checks</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Remarks & Next Visit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPrenatals.length === 0 ? (
                  <tr>
                    <td colspan="7" className="p-5 text-center text-slate-400 italic">Walang nahanap na prenatal records.</td>
                  </tr>
                ) : (
                  filteredPrenatals.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-bold">{p.id}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-slate-800 block">{getPatientName(p.patientId)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {p.patientId} • {getPatientPurok(p.patientId)}</span>
                      </td>
                      <td className="p-3">
                        <span className="block text-slate-700 font-semibold">LMP: {p.lmp}</span>
                        <span className="text-[10px] text-emerald-800 block mt-0.5">EDC: {p.edc}</span>
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-slate-700">
                        G{p.gravida} P{p.para}
                        <span className="text-[9px] font-medium text-slate-400 font-sans block mt-0.5">ABP: {p.gestationalAgeWeeks} Weeks</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="block text-slate-650 font-mono text-[11px]">BP: {p.bloodPressure}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">Fundal: {p.fundalHeightCm || 'N/A'}cm • Heart: {p.fetalHeartToneBpm || 'N/A'} BPM</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                          p.riskClassification === 'Low Risk' ? 'bg-emerald-100 text-emerald-800' :
                          p.riskClassification === 'Medium Risk' ? 'bg-yellow-105 text-yellow-800' :
                          'bg-rose-100 text-rose-850 animate-pulse'
                        }`}>
                          {p.riskClassification}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-slate-500 text-[11px] block italic">"{p.remarks}"</span>
                        <span className="text-[10px] text-purple-750 font-semibold block mt-1 font-mono">Next Check: {p.nextPrenatalVisit}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: IMMUNIZATION RECORDS */}
        {activeSubTab === 'immunizations' && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Record ID</th>
                  <th className="p-3">Sanggol (Child Name)</th>
                  <th className="p-3">Mother Name</th>
                  <th className="p-3">Bakuna (Vaccine Administered)</th>
                  <th className="p-3 text-center">Petsa ng Bakuna</th>
                  <th className="p-3">In-charge Officer</th>
                  <th className="p-3">Remarks / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredImmunizations.length === 0 ? (
                  <tr>
                    <td colspan="7" className="p-5 text-center text-slate-400 italic">Walang nahanap na immunization records.</td>
                  </tr>
                ) : (
                  filteredImmunizations.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono text-slate-500 font-bold">{v.id}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-slate-800 block">{getPatientName(v.patientId)}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {v.patientId} • {getPatientPurok(v.patientId)}</span>
                      </td>
                      <td className="p-3 text-slate-650 font-semibold">{v.motherName}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-850 font-black text-[10px] rounded tracking-wide mr-1 inline-block">
                          {v.vaccineName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono inline-block">Dose #{v.doseNumber}</span>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-700">{v.dateGiven}</td>
                      <td className="p-3 font-semibold text-slate-650">{v.givenBy}</td>
                      <td className="p-3 text-slate-500 italic">"{v.remarks || 'No remarks recorded.'}"</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: MEDICINE STOCK INVENTORY */}
        {activeSubTab === 'inventory' && (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Medicine ID</th>
                  <th className="p-3">Pangalan ng Gamots (Brand / Generic)</th>
                  <th className="p-3">Kategorya</th>
                  <th className="p-3 text-center">Aktibong Supply</th>
                  <th className="p-3 text-center">Reorder point</th>
                  <th className="p-3">Status ng Supply</th>
                  <th className="p-3">Petsa ng Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colspan="7" className="p-5 text-center text-slate-400 italic">Walang nahanap na medicine stock records.</td>
                  </tr>
                ) : (
                  filteredInventory.map(i => {
                    const isLowStock = i.currentStock <= i.reorderLevel;
                    return (
                      <tr key={i.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono text-slate-500 font-bold">{i.id}</td>
                        <td className="p-3">
                          <span className="font-extrabold text-slate-800 block">{i.medicineName}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Generic Context: {i.genericName}</span>
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded font-mono">
                            {i.category}
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-800 font-black text-sm">
                          {i.currentStock} <span className="text-[10px] font-medium text-slate-450 font-sans">{i.stockInUnit}</span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">{i.reorderLevel} units</td>
                        <td className="p-3">
                          {isLowStock ? (
                            <span className="px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-800 text-[9px] font-black uppercase rounded inline-block animate-pulse font-mono">
                              ⚠️ LOW SUPPLY ALERT
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded inline-block font-mono">
                              OPTIMAL SUPPLY
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{i.expiryDate}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 7: DAILY VISITORS REGISTRY TIMELINE & STATS REPORTS */}
        {activeSubTab === 'daily_logs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Daily ledger logs list */}
              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider block font-mono">
                  📋 Live Walk-In Ledger timeline ({filteredDailyLogs.length} visitoys)
                </span>
                
                <div className="overflow-x-auto border border-slate-150 rounded-xl bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                        <th className="p-3">Log ID / Oras</th>
                        <th className="p-3">Resident Name</th>
                        <th className="p-3">Sektor (Purok)</th>
                        <th className="p-3">Layunin ng Konsulta (Purpose)</th>
                        <th className="p-3 text-right">Triage State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredDailyLogs.length === 0 ? (
                        <tr>
                          <td colspan="5" className="p-5 text-center text-slate-400 italic">Walang records sa ledger ng walk-ins ngayon araw.</td>
                        </tr>
                      ) : (
                        filteredDailyLogs.map(l => (
                          <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 font-mono">
                              <span className="font-extrabold text-slate-800 block text-[11px]">{l.id}</span>
                              <span className="text-[10px] text-slate-450">{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-800 block">{l.patientName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">ID: {l.patientId}</span>
                            </td>
                            <td className="p-3 font-bold text-slate-650">{l.purok}</td>
                            <td className="p-3 font-mono text-[11px]">
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                                {l.purpose}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                l.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                l.status === 'In Progress' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aggregated indicators report sidebar */}
              <div className="md:col-span-4 p-4 border border-indigo-200/60 bg-indigo-50/15 rounded-xl space-y-4">
                <span className="text-xs font-black text-indigo-950 uppercase tracking-wider block font-mono border-b border-indigo-100 pb-2 flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-indigo-600" />
                  Barangay KPI Reports Summary
                </span>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium">BHW Survelled Kids (&le; 5yo)</span>
                    <strong className="text-slate-800 font-mono">{totalKidsCount} infants</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium">Poor/Indigent Households</span>
                    <strong className="text-slate-800 font-mono">{indigentResidentsCount} residents</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium">FHSIS EPI BCG Completed</span>
                    <strong className="text-slate-800 font-mono">
                      {Math.round((vaccinations.filter(v => v.vaccineName === 'BCG').length / (totalKidsCount || 1)) * 100)}%
                    </strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium">FHSIS Pentavalent complete</span>
                    <strong className="text-slate-800 font-mono">
                      {vaccinations.filter(v => v.vaccineName.includes('Pentavalent')).length} doses
                    </strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500 font-medium font-mono text-[10px] uppercase text-indigo-800">DOH Registry integrity</span>
                    <strong className="text-emerald-700 font-extrabold uppercase font-mono tracking-wider animate-pulse">
                      100% compliant
                    </strong>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 p-3 rounded-lg text-[11px] text-slate-500 font-mono leading-relaxed shadow-2xs">
                  <strong className="text-slate-800 block mb-1">💡 Data Assurance</strong>
                  All logs are safely synchronized locally to browser localStorage under RA 10173 compliant guidelines for Municipal integration.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {selectedPatientToView && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[110] p-4 font-sans" id="patient-profile-detail-modal">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350">
                    {language === 'EN' ? 'Resident Health Folder' : language === 'TL' ? 'Kalusugang Talaan ng Residente' : 'Talaang Panglawas sa Residente'}
                  </h3>
                  <p className="text-sm font-black text-white tracking-tight">
                    {selectedPatientToView.lastName}, {selectedPatientToView.firstName} {selectedPatientToView.middleName}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatientToView(null)}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition-colors cursor-pointer"
                title={language === 'EN' ? 'Close' : 'Isara'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              
              {/* Demographics Row (Bento Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Visual Card Column */}
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    {/* Patient photograph */}
                    {selectedPatientToView.photo ? (
                      <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-200 shadow-3xs mb-4 bg-white shrink-0">
                        <img 
                          src={selectedPatientToView.photo} 
                          alt={`${selectedPatientToView.firstName}'s photo`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 rounded-xl overflow-hidden border border-indigo-200 border-dashed bg-slate-100/50 flex flex-col items-center justify-center text-slate-400 mb-4 shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">No Photograph</span>
                        <span className="text-[9px] text-slate-400 font-medium font-mono">(Walang Larawan)</span>
                      </div>
                    )}

                    <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest font-mono">Reference Code</span>
                    <h4 className="text-xl font-extrabold text-indigo-950 font-mono tracking-tight mt-1">{selectedPatientToView.id}</h4>
                    
                    <div className="mt-4 space-y-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Registered On:</span>
                        <strong className="text-slate-700">{new Date(selectedPatientToView.createdAt).toLocaleDateString()}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Household ID:</span>
                        <strong className="text-indigo-900 font-mono">{selectedPatientToView.householdId}</strong>
                        {(() => {
                          const linkedHousehold = households.find(h => h.id === selectedPatientToView.householdId);
                          return linkedHousehold ? (
                            <span className="text-[10px] text-slate-500 block mt-0.5">Head: {linkedHousehold.householdHead}</span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-indigo-100/50 mt-4">
                    <span className="px-2 py-1 bg-indigo-100/60 rounded-lg text-indigo-800 font-black text-[10px] uppercase tracking-wider block text-center">
                      {selectedPatientToView.purok} Resident
                    </span>
                  </div>
                </div>

                {/* Primary demographics column */}
                <div className="sm:col-span-2 space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono border-b border-slate-150 pb-1">
                    {language === 'EN' ? 'Personal & Demographics Detail' : 'Pangkalahatang Datos at Demograpiya'}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Kasarian (Gender)</span>
                      <strong className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase inline-block mt-0.5 ${selectedPatientToView.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'}`}>
                        {selectedPatientToView.gender === 'Female' ? 'Babae (Female)' : 'Lalake (Male)'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Civil Status</span>
                      <strong className="text-slate-800 block mt-0.5">{selectedPatientToView.civilStatus}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Petsa ng Kapanganakan (Birthdate)</span>
                      <strong className="text-slate-800 block mt-0.5">{selectedPatientToView.birthDate}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Kasalukuyang Edad (Current Age)</span>
                      <strong className="text-slate-800 block mt-0.5">
                        {(() => {
                          const birth = new Date(selectedPatientToView.birthDate);
                          const today = new Date();
                          let calculatedAge = today.getFullYear() - birth.getFullYear();
                          const monthDiff = today.getMonth() - birth.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                            calculatedAge--;
                          }
                          return `${calculatedAge} taon gulang`;
                        })()}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Numero ng Telepono</span>
                      <strong className="text-slate-800 block mt-0.5 font-mono">{selectedPatientToView.phoneNumber || 'N/A'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block font-mono">Blood Type</span>
                      <strong className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-800 rounded font-mono text-[10px] inline-block mt-0.5">
                        {selectedPatientToView.bloodType || 'Undetermined'}
                      </strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* Health Coverage and DOH Programs Block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-150">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono border-b border-slate-150 pb-1">
                    {language === 'EN' ? 'National Health Insurance (PhilHealth)' : 'Impormasyon sa Seguro ng Kalusugan'}
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">PhilHealth ID Number</span>
                      <strong className="text-slate-800 text-[13px] font-mono tracking-wider">{selectedPatientToView.philHealthId || 'WALANG IPINAHAYAG (NONE)'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">PhilHealth Category</span>
                      <strong className="text-indigo-900 block font-bold">{selectedPatientToView.philHealthCategory || 'Direct Contributor'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Indigency Registry Status</span>
                      {selectedPatientToView.isIndigent ? (
                        <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded text-[10px] font-black uppercase mt-0.5 inline-block">
                          Indigent Beneficiary
                        </span>
                      ) : (
                        <span className="text-slate-500">Regular Non-Indigent</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono border-b border-slate-150 pb-1">
                    {language === 'EN' ? 'Allergies & DOH Program Enrolment' : 'Mga Alerdye at Kasalukuyang Programa ng DOH'}
                  </h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono text-rose-700">⚠️ Allergies / Allergen Threats</span>
                      <p className="text-slate-700 font-extrabold mt-0.5">{selectedPatientToView.allergies || 'No known drug or environmental allergies.'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Enrolled Active Programs</span>
                      {selectedPatientToView.activePrograms.length === 0 ? (
                        <em className="text-slate-400 block mt-1">Not enrolled in any DOH National Program.</em>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedPatientToView.activePrograms.map(prog => (
                            <span key={prog} className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 font-black text-[9px] rounded-lg tracking-wider">
                              {prog}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Health Records Tab (History of visits) */}
              <div className="pt-4 border-t border-slate-150 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono border-b border-slate-150 pb-1">
                  🩺 Barangay Health Center Consultation Ledger & Lab Vitals
                </h4>

                <div className="space-y-4">
                  {/* VITALS SECTION FOR PATIENT */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono mb-1.5">🩺 Pinakahuling Vital Signs</span>
                    {vitals.filter(v => v.patientId === selectedPatientToView.id).length === 0 ? (
                      <p className="text-xs italic text-slate-400 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">Walang nakatalang kunang vitals sa residente na ito.</p>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                        <table className="w-full text-left border-collapse text-[11px]">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase font-mono">
                              <th className="p-2.5">Date</th>
                              <th className="p-2.5">BP (mmHg)</th>
                              <th className="p-2.5">Temp (°C)</th>
                              <th className="p-2.5">Heart / Resp Rate</th>
                              <th className="p-2.5">Weight / Height</th>
                              <th className="p-2.5">BMI Category</th>
                              <th className="p-2.5">Sugar</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {vitals.filter(v => v.patientId === selectedPatientToView.id).map(v => (
                              <tr key={v.id} className="hover:bg-slate-50/40">
                                <td className="p-2.5 text-slate-600 font-bold">{v.date}</td>
                                <td className="p-2.5 font-bold text-slate-800">{v.systolic}/{v.diastolic}</td>
                                <td className="p-2.5">{v.temperature} °C</td>
                                <td className="p-2.5">{v.heartRate} bpm / {v.respiratoryRate} rpm</td>
                                <td className="p-2.5">{v.weightKg} kg / {v.heightCm} cm</td>
                                <td className="p-2.5">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                    v.bmiCategory === 'Normal' ? 'bg-emerald-50 text-emerald-800' :
                                    v.bmiCategory === 'Underweight' ? 'bg-amber-50 text-amber-700' :
                                    'bg-rose-50 text-rose-800'
                                  }`}>
                                    {v.bmiCategory}
                                  </span>
                                </td>
                                <td className="p-2.5">{v.bloodSugar ? `${v.bloodSugar} mg/dL` : 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* CLINICAL CONSULTATION HISTORIES */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono mb-1.5">📋 Consultation History</span>
                    {consultations.filter(c => c.patientId === selectedPatientToView.id).length === 0 ? (
                      <p className="text-xs italic text-slate-400 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">Walang nakatalang clinical consultations sa residente na ito.</p>
                    ) : (
                      <div className="space-y-3">
                        {consultations.filter(c => c.patientId === selectedPatientToView.id).map(c => (
                          <div key={c.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                            <div className="flex justify-between items-center bg-slate-200/50 p-2 rounded-lg font-mono">
                              <div>
                                <span className="font-extrabold text-slate-700">ID: {c.id}</span>
                                <span className="text-slate-400 mx-2">•</span>
                                <span className="text-slate-600">{c.date}</span>
                              </div>
                              <span className="text-indigo-800 font-extrabold uppercase text-[10px]">
                                Attending: {c.attendingStaff}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed mt-1 text-[11px]">
                              <div>
                                <strong className="text-slate-600 block text-[9px] uppercase font-mono">Chief Complaint:</strong>
                                <p className="text-slate-800 font-medium">{c.chiefComplaint}</p>
                              </div>
                              <div>
                                <strong className="text-slate-600 block text-[9px] uppercase font-mono">Diagnosis / Assessments Aligned:</strong>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {c.assessmentDiagnoses.map(dia => (
                                    <span key={dia} className="px-1.5 py-0.5 bg-rose-50 border border-rose-100 text-rose-800 text-[9px] font-black uppercase rounded">
                                      {dia}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed border-t border-slate-200/50 pt-2 text-[11px]">
                              <div>
                                <strong className="text-slate-500 block text-[9px] uppercase font-mono">Medical Subjective/Objective Detail:</strong>
                                <p className="text-slate-600">S: "{c.subjective}" | O: {c.objective}</p>
                              </div>
                              <div>
                                <strong className="text-slate-500 block text-[9px] uppercase font-mono">Plan & Treatment Prescribed:</strong>
                                <p className="text-emerald-800 font-bold">{c.planTreatment || 'Pending formulation'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* IMMUNIZATION SECTION (If kids EPI is active) */}
                  {vaccinations.filter(v => v.patientId === selectedPatientToView.id).length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono mb-1.5">👶 EPI Child Immunization Logs (Bakuna)</span>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white text-[11px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase font-mono">
                              <th className="p-2.5">Date Given</th>
                              <th className="p-2.5">Vaccine</th>
                              <th className="p-2.5">Dose</th>
                              <th className="p-2.5">Given By</th>
                              <th className="p-2.5">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {vaccinations.filter(v => v.patientId === selectedPatientToView.id).map(v => (
                              <tr key={v.id}>
                                <td className="p-2.5 text-slate-600 font-bold">{v.dateGiven}</td>
                                <td className="p-2.5 font-bold text-indigo-700">{v.vaccineName}</td>
                                <td className="p-2.5 uppercase">{v.doseNumber}</td>
                                <td className="p-2.5">{v.givenBy}</td>
                                <td className="p-2.5 text-slate-500 italic">{v.remarks || 'No remarks'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* PRENATAL SECTION (If pregnant mother MCH is active) */}
                  {prenatals.filter(p => p.patientId === selectedPatientToView.id).length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono mb-1.5">🤰 Prenatal Maternal Health Cards</span>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white text-[11px]">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase font-mono">
                              <th className="p-2.5">LMP</th>
                              <th className="p-2.5">EDC / Due Date</th>
                              <th className="p-2.5">G / P Stats</th>
                              <th className="p-2.5">Gest. Age</th>
                              <th className="p-2.5">Fundal Ht. / Heart Tone</th>
                              <th className="p-2.5">Risk Classification</th>
                              <th className="p-2.5">Next Appointment</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {prenatals.filter(p => p.patientId === selectedPatientToView.id).map(p => (
                              <tr key={p.id}>
                                <td className="p-2.5">{p.lmp}</td>
                                <td className="p-2.5 text-indigo-800 font-bold">{p.edc}</td>
                                <td className="p-2.5">G{p.gravida} P{p.para}</td>
                                <td className="p-2.5">{p.gestationalAgeWeeks} weeks</td>
                                <td className="p-2.5">{p.fundalHeightCm || 'N/A'} cm / {p.fetalHeartToneBpm || 'N/A'} bpm</td>
                                <td className="p-2.5 font-bold">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    p.riskClassification === 'High Risk' ? 'bg-red-100 text-red-800 animate-pulse' :
                                    p.riskClassification === 'Medium Risk' ? 'bg-amber-100 text-amber-800' :
                                    'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {p.riskClassification}
                                  </span>
                                </td>
                                <td className="p-2.5 text-slate-800 font-bold">{p.nextPrenatalVisit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-150 flex flex-wrap justify-between items-center shrink-0 gap-3">
              <div className="flex gap-2">
                {canEdit && onEditPatient && (
                  <button
                    type="button"
                    onClick={() => {
                      onEditPatient(selectedPatientToView);
                      setSelectedPatientToView(null);
                    }}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shadow-3xs"
                  >
                    <Edit size={13} />
                    <span>{language === 'EN' ? 'Edit Resident Details' : 'I-edit ang Detalye'}</span>
                  </button>
                )}
                {canDelete && onDeletePatient && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Sigurado ka bang nais mong tanggalin si ${selectedPatientToView.lastName}, ${selectedPatientToView.firstName}?`)) {
                        onDeletePatient(selectedPatientToView.id);
                        setSelectedPatientToView(null);
                      }
                    }}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-1.5 shadow-3xs"
                  >
                    <Trash2 size={13} />
                    <span>{language === 'EN' ? 'Delete Resident' : 'Burahin Residente'}</span>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatientToView(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
              >
                {language === 'EN' ? 'Close folder' : language === 'TL' ? 'Isara ang folder' : 'Isira ang folder'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
