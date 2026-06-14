/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Patient, Household, Language, Role, PrenatalRecord, ImmunizationRecord } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';

interface SystemOverviewProps {
  patients: Patient[];
  households: Household[];
  language: Language;
  userActiveRole?: Role;
  prenatals?: PrenatalRecord[];
  vaccinations?: ImmunizationRecord[];
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ 
  patients, 
  households, 
  language,
  userActiveRole,
  prenatals = [],
  vaccinations = []
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

  // Calculate environmental hygiene metrics
  const totalHouseholds = households.length;
  const sanitaryToiletsCount = households.filter((h) => h.sanitaryToilet).length;
  const sanitaryPercentage = totalHouseholds > 0 ? Math.round((sanitaryToiletsCount / totalHouseholds) * 100) : 0;

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
              <span className="text-xl">🤰</span> Maternal Health & Prenatal Care Workspace
            </h2>
            <p className="text-xs text-indigo-800 leading-relaxed font-semibold">
              Naka-log in bilang midwife. Ang iyong dashboard ay naka-focus sa regular na pagsubaybay sa kalusugan ng mga Buntis, pre-natal care, at maternal health indicators ng barangay.
            </p>
          </div>
          <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0 shadow-xs">
            MIDWIFE PORTFOLIO
          </span>
        </div>

