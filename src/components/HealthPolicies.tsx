/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ClipboardList, Plus, FileText, Send, CheckCircle2, TrendingUp, Users, HeartHandshake, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { Purok } from '../types';

export interface HealthPolicy {
  id: string;
  date: string;
  programName: string;
  focusPurok: Purok | 'All Puroks';
  focusPopulation: string;
  directiveDetails: string;
  sender: string;
  status: 'Active' | 'Archived';
}

export const HealthPolicies: React.FC = () => {
  // Policies State linked to localStorage
  const [policies, setPolicies] = useState<HealthPolicy[]>(() => {
    const saved = localStorage.getItem('bhc_policies');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'POL-2026-001',
        date: '2026-06-04',
        programName: 'Operation Timbang Plus (Aesthetic Nutritional Enhancement)',
        focusPurok: 'Purok 4',
        focusPopulation: 'Infants & Toddlers aged 0-59 months',
        directiveDetails: 'Immediate nutritional monitoring and supplement provisioning following malnutrition spikes discovered in the OPT surveillance survey.',
        sender: 'DOH Provincial Representative',
        status: 'Active'
      },
      {
        id: 'POL-2026-002',
        date: '2026-06-02',
        programName: 'Expanded Infant Immunization Campaign (EPI-30)',
        focusPurok: 'All Puroks',
        focusPopulation: 'Infants under 12 months',
        directiveDetails: 'Intensified tracking of unvaccinated cases with standard Pentavalent and Oral Polio Vaccine (OPV) booster checks.',
        sender: 'Municipal Health Office Director',
        status: 'Active'
      },
      {
        id: 'POL-2026-003',
        date: '2026-05-28',
        programName: 'Clean Water Advocacy & Sanitation Drive',
        focusPurok: 'Purok 7',
        focusPopulation: 'All Households with Unprotected Well Access',
        directiveDetails: 'Provisioning of chlorine tablets and sanitary toilet inspections following environmental hygiene score updates.',
        sender: 'LGU Provincial Health Service Desk',
        status: 'Archived'
      }
    ];
  });

  // Persist policies
  useEffect(() => {
    localStorage.setItem('bhc_policies', JSON.stringify(policies));
  }, [policies]);

  // Form submission state
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [programName, setProgramName] = useState('');
  const [focusPurok, setFocusPurok] = useState<Purok | 'All Puroks'>('All Puroks');
  const [focusPopulation, setFocusPopulation] = useState('All Residents');
  const [directiveDetails, setDirectiveDetails] = useState('');
  const [sender, setSender] = useState('DOH Regional Office (Zamboanga del Sur)');

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName || !directiveDetails) {
      alert('Pakisulat ang Program Name at ang Detalye ng Polisiya. (Please fill in Program Name and Directive Details).');
      return;
    }

    const newPolicy: HealthPolicy = {
      id: `POL-2026-00${policies.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      programName,
      focusPurok,
      focusPopulation,
      directiveDetails,
      sender,
      status: 'Active'
    };

    setPolicies([newPolicy, ...policies]);
    setIsAddingPolicy(false);
    // Clear formulation states
    setProgramName('');
    setFocusPurok('All Puroks');
    setFocusPopulation('All Residents');
    setDirectiveDetails('');
    alert('Matagumpay na naipadala at naisapubliko ang bagong polisiya! (New health policy successfully broadcasted to DHRMS Dashboard).');
  };

  const archivePolicy = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Archived' : 'Active' } : p));
  };

  return (
    <div className="space-y-6" id="health-policies-viewport">
      
      {/* Policy banner instructions */}
      <div className="bg-emerald-800 text-white p-6 rounded-xl relative overflow-hidden border border-emerald-950 shadow-sm">
        <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full pointer-events-none translate-y-6 translate-x-6"></div>
        <div className="max-w-3xl space-y-2 relative z-10">
          <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono inline-flex items-center gap-1">
            <ClipboardList size={11} />
            MUNICIPAL & DOH BROADCAST BOARD
          </span>
          <h2 className="text-xl font-bold uppercase tracking-wide">Health Policies & Statistical Surveillance</h2>
          <p className="text-xs text-emerald-100/95 leading-relaxed">
            Specify clinical targets, trigger disease containment procedures, and broadcast national DOH mandates. Active policies are synchronized and displayed directly on BHW and Doctor Workstation dashboards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Manage Memos/Broadcasts */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="text-emerald-700 animate-pulse" size={18} />
                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wide">Active Directives & Campaigns</h3>
              </div>
              <button
                onClick={() => setIsAddingPolicy(!isAddingPolicy)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer flex items-center gap-1 transition-all"
              >
                <Plus size={14} />
                {isAddingPolicy ? 'Kanselahin' : 'Magpadala ng Polisiya'}
              </button>
            </div>

            <div className="p-5">
              
              {/* Add policy form */}
              {isAddingPolicy && (
                <form onSubmit={handleCreatePolicy} className="bg-slate-50/60 p-5 rounded-2xl border border-dashed border-emerald-250 space-y-4 mb-5">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-800 flex items-center gap-1">
                    <Sparkles size={12} className="text-emerald-600" />
                    Bumuo ng Bagong DOH Campaign at Polisiya
                  </span>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">DOH Program / Campaign Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. National Deworming Month in Purok 2"
                        required
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-xs"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Target Cluster Purok</label>
                        <select
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-xs font-mono"
                          value={focusPurok}
                          onChange={(e) => setFocusPurok(e.target.value as any)}
                        >
                          <option value="All Puroks">All Puroks (Kabuuan)</option>
                          <option value="Purok 1">Purok 1</option>
                          <option value="Purok 2">Purok 2</option>
                          <option value="Purok 3">Purok 3</option>
                          <option value="Purok 4">Purok 4</option>
                          <option value="Purok 5">Purok 5</option>
                          <option value="Purok 6">Purok 6</option>
                          <option value="Purok 7">Purok 7</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Focus Demography (Target Population)</label>
                        <input
                          type="text"
                          placeholder="e.g. Children < 12y/o, Pregnant Mothers"
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-xs"
                          value={focusPopulation}
                          onChange={(e) => setFocusPopulation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Origin / Mandatee Department</label>
                        <input
                          type="text"
                          placeholder="e.g. DOH Regional Office Region IX"
                          className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-xs"
                          value={sender}
                          onChange={(e) => setSender(e.target.value)}
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 p-2 bg-emerald-50/10 border border-emerald-100/50 rounded flex items-center gap-1.5 font-medium italic">
                        <AlertCircle size={14} className="text-emerald-605 text-emerald-600" />
                        Will be pinned to BHW dashboards immediately.
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Campaign Instructions / Detailed Guidelines *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Define active instructions, medicine dosages, schedule guidelines, or specific tasks for BHW deployment."
                        className="w-full bg-white border border-slate-200 p-2.5 rounded-lg focus:outline-hidden text-xs"
                        value={directiveDetails}
                        onChange={(e) => setDirectiveDetails(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPolicy(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-lg text-xs cursor-pointer"
                    >
                      Kanselahin
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Send size={12} />
                      I-broadcast sa DHRMS
                    </button>
                  </div>
                </form>
              )}

              {/* Policy timeline render list */}
              <div className="space-y-4">
                {policies.map((p) => (
                  <div 
                    key={p.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      p.status === 'Active' 
                        ? 'bg-emerald-50/15 border-emerald-150 shadow-2xs hover:shadow-xs' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-start text-[10px] font-mono select-none">
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold">
                        <span>{p.date}</span>
                        <span>•</span>
                        <span className="text-indigo-850 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{p.sender}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-black tracking-widest text-[9px] ${
                        p.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {p.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-extrabold text-slate-800">{p.programName}</h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{p.directiveDetails}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3.5 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
                      <div className="flex items-center gap-1 w-fit">
                        <MapPin size={13} className="text-rose-500" />
                        Target: <span className="text-slate-800 font-bold bg-slate-105 p-0.5 px-1.5 rounded">{p.focusPurok}</span>
                      </div>
                      <div className="flex items-center gap-1 w-fit">
                        <Users size={13} className="text-slate-400" />
                        Population: <span className="text-slate-800 font-bold">{p.focusPopulation}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100/30 pt-3 mt-3">
                      <button
                        onClick={() => archivePolicy(p.id)}
                        className={`px-3 py-1 bg-slate-50 border border-slate-200 hover:bg-slate-105 text-[10px] font-bold rounded-lg cursor-pointer transition-colors ${
                          p.status === 'Active' ? 'text-slate-500' : 'text-emerald-700 font-bold'
                        }`}
                      >
                        {p.status === 'Active' ? 'Archive Directive' : 'Restore Active'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Right column: Statistical Reports */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-indigo-650" size={18} />
                <h3 className="text-sm font-black uppercase text-slate-700 tracking-wide">FHSIS Statistical trends</h3>
              </div>
            </div>

            <div className="p-5 space-y-6">
              
              {/* Stat 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-extrabold text-slate-650 uppercase">Infant Immunization Target Ratio (EPI)</span>
                  <span className="font-bold text-emerald-700">88%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Target: {'>'}95% (DOH Target)</span>
                  <span className="font-semibold text-rose-500">Goal alert: -7% deficit</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-extrabold text-slate-650 uppercase">Sanitary Toilet Compliance Ratio</span>
                  <span className="font-bold text-teal-700">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>6 out of 8 households surveyed</span>
                  <span className="font-semibold text-teal-600">Improving (Up 5% this month)</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-extrabold text-slate-650 uppercase">Maternal prenatal profiling completeness</span>
                  <span className="font-bold text-indigo-700">92%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-505 bg-indigo-600 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Target: 90% completeness</span>
                  <span className="font-semibold text-emerald-600">COMPLIANT (DOH METRIC)</span>
                </div>
              </div>

              {/* Statistics Overview Insights */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 space-y-3">
                <h4 className="text-[11px] font-black uppercase text-slate-600 flex items-center gap-1 tracking-wide border-b border-slate-200/50 pb-1.5 select-none">
                  <HeartHandshake size={13} className="text-emerald-600" />
                  DOH REGIONAL OFFICE ANALYTICS INSIGHTS
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">⚠️ OUTBREAK SURVEILLANCE RISK: LOW</span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Puroks 1 and 4 indicate normal morbidity bounds. Dengue risk vectors minimized due to dewatering compliance checkups.
                    </p>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">📈 HEALTH ENGAGEMENT: EXCEL</span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Barangay resident registry completeness meets local health planning parameters. Keep records synced.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
