/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient, Household, Purok } from '../types';
import { MapPin, Users, Flame, ShieldAlert, CheckCircle, Droplet, AlertTriangle } from 'lucide-react';

interface BarangayHealthMapProps {
  patients: Patient[];
  households: Household[];
}

export const BarangayHealthMap: React.FC<BarangayHealthMapProps> = ({ patients, households }) => {
  const [selectedPurok, setSelectedPurok] = useState<Purok>('Purok 1');

  // Compute stats for the chosen Purok
  const purokHouseholds = households.filter((h) => h.purok === selectedPurok);
  const purokPatients = patients.filter((p) => p.purok === selectedPurok);
  
  const totalResidents = purokPatients.length;
  const totalFamilies = purokHouseholds.length;
  
  // Specific health risks per Purok matching mock structures
  const activeTB = purokPatients.filter((p) => p.activePrograms.includes('TB_DOTS')).length;
  const activePrenatal = purokPatients.filter((p) => p.activePrograms.includes('MCH')).length;
  const unvaccinatedEPI = purokPatients.filter((p) => p.activePrograms.includes('EPI')).length; // representative
  const seniorsCount = purokPatients.filter((p) => p.activePrograms.includes('SENIOR_CITIZEN')).length;

  const unsanitaryToilets = purokHouseholds.filter((h) => !h.sanitaryToilet).length;
  const unsafeWater = purokHouseholds.filter((h) => h.waterSource === 'Unsanitary/Unprotected').length;

  // Render maps layout coordinate structures
  const purokSpecs: { key: Purok; d: string; color: string; labelX: number; labelY: number }[] = [
    { key: 'Purok 1', d: 'M 30,50 L 150,30 L 170,120 L 50,140 Z', color: 'fill-emerald-100 hover:fill-emerald-200 stroke-emerald-600', labelX: 90, labelY: 80 },
    { key: 'Purok 2', d: 'M 150,30 L 290,40 L 270,130 L 170,120 Z', color: 'fill-sky-100 hover:fill-sky-200 stroke-sky-600', labelX: 210, labelY: 80 },
    { key: 'Purok 3', d: 'M 290,40 L 410,20 L 430,110 L 270,130 Z', color: 'fill-indigo-100 hover:fill-indigo-200 stroke-indigo-600', labelX: 350, labelY: 70 },
    { key: 'Purok 4', d: 'M 50,140 L 170,120 L 150,220 L 30,230 Z', color: 'fill-amber-100 hover:fill-amber-200 stroke-amber-600', labelX: 100, labelY: 180 },
    { key: 'Purok 5', d: 'M 170,120 L 270,130 L 250,240 L 150,220 Z', color: 'fill-rose-100/80 hover:fill-rose-200/90 stroke-rose-600', labelX: 200, labelY: 180 }, // Alert hot spot!
    { key: 'Purok 6', d: 'M 270,130 L 430,110 L 400,210 L 250,240 Z', color: 'fill-teal-100 hover:fill-teal-200 stroke-teal-600', labelX: 330, labelY: 170 },
    { key: 'Purok 7', d: 'M 150,220 L 250,240 L 220,320 L 110,310 Z', color: 'fill-orange-100/80 hover:fill-orange-200/90 stroke-orange-600', labelX: 180, labelY: 280 }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="surveillance-map-panel">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-emerald-600" size={20} />
        <div>
          <h2 className="text-lg font-bold text-slate-800">Barangay Balong-balong - Health Map</h2>
          <p className="text-xs text-slate-500">Pitogo, Zamboanga del Sur • Purok-level disease surveillance & household sanitation mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Map Section */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-center border border-slate-100 rounded-lg p-3 bg-slate-50 justify-center">
          <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Click to Investigate Purok Clusters</span>
          
          <svg viewBox="0 0 460 350" className="w-full max-w-[430px] drop-shadow-md">
            {purokSpecs.map((p) => (
              <g 
                key={p.key} 
                className="cursor-pointer transition-all" 
                onClick={() => setSelectedPurok(p.key)}
              >
                <path
                  d={p.d}
                  className={`${p.color} stroke-2 transition-colors duration-150 ${
                    selectedPurok === p.key ? 'fill-opacity-100 stroke-[3px] filter drop-shadow-lg scale-[1.01]' : 'fill-opacity-65'
                  }`}
                />
                
                {/* Labels indicating numbers of residents */}
                <text
                  x={p.labelX}
                  y={p.labelY}
                  textAnchor="middle"
                  className={`font-semibold text-[11px] pointer-events-none select-none transition-colors ${
                    selectedPurok === p.key ? 'fill-slate-950 font-bold' : 'fill-slate-700'
                  }`}
                >
                  {p.key}
                </text>
                
                {/* Hotspot Alerts for active issues */}
                {p.key === 'Purok 5' && (
                  <circle cx={p.labelX + 8} cy={p.labelY + 12} r="4" className="fill-rose-600 animate-ping" />
                )}
                {p.key === 'Purok 7' && (
                  <circle cx={p.labelX + 8} cy={p.labelY + 12} r="4" className="fill-amber-600" />
                )}
              </g>
            ))}
          </svg>
          
          {/* Map Legends */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[10px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-rose-200 stroke-rose-600 border border-rose-400 rounded-xs" />
              <span>High Risk (Active Outbreak / Unsanitary Toilets)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-emerald-200 stroke-emerald-600 border border-emerald-400 rounded-xs" />
              <span>Low Risk (DOH Immunization Met / Sanitary Water)</span>
            </div>
          </div>
        </div>

        {/* Localized Details Section */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between border border-slate-100 rounded-lg p-4 bg-white">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xl font-black text-slate-800">{selectedPurok}</span>
              <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-sm flex items-center gap-1">
                <Users size={12} />
                {totalResidents} Residents
              </span>
            </div>

            {/* Purok Census Metadata list */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                <span className="font-medium text-slate-500">Registered Households</span>
                <span className="font-bold text-slate-900 text-sm">{totalFamilies} families</span>
              </div>

              {/* Programs and indicators layout */}
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Health Program Demographics</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 border border-slate-100 rounded-lg bg-emerald-50/50">
                  <span className="text-[10px] text-slate-500 block">Prenatal (MCH)</span>
                  <span className="text-base font-extrabold text-emerald-700">{activePrenatal} active</span>
                </div>
                <div className="p-2 border border-slate-100 rounded-lg bg-teal-50/50">
                  <span className="text-[10px] text-slate-500 block">Infants in EPI</span>
                  <span className="text-base font-extrabold text-teal-700">{unvaccinatedEPI} active</span>
                </div>
                <div className="p-2 border border-slate-100 rounded-lg bg-amber-50/50">
                  <span className="text-[10px] text-slate-500 block">Senior Citizens</span>
                  <span className="text-base font-extrabold text-amber-700">{seniorsCount} registered</span>
                </div>
                <div className="p-2 border border-slate-100 rounded-lg bg-rose-50/50">
                  <span className="text-[10px] text-slate-500 block">TB Presumptives</span>
                  <span className="text-base font-extrabold text-rose-700">{activeTB} monitoring</span>
                </div>
              </div>

              {/* Environmental Metrics (Critical DOH FHSIS standards) */}
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mt-4">Sanitary Environment Status</h3>
              
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Droplet size={12} className="text-sky-500" /> Unsafe Water Sources
                  </span>
                  <span className={`font-bold py-0.5 px-2 rounded ${unsafeWater > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {unsafeWater} HHs
                  </span>
                </div>
                
                <div className="flex justify-between items-center bg-slate-50 p-2 rounded">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Flame size={12} className="text-orange-500" /> Unsanitary Toilets
                  </span>
                  <span className={`font-bold py-0.5 px-2 rounded ${unsanitaryToilets > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {unsanitaryToilets} HHs
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1 bg-amber-50 text-amber-800 p-2 rounded-md">
            <AlertTriangle size={12} />
            <span>
              {selectedPurok === 'Purok 5' && 'Alert: Water contamination alert in effect. Educate residents on boiling drinking water.'}
              {selectedPurok === 'Purok 7' && 'Alert: Under-immunized cluster warning. Scheduled BHW outreach this Friday.'}
              {selectedPurok !== 'Purok 5' && selectedPurok !== 'Purok 7' && 'Surveillance status optimal. Standard quarterly monitoring ongoing.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
