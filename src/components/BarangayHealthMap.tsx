/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient, Household, Purok } from '../types';
import { MapPin, Users, Flame, ShieldAlert, CheckCircle, Droplet, AlertTriangle, Image as ImageIcon, Map as MapIcon, ShoppingBag } from 'lucide-react';

interface BarangayHealthMapProps {
  patients: Patient[];
  households: Household[];
}

export const BarangayHealthMap: React.FC<BarangayHealthMapProps> = ({ patients, households }) => {
  const [selectedPurok, setSelectedPurok] = useState<Purok>('Purok 1');
  const [mapMode, setMapMode] = useState<'purok' | 'satellite'>('satellite');

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

  // Satellite pin positions (normalized as percentage left/top placement)
  const satellitePins: { key: Purok; left: string; top: string; color: string }[] = [
    { key: 'Purok 1', left: '32%', top: '15%', color: 'bg-emerald-500' },
    { key: 'Purok 2', left: '60%', top: '22%', color: 'bg-sky-500' },
    { key: 'Purok 3', left: '80%', top: '28%', color: 'bg-indigo-500' },
    { key: 'Purok 4', left: '22%', top: '50%', color: 'bg-amber-500' },
    { key: 'Purok 5', left: '50%', top: '54%', color: 'bg-rose-500' }, // Outbreak Hotspot
    { key: 'Purok 6', left: '82%', top: '52%', color: 'bg-teal-500' },
    { key: 'Purok 7', left: '42%', top: '80%', color: 'bg-orange-500' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="surveillance-map-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-emerald-700" size={20} />
          <div>
            <h2 className="text-lg font-bold text-slate-800">Barangay Balong-balong - Health Map</h2>
            <p className="text-xs text-slate-500">Pitogo, Zamboanga del Sur • Purok-level disease surveillance & household sanitation mapping</p>
          </div>
        </div>

        {/* Dynamic map viewport selector with premium visuals */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 self-start sm:self-auto shadow-inner" id="map-mode-toggle">
          <button
            type="button"
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'satellite'
                ? 'bg-white shadow-xs text-slate-900 border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon size={13} />
            <span>Real Satellite Map</span>
          </button>
          <button
            type="button"
            onClick={() => setMapMode('purok')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'purok'
                ? 'bg-white shadow-xs text-slate-900 border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapIcon size={13} />
            <span>Interactive Puroks</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG/Image Map Section */}
        <div className="col-span-1 lg:col-span-7 flex flex-col items-center border border-slate-200/60 rounded-2xl p-4 bg-slate-50 justify-center">
          
          {mapMode === 'satellite' ? (
            /* REAL SATELLITE MAP RENDER LAYOUT WITH Pin Overlays & Labels */
            <div className="relative w-full max-w-[550px] rounded-xl overflow-hidden border-2 border-slate-300 shadow-md aspect-[460/350]">
              <img 
                src="/src/assets/images/balong_balong_map_1781075564140.png" 
                alt="Barangay Balong-balong satellite map with red outline" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />

              {/* Geographical Landmarks overlays */}
              <div className="absolute top-[34%] left-[10%] bg-slate-900/85 text-white text-[9px] font-black px-2 py-1 rounded-md border border-slate-700 pointer-events-none shadow-xs flex items-center gap-1 select-none whitespace-nowrap">
                <ShoppingBag size={9} className="text-amber-400" />
                <span>Balong balong Public Market</span>
              </div>
              <div className="absolute top-[48%] left-[54%] bg-slate-900/80 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-sm tracking-widest pointer-events-none uppercase select-none whitespace-nowrap">
                BALONG-BALONG
              </div>

              {/* Dynamic Interactive Pin overlays linked to selected Purok */}
              {satellitePins.map((pin) => {
                const isSelected = selectedPurok === pin.key;
                const isHotspot = pin.key === 'Purok 5';
                const isWarning = pin.key === 'Purok 7';
                
                return (
                  <button
                    key={pin.key}
                    type="button"
                    onClick={() => setSelectedPurok(pin.key)}
                    style={{ left: pin.left, top: pin.top }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 group flex flex-col items-center z-10"
                    title={`Click to analyze ${pin.key}`}
                  >
                    {/* Ring alerts for warnings or outbreak */}
                    {isHotspot && (
                      <span className="absolute flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500/20"></span>
                      </span>
                    )}

                    {isWarning && (
                      <span className="absolute flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500/20"></span>
                      </span>
                    )}

                    <div className={`p-1.5 rounded-full shadow-md border ${
                      isSelected 
                        ? 'bg-slate-950 border-white text-white scale-125 z-20' 
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    } transition-all`}>
                      <MapPin size={isSelected ? 14 : 11} className={isSelected ? 'text-white' : 'text-emerald-600'} />
                    </div>
                    
                    <span className={`mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-xs shadow-3xs ${
                      isSelected 
                        ? 'bg-slate-950 text-white border border-slate-800' 
                        : 'bg-white/90 text-slate-800 border border-slate-200'
                    } whitespace-nowrap`}>
                      {pin.key}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* VECTOR SVG CLUSTER LAYOUT MAP */
            <div className="w-full flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Click to Investigate Purok Clusters</span>
              <svg viewBox="0 0 460 350" className="w-full max-w-[550px] drop-shadow-md">
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
            </div>
          )}
          
          {/* Map Legends */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-[10px] text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border border-rose-600"></span>
              <span>High Risk (Purok 5 - Outbreak Cluster)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 border border-orange-500"></span>
              <span>Medium Risk (Purok 7 - Vax Outreach)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600"></span>
              <span>Regular Surveillance Monitoring</span>
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
