/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Patient, PrenatalRecord, ImmunizationRecord, FamilyPlanningRecord, Language, DOHProgram, Role } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { Baby, Heart, ShieldAlert, Plus, Layers, UserCheck, Trash2, Edit3 } from 'lucide-react';

interface MaternalFPImmunizationProps {
  patients: Patient[];
  prenatals: PrenatalRecord[];
  vaccinations: ImmunizationRecord[];
  familyPlannings: FamilyPlanningRecord[];
  onAddPrenatal: (p: PrenatalRecord) => void;
  onAddVaccination: (v: ImmunizationRecord) => void;
  onAddFamilyPlanning: (f: FamilyPlanningRecord) => void;
  onUpdatePrenatal: (p: PrenatalRecord) => void;
  onDeletePrenatal: (id: string) => void;
  onUpdateVaccination: (v: ImmunizationRecord) => void;
  onDeleteVaccination: (id: string) => void;
  onUpdateFamilyPlanning: (f: FamilyPlanningRecord) => void;
  onDeleteFamilyPlanning: (id: string) => void;
  language: Language;
  activeRole?: Role;
}

export const MaternalFPImmunization: React.FC<MaternalFPImmunizationProps> = ({
  patients,
  prenatals,
  vaccinations,
  familyPlannings,
  onAddPrenatal,
  onAddVaccination,
  onAddFamilyPlanning,
  onUpdatePrenatal,
  onDeletePrenatal,
  onUpdateVaccination,
  onDeleteVaccination,
  onUpdateFamilyPlanning,
  onDeleteFamilyPlanning,
  language,
  activeRole,
}) => {
  const text = LOCALIZED_TEXTS[language];
  const [activeSection, setActiveSection] = useState<'prenatal' | 'epi' | 'fp'>(() => {
    if (activeRole === 'NURSE') return 'epi';
    return 'prenatal';
  });
  const [targetPatId, setTargetPatId] = useState(patients[0]?.id || '');

  // Edit status trackers
  const [editingPrenatalId, setEditingPrenatalId] = useState<string | null>(null);
  const [editingVaccineId, setEditingVaccineId] = useState<string | null>(null);
  const [editingFpId, setEditingFpId] = useState<string | null>(null);

  // Filter patients by program eligibility for lists
  const femalePatients = patients.filter((p) => p.gender === 'Female' && p.civilStatus !== 'Single' || p.lastName !== ''); // reproductives
  const infantPatients = patients.filter((p) => {
    const ageDiff = new Date().getFullYear() - new Date(p.birthDate).getFullYear();
    return ageDiff <= 5; // < 5 immunization bracket
  });

  // Filter existing record histories
  const patientPrenatals = prenatals.filter((p) => p.patientId === targetPatId);
  const patientVaccines = vaccinations.filter((v) => v.patientId === targetPatId);
  const patientFPs = familyPlannings.filter((f) => f.patientId === targetPatId);

  // Form states - Prenatal
  const [lmp, setLmp] = useState('2025-10-05');
  const [edc, setEdc] = useState('2026-07-12');
  const [gravida, setGravida] = useState(1);
  const [para, setPara] = useState(0);
  const [fundalHeightCm, setFundalHeightCm] = useState(32);
  const [fetalHeartTone, setFetalHeartTone] = useState(140);
  const [ttStatus, setTtStatus] = useState('TT2');
  const [riskClassification, setRiskClassification] = useState<'Low Risk' | 'Medium Risk' | 'High Risk'>('Low Risk');
  const [prenatalRemarks, setPrenatalRemarks] = useState('');

  // Form states - EPI Vaccine
  const [motherName, setMotherName] = useState('');
  const [vaccineName, setVaccineName] = useState<ImmunizationRecord['vaccineName']>('BCG');
  const [doseNumber, setDoseNumber] = useState(1);
  const [epiRemarks, setEpiRemarks] = useState('');

  // Form states - Family Planning
  const [spouseName, setSpouseName] = useState('');
  const [desiredSize, setDesiredSize] = useState(2);
  const [livingChildren, setLivingChildren] = useState(1);
  const [fpMethod, setFpMethod] = useState<FamilyPlanningRecord['methodAccepted']>('Oral Contraceptives');
  const [fpType, setFpType] = useState<FamilyPlanningRecord['methodType']>('New Acceptor');

  // Start / Cancel helper functions for form overrides
  const startEditingPrenatal = (pr: PrenatalRecord) => {
    setLmp(pr.lmp);
    setEdc(pr.edc);
    setGravida(pr.gravida);
    setPara(pr.para);
    setFundalHeightCm(pr.fundalHeightCm || 32);
    setFetalHeartTone(pr.fetalHeartToneBpm || 140);
    setTtStatus(pr.tetanusToxoidStatus || 'TT2');
    setRiskClassification(pr.riskClassification || 'Low Risk');
    setPrenatalRemarks(pr.remarks || '');
    setEditingPrenatalId(pr.id);
  };

  const cancelEditingPrenatal = () => {
    setEditingPrenatalId(null);
    setPrenatalRemarks('');
  };

  const startEditingVaccine = (vac: ImmunizationRecord) => {
    setMotherName(vac.motherName || '');
    setVaccineName(vac.vaccineName);
    setDoseNumber(vac.doseNumber);
    setEpiRemarks(vac.remarks || '');
    setEditingVaccineId(vac.id);
  };

  const cancelEditingVaccine = () => {
    setEditingVaccineId(null);
    setEpiRemarks('');
    setMotherName('');
  };

  const startEditingFp = (fp: FamilyPlanningRecord) => {
    setSpouseName(fp.spouseName || '');
    setLivingChildren(fp.numberOfLivingChildren);
    setDesiredSize(fp.desiredFamilySize);
    setFpMethod(fp.methodAccepted);
    setFpType(fp.methodType);
    setEditingFpId(fp.id);
  };

  const cancelEditingFp = () => {
    setEditingFpId(null);
    setSpouseName('');
  };

  const handleDeletePrenatalClick = (prId: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang prenatal record na ito?')) {
      onDeletePrenatal(prId);
      alert('Nabura na ang prenatal record.');
    }
  };

  const handleDeleteVaccineClick = (vacId: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang record ng bakuna na ito?')) {
      onDeleteVaccination(vacId);
      alert('Nabura na ang record ng bakuna.');
    }
  };

  const handleDeleteFpClick = (fpId: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang family planning record na ito?')) {
      onDeleteFamilyPlanning(fpId);
      alert('Nabura na ang family planning record.');
    }
  };

  const handleSavePrenatal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatId) return;

    if (editingPrenatalId) {
      const updatedPr: PrenatalRecord = {
        id: editingPrenatalId,
        patientId: targetPatId,
        lmp,
        edc,
        gravida,
        para,
        gestationalAgeWeeks: 34,
        fundalHeightCm,
        fetalHeartToneBpm: fetalHeartTone,
        tetanusToxoidStatus: ttStatus,
        ironFolicAcidGiven: true,
        bloodPressure: '110/70',
        riskClassification,
        remarks: prenatalRemarks || 'Standard normal prenatal tracking visit.',
        nextPrenatalVisit: '2026-06-25',
      };
      onUpdatePrenatal(updatedPr);
      alert('Na-update ang Prenatal monitoring record!');
      setEditingPrenatalId(null);
    } else {
      const newPr: PrenatalRecord = {
        id: `PRE-2026-00${prenatals.length + 1}`,
        patientId: targetPatId,
        lmp,
        edc,
        gravida,
        para,
        gestationalAgeWeeks: 34,
        fundalHeightCm,
        fetalHeartToneBpm: fetalHeartTone,
        tetanusToxoidStatus: ttStatus,
        ironFolicAcidGiven: true,
        bloodPressure: '110/70',
        riskClassification,
        remarks: prenatalRemarks || 'Standard normal prenatal tracking visit.',
        nextPrenatalVisit: '2026-06-25',
      };
      onAddPrenatal(newPr);
      alert('Naitala ang Prenatal monitoring record!');
    }
    setPrenatalRemarks('');
  };

  const handleSaveEpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatId) return;

    if (editingVaccineId) {
      const existing = vaccinations.find(v => v.id === editingVaccineId);
      const updatedVac: ImmunizationRecord = {
        id: editingVaccineId,
        patientId: targetPatId,
        motherName: motherName || 'Santos, Maria',
        vaccineName,
        doseNumber,
        dateGiven: existing?.dateGiven || new Date().toISOString().split('T')[0],
        givenBy: existing?.givenBy || 'Arlene Cagas Dayama, RM',
        remarks: epiRemarks || 'Standard vaccine dose completed.',
      };
      onUpdateVaccination(updatedVac);
      alert('Na-update ang Pagbabakuna record!');
      setEditingVaccineId(null);
    } else {
      const newVac: ImmunizationRecord = {
        id: `VAC-2026-00${vaccinations.length + 1}`,
        patientId: targetPatId,
        motherName: motherName || 'Santos, Maria',
        vaccineName,
        doseNumber,
        dateGiven: new Date().toISOString().split('T')[0],
        givenBy: 'Arlene Cagas Dayama, RM',
        remarks: epiRemarks || 'Standard vaccine dose completed.',
      };
      onAddVaccination(newVac);
      alert('Matagumpay na naitala ang Pagbabakuna!');
    }
    setEpiRemarks('');
    setMotherName('');
  };

  const handleSaveFP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatId) return;

    if (editingFpId) {
      const updatedFP: FamilyPlanningRecord = {
        id: editingFpId,
        patientId: targetPatId,
        spouseName,
        numberOfLivingChildren: livingChildren,
        desiredFamilySize: desiredSize,
        methodAccepted: fpMethod,
        methodType: fpType,
        remarks: 'Healthy user client follow up scheduled.',
        nextServiceDate: '2026-09-01',
      };
      onUpdateFamilyPlanning(updatedFP);
      alert('Na-update ang Family Planning client profile!');
      setEditingFpId(null);
    } else {
      const newFP: FamilyPlanningRecord = {
        id: `FP-2026-00${familyPlannings.length + 1}`,
        patientId: targetPatId,
        spouseName,
        numberOfLivingChildren: livingChildren,
        desiredFamilySize: desiredSize,
        methodAccepted: fpMethod,
        methodType: fpType,
        remarks: 'Healthy user client follow up scheduled.',
        nextServiceDate: '2026-09-01',
      };
      onAddFamilyPlanning(newFP);
      alert('Naitala ang Family Planning client profile!');
    }
    setSpouseName('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="national-programs-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-md font-bold text-slate-800">DOH National Maternal & Child Care Programs</h2>
          <p className="text-xs text-slate-500">Structured surveillance monitoring for high priority target sectors</p>
        </div>

        {/* Rapid selectors */}
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-slate-400" />
          <select
            className="border border-slate-200 px-3 py-1.5 bg-white rounded-lg text-xs font-semibold focus:outline-hidden"
            value={targetPatId}
            onChange={(e) => setTargetPatId(e.target.value)}
            id="programs-patient-selector"
          >
            {patients.map((pat) => (
              <option key={pat.id} value={pat.id}>
                {pat.lastName}, {pat.firstName} ({pat.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Program Selector Toggles */}
      <div className="grid grid-cols-3 gap-2 border-b border-slate-150 pb-3" id="inner-program-toggles">
        <button
          onClick={() => setActiveSection('prenatal')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeSection === 'prenatal'
              ? 'bg-teal-50 border-teal-200 text-teal-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-prog-prenatal"
        >
          <Heart size={14} />
          MCH Prenatal Care
        </button>

        <button
          onClick={() => setActiveSection('epi')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeSection === 'epi'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-prog-epi"
        >
          <Baby size={14} />
          Baby Immunization (EPI)
        </button>

        <button
          onClick={() => setActiveSection('fp')}
          className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            activeSection === 'fp'
              ? 'bg-purple-50 border-purple-200 text-purple-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-prog-fp"
        >
          <UserCheck size={14} />
          Family Planning
        </button>
      </div>

      {/* RENDER ACTIVE PROGRAM SECTIONS */}
      {activeSection === 'prenatal' && (
        <div className="space-y-4 pt-3" id="prenatal-tab-content">
          {activeRole === 'NURSE' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3.5 text-xs font-semibold space-y-1">
              <strong className="text-amber-800 font-bold block font-sans">🤰 Gampanin sa Workstation (Workstation Notice):</strong>
              <span>Ang Maternal Prenatal Care ay pinamamahalaan ng ating Barangay Midwife (Arlene Cagas Dayama, RM) dahil espesyalista siya sa buntis at prenatal. Ang active workstation ngayon ay para sa Public Health Nurse (Yvonne Galang, RN). Maaari mo lamang basahin (read-only) ang records dito.</span>
            </div>
          )}

          <form onSubmit={handleSavePrenatal} className="space-y-4">
            <fieldset disabled={activeRole === 'NURSE'} className="space-y-4">
              <h3 className="text-xs font-black text-teal-800 uppercase tracking-wider">New Prenatal Encounter (MCH)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Apelyido ng Sanggol (LMP date) *</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-200 p-2.5 rounded-lg font-mono bg-white"
                  value={lmp}
                  onChange={(e) => setLmp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Expected Delivery (EDC) *</label>
                <input
                  type="date"
                  required
                  className="w-full border border-slate-200 p-2.5 rounded-lg font-mono bg-white"
                  value={edc}
                  onChange={(e) => setEdc(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gravida (Pregnancy No)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-slate-200 p-2.5 rounded-lg font-mono"
                  value={gravida}
                  onChange={(e) => setGravida(parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Para (Viable Births)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-slate-200 p-2.5 rounded-lg font-mono"
                  value={para}
                  onChange={(e) => setPara(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fundal Height (cm)</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 p-2.5 rounded-lg font-mono"
                  value={fundalHeightCm}
                  onChange={(e) => setFundalHeightCm(parseInt(e.target.value) || 30)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fetal Heart Tone (bpm)</label>
                <input
                  type="number"
                  className="w-full border border-slate-200 p-2.5 rounded-lg font-mono"
                  value={fetalHeartTone}
                  onChange={(e) => setFetalHeartTone(parseInt(e.target.value) || 140)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tetanus Vaccine (TT-Class)</label>
                <select
                  className="w-full border border-slate-200 p-2.5 bg-white rounded-lg"
                  value={ttStatus}
                  onChange={(e) => setTtStatus(e.target.value)}
                >
                  {['TT1', 'TT2', 'TT3', 'TT4', 'TT5'].map((tt) => (
                    <option key={tt} value={tt}>{tt}</option>
                  ))}
                </select>
              </div>

              {/* Risk Alert colors classification */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Risk Classification Alert</label>
                <select
                  className="w-full border border-slate-200 p-2.5 bg-white rounded-lg font-bold"
                  value={riskClassification}
                  onChange={(e) => setRiskClassification(e.target.value as any)}
                >
                  <option value="Low Risk">Ligtas (Low Risk - Green)</option>
                  <option value="Medium Risk">Katamtaman (Medium Risk - Yellow)</option>
                  <option value="High Risk">Lubhang Mapanganib (High Risk - Red Alert!)</option>
                </select>
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Puna at Tagubilin (Instructions or Remarks)</label>
              <textarea
                rows={2}
                className="w-full border border-slate-200 p-2.5 rounded-lg"
                placeholder="Hal. Naka-iskedyul sa Municipal Lying-In, sumasailalim sa Iron supplementation..."
                value={prenatalRemarks}
                onChange={(e) => setPrenatalRemarks(e.target.value)}
              />
            </div>

              {activeRole !== 'NURSE' && (
                <div className="flex justify-end gap-3">
                  {editingPrenatalId && (
                    <button
                      type="button"
                      onClick={cancelEditingPrenatal}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-lg text-xs cursor-pointer"
                    >
                      I-cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-5 rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                    id="prenatal-submit-button"
                  >
                    {editingPrenatalId ? 'I-update ang Prenatal Visit' : 'I-tala ang Prenatal Visit'}
                  </button>
                </div>
              )}
            </fieldset>
          </form>

          {/* Previous prenatals lists */}
          {patientPrenatals.length > 0 && (
            <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50 text-xs">
              <span className="font-bold text-slate-500 block mb-2 font-mono">Past Prenatal Visits for Patient</span>
              <div className="space-y-2">
                {patientPrenatals.map((pr) => (
                  <div key={pr.id} className="p-2.5 border rounded bg-white flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <strong className="text-slate-800">LMP: {pr.lmp} • Gravida: {pr.gravida} • Para: {pr.para}</strong>
                      <p className="text-slate-500 mt-0.5">{pr.remarks}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                        pr.riskClassification === 'Low Risk' ? 'bg-emerald-100 text-emerald-800' :
                        pr.riskClassification === 'Medium Risk' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-rose-100 text-rose-800 animate-pulse'
                      }`}>
                        {pr.riskClassification}
                      </span>
                      {activeRole !== 'NURSE' && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditingPrenatal(pr)}
                            className="p-1 hover:text-emerald-700 hover:bg-slate-55 rounded cursor-pointer text-slate-400"
                            title="Edit entry"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePrenatalClick(pr.id)}
                            className="p-1 hover:text-rose-600 hover:bg-slate-55 rounded cursor-pointer text-slate-400"
                            title="Delete entry"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'epi' && (
        <div className="space-y-4 pt-3 text-xs" id="epi-tab-content">
          {activeRole === 'MIDWIFE' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3.5 text-xs font-semibold space-y-1">
              <strong className="text-amber-800 font-bold block font-sans">👶 Gampanin sa Workstation (Workstation Notice):</strong>
              <span>Ang serye ng Pagbabakuna (EPI Vaccine) ay pinamamahalaan ng ating Public Health Nurse (Yvonne Galang, RN). Ang active workstation ngayon ay para sa Barangay Midwife (Arlene Cagas Dayama, RM). Maaari mo lamang basahin (read-only) ang records ng bakuna rito.</span>
            </div>
          )}

          <form onSubmit={handleSaveEpi} className="space-y-4">
            <fieldset disabled={activeRole === 'MIDWIFE'} className="space-y-4">
              <h3 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Expand Infant Vaccination Records (EPI Program)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pangalan ng Ina (Ina o Guardian name)</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                  placeholder="e.g. Maria Santos"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pangalan ng Bakuna (EPI Vaccine type) *</label>
                <select
                  className="w-full border border-slate-200 p-2.5 bg-white rounded-lg"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value as any)}
                >
                  {['BCG', 'HepB', 'Pentavalent 1', 'Pentavalent 2', 'Pentavalent 3', 'OPV 1', 'OPV 2', 'OPV 3', 'PCV 1', 'PCV 2', 'PCV 3', 'IPV', 'MCV 1 (Measles)'].map((vac) => (
                    <option key={vac} value={vac}>{vac}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Numero ng Dose (Dose #)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="w-full border border-slate-200 p-2.5 rounded-lg"
                  value={doseNumber}
                  onChange={(e) => setDoseNumber(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Puna (Remarks or weight of infant)</label>
              <input
                type="text"
                className="w-full border border-slate-200 p-2.5 rounded-lg"
                placeholder="Hal. Timbang: 7.2kg, walang lagnat pagkatapos."
                value={epiRemarks}
                onChange={(e) => setEpiRemarks(e.target.value)}
              />
            </div>

              {activeRole !== 'MIDWIFE' && (
                <div className="flex justify-end gap-3">
                  {editingVaccineId && (
                    <button
                      type="button"
                      onClick={cancelEditingVaccine}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-lg text-xs cursor-pointer"
                    >
                      I-cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                    id="epi-submit-button"
                  >
                    {editingVaccineId ? 'I-update ang Bakuna (Update Dose)' : 'Itala ang Bakuna (Record Dose)'}
                  </button>
                </div>
              )}
            </fieldset>
          </form>

          {/* Vaccine schedule checklists */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="font-bold text-slate-700 block mb-3 font-mono">DOH Standard Infant Immunization Lifeline Indicator</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono">
              {[
                { name: 'BCG', desc: 'At birth (Tuberculosis)' },
                { name: 'HepB', desc: 'At birth (Hepatitis B)' },
                { name: 'Pentavalent 1', desc: '6 weeks (DPT-HepB-Hib)' },
                { name: 'Pentavalent 2', desc: '10 weeks (DPT-HepB-Hib)' },
                { name: 'Pentavalent 3', desc: '14 weeks (DPT-HepB-Hib)' },
                { name: 'OPV 1', desc: '6 weeks (Oral Polio)' },
                { name: 'PCV 1', desc: '6 weeks (Pneumococcal)' },
                { name: 'MCV 1 (Measles)', desc: '9 months (Measles)' }
              ].map((vacMeta) => {
                const isGiven = vaccinations.some((v) => v.patientId === targetPatId && v.vaccineName.includes(vacMeta.name));
                return (
                  <div key={vacMeta.name} className={`p-2 rounded border flex items-center justify-between ${
                    isGiven ? 'bg-emerald-100/50 border-emerald-400 text-emerald-800' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    <div>
                      <span className="font-extrabold block">{vacMeta.name}</span>
                      <span>{vacMeta.desc}</span>
                    </div>
                    <span className="font-bold text-xs">{isGiven ? '✓' : '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Vaccines Records */}
          {patientVaccines.length > 0 && (
            <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50 text-xs">
              <span className="font-bold text-slate-505 block mb-2 font-mono text-zinc-650">Recorded Vaccine Doses for Patient</span>
              <div className="space-y-2">
                {patientVaccines.map((v) => (
                  <div key={v.id} className="p-2.5 border rounded bg-white flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <strong className="text-slate-800">Vaccine: {v.vaccineName} (Dose #{v.doseNumber}) • Date: {v.dateGiven}</strong>
                      <p className="text-slate-500 mt-0.5 font-mono text-[11px]">{v.remarks || 'No remarks recorded.'}</p>
                    </div>
                    {activeRole !== 'MIDWIFE' && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => startEditingVaccine(v)}
                          className="p-1 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          title="Edit entry"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVaccineClick(v.id)}
                          className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'fp' && (
        <div className="space-y-4 pt-3 text-xs" id="fp-tab-content">
          {activeRole === 'NURSE' && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3.5 text-xs font-semibold space-y-1">
              <strong className="text-amber-800 font-bold block font-sans">🤰 Gampanin sa Workstation (Workstation Notice):</strong>
              <span>Ang Family Planning program ay pinamamahalaan ng ating Barangay Midwife (Arlene Cagas Dayama, RM). Ang active workstation ngayon ay para sa Public Health Nurse (Yvonne Galang, RN). Maaari mo lamang basahin (read-only) ang records dito.</span>
            </div>
          )}

          <form onSubmit={handleSaveFP} className="space-y-4">
            <fieldset disabled={activeRole === 'NURSE'} className="space-y-4">
              <h3 className="text-xs font-black text-purple-800 uppercase tracking-wider">Family Planning Registry Intake</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Pangalan ng Asawa (Spouse full name)</label>
                <input
                  type="text"
                  className="w-full border border-slate-200 p-2.5 rounded-lg bg-white"
                  placeholder="Apelyido, Pangalan"
                  value={spouseName}
                  onChange={(e) => setSpouseName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Living Children Count</label>
                <input
                  type="number"
                  min="0"
                  className="w-full border border-slate-200 p-2.5 rounded-lg"
                  value={livingChildren}
                  onChange={(e) => setLivingChildren(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Desired Size</label>
                <input
                  type="number"
                  min="1"
                  className="w-full border border-slate-200 p-2.5 rounded-lg"
                  value={desiredSize}
                  onChange={(e) => setDesiredSize(parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 font-mono">Method Type Acceptor</label>
                <select
                  className="w-full border border-slate-200 p-2.5 bg-white rounded-lg font-bold"
                  value={fpType}
                  onChange={(e) => setFpType(e.target.value as any)}
                >
                  <option value="New Acceptor">Bagong Sumali (New Acceptor)</option>
                  <option value="Current User">Kasalukuyang Gumagamit (Current User)</option>
                  <option value="Dropout Reactivated">Bumalik pagkatapos huminto</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Paraan ng Kontrasepsyon (FP Method Chosen) *</label>
              <select
                className="w-full border border-slate-200 p-2.5 bg-white rounded-lg"
                value={fpMethod}
                onChange={(e) => setFpMethod(e.target.value as any)}
              >
                <option value="Oral Contraceptives">Oral Contraceptives (Micropil/Combination Pills)</option>
                <option value="Condoms">Condoms</option>
                <option value="IUD">Intrauterine Device (IUD)</option>
                <option value="DMPA Injectable">Depo trust DMPA Injectable</option>
                <option value="Subdermal Implant">Subdermal Implant</option>
                <option value="Natural FP (BBT/Billings)">Natural FP methods</option>
              </select>
            </div>

              {activeRole !== 'NURSE' && (
                <div className="flex justify-end gap-3">
                  {editingFpId && (
                    <button
                      type="button"
                      onClick={cancelEditingFp}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-5 rounded-lg text-xs cursor-pointer"
                    >
                      I-cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-purple-650 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                    id="fp-submit-button"
                  >
                    {editingFpId ? 'I-update ang Family Planning Record' : 'I-tala ang Family Planning Record'}
                  </button>
                </div>
              )}
            </fieldset>
          </form>

          {/* Past Family Planning records lists */}
          {patientFPs.length > 0 && (
            <div className="border border-slate-100 rounded-lg p-3.5 bg-slate-50/50 text-xs mt-4">
              <span className="font-bold text-slate-500 block mb-2 font-mono">Past Family Planning client profiles for Patient</span>
              <div className="space-y-2">
                {patientFPs.map((fp) => (
                  <div key={fp.id} className="p-2.5 border rounded bg-white flex justify-between items-center gap-2">
                    <div className="flex-1">
                      <strong className="text-slate-800">Method: {fp.methodAccepted} ({fp.methodType}) • Spouse: {fp.spouseName || 'None'}</strong>
                      <div className="text-slate-500 mt-0.5 font-mono text-[11px]">
                        Living Children: {fp.numberOfLivingChildren} • Desired Family Size: {fp.desiredFamilySize} • Next Service: {fp.nextServiceDate || 'N/A'}
                      </div>
                    </div>
                    {activeRole !== 'NURSE' && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <button
                          type="button"
                          onClick={() => startEditingFp(fp)}
                          className="p-1 hover:text-emerald-700 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          title="Edit profile"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFpClick(fp.id)}
                          className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                          title="Delete profile"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
