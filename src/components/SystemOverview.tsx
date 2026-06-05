/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Patient, Household, Language } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { Activity, ShieldCheck, Heart, Users, AlertTriangle, Droplet } from 'lucide-react';

interface SystemOverviewProps {
  patients: Patient[];
  households: Household[];
  language: Language;
}

export const SystemOverview: React.FC<SystemOverviewProps> = ({ patients, households, language }) => {
  const text = LOCALIZED_TEXTS[language];
  
  // Calculate consolidated metrics based on real datasets
  const activeTB = patients.filter((p) => p.activePrograms.includes('TB_DOTS')).length;
  const unvaccinatedEPI = patients.filter((p) => p.activePrograms.includes('EPI')).length;
  const malnourishedOPT = patients.filter((p) => p.activePrograms.includes('OPT_PLUS')).length;
  const indigentCount = patients.filter((p) => p.isIndigent).length;

  // Let's count high blood pressure candidates (systolic >= 140 or diastolic >= 90)
  // Here we can find matching hypertension registered or direct seniors
  const hypertensionRiskCount = patients.filter((p) => p.activePrograms.includes('SENIOR_CITIZEN')).length;

  const totalPatients = patients.length;
  const totalHouseholds = households.length;

  // Sanitary toilet ratio DOH parameter
  const sanitaryToiletsCount = households.filter((h) => h.sanitaryToilet).length;
  const sanitaryPercentage = totalHouseholds > 0 ? Math.round((sanitaryToiletsCount / totalHouseholds) * 100) : 0;

  // Puroks count lists
  const purokCounts = households.reduce((acc, curr) => {
    acc[curr.purok] = (acc[curr.purok] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          <div className="mt-2 text-[10px] text-slate-500 font-mono">2 scheduled sputum tests tomorrow</div>
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
          <div className="mt-2 text-[10px] text-slate-500 font-mono">Nutrition intervention active</div>
        </div>

        {/* High blood pressures */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm" id="kpi-ncd">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">{text.highBPResidents}</span>
            <span className="p-1 px-1.5 bg-blue-100 text-blue-800 rounded-lg text-[9px] font-black uppercase tracking-wider">NCD</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-blue-600">{hypertensionRiskCount}</span>
            <span className="text-xs text-blue-700 font-bold">seniors & NCDs</span>
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
              // Normalize length based on a realistic maximum
              const widthPercentage = Math.min((householdCount / 8) * 100, 100);
              return (
                <div key={purok} className="flex items-center gap-3" id={`purok-bar-${purok.replace(' ', '')}`}>
                  <span className="text-xs font-mono font-bold text-slate-650 w-16">{purok}</span>
                  <div className="flex-1 bg-slate-50 h-7 rounded-lg overflow-hidden relative border border-slate-200/50">
                    <div 
                      className="bg-emerald-600 h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3 font-mono text-[10px] text-white font-extrabold" 
                      style={{ width: `${Math.max(widthPercentage, 8)}%` }}
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
              {/* Custom big circle dial representer */}
              <div className="w-24 h-24 rounded-full border-[7px] border-slate-105 flex flex-col items-center justify-center border-t-emerald-600">
                <span className="text-xl font-black text-slate-800">{sanitaryPercentage}%</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase">Sanitary toilet</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-snug text-center font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <strong>{sanitaryToiletsCount} of {totalHouseholds}</strong> households verified with DOH compliant sanitary toilets.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div className="border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-4.5 bg-blue-500 rounded-xs mr-0.5 block"></span>
                Malasakit Eligibility Check
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Target health subsidies guidelines</p>
            </div>

            <div className="space-y-2.5 my-1 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-600">
                <span>Total Registrants:</span>
                <span className="font-bold text-slate-900">{totalPatients} patients</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Indigent (Malasakit Support):</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-1.5 rounded">{indigentCount} citizens</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
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
            <h3 className="text-sm font-black uppercase text-slate-700 tracking-wider">Aktibong Kautusan at Kampanya ng DOH (Active DOH Policy Directives)</h3>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest font-mono">Real-time Broadcast</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            try {
              const saved = localStorage.getItem('bhc_policies');
              if (saved) {
                const parsed = JSON.parse(saved);
                const active = parsed.filter((p: any) => p.status === 'Active');
                if (active.length > 0) return active.map((p: any) => (
                  <div key={p.id} className="bg-white border border-slate-200/85 p-4 rounded-xl shadow-3xs space-y-2.5 hover:shadow-2xs transition-shadow">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-b border-slate-50 pb-2">
                      <span className="font-bold">{p.date} • {p.sender}</span>
                      <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">{p.focusPurok}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-tighter">{p.programName}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{p.directiveDetails}</p>
                    </div>
                    <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">
                      Target Demography: {p.focusPopulation}
                    </div>
                  </div>
                ));
              }
            } catch (e) {}

            // Static fallback
            return (
              <>
                <div className="bg-white border border-slate-200/85 p-4 rounded-xl shadow-3xs space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 border-b border-slate-50 pb-2">
                    <span className="font-bold">2026-06-04 • DOH Provincial Representative</span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-100 px-1.5 py-0.5 rounded font-bold uppercase">Purok 4</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tighter">Operation Timbang Plus (Aesthetic Nutritional Enhancement)</h4>
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
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-tighter">Expanded Infant Immunization Campaign (EPI-30)</h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Intensified tracking of unvaccinated cases with standard Pentavalent and Oral Polio Vaccine (OPV) booster checks.</p>
                  </div>
                  <div className="text-[10px] text-indigo-700 font-extrabold font-mono bg-indigo-50/50 p-1 px-2 rounded w-fit border border-indigo-100/30">
                    Target Demography: Infants under 12 months
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
