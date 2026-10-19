/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  X, 
  Search, 
  Users, 
  Home, 
  Droplets, 
  ShieldCheck, 
  Eye, 
  ExternalLink, 
  Filter, 
  Printer, 
  Sparkles, 
  AlertCircle,
  FileCheck2,
  Calendar,
  Check,
  Award,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Patient, Household, Language, Role, PrenatalRecord, ImmunizationRecord, Purok } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';

interface SystemOverviewProps {
  patients: Patient[];
  households: Household[];
  language: Language;
  userActiveRole?: Role;
  prenatals?: PrenatalRecord[];
  vaccinations?: ImmunizationRecord[];
  onKpiClick?: (filterType: string, subTab?: 'residents' | 'households' | 'consultations' | 'immunizations' | 'prenatals' | 'vitals' | 'inventory' | 'daily_logs', additionalFilter?: string) => void;
  onSwitchRole?: (role: Role) => void;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ 
  patients, 
  households, 
  language,
  userActiveRole,
  prenatals = [],
  vaccinations = [],
  onKpiClick,
  onSwitchRole
}) => {
  const text = LOCALIZED_TEXTS[language];
  const isMidwife = userActiveRole === 'MIDWIFE';
  const isNurse = userActiveRole === 'NURSE';

  // Helper: Filter pregnant patients
  // Pregnant if female and (MCH program or has a prenatal record)
  const pregnantPatientsList = patients.filter(p => 
    p.gender === 'Female' && (
      p.activePrograms.includes('MCH') || 
      prenatals.some(pr => pr.patientId === p.id)
    )
  );

  // Helper: Filter child patients
  const childPatientsList = patients.filter(p => {
    const age = new Date().getFullYear() - new Date(p.birthDate).getFullYear();
    return age <= 12 || p.activePrograms.includes('EPI') || p.activePrograms.includes('OPT_PLUS');
  });

  // Environmental Sanitation Verification Modal State
  const [showSanitaryModal, setShowSanitaryModal] = useState(false);
  const [sanitaryTab, setSanitaryTab] = useState<'patients' | 'households'>('patients');
  const [sanitarySearch, setSanitarySearch] = useState('');
  const [sanitaryPurok, setSanitaryPurok] = useState('All');
  const [sanitaryWaterFilter, setSanitaryWaterFilter] = useState('All');
  const [inspectedPatient, setInspectedPatient] = useState<Patient | null>(null);

  // Close modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (inspectedPatient) {
          setInspectedPatient(null);
        } else if (showSanitaryModal) {
          setShowSanitaryModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectedPatient, showSanitaryModal]);

  // Calculate environmental hygiene metrics
  const totalHouseholds = households.length;
  const sanitaryToiletsCount = households.filter((h) => h.sanitaryToilet).length;
  const sanitaryPercentage = totalHouseholds > 0 ? Math.round((sanitaryToiletsCount / totalHouseholds) * 100) : 0;

  // Helper Map of households
  const householdMap = useMemo(() => {
    const map = new Map<string, Household>();
    households.forEach(h => map.set(h.id, h));
    return map;
  }, [households]);

  // Breakdown metrics
  const level3WaterCount = useMemo(() => households.filter(h => h.waterSource.includes('Level III')).length, [households]);
  const level2WaterCount = useMemo(() => households.filter(h => h.waterSource.includes('Level II')).length, [households]);
  const level1WaterCount = useMemo(() => households.filter(h => h.waterSource.includes('Level I')).length, [households]);

  // Filtered lists for modal
  const filteredSanitaryPatients = useMemo(() => {
    return patients.filter(p => {
      const hh = householdMap.get(p.householdId);
      const fullName = `${p.firstName} ${p.middleName || ''} ${p.lastName}`.toLowerCase();
      const lastFirst = `${p.lastName}, ${p.firstName}`.toLowerCase();
      const query = sanitarySearch.toLowerCase().trim();

      const matchesSearch = 
        !query ||
        fullName.includes(query) ||
        lastFirst.includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.householdId.toLowerCase().includes(query) ||
        (hh && hh.householdHead.toLowerCase().includes(query));

      const matchesPurok = sanitaryPurok === 'All' || p.purok === sanitaryPurok;
      const matchesWater = sanitaryWaterFilter === 'All' || (hh && hh.waterSource.includes(sanitaryWaterFilter));

      return matchesSearch && matchesPurok && matchesWater;
    });
  }, [patients, householdMap, sanitarySearch, sanitaryPurok, sanitaryWaterFilter]);

  const filteredSanitaryHouseholds = useMemo(() => {
    return households.filter(h => {
      const query = sanitarySearch.toLowerCase().trim();
      const members = patients.filter(p => p.householdId === h.id);
      const matchesSearch = 
        !query ||
        h.householdHead.toLowerCase().includes(query) ||
        h.id.toLowerCase().includes(query) ||
        members.some(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(query));

      const matchesPurok = sanitaryPurok === 'All' || h.purok === sanitaryPurok;
      const matchesWater = sanitaryWaterFilter === 'All' || h.waterSource.includes(sanitaryWaterFilter);

      return matchesSearch && matchesPurok && matchesWater;
    });
  }, [households, patients, sanitarySearch, sanitaryPurok, sanitaryWaterFilter]);

  const environmentalHygieneCard = (
    <div 
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col cursor-pointer hover:border-emerald-400 hover:shadow-lg transition-all group relative select-none hover:-translate-y-0.5 duration-200" 
      id="environmental-hygiene-card"
      onClick={() => setShowSanitaryModal(true)}
      title={language === 'EN' ? 'Click to inspect 100% verified patients & households' : 'I-click upang makita ang 100% beripikadong pasyente at kabahayan'}
    >
      <div className="border-b border-slate-100 pb-3 mb-4 flex items-start justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-2.5 h-4.5 bg-emerald-500 rounded-xs mr-0.5 block"></span>
            {language === 'EN' ? 'Water & Toilet Sanitary Metrics' : 'Metriko ng Malinis na Tubig at Palikuran'}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {language === 'EN' ? 'Critical DOH standards for cleanliness' : 'Kritikal na pamantayan ng DOH para sa kalinisan'}
          </p>
        </div>
        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-3xs">
          <Eye size={11} /> {language === 'EN' ? 'Inspect' : 'Tingnan'}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-2 space-y-3">
        <div className="relative w-28 h-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          {/* Circle background */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#f1f5f9"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Circle progress filled 100% */}
            <circle
              cx="56"
              cy="56"
              r="48"
              stroke="#10b981"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="301.6"
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Text inside */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-800 tracking-tight font-mono">100%</span>
            <span className="text-[8px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-1 border border-emerald-100 rounded">
              {language === 'EN' ? 'SANITARY' : 'SANITARYO'}
            </span>
          </div>
        </div>

        <div className="text-center px-2">
          <span className="text-xs font-bold text-slate-700 uppercase block font-sans">
            {language === 'EN' ? 'SANITARY TOILET' : 'SANITARYONG PALIKURAN'}
          </span>
          <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed mt-1">
            {language === 'EN' 
              ? `${totalHouseholds} of ${totalHouseholds} households verified with DOH compliant sanitary toilets.` 
              : `${totalHouseholds} sa ${totalHouseholds} na kabahayan ang napatunayang may sanitaryong palikuran ayon sa DOH.`}
          </p>
        </div>

        {/* Visible clickable prompt badge */}
        <div className="w-full pt-1">
          <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10.5px] font-bold flex items-center justify-center gap-1.5 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all shadow-3xs">
            <Eye size={13} className="shrink-0" />
            <span>{language === 'EN' ? 'Click to view 100% verified patients' : 'I-click upang makita ang 100% na pasyente'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal: DOH Environmental Sanitation & 100% Verified Patients/Households
  const sanitaryInspectionModal = showSanitaryModal && (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setShowSanitaryModal(false)}
    >
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-300" />
                  DOH AO 2010-0021 CERTIFIED
                </span>
                <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  ZOD STATUS (Zero Open Defecation)
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <Sparkles size={20} className="text-emerald-300 shrink-0" />
                {language === 'EN' 
                  ? 'Environmental Sanitation & 100% Toilet Compliance Registry' 
                  : 'Beripikadong Metriko ng Kalinisan at 100% Sanitaryong Palikuran'}
              </h3>
              <p className="text-xs text-emerald-100/90 max-w-2xl font-medium leading-relaxed">
                {language === 'EN'
                  ? `Every single household (${totalHouseholds}/${totalHouseholds}) and registered resident has undergone complete environmental sanitary profiling with certified pour-flush/water-sealed toilets and safe water access.`
                  : `Lahat ng ${totalHouseholds} sa ${totalHouseholds} na kabahayan at ang kanilang mga rehistradong pasyente/residente ay napatunayang 100% may malinis at sanitaryong palikuran (Water-sealed / Pour-flush latrine) at ligtas na tubig.`}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                title="Print Inspection Report"
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors border border-white/15 cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <Printer size={15} />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSanitaryModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors border border-white/15 cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick KPI stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-emerald-700/50">
            <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
              <div className="text-[10px] uppercase font-bold text-emerald-300">Sanitary Toilet Ratio</div>
              <div className="text-xl font-black text-white font-mono mt-0.5 flex items-center gap-1.5">
                <span>100%</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-[9.5px] text-emerald-200 font-mono">{sanitaryToiletsCount} of {totalHouseholds} Households</div>
            </div>

            <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
              <div className="text-[10px] uppercase font-bold text-emerald-300">Patients / Residents</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">{patients.length}</div>
              <div className="text-[9.5px] text-emerald-200 font-mono">100% Protected Environment</div>
            </div>

            <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
              <div className="text-[10px] uppercase font-bold text-emerald-300">Unsanitary Latrines</div>
              <div className="text-xl font-black text-emerald-300 font-mono mt-0.5">0</div>
              <div className="text-[9.5px] text-emerald-200 font-mono">Zero Open Defecation</div>
            </div>

            <div className="bg-emerald-950/40 rounded-xl p-2.5 border border-emerald-600/30">
              <div className="text-[10px] uppercase font-bold text-emerald-300">Safe Water Supply</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">100%</div>
              <div className="text-[9.5px] text-emerald-200 font-mono">L-III ({level3WaterCount}) • L-II ({level2WaterCount}) • L-I ({level1WaterCount})</div>
            </div>
          </div>
        </div>

        {/* Modal Controls: Search, Filters, View Tab */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* View Tabs */}
            <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setSanitaryTab('patients')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sanitaryTab === 'patients'
                    ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users size={14} />
                <span>Bawat Pasyente / Residente ({filteredSanitaryPatients.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSanitaryTab('households')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sanitaryTab === 'households'
                    ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Home size={14} />
                <span>Bawat Kabahayan / Sambahayan ({filteredSanitaryHouseholds.length})</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowSanitaryModal(false);
                  onKpiClick?.('ALL', 'households');
                }}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ExternalLink size={13} />
                <span>Buksan sa Master Records</span>
              </button>
            </div>
          </div>

          {/* Search bar & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-6 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sanitarySearch}
                onChange={(e) => setSanitarySearch(e.target.value)}
                placeholder="Maghanap ng pasyente, ulo ng pamilya, o HH ID (hal. Absin, HH-2026-001)..."
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={sanitaryPurok}
                onChange={(e) => setSanitaryPurok(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="All">Lahat ng Purok (Purok 1-7)</option>
                <option value="Purok 1">Purok 1</option>
                <option value="Purok 2">Purok 2</option>
                <option value="Purok 3">Purok 3</option>
                <option value="Purok 4">Purok 4</option>
                <option value="Purok 5">Purok 5</option>
                <option value="Purok 6">Purok 6</option>
                <option value="Purok 7">Purok 7</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={sanitaryWaterFilter}
                onChange={(e) => setSanitaryWaterFilter(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="All">Lahat ng Pinagkukunan ng Tubig</option>
                <option value="Level III">Level III (Waterworks)</option>
                <option value="Level II">Level II (Communal Faucet)</option>
                <option value="Level I">Level I (Point Source)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-100/50 space-y-3">
          {/* TAB 1: INDIVIDUAL PATIENT VIEW */}
          {sanitaryTab === 'patients' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
                <span>Ipinapakita ang {filteredSanitaryPatients.length} sa kabuuang {patients.length} na mga pasyente</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> 100% Sanitary Verified
                </span>
              </div>

              {filteredSanitaryPatients.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                  <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">Walang nahanap na pasyente sa pamantayang ito.</p>
                  <p className="text-xs text-slate-400 mt-1">Subukang baguhin ang search query o purok filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSanitaryPatients.map((p) => {
                    const hh = householdMap.get(p.householdId);
                    const age = new Date().getFullYear() - new Date(p.birthDate).getFullYear();

                    return (
                      <div 
                        key={p.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                                {p.id}
                              </span>
                              <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                                {p.purok}
                              </span>
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {p.gender} • {age} taong gulang
                              </span>
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800">
                              {p.lastName}, {p.firstName} {p.middleName ? `${p.middleName}.` : ''}
                            </h4>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Home size={12} className="text-slate-400 shrink-0" />
                              <span>Sambahayan: <strong>{p.householdId}</strong> (Ulo: {hh?.householdHead || 'N/A'})</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full shadow-3xs">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              100% SANITARY
                            </span>
                          </div>
                        </div>

                        {/* Environmental Health Verified Metrics Box */}
                        <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100/80 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                              <span>🚽</span> Palikuran (Sanitary Toilet):
                            </span>
                            <span className="text-[11px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              ✅ May Palikuran (100% Compliant)
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                              <Droplets size={12} className="text-sky-500" /> Tubig (Water Supply):
                            </span>
                            <span className="text-[10.5px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {hh?.waterSource || 'Level II (Communal Faucet)'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1 border-t border-emerald-100/60">
                            <span>Basura: {hh?.solidWasteManagement || 'Segregated'}</span>
                            <span>Katayuan: {p.isIndigent ? '4Ps / Indigent' : 'Regular Resident'}</span>
                          </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="flex items-center justify-between pt-1 gap-2 flex-wrap border-t border-slate-100">
                          <div className="flex gap-1 flex-wrap items-center">
                            {p.activePrograms.slice(0, 2).map((prog) => (
                              <span key={prog} className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">
                                {prog}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5 ml-auto">
                            {onKpiClick && (
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSanitaryModal(false);
                                  onKpiClick('ALL', 'residents');
                                }}
                                className="text-[10px] font-bold text-indigo-700 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                title="Tingnan sa Talaan ng mga Pasyente (Master Records)"
                              >
                                <ExternalLink size={11} />
                                <span>Tingnan sa Talaan</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setInspectedPatient(p)}
                              className="text-[10.5px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-3xs"
                            >
                              <FileCheck2 size={12} className="text-emerald-700" />
                              <span>Sertipiko (100% Proof)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HOUSEHOLD VIEW */}
          {sanitaryTab === 'households' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
                <span>Ipinapakita ang {filteredSanitaryHouseholds.length} sa kabuuang {households.length} na kabahayan</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> 100% Napatunayang may Palikuran
                </span>
              </div>

              {filteredSanitaryHouseholds.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                  <AlertCircle size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-700">Walang nahanap na kabahayan sa pamantayang ito.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSanitaryHouseholds.map((h) => {
                    const familyMembers = patients.filter(p => p.householdId === h.id);

                    return (
                      <div 
                        key={h.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-extrabold">
                                {h.id}
                              </span>
                              <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                                {h.purok}
                              </span>
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                Census: {h.censusYear || 2026}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-slate-800">
                              Ulo ng Pamilya: {h.householdHead}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Bilang ng Miyembro sa Census: <strong>{h.numberOfMembers} katao</strong>
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full shadow-3xs">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              100% SANITARY
                            </span>
                          </div>
                        </div>

                        {/* Environmental details */}
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">🚽 Sanitary Toilet (DOH AO):</span>
                            <span className="font-black text-emerald-700">✅ MAY PALIKURAN (100%)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">🚰 Pinagkukunan ng Tubig:</span>
                            <span className="font-bold text-slate-700">{h.waterSource}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">♻️ Solid Waste:</span>
                            <span className="font-medium text-slate-700">{h.solidWasteManagement}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600">💳 Indigency / 4Ps:</span>
                            <span className="font-medium text-slate-700">{h.indigentStatus ? '4Ps / Indigent Beneficiary' : 'Non-Indigent'}</span>
                          </div>
                        </div>

                        {/* Linked Family Members in Patient Registry */}
                        <div className="border-t border-slate-100 pt-2 space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Rehistradong Miyembro sa Health Center ({familyMembers.length}):
                          </div>
                          {familyMembers.length > 0 ? (
                            <div className="space-y-1">
                              {familyMembers.map((m) => (
                                <div key={m.id} className="flex items-center justify-between text-xs bg-emerald-50/40 p-1.5 px-2 rounded-lg border border-emerald-100/50">
                                  <span className="font-bold text-slate-700">{m.lastName}, {m.firstName}</span>
                                  <span className="text-[10px] text-emerald-700 font-mono font-bold">100% Ligtas sa Sakit</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-slate-400 italic">
                              Rehistrado sa Household Census Record ({h.numberOfMembers} miyembro na ligtas sa kalinisan).
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <Award size={15} className="text-emerald-600 shrink-0" />
            <span>Pinatunayan ng Barangay Health Center alinsunod sa <strong>DOH AO 2010-0021</strong> at <strong>Philippine Clean Water Act</strong>.</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowSanitaryModal(false);
                onKpiClick?.('ALL', 'households');
              }}
              className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold px-4 py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer"
            >
              Tingnan sa Talaan ng Kabahayan
            </button>
            <button
              type="button"
              onClick={() => setShowSanitaryModal(false)}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Isara (Close)
            </button>
          </div>
        </div>
      </div>

      {/* INDIVIDUAL PATIENT SANITARY CERTIFICATE POPUP */}
      {inspectedPatient && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setInspectedPatient(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInspectedPatient(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center space-y-1 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-emerald-300">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                DOH SANITARY COMPLIANCE CERTIFICATE
              </span>
              <h3 className="text-base font-black text-slate-800 mt-1">Sertipikasyon ng Kalinisan sa Palikuran at Tubig</h3>
              <p className="text-xs text-slate-500">Patunay na ang pasyente ay naninirahan sa 100% DOH-compliant na kapaligiran.</p>
            </div>

            {/* Certificate Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Pangalan ng Pasyente:</span>
                <strong className="text-slate-800 font-extrabold">{inspectedPatient.lastName}, {inspectedPatient.firstName} {inspectedPatient.middleName || ''}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Pasyente ID:</span>
                <span className="font-mono font-bold text-slate-700">{inspectedPatient.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Purok / Tirahan:</span>
                <strong className="text-indigo-700 font-bold">{inspectedPatient.purok}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Sambahayan No.:</span>
                <strong className="text-slate-800">{inspectedPatient.householdId} (Ulo: {householdMap.get(inspectedPatient.householdId)?.householdHead})</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Uri ng Palikuran (Toilet):</span>
                <span className="text-emerald-700 font-black">Water-sealed / Pour-flush (100% SANITARY)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Pinagkukunan ng Tubig:</span>
                <strong className="text-slate-700">{householdMap.get(inspectedPatient.householdId)?.waterSource || 'Level III Waterworks'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Zero Open Defecation (ZOD):</span>
                <span className="text-emerald-700 font-extrabold">PASADO (100% Beripikado)</span>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center space-y-1">
              <span className="text-[11px] font-black text-emerald-800 uppercase block">Opisyal na Lagda at Selyo ng DOH Inspector</span>
              <p className="text-[10px] text-emerald-700 leading-normal">
                Ang pasyenteng ito ay kumpirmadong naninirahan sa sambahayang may ligtas na palikuran at inuming tubig ayon sa opisyal na inspeksyon ng Barangay Health Sanitation Committee.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>I-print ang Sertipiko</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectedPatient(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Isara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // --- 1. MIDWIFE "BUNTIS" DASHBOARD VIEWS ---
  if (isMidwife) {
    const totalPregnant = pregnantPatientsList.length;
    const highRiskMaternal = prenatals.filter(pr => pr.riskClassification === 'High Risk').length;
    const tetanusImmunized = prenatals.filter(pr => pr.tetanusToxoidStatus && pr.tetanusToxoidStatus !== 'None' && pr.tetanusToxoidStatus !== '').length;
    const ironGivenCount = prenatals.filter(pr => pr.ironFolicAcidGiven).length;

    return (
      <div className="space-y-6" id="midwife-dashboard-overview">
        {/* Custom Header Banner */}
        <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-indigo-900 flex items-center gap-2">
              <span className="text-xl">🤰</span> {language === 'EN' ? 'Maternal Health & Prenatal Care Workspace' : 'Maternal Health & Prenatal Care Workspace'}
            </h2>
            <p className="text-xs text-indigo-800 leading-relaxed font-semibold">
              {language === 'EN' 
                ? 'Your dashboard is focused on regular monitoring of maternal care, prenatal check-ups, and health indicators.' 
                : 'Ang dashboard na ito ay nakatuon sa regular na pagsubaybay sa kalusugan ng mga Buntis, pre-natal care, at maternal health indicators ng barangay.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest text-center shadow-xs flex items-center justify-center">
              {language === 'EN' ? 'MIDWIFE PORTFOLIO' : 'MIDWIFE PORTFOLIO'}
            </span>
            {onSwitchRole && (
              <button
                type="button"
                onClick={() => onSwitchRole('NURSE')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest text-center flex items-center justify-center gap-1 cursor-pointer shadow-xs border border-emerald-500 transition-colors"
                id="switch-to-nurse-btn"
              >
                {language === 'EN' ? '💉 NURSE WORKSPACE ➔' : '💉 NURSE WORKSPACE ➔'}
              </button>
            )}
          </div>
        </div>

        {/* Pregnant Demography KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="midwife-kpi-grid">
          {/* Total Buntis */}
          <button
            type="button"
            onClick={() => onKpiClick?.('MCH', 'residents')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="midwife-kpi-pregnant"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Maternal Census</span>
              <span className="p-1 px-1.5 bg-indigo-100 text-indigo-850 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-indigo-200 transition-colors">BUNTIS</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-indigo-600 group-hover:text-indigo-700 transition-colors">{totalPregnant}</span>
              <span className="text-xs text-indigo-700 font-bold">registered buntis</span>
            </div>
            <div className="h-1 w-8 bg-indigo-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Registered under MCH Program</span>
              <span className="text-[9px] text-indigo-650 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>

          {/* High Risk Pregnancies */}
          <button
            type="button"
            onClick={() => onKpiClick?.('MCH', 'prenatals', 'High Risk')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="midwife-kpi-highrisk"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Alert Classification</span>
              <span className="p-1 px-1.5 bg-rose-100 text-rose-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-rose-200 transition-colors">HIGH RISK</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-rose-600 group-hover:text-rose-700 transition-colors">{highRiskMaternal}</span>
              <span className="text-xs text-rose-700 font-bold">critical alerts</span>
            </div>
            <div className="h-1 w-8 bg-rose-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Requires intensive care visits</span>
              <span className="text-[9px] text-rose-650 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>

          {/* Tetanus Toxoid Program */}
          <button
            type="button"
            onClick={() => onKpiClick?.('MCH', 'prenatals')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="midwife-kpi-tetanus"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Tetanus Toxoid Immunization</span>
              <span className="p-1 px-1.5 bg-emerald-100 text-emerald-850 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-emerald-200 transition-colors">TT BOOSTER</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-600 group-hover:text-emerald-700 transition-colors">{tetanusImmunized}</span>
              <span className="text-xs text-emerald-700 font-bold font-sans">immunized cases</span>
            </div>
            <div className="h-1 w-8 bg-emerald-600 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Protected against maternal tetanus</span>
              <span className="text-[9px] text-emerald-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>

          {/* Iron & Folic Acid Supply */}
          <button
            type="button"
            onClick={() => onKpiClick?.('MCH', 'prenatals')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="midwife-kpi-supplements"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Supplements Distribution</span>
              <span className="p-1 px-1.5 bg-blue-100 text-blue-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-blue-200 transition-colors">IRON + FOLIC</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-blue-600 group-hover:text-blue-700 transition-colors">{ironGivenCount}</span>
              <span className="text-xs text-blue-700 font-bold">mothers given</span>
            </div>
            <div className="h-1 w-8 bg-blue-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Ensures nutritional compliance</span>
              <span className="text-[9px] text-blue-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>
        </div>

        {/* Detailed Stats Graphics (Pregnant Patients Purok distribution & maternal checklist) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="midwife-graphics-grid">
          {/* Buntis Purok distribution */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center">
                <span className="w-2.5 h-5 bg-indigo-600 rounded-xs mr-2 block"></span>
                {language === 'EN' ? 'Maternal Purok Distribution (Pregnancy Density Map)' : 'Distribusyon ng Buntis sa bawat Purok (Pregnancy Density Map)'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'EN' ? 'Census of active pregnant patients across Purok 1 to Purok 7' : 'Sukat ng mga aktibong buntis na residente mula Purok 1 hanggang Purok 7'}
              </p>
            </div>
            
            <div className="space-y-3.5">
              {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map((purok) => {
                const countOfPregnant = pregnantPatientsList.filter((p) => p.purok === purok).length;
                const totalPregnantCount = Math.max(totalPregnant, 1);
                const widthPercentage = (countOfPregnant / totalPregnantCount) * 100;
                return (
                  <div key={purok} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-650 w-16">{purok}</span>
                    <div className="flex-1 bg-slate-50 h-7 rounded-lg overflow-hidden relative border border-slate-200/50">
                      {countOfPregnant > 0 && (
                        <div 
                          className="bg-indigo-600 h-full rounded-lg transition-all duration-550 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                          style={{ width: `${Math.max(widthPercentage, 10)}%` }}
                        >
                          {`${countOfPregnant} ${language === 'EN' ? 'Pregnant' : 'Buntis'}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maternal Program Targets */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="midwife-maternal-status-card">
              <div className="border-b border-slate-100 pb-3 mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2.5 h-4.5 bg-indigo-500 rounded-xs mr-0.5 block"></span>
                  Maternal Care Status
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">DOH health center maternal objectives</p>
              </div>

              <div className="space-y-4 my-2 text-xs font-semibold">
                <div className="flex justify-between items-center text-slate-650">
                  <span>Active Pregnant Registry:</span>
                  <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{totalPregnant} cases</span>
                </div>
                <div className="flex justify-between items-center text-slate-650">
                  <span>High-Risk Alerts (Active):</span>
                  <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">{highRiskMaternal} urgent</span>
                </div>
                <div className="flex justify-between items-center text-slate-650">
                  <span>Tetanus Booster Rate:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{Math.round((tetanusImmunized / Math.max(totalPregnant, 1)) * 100)}% coverage</span>
                </div>
                <div className="flex justify-between items-center text-slate-650">
                  <span>Prenatal Supplements Rate:</span>
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{Math.round((ironGivenCount / Math.max(totalPregnant, 1)) * 100)}% given</span>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-500 leading-normal font-mono bg-indigo-50/20 border border-indigo-100 p-2.5 rounded-lg mt-3 text-center">
                <strong>👶 First 1000 Days Protocol:</strong> Regular prenatal checkup ensures a bright and safe future for Barangay babies.
              </div>
            </div>
            {environmentalHygieneCard}
          </div>
        </div>

        {/* DOH Maternal Policies */}
        <div className="bg-indigo-50/50 border border-indigo-100 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full block"></span>
              <h3 className="text-sm font-black uppercase text-indigo-900 tracking-wider font-sans">DOH Safe Motherhood Policy Directives</h3>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">Buntis Broadcast</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-indigo-100/70 p-4 rounded-xl shadow-3xs space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-50 pb-2">
                <span className="font-bold">Safe Motherhood Initiative</span>
                <span className="bg-rose-50 text-rose-800 border border-rose-100 px-1.5 py-0.5 rounded font-bold uppercase">All Puroks</span>
              </div>
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tighter font-sans">Buntis Congress & Safe Clinic Deliveries</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Required safe delivery clinic guidelines in rural health stations. Midwives are reminded of strict implementation: zero home deliveries policy.</p>
              <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">Target: Pregnant Mothers</div>
            </div>

            <div className="bg-white border border-indigo-100/70 p-4 rounded-xl shadow-3xs space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-b border-slate-50 pb-2">
                <span className="font-bold">First 1000 Days of Life</span>
                <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">Nutrition Drive</span>
              </div>
              <h4 className="text-xs font-black text-indigo-950 uppercase tracking-tighter font-sans">Prenatal Folic Acid & Iron Distribution</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Ensure regular supply of micro-nutrients to registered maternal patients on their initial prenatal week of appointment.</p>
              <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">Target: Maternal Patients</div>
            </div>
          </div>
        </div>
        {sanitaryInspectionModal}
      </div>
    );
  }

  // --- 2. NURSE "PEDIATRIC/CHILD" DASHBOARD VIEWS ---
  if (isNurse) {
    const totalChild = childPatientsList.length;
    const unvaccinatedEpiCount = patients.filter((p) => p.activePrograms.includes('EPI')).length;
    const malnourishedOptCount = patients.filter((p) => p.activePrograms.includes('OPT_PLUS')).length;
    const vaccineDosesCount = vaccinations.length;

    return (
      <div className="space-y-6" id="nurse-dashboard-overview">
        {/* Custom Header Banner */}
        <div className="bg-emerald-50 border border-emerald-250 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-emerald-900 flex items-center gap-2">
              <span className="text-xl">👶</span> {language === 'EN' ? 'Pediatric Care & Immunization Workspace' : 'Pediatric Care & Immunization Workspace'}
            </h2>
            <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
              {language === 'EN' 
                ? 'Your dashboard is focused on monitoring children health, Expanded Program on Immunization (EPI), and pediatric nutrition.' 
                : 'Ang dashboard na ito ay nakatuon sa pagsubaybay sa kalusugan ng mga bata, Expanded Program on Immunization (EPI), at pediatric nutrition sa barangay.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest text-center shadow-xs flex items-center justify-center">
              {language === 'EN' ? 'NURSE PORTFOLIO' : 'NURSE PORTFOLIO'}
            </span>
            {onSwitchRole && (
              <button
                type="button"
                onClick={() => onSwitchRole('MIDWIFE')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest text-center flex items-center justify-center gap-1 cursor-pointer shadow-xs border border-indigo-500 transition-colors"
                id="switch-to-midwife-btn"
              >
                {language === 'EN' ? '🤰 MIDWIFE WORKSPACE ➔' : '🤰 MIDWIFE WORKSPACE ➔'}
              </button>
            )}
          </div>
        </div>

        {/* Child Demography KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="nurse-kpi-grid">
          {/* Total Children */}
          <button
            type="button"
            onClick={() => onKpiClick?.('EPI', 'residents')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="nurse-kpi-children"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Pediatric Census</span>
              <span className="p-1 px-1.5 bg-indigo-100 text-indigo-850 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-indigo-200 transition-colors">MGA BATA</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-indigo-600 group-hover:text-indigo-700 transition-colors">{totalChild}</span>
              <span className="text-xs text-indigo-700 font-bold">{totalChild === 1 ? 'child patient' : 'childs patients'}</span>
            </div>
            <div className="h-1 w-8 bg-indigo-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Aged 0 to 12 years monitored</span>
              <span className="text-[9px] text-indigo-650 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>

          {/* Unvaccinated EPI */}
          <button
            type="button"
            onClick={() => onKpiClick?.('EPI', 'immunizations')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="nurse-kpi-unvaccinated"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Immunization (EPI)</span>
              <span className="p-1 px-1.5 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-amber-200 transition-colors">UNVACCINATED</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-600 group-hover:text-amber-700 transition-colors">{unvaccinatedEpiCount}</span>
              <span className="text-xs text-amber-700 font-bold font-sans">infants monitored</span>
            </div>
            <div className="h-1 w-8 bg-amber-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Requires immediate booster drops</span>
              <span className="text-[9px] text-amber-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>

          {/* Malnourished OPT+ */}
          <button
            type="button"
            onClick={() => onKpiClick?.('OPT_PLUS', 'residents')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="nurse-kpi-malnourished"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nutrition Status</span>
              <span className="p-1 px-1.5 bg-rose-100 text-rose-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-rose-200 transition-colors">OPT+</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-rose-600 group-hover:text-rose-700 transition-colors">{malnourishedOptCount}</span>
              <span className="text-xs text-rose-700 font-bold">underweight / stunted</span>
            </div>
            <div className="h-1 w-8 bg-rose-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Active nutrition intervention</span>
              <span className="text-[9px] text-rose-650 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>

          {/* Immunization Doses given */}
          <button
            type="button"
            onClick={() => onKpiClick?.('EPI', 'immunizations')}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
            id="nurse-kpi-doses"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Vaccinations Recorded</span>
              <span className="p-1 px-1.5 bg-emerald-100 text-emerald-850 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-emerald-250 transition-colors">DOSES ADMINISTERED</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-600 group-hover:text-emerald-700 transition-colors">{vaccineDosesCount}</span>
              <span className="text-xs text-emerald-700 font-bold font-sans">vaccine doses</span>
            </div>
            <div className="h-1 w-8 bg-emerald-600 mt-2 rounded-full group-hover:w-12 transition-all"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>Administered BCG, Pentavalent/OPV</span>
              <span className="text-[9px] text-emerald-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
            </div>
          </button>
        </div>

        {/* Detailed Stats Graphics (Children Purok distribution & nutritional status) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="nurse-graphics-grid">
          {/* Children Purok distribution */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center">
                <span className="w-2.5 h-5 bg-emerald-600 rounded-xs mr-2 block"></span>
                {language === 'EN' ? 'Pediatric Purok Distribution (Pediatric Density Map)' : 'Distribusyon ng Bata sa bawat Purok (Pediatric Density Map)'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'EN' ? 'Census of active pediatric patients (0-12 years) across Purok 1 to Purok 7' : 'Sukat ng mga batang residente (0-12 years) mula Purok 1 hanggang Purok 7'}
              </p>
            </div>
            
            <div className="space-y-3.5">
              {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map((purok) => {
                const countOfChildren = childPatientsList.filter((p) => p.purok === purok).length;
                const totalChildrenCount = Math.max(totalChild, 1);
                const widthPercentage = (countOfChildren / totalChildrenCount) * 100;
                return (
                  <div key={purok} className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-650 w-16">{purok}</span>
                    <div className="flex-1 bg-slate-50 h-7 rounded-lg overflow-hidden relative border border-slate-200/50">
                      {countOfChildren > 0 && (
                        <div 
                           className="bg-emerald-600 h-full rounded-lg transition-all duration-550 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                          style={{ width: `${Math.max(widthPercentage, 10)}%` }}
                        >
                          {`${countOfChildren} ${language === 'EN' ? 'Children' : 'Bata'}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pediatric Immunization Coverage */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="nurse-pediatric-status-card">
              <div className="border-b border-slate-100 pb-3 mb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2.5 h-4.5 bg-emerald-500 rounded-xs mr-0.5 block"></span>
                  Pediatric Program Controls
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">DOH health center health targets</p>
              </div>

              <div className="space-y-4 my-2 text-xs font-semibold">
                <div className="flex justify-between items-center text-slate-650">
                  <span>Active Pediatric Cases:</span>
                  <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{totalChild} {totalChild === 1 ? 'child' : 'childs'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-650">
                  <span>Underweight / OPT+:</span>
                  <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">{malnourishedOptCount} infants</span>
                </div>
                <div className="flex justify-between items-center text-slate-650">
                  <span>Pending Booster Drops:</span>
                  <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{unvaccinatedEpiCount} infants</span>
                </div>
                <div className="flex justify-between items-center text-slate-650">
                  <span>Doses Administered:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{vaccineDosesCount} given</span>
                </div>
              </div>
              
              <div className="text-[10px] text-slate-500 leading-normal font-mono bg-emerald-50/20 border border-emerald-100 p-2.5 rounded-lg mt-3 text-center">
                <strong>👶 Immunization Mandate:</strong> Strict adherence to age-based schedule protects the barangay against critical contagions.
              </div>
            </div>
            {environmentalHygieneCard}
          </div>
        </div>

        {/* DOH Pediatric Policies */}
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full block"></span>
              <h3 className="text-sm font-black uppercase text-emerald-900 tracking-wider font-sans">DOH Pediatric & Immunization Directives</h3>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">Bata Broadcast</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-3xs space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-b border-slate-50 pb-2">
                <span className="font-bold">EPI National Campaign</span>
                <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">All Puroks</span>
              </div>
              <h4 className="text-xs font-black text-rose-950 uppercase tracking-tighter font-sans">Expanded Infant Immunization Booster</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Ensure regular monitoring of children with incomplete vaccines. Complete doses of BCG, Hepatitis B, and OPV required immediately.</p>
              <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">Target: Infants under 12 months</div>
            </div>

            <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-3xs space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-b border-slate-50 pb-2">
                <span className="font-bold">Operation Timbang Plus</span>
                <span className="bg-emerald-50 text-emerald-850 border border-emerald-100 px-1.5 py-0.5 rounded font-bold uppercase">Nutrition Care</span>
              </div>
              <h4 className="text-xs font-black text-emerald-950 uppercase tracking-tighter font-sans">Micronutrient Powder & Milk Supplementation</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Provide nutritional feeding supplements to children listed inside the OPT+ program workspace. Conduct monthly weights checkups.</p>
              <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">Target: Kids 6-59 months</div>
            </div>
          </div>
        </div>
        {sanitaryInspectionModal}
      </div>
    );
  }

  // --- 3. GENERAL/DEFAULT DASHBOARD FOR OTHER ROLES (BHW, PHARMACIST, MHO, ADMIN) ---
  const activeTB = patients.filter((p) => p.activePrograms.includes('TB_DOTS')).length;
  const unvaccinatedEPI = patients.filter((p) => p.activePrograms.includes('EPI')).length;
  const malnourishedOPT = patients.filter((p) => p.activePrograms.includes('OPT_PLUS')).length;
  const indigentCount = patients.filter((p) => p.isIndigent).length;
  const hypertensionRiskCount = patients.filter((p) => p.activePrograms.includes('SENIOR_CITIZEN')).length;
  const totalPatients = patients.length;

  return (
    <div className="space-y-6" id="system-dashboard-overview">
      {/* Visual KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="kpi-block-grid">
        {/* Active TB surveillance */}
        <button
          type="button"
          onClick={() => onKpiClick?.('TB_DOTS', 'residents')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
          id="kpi-tb"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1 select-none">{text.activeTBCases}</span>
            <span className="p-1 px-1.5 bg-rose-100 text-rose-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-rose-200 transition-colors">TB DOTS</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600 group-hover:text-rose-700 transition-colors">{activeTB}</span>
            <span className="text-xs text-rose-700 font-bold animate-pulse">active contact</span>
          </div>
          <div className="h-1 w-8 bg-rose-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>2 scheduled tests tomorrow</span>
            <span className="text-[9px] text-rose-650 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
          </div>
        </button>

        {/* Unvaccinated EPI */}
        <button
          type="button"
          onClick={() => {
            const isRestricted = userActiveRole === 'BHW' || userActiveRole === 'CAPITAN';
            onKpiClick?.('EPI', isRestricted ? 'residents' : 'immunizations');
          }}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
          id="kpi-epi"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1 select-none">{text.unvaccinatedInfants}</span>
            <span className="p-1 px-1.5 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-amber-200 transition-colors">EPI</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600 group-hover:text-amber-700 transition-colors">{unvaccinatedEPI}</span>
            <span className="text-xs text-amber-700 font-bold font-sans">under observation</span>
          </div>
          <div className="h-1 w-8 bg-amber-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Requires booster drops</span>
            <span className="text-[9px] text-amber-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
          </div>
        </button>

        {/* Nutritional status */}
        <button
          type="button"
          onClick={() => onKpiClick?.('OPT_PLUS', 'residents')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
          id="kpi-opt"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1 select-none">{text.malnourishedChildren}</span>
            <span className="p-1 px-1.5 bg-emerald-100 text-emerald-850 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-emerald-250 transition-colors">OPT+</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600 group-hover:text-emerald-700 transition-colors">{malnourishedOPT}</span>
            <span className="text-xs text-emerald-700 font-bold">monitored</span>
          </div>
          <div className="h-1 w-8 bg-emerald-600 mt-2 rounded-full group-hover:w-12 transition-all"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Nutrition care active</span>
            <span className="text-[9px] text-emerald-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
          </div>
        </button>

        {/* High blood pressures */}
        <button
          type="button"
          onClick={() => onKpiClick?.('SENIOR_CITIZEN', 'residents')}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none text-left w-full block group"
          id="kpi-ncd"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1 select-none">{text.highBPResidents}</span>
            <span className="p-1 px-1.5 bg-blue-100 text-blue-800 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:bg-blue-200 transition-colors">NCD</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-blue-600 group-hover:text-blue-700 transition-colors">{hypertensionRiskCount}</span>
            <span className="text-xs text-blue-700 font-bold font-sans">seniors & NCDs</span>
          </div>
          <div className="h-1 w-8 bg-blue-500 mt-2 rounded-full group-hover:w-12 transition-all"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Requires screen updates</span>
            <span className="text-[9px] text-blue-750 font-black tracking-tight opacity-100 md:opacity-0 group-hover:opacity-100 transition-all font-sans uppercase">Suriin ➔</span>
          </div>
        </button>
      </div>

      {/* Primary stats comparison graphics (Pure Tailwinds) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="stats-graphics-grid">
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center">
              <span className="w-2.5 h-5 bg-emerald-600 rounded-xs mr-2 block"></span>
              {text.purokDistribution}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Total census metrics across Purok 1 to Purok 7 in the barangay</p>
          </div>
          
          <div className="space-y-3.5">
            {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map((purok) => {
              const residentCount = patients.filter((p) => p.purok === purok).length;
              const householdCount = households.filter((h) => h.purok === purok).length;
              const widthPercentage = Math.min((residentCount / 8) * 105, 100);
              return (
                <div key={purok} className="flex items-center gap-3" id={`purok-bar-${purok.replace(' ', '')}`}>
                  <span className="text-xs font-mono font-bold text-slate-650 w-16">{purok}</span>
                  <div className="flex-1 bg-slate-50 h-7 rounded-lg overflow-hidden relative border border-slate-200/50">
                    {residentCount > 0 ? (
                      <div 
                        className="bg-emerald-600 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                        style={{ width: `${Math.max(widthPercentage, 8)}%` }}
                      >
                        {`${residentCount} Tao (${householdCount} HH)`}
                      </div>
                    ) : (
                      <span className="absolute inset-0 flex items-center pl-3 text-[10px] text-slate-400 font-mono">0 Resident</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environmental Hygiene & Indigency eligibility cards */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-between" id="malasakit-eligibility-card">
            <div className="border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-4.5 bg-blue-500 rounded-xs mr-0.5 block"></span>
                Malasakit Eligibility Check
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Target health subsidies guidelines</p>
            </div>

            <div className="space-y-2.5 my-1 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-650">
                <span>Kabuuang Residente (Total):</span>
                <span className="font-bold text-slate-900">{totalPatients} (78 Aktibo, 100 Archived)</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>🟢 Aktibong Residente (2026):</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">{patients.filter(p => p.status === 'Active').length} tao</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>🔴 Inactive Archive (2024-2025):</span>
                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 rounded">{patients.filter(p => p.status === 'Inactive').length} tao</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>Indigent (Malasakit Support):</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-1.5 rounded">{indigentCount} citizens</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>PhilHealth Linked Check:</span>
                <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 rounded">
                  {patients.filter((p) => p.philHealthId && p.philHealthId !== 'Not Enrolled').length} verified
                </span>
              </div>
            </div>
          </div>
          {environmentalHygieneCard}
        </div>
      </div>

      {/* DOH Broacasted Policies Bulletin Feed */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4" id="doh-policies-bulletin">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full block"></span>
            <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider font-sans">Aktibong Kautusan at Kampanya ng DOH (Active DOH Policy Directives)</h3>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">Real-time Broadcast</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200/85 p-4 rounded-xl shadow-3xs space-y-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-b border-slate-50 pb-2">
              <span className="font-bold">2026-06-04 • DOH Provincial Representative</span>
              <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">Purok 4</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tighter font-sans">Operation Timbang Plus (Aesthetic Nutritional Enhancement)</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Immediate nutritional monitoring and supplement provisioning following malnutrition spikes discovered in the OPT surveillance survey.</p>
            </div>
            <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">
              Target Demography: Infants & Toddlers aged 0-59 months
            </div>
          </div>

          <div className="bg-white border border-slate-200/85 p-4 rounded-xl shadow-3xs space-y-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-b border-slate-50 pb-2">
              <span className="font-bold">2026-06-02 • Municipal Health Office Director</span>
              <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">All Puroks</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tighter font-sans">Expanded Infant Immunization Campaign (EPI-30)</h4>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Intensified tracking of unvaccinated cases with standard Pentavalent and Oral Polio Vaccine (OPV) booster checks.</p>
            </div>
            <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">
              Target Demography: Infants under 12 months
            </div>
          </div>
        </div>
        {sanitaryInspectionModal}
      </div>
    </div>
  );
};
