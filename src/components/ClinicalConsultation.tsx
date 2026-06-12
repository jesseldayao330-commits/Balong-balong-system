/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient, VitalSigns, Consultation, Language, Role } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { HeartPulse, Plus, BookOpen, AlertTriangle, Scale, Thermometer, ShieldCheck, Check, Trash2, Edit3 } from 'lucide-react';

interface ClinicalConsultationProps {
  patients: Patient[];
  vitals: VitalSigns[];
  consultations: Consultation[];
  onAddVitalSign: (v: VitalSigns) => void;
  onAddConsultation: (c: Consultation) => void;
  onUpdateVitalSign: (v: VitalSigns) => void;
  onDeleteVitalSign: (id: string) => void;
  onUpdateConsultation: (c: Consultation) => void;
  onDeleteConsultation: (id: string) => void;
  language: Language;
  attendingStaffName: string;
  activeRole?: Role;
}

export const ClinicalConsultation: React.FC<ClinicalConsultationProps> = ({
  patients,
  vitals,
  consultations,
  onAddVitalSign,
  onAddConsultation,
  onUpdateVitalSign,
  onDeleteVitalSign,
  onUpdateConsultation,
  onDeleteConsultation,
  language,
  attendingStaffName,
  activeRole,
}) => {
  const text = LOCALIZED_TEXTS[language];
  const [selectedPatId, setSelectedPatId] = useState(patients[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'vitals' | 'consultation' | 'history'>('vitals');

  // Edit status trackers
  const [editingVitalId, setEditingVitalId] = useState<string | null>(null);
  const [editingConsultId, setEditingConsultId] = useState<string | null>(null);

  // Select patient record
  const currentPatient = patients.find((p) => p.id === selectedPatId);

  // Filter existing history records
  const patientVitals = vitals.filter((v) => v.patientId === selectedPatId);
  const patientConsults = consultations.filter((c) => c.patientId === selectedPatId);

  // Vital Form State
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [temperature, setTemperature] = useState(36.5);
  const [heartRate, setHeartRate] = useState(72);
  const [respiratoryRate, setRespiratoryRate] = useState(18);
  const [weightKg, setWeightKg] = useState(60);
  const [heightCm, setHeightCm] = useState(165);
  const [bmi, setBmi] = useState(22);
  const [bmiCategory, setBmiCategory] = useState<'Underweight' | 'Normal' | 'Overweight' | 'Obese'>('Normal');
  const [bloodSugar, setBloodSugar] = useState('');

  // Auto calculate BMI (weight / height^2)
  useEffect(() => {
    if (weightKg > 0 && heightCm > 0) {
      const heightM = heightCm / 100;
      const calculatedBmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
      setBmi(calculatedBmi);
      
      if (calculatedBmi < 18.5) {
        setBmiCategory('Underweight');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiCategory('Normal');
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    }
  }, [weightKg, heightCm]);

  // Consultation Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [customDiagnosis, setCustomDiagnosis] = useState('');
  const [isTBPossible, setIsTBPossible] = useState(false);
  const [isDenguePossible, setIsDenguePossible] = useState(false);
  const [planTreatment, setPlanTreatment] = useState('');
  const [referredToHospital, setReferredToHospital] = useState(false);

  // Action initiators for editing state
  const startEditingVital = (v: VitalSigns) => {
    setSystolic(v.systolic);
    setDiastolic(v.diastolic);
    setTemperature(v.temperature);
    setHeartRate(v.heartRate);
    setRespiratoryRate(v.respiratoryRate);
    setWeightKg(v.weightKg);
    setHeightCm(v.heightCm);
    setBmi(v.bmi);
    setBmiCategory(v.bmiCategory);
    setBloodSugar(v.bloodSugar ? String(v.bloodSugar) : '');
    setEditingVitalId(v.id);
    setActiveTab('vitals');
  };

  const cancelEditingVital = () => {
    setEditingVitalId(null);
    setSystolic(120);
    setDiastolic(80);
    setTemperature(36.5);
    setHeartRate(72);
    setRespiratoryRate(18);
    setWeightKg(60);
    setHeightCm(165);
    setBloodSugar('');
  };

  const startEditingConsult = (c: Consultation) => {
    setChiefComplaint(c.chiefComplaint);
    setSubjective(c.subjective || '');
    setObjective(c.objective || '');
    setDiagnoses(c.assessmentDiagnoses);
    setIsTBPossible(c.isTBPossible);
    setIsDenguePossible(c.isDenguePossible);
    setPlanTreatment(c.planTreatment);
    setReferredToHospital(c.referredToHospital);
    setEditingConsultId(c.id);
    setActiveTab('consultation');
  };

  const cancelEditingConsult = () => {
    setEditingConsultId(null);
    setChiefComplaint('');
    setSubjective('');
    setObjective('');
    setDiagnoses([]);
    setIsTBPossible(false);
    setIsDenguePossible(false);
    setPlanTreatment('');
    setReferredToHospital(false);
  };

  const handleDeleteVitalClick = (vId: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang partikular na vital signs record na ito?')) {
      onDeleteVitalSign(vId);
      alert('Nabura na ang vital signs record.');
    }
  };

  const handleDeleteConsultClick = (cId: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang consultation record na ito?')) {
      onDeleteConsultation(cId);
      alert('Nabura na ang consultation record.');
    }
  };

  // Common Philippine diagnostic quick selector codes
  const icdQuickOptions = [
    { code: 'I10', term: 'Essential Hypertension' },
    { code: 'E11.9', term: 'Type 2 Diabetes Mellitus' },
    { code: 'A15.0', term: 'Pulmonary Tuberculosis (Confirm)' },
    { code: 'J06.9', term: 'Acute Upper Respiratory Infection' },
    { code: 'A90', term: 'Dengue Fever' },
    { code: 'J18.9', term: 'Community Acquired Pneumonia' },
    { code: 'K30', term: 'Dyspepsia / Hyperacidity' }
  ];

  const handleDiagnoseSelect = (codeTerm: string) => {
    if (diagnoses.includes(codeTerm)) {
      setDiagnoses(diagnoses.filter((d) => d !== codeTerm));
    } else {
      setDiagnoses([...diagnoses, codeTerm]);
      
      // Smart trigger - if TB code is picked, auto flip TB checkpoint
      if (codeTerm.includes('A15.0') || codeTerm.toLowerCase().includes('tuberculosis')) {
        setIsTBPossible(true);
      }
      if (codeTerm.includes('A90') || codeTerm.toLowerCase().includes('dengue')) {
        setIsDenguePossible(true);
      }
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatId) return;

    if (editingVitalId) {
      const updatedV: VitalSigns = {
        id: editingVitalId,
        patientId: selectedPatId,
        date: new Date().toISOString().split('T')[0],
        systolic,
        diastolic,
        temperature,
        heartRate,
        respiratoryRate,
        weightKg,
        heightCm,
        bmi,
        bmiCategory,
        bloodSugar: bloodSugar ? parseInt(bloodSugar) : undefined,
        loggedBy: attendingStaffName || 'Julefe Magwate (BHW)',
      };
      onUpdateVitalSign(updatedV);
      setEditingVitalId(null);
      alert('Matagumpay na nai-update ang Vital Signs. (Vital Signs updated successfully).');
    } else {
      const newV: VitalSigns = {
        id: `VIT-2026-00${vitals.length + 1}`,
        patientId: selectedPatId,
        date: new Date().toISOString().split('T')[0],
        systolic,
        diastolic,
        temperature,
        heartRate,
        respiratoryRate,
        weightKg,
        heightCm,
        bmi,
        bmiCategory,
        bloodSugar: bloodSugar ? parseInt(bloodSugar) : undefined,
        loggedBy: attendingStaffName || 'Julefe Magwate (BHW)',
      };
      onAddVitalSign(newV);
      alert('Matagumpay na naitala ang Vital Signs (Vital Signs logged successfully).');
    }

    setBloodSugar('');
    setActiveTab('history'); // promote quick checking in history
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatId) return;

    if (editingConsultId) {
      const updatedC: Consultation = {
        id: editingConsultId,
        patientId: selectedPatId,
        date: new Date().toISOString().split('T')[0],
        chiefComplaint,
        subjective,
        objective,
        assessmentDiagnoses: diagnoses.length > 0 ? diagnoses : ['J06.9 - Unspecified Assessment'],
        isTBPossible,
        isDenguePossible,
        planTreatment,
        referredToHospital,
        mhoValidated: attendingStaffName.includes('MD') || attendingStaffName.includes('MHO'),
        attendingStaff: attendingStaffName,
      };
      onUpdateConsultation(updatedC);
      setEditingConsultId(null);
      alert('Matagumpay na nai-update ang Clinical Consultation! (Consultation updated successfully).');
    } else {
      const newC: Consultation = {
        id: `CON-2026-00${consultations.length + 1}`,
        patientId: selectedPatId,
        date: new Date().toISOString().split('T')[0],
        chiefComplaint,
        subjective,
        objective,
        assessmentDiagnoses: diagnoses.length > 0 ? diagnoses : ['J06.9 - Unspecified Assessment'],
        isTBPossible,
        isDenguePossible,
        planTreatment,
        referredToHospital,
        mhoValidated: attendingStaffName.includes('MD') || attendingStaffName.includes('MHO'),
        attendingStaff: attendingStaffName,
      };
      onAddConsultation(newC);
      alert('Naitala ang clinical consultation! (Consultation recorded successfully).');
    }
    
    // Clear state
    setChiefComplaint('');
    setSubjective('');
    setObjective('');
    setDiagnoses([]);
    setIsTBPossible(false);
    setIsDenguePossible(false);
    setPlanTreatment('');
    setReferredToHospital(false);
    setActiveTab('history');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5" id="clinical-management-panel">
      {/* Patient choosing header */}
      <div className="border-b border-slate-100 pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HeartPulse size={20} className="text-emerald-600" />
          <div>
            <h2 className="text-md font-bold text-slate-800">Klinika at Pangangalaga (Clinic & Consultation Module)</h2>
            <p className="text-xs text-slate-500">Record stats and patient consultations within 2 minutes</p>
          </div>
        </div>

        {/* Rapid Patient Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Pasyente:</span>
          <select
            className="border border-slate-200 px-3 py-2 bg-white rounded-lg text-xs font-semibold focus:outline-hidden"
            value={selectedPatId}
            onChange={(e) => {
              setSelectedPatId(e.target.value);
              setActiveTab('vitals');
            }}
            id="clinical-patient-selector"
          >
            {patients.map((pat) => (
              <option key={pat.id} value={pat.id}>
                {pat.lastName}, {pat.firstName} ({pat.purok})
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentPatient ? (
        <div className="space-y-4">
          {/* Active Patient summary strip */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 uppercase tracking-widest font-mono text-[9px]">Pasyente Ngayon:</span>
              <h3 className="font-extrabold text-sm text-slate-800">{currentPatient.lastName}, {currentPatient.firstName}</h3>
            </div>
            <div className="font-mono text-slate-500">
              Edad/Kasrian: <strong className="text-slate-800">{new Date().getFullYear() - new Date(currentPatient.birthDate).getFullYear()} taong gulang</strong> ({currentPatient.gender})
            </div>
            <div className="font-mono text-slate-500">
              Purok: <strong className="text-emerald-800">{currentPatient.purok}</strong>
            </div>
            {currentPatient.allergies && (
              <div className="px-2.5 py-1 bg-rose-100 text-rose-800 font-bold rounded-sm border border-rose-200 font-mono text-[10px]">
                Alerhiya: {currentPatient.allergies}
              </div>
            )}
          </div>

          {/* Module Inner Tabs */}
          <div className="flex border-b border-slate-200/60 pb-0.5 gap-2" id="clinical-work-tabs">
            <button
              onClick={() => setActiveTab('vitals')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                activeTab === 'vitals' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
              id="tab-vitals"
            >
              {editingVitalId ? '✏️ Ibahagi ang Vitals (Editing)' : '1. Vital Signs Log'}
            </button>
            <button
              onClick={() => setActiveTab('consultation')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                activeTab === 'consultation' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
              id="tab-consultation"
            >
              {editingConsultId ? '✏️ Ibahagi ang Konsulta (Editing)' : '2. Log Consultation'}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
                activeTab === 'history' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
              id="tab-diagnostic-history"
            >
              Medical History ({patientConsults.length})
            </button>
          </div>

          {/* WORK TAB 1: Vital Signs Form */}
          {activeTab === 'vitals' && (
            <form onSubmit={handleSaveVitals} className="space-y-4 pt-3" id="vitals-entry-form">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Blood Pressure (Systolic) *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min="50"
                      max="250"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-center font-mono"
                      value={systolic}
                      onChange={(e) => setSystolic(parseInt(e.target.value) || 120)}
                    />
                    <span className="text-xs text-slate-400">mmHg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">BP (Diastolic) *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      min="30"
                      max="150"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-center font-mono"
                      value={diastolic}
                      onChange={(e) => setDiastolic(parseInt(e.target.value) || 80)}
                    />
                    <span className="text-xs text-slate-400">mmHg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Lagnat (Temperature °C) *</label>
                  <div className="flex items-center gap-1">
                    <Thermometer size={14} className="text-amber-500" />
                    <input
                      type="number"
                      step="0.1"
                      required
                      min="33"
                      max="43"
                      className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-center font-mono"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value) || 36.5)}
                    />
                    <span className="text-xs text-slate-400">°C</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Detox/Heart Rate (bpm)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm text-center font-mono"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 72)}
                  />
                </div>
              </div>

              {/* Patient scale body parameters Weight, Height, BMI */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/20">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Weight (Timbang) *</label>
                  <div className="flex items-center gap-1">
                    <Scale size={14} className="text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm text-center font-mono"
                      value={weightKg}
                      onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    />
                    <span className="text-xs text-slate-400">Kg</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Height (Taas) *</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      required
                      className="w-full border border-slate-200 bg-white p-2.5 rounded-lg text-sm text-center font-mono"
                      value={heightCm}
                      onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                    />
                    <span className="text-xs text-slate-400">Cm</span>
                  </div>
                </div>

                {/* BMI Auto compute output */}
                <div className="col-span-2 flex items-center justify-between border-l border-slate-200 pl-4">
                  <div className="font-mono text-xs">
                    <span className="text-slate-400 text-[10px] block font-sans">COMPUTED BMI</span>
                    <strong className="text-slate-800 text-lg mr-2">{bmi}</strong>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                      bmiCategory === 'Normal' ? 'bg-emerald-100 text-emerald-800' :
                      bmiCategory === 'Underweight' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      'bg-rose-100 text-rose-800 font-bold'
                    }`}>
                      {bmiCategory}
                    </span>
                  </div>
                  
                  {bmiCategory === 'Underweight' && (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 p-2 rounded max-w-44">
                      Refer to Operation Timbang Nutritions checklist
                    </span>
                  )}
                </div>
              </div>

              {/* Seniors sugar check metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Respiratory Rate (breaths/min)</label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-mono"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(Math.max(1, parseInt(e.target.value) || 18))}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Random Blood Sugar (Seniors Alert prn)</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-mono"
                    placeholder="mg/dL (e.g. 110)"
                    value={bloodSugar}
                    onChange={(e) => setBloodSugar(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                {editingVitalId && (
                  <button
                    type="button"
                    onClick={cancelEditingVital}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-lg text-xs cursor-pointer"
                  >
                    I-cancel (Cancel)
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-6 rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                  id="vitals-entry-submit-button"
                >
                  {editingVitalId ? 'I-update ang mga Vital Stats (Update Vitals)' : 'I-save ang mga Vital Stats (Process to Consultation)'}
                </button>
              </div>
            </form>
          )}

          {/* WORK TAB 2: Clean Consultation Form */}
          {activeTab === 'consultation' && (
            <div className="space-y-4">
              {activeRole === 'MIDWIFE' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3.5 text-xs font-semibold space-y-1">
                  <strong className="text-amber-800 font-bold block font-sans">📋 Pangkalahatang Konsulta (General Check-up Notice):</strong>
                  <span>Ang pangkalahatang Clinical Consultation / Check-up ay pinamamahalaan ng ating Public Health Nurse (Yvonne Galang, RN). Ang iyong active workstation ngayon ay para sa Barangay Midwife (Arlene Cagas Dayama, RM) na nakatuon sa Maternal at Prenatal. Maaari mo lamang basahin (read-only) ang pangkalahatang konsulta rito.</span>
                </div>
              )}

              <form onSubmit={handleSaveConsultation} className="space-y-4 pt-3" id="consultation-form-block">
                <fieldset disabled={activeRole === 'MIDWIFE'} className="space-y-4">
              {/* Vitals snapshot box under review */}
              {patientVitals.length > 0 && (
                <div className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-lg text-xs text-slate-600 flex items-center justify-between">
                  <span>Pinakahuling Vital Signs ({patientVitals[patientVitals.length - 1].date}): </span>
                  <span className="font-bold font-mono text-slate-800">
                    BP: {patientVitals[patientVitals.length - 1].systolic}/{patientVitals[patientVitals.length - 1].diastolic} mmHg •
                    Temp: {patientVitals[patientVitals.length - 1].temperature}°C •
                    Weight: {patientVitals[patientVitals.length - 1].weightKg}Kg •
                    BMI: {patientVitals[patientVitals.length - 1].bmi} ({patientVitals[patientVitals.length - 1].bmiCategory})
                  </span>
                </div>
              )}

              {/* Chef complaints */}
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Pangunahing Daing (Chief Complaint) *</label>
                <textarea
                  required
                  rows={2}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden"
                  placeholder="Isulat ang mismong salita ng pasyente. Halimbawa: Inubo ng may plema sa loob ng dalawang linggo."
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                />
              </div>

              {/* Subjective Objective details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Subjective (Mga nararamdaman pa ng pasyente)</label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs"
                    placeholder="Kasaysayan ng sakit, pamilya, o gamot na ininom..."
                    value={subjective}
                    onChange={(e) => setSubjective(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-1">Objective (Klinikal na obserbasyon ng BHW/Midwife)</label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-xs"
                    placeholder="Pisikal na pagsusuri, tunog ng baga, lalamunan..."
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                  />
                </div>
              </div>

              {/* Diagnostic/ICD-10 quick checkboxes selection */}
              <div>
                <label className="block text-xs font-black text-indigo-950 uppercase mb-2">Philippine Common Cases & ICD-10 Coding Checkbox</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/50">
                  {icdQuickOptions.map((opt) => {
                    const selectKey = `${opt.code} - ${opt.term}`;
                    const isSelected = diagnoses.includes(selectKey);
                    return (
                      <button
                        type="button"
                        key={opt.code}
                        onClick={() => handleDiagnoseSelect(selectKey)}
                        className={`text-left p-2 rounded text-[11px] font-semibold flex items-center justify-between border cursor-pointer ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-650' : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>{opt.code}: {opt.term}</span>
                        {isSelected && <Check size={12} className="shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom diagnosis */}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-slate-200 p-2 rounded-lg text-xs"
                  placeholder="Iba pang Diagnosis / ICD-10 codings..."
                  value={customDiagnosis}
                  onChange={(e) => setCustomDiagnosis(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customDiagnosis.trim()) {
                      setDiagnoses([...diagnoses, customDiagnosis.trim()]);
                      setCustomDiagnosis('');
                    }
                  }}
                  className="bg-indigo-100 hover:bg-slate-200 border border-indigo-200 text-indigo-900 text-xs px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Idugang Diagnosis
                </button>
              </div>

              {/* Disease surveillance triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-dashed border-slate-200 py-3 bg-red-50/20 p-3 rounded-xl">
                <div>
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="mt-1 accent-rose-600"
                      checked={isTBPossible}
                      onChange={(e) => setIsTBPossible(e.target.checked)}
                    />
                    <div>
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                        <AlertTriangle size={12} /> TB Presumptive Alert
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">May ubo ng mahigit 2 linggo, lagnat sa hapon, o bawas sa timbang.</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="mt-1 accent-indigo-600"
                      checked={isDenguePossible}
                      onChange={(e) => setIsDenguePossible(e.target.checked)}
                    />
                    <div>
                      <span className="text-xs font-bold text-indigo-800 flex items-center gap-1">
                        <AlertTriangle size={12} /> Dengue Outbreak Check
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">May mataas na lagnat, sakit ng ulo, likod ng mata, o mga petechiae.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Planned treatment plan prescriptions */}
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-1">Plano at Paggamot (Plan & Treatment Prescription) *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full border border-slate-200 p-2.5 rounded-lg text-xs"
                  placeholder="Ilista ang ireresetang gamot (medicine dosage format) pati na rin ang mga payo o iskedyul ng lab..."
                  value={planTreatment}
                  onChange={(e) => setPlanTreatment(e.target.value)}
                />
              </div>

              {/* Referral check */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-emerald-600"
                    checked={referredToHospital}
                    onChange={(e) => setReferredToHospital(e.target.checked)}
                  />
                  <span>Kailangang i-refer sa Municipal Hospital? (Requires Outgoing Referral document)</span>
                </label>
              </div>

                {activeRole !== 'MIDWIFE' && (
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    {editingConsultId && (
                      <button
                        type="button"
                        onClick={cancelEditingConsult}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-6 rounded-lg text-xs cursor-pointer"
                      >
                        I-cancel (Cancel)
                      </button>
                    )}
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-6 rounded-lg text-xs tracking-wider uppercase cursor-pointer"
                      id="consultation-entry-submit-button"
                    >
                      {editingConsultId ? 'I-update ang Consultation Record' : 'Ipasa ang Clinical Consultation Record'}
                    </button>
                  </div>
                )}
                </fieldset>
              </form>
            </div>
          )}

          {/* WORK TAB 3: Diagnostic and vitals histories */}
          {activeTab === 'history' && (
            <div className="space-y-6 pt-3" id="patient-medical-histories">
              {/* VITALS HISTORIES SECTION */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b pb-1">Vitals Log Histories</h3>
                {patientVitals.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs bg-slate-50/50 rounded-lg italic border text-slate-500">
                    Walang nakaraang vital signs naitala (No past vitals on record).
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {patientVitals.map((vit) => (
                      <div key={vit.id} className="border border-slate-200 rounded-lg p-3 bg-white shadow-xs">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {vit.id} • Petsa: {vit.date}</span>
                          <div className="flex gap-1 text-slate-500">
                            <button
                              type="button"
                              onClick={() => startEditingVital(vit)}
                              className="p-1 hover:text-emerald-700 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                              title="Edit Vitals"
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVitalClick(vit.id)}
                              className="p-1 hover:text-rose-600 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                              title="Delete Vitals"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-755">
                          <div><span className="text-slate-400">BP:</span> <strong>{vit.systolic}/{vit.diastolic}</strong></div>
                          <div><span className="text-slate-400">Temp:</span> <strong>{vit.temperature}°C</strong></div>
                          <div><span className="text-slate-400">Heart:</span> <strong>{vit.heartRate} bpm</strong></div>
                          <div><span className="text-slate-400">Resp:</span> <strong>{vit.respiratoryRate}/m</strong></div>
                          <div><span className="text-slate-400">Weight:</span> <strong>{vit.weightKg} kg</strong></div>
                          <div><span className="text-slate-400">BMI:</span> <strong>{vit.bmi} ({vit.bmiCategory})</strong></div>
                        </div>
                        {vit.bloodSugar && (
                          <div className="mt-1 pb-1 text-[10px] text-zinc-500 font-mono">
                             FBS/Sugar: <strong className="text-indigo-950">{vit.bloodSugar} mg/dL</strong>
                          </div>
                        )}
                        <div className="text-[9px] text-zinc-400 text-right mt-1.5 border-t border-slate-50 pt-1 font-mono italic">
                          Logged by: {vit.loggedBy}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CONSULTATIONS HISTORIES SECTION */}
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b pb-1">Consultation Log Histories</h3>
                {patientConsults.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs bg-slate-50/50 rounded-lg italic border text-slate-500">
                    Walang nakaraang konsultasyon naitala (No past consultations on record).
                  </div>
                ) : (
                  <div className="space-y-4">
                    {patientConsults.map((con) => (
                      <div key={con.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs" id={`med-history-${con.id}`}>
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
                          <span className="text-xs font-bold text-slate-400 font-mono">ID: {con.id} • Petsa: {con.date}</span>
                          <div className="flex items-center gap-3">
                            {activeRole !== 'MIDWIFE' && (
                              <div className="flex gap-0.5">
                                <button
                                  type="button"
                                  onClick={() => startEditingConsult(con)}
                                  className="p-1 hover:text-emerald-700 hover:bg-slate-55 rounded cursor-pointer transition-all"
                                  title="Edit Consultation"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteConsultClick(con.id)}
                                  className="p-1 hover:text-rose-600 hover:bg-slate-55 rounded cursor-pointer transition-all"
                                  title="Delete Consultation"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            )}
                            <span className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-full font-mono">
                              Attendant: {con.attendingStaff}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <strong className="text-rose-900">Chief Complaint (Daing):</strong>
                            <p className="text-slate-700 mt-1 font-sans">{con.chiefComplaint}</p>
                          </div>
                          {con.subjective && (
                            <div>
                              <strong className="text-slate-500 font-mono text-[10px]">Subjective Notes (S):</strong>
                              <p className="text-slate-500 mt-0.5 italic font-sans">{con.subjective}</p>
                            </div>
                          )}
                          {con.objective && (
                            <div>
                              <strong className="text-slate-500 font-mono text-[10px]">Objective Notes (O):</strong>
                              <p className="text-slate-500 mt-0.5 italic font-sans">{con.objective}</p>
                            </div>
                          )}
                          {con.assessmentDiagnoses.length > 0 && (
                            <div className="mt-2">
                              <strong className="text-indigo-900">Diagnosis Assessments (A):</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {con.assessmentDiagnoses.map((d, dIdx) => (
                                  <span key={dIdx} className="bg-slate-100 text-slate-850 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                                    {d}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="mt-2">
                            <strong className="text-slate-800 font-black">Prescription Treatment Plan (P):</strong>
                            <p className="text-slate-650 mt-1 font-mono text-[11px] whitespace-pre-line bg-zinc-50 p-2.5 border border-zinc-150 rounded">{con.planTreatment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-8 text-slate-400 font-medium">Pakisigurong nakarehistro ang hindi bababa sa isang pasyente. (Please ensure at least one patient is active).</div>
      )}
    </div>
  );
};