        {/* Pregnant Demography KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="midwife-kpi-grid">
          {/* Total Buntis */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Maternal Census</span>
              <span className="p-1 px-1.5 bg-indigo-100 text-indigo-850 rounded-lg text-[9px] font-black uppercase tracking-wider">BUNTIS</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-indigo-600">{totalPregnant}</span>
              <span className="text-xs text-indigo-700 font-bold">registered buntis</span>
            </div>
            <div className="h-1 w-8 bg-indigo-500 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Registered under MCH Program</div>
          </div>

          {/* High Risk Pregnancies */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Alert Classification</span>
              <span className="p-1 px-1.5 bg-rose-100 text-rose-800 rounded-lg text-[9px] font-black uppercase tracking-wider">HIGH RISK</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-rose-600">{highRiskMaternal}</span>
              <span className="text-xs text-rose-700 font-bold">critical alerts</span>
            </div>
            <div className="h-1 w-8 bg-rose-500 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Requires intensive care visits</div>
          </div>

          {/* Tetanus Toxoid Program */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Tetanus Toxoid Immunization</span>
              <span className="p-1 px-1.5 bg-emerald-100 text-emerald-850 rounded-lg text-[9px] font-black uppercase tracking-wider">TT BOOSTER</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-600">{tetanusImmunized}</span>
              <span className="text-xs text-emerald-700 font-bold font-sans">immunized cases</span>
            </div>
            <div className="h-1 w-8 bg-emerald-600 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Protected against maternal tetanus</div>
          </div>

          {/* Iron & Folic Acid Supply */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Supplements Distribution</span>
              <span className="p-1 px-1.5 bg-blue-100 text-blue-800 rounded-lg text-[9px] font-black uppercase tracking-wider">IRON + FOLIC</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-blue-600">{ironGivenCount}</span>
              <span className="text-xs text-blue-700 font-bold">mothers given</span>
            </div>
            <div className="h-1 w-8 bg-blue-500 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Ensures nutritional compliance</div>
          </div>
        </div>

        {/* Detailed Stats Graphics (Pregnant Patients Purok distribution & maternal checklist) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="midwife-graphics-grid">
          {/* Buntis Purok distribution */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center">
                <span className="w-2.5 h-5 bg-indigo-600 rounded-xs mr-2 block"></span>
                Distribusyon ng Buntis sa bawat Purok (Pregnancy Density Map)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Sukat ng mga aktibong buntis na residente mula Purok 1 hanggang Purok 7</p>
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
                      <div 
                        className="bg-indigo-600 h-full rounded-lg transition-all duration-550 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                        style={{ width: `${Math.max(widthPercentage, countOfPregnant > 0 ? 10 : 3)}%` }}
                      >
                        {countOfPregnant > 0 ? `${countOfPregnant} Buntis` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Maternal Program Targets */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
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
              <span className="text-xl">👶</span> Pediatric Care & Immunization Workspace
            </h2>
            <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
              Naka-log in bilang nurse. Ang iyong dashboard ay naka-focus sa pagsubaybay sa kalusugan ng mga bata, Expanded Program on Immunization (EPI), at pediatric nutrition sa barangay.
            </p>
          </div>
          <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0 shadow-xs">
            NURSE PORTFOLIO
          </span>
        </div>

        {/* Child Demography KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="nurse-kpi-grid">
          {/* Total Children */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Pediatric Census</span>
              <span className="p-1 px-1.5 bg-indigo-100 text-indigo-850 rounded-lg text-[9px] font-black uppercase tracking-wider">MGA BATA</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-indigo-600">{totalChild}</span>
              <span className="text-xs text-indigo-700 font-bold">children patients</span>
            </div>
            <div className="h-1 w-8 bg-indigo-500 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Aged 0 to 12 years monitored</div>
          </div>

          {/* Unvaccinated EPI */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Immunization (EPI)</span>
              <span className="p-1 px-1.5 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider">UNVACCINATED</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-amber-600">{unvaccinatedEpiCount}</span>
              <span className="text-xs text-amber-700 font-bold font-sans">infants monitored</span>
            </div>
            <div className="h-1 w-8 bg-amber-500 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Requires immediate booster drops</div>
          </div>

          {/* Malnourished OPT+ */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nutrition Status</span>
              <span className="p-1 px-1.5 bg-rose-100 text-rose-800 rounded-lg text-[9px] font-black uppercase tracking-wider">OPT+</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-rose-600">{malnourishedOptCount}</span>
              <span className="text-xs text-rose-700 font-bold">underweight / stunted</span>
            </div>
            <div className="h-1 w-8 bg-rose-500 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Active nutrition intervention</div>
          </div>

          {/* Immunization Doses given */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Vaccinations Recorded</span>
              <span className="p-1 px-1.5 bg-emerald-100 text-emerald-850 rounded-lg text-[9px] font-black uppercase tracking-wider">DOSES ADMINISTERED</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-emerald-600">{vaccineDosesCount}</span>
              <span className="text-xs text-emerald-700 font-bold font-sans">vaccine doses</span>
            </div>
            <div className="h-1 w-8 bg-emerald-600 mt-2 rounded-full"></div>
            <div className="mt-2 text-[10px] text-slate-500 font-mono">Administered BCG, Pentavalent/OPV</div>
          </div>
        </div>

        {/* Detailed Stats Graphics (Children Purok distribution & nutritional status) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="nurse-graphics-grid">
          {/* Children Purok distribution */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center">
                <span className="w-2.5 h-5 bg-emerald-600 rounded-xs mr-2 block"></span>
                Distribusyon ng Bata sa bawat Purok (Pediatric Density Map)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Sukat ng mga batang residente (0-12 years) mula Purok 1 hanggang Purok 7</p>
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
                      <div 
                        className="bg-emerald-600 h-full rounded-lg transition-all duration-550 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                        style={{ width: `${Math.max(widthPercentage, countOfChildren > 0 ? 10 : 3)}%` }}
                      >
                        {countOfChildren > 0 ? `${countOfChildren} Bata` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pediatric Immunization Coverage */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
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
                <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{totalChild} children</span>
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
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="kpi-tb">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{text.activeTBCases}</span>
            <span className="p-1 px-1.5 bg-rose-100 text-rose-800 rounded-lg text-[9px] font-black uppercase tracking-wider">TB DOTS</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-rose-600">{activeTB}</span>
            <span className="text-xs text-rose-700 font-bold">active contacts</span>
          </div>
          <div className="h-1 w-8 bg-rose-500 mt-2 rounded-full"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">2 scheduled Sputum tests tomorrow</div>
        </div>

        {/* Unvaccinated EPI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="kpi-epi">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{text.unvaccinatedInfants}</span>
            <span className="p-1 px-1.5 bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider">EPI</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-amber-600">{unvaccinatedEPI}</span>
            <span className="text-xs text-amber-700 font-bold font-sans">under observation</span>
          </div>
          <div className="h-1 w-8 bg-amber-500 mt-2 rounded-full"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Requires immediate vaccine drops</div>
        </div>

        {/* Nutritional status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="kpi-opt">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{text.malnourishedChildren}</span>
            <span className="p-1 px-1.5 bg-emerald-100 text-emerald-850 rounded-lg text-[9px] font-black uppercase tracking-wider">OPT+</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-emerald-600">{malnourishedOPT}</span>
            <span className="text-xs text-emerald-700 font-bold">monitored</span>
          </div>
          <div className="h-1 w-8 bg-emerald-600 mt-2 rounded-full"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono font-sans">Nutrition intervention active</div>
        </div>

        {/* High blood pressures */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="kpi-ncd">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{text.highBPResidents}</span>
            <span className="p-1 px-1.5 bg-blue-100 text-blue-800 rounded-lg text-[9px] font-black uppercase tracking-wider">NCD</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-blue-600">{hypertensionRiskCount}</span>
            <span className="text-xs text-blue-700 font-bold font-sans">seniors & NCDs</span>
          </div>
          <div className="h-1 w-8 bg-blue-500 mt-2 rounded-full"></div>
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Requires screening & updates</div>
        </div>
      </div>

      {/* Primary stats comparison graphics (Pure Tailwinds) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5" id="stats-graphics-grid">
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center">
              <span className="w-2.5 h-5 bg-emerald-600 rounded-xs mr-2 block"></span>
              {text.purokDistribution}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Total census metrics across Purok 1 to Purok 7 in the barangay</p>
          </div>
          
          <div className="space-y-3.5">
            {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map((purok) => {
              const householdCount = households.filter((h) => h.purok === purok).length;
              const widthPercentage = Math.min((householdCount / 8) * 105, 100);
              return (
                <div key={purok} className="flex items-center gap-3" id={`purok-bar-${purok.replace(' ', '')}`}>
                  <span className="text-xs font-mono font-bold text-slate-650 w-16">{purok}</span>
                  <div className="flex-1 bg-slate-50 h-7 rounded-lg overflow-hidden relative border border-slate-200/50">
                    <div 
                      className="bg-emerald-600 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                      style={{ width: `${Math.max(widthPercentage, householdCount > 0 ? 8 : 3)}%` }}
                    >
                      {householdCount > 0 ? `${householdCount} HH` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Environmental Hygiene & Indigency eligibility cards */}
        <div className="md:col-span-4 space-y-5 flex flex-col justify-between">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-4.5 bg-emerald-500 rounded-xs mr-0.5 block"></span>
                {text.environmentalHygiene}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Critical DOH standards for cleanliness</p>
            </div>

            <div className="my-3 flex items-center justify-center relative">
              <div className="w-24 h-24 rounded-full border-[7px] border-slate-100 flex flex-col items-center justify-center border-t-emerald-600">
                <span className="text-xl font-black text-slate-800">{sanitaryPercentage}%</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Sanitary toilet</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-snug text-center font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
              <strong>{sanitaryToiletsCount} of {totalHouseholds}</strong> households verified with DOH compliant sanitary toilets.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-between mt-4">
            <div className="border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-4.5 bg-blue-500 rounded-xs mr-0.5 block"></span>
                Malasakit Eligibility Check
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Target health subsidies guidelines</p>
            </div>

            <div className="space-y-2.5 my-1 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-650">
                <span>Total Registrants:</span>
                <span className="font-bold text-slate-900">{totalPatients} patients</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>Indigent (Malasakit Support):</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-1.5 rounded">{indigentCount} citizens</span>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>PhilHealth Linked Check:</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 rounded">
                  {patients.filter((p) => p.philHealthId && p.philHealthId !== 'Not Enrolled').length} verified
                </span>
              </div>
            </div>
          </div>
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
      </div>
    </div>
  );
};
