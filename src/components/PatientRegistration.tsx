/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Patient, Household, Purok, DOHProgram, Language, Role, ImmunizationRecord, PrenatalRecord } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { Search, UserPlus, Users, Eye, CheckCircle, ShieldAlert, AlertTriangle, Trash2, Link } from 'lucide-react';

interface PatientRegistrationProps {
  patients: Patient[];
  households: Household[];
  onAddPatient: (patient: Patient) => void;
  onUpdatePatient: (patient: Patient) => void;
  onDeletePatient: (id: string) => void;
  onAddHousehold?: (hh: Household) => void;
  language: Language;
  activeRole?: Role;
  initialPatientId?: string;
  onAddVaccination?: (vac: ImmunizationRecord) => void;
  onAddPrenatal?: (pre: PrenatalRecord) => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  patients,
  households,
  onAddPatient,
  onUpdatePatient,
  onDeletePatient,
  onAddHousehold,
  language,
  activeRole = 'BHW',
  initialPatientId,
  onAddVaccination,
  onAddPrenatal,
}) => {
  const text = LOCALIZED_TEXTS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Nurse Immunization Form States
  const [includeImmunization, setIncludeImmunization] = useState(true);
  const [motherName, setMotherName] = useState('');
  const [vaccineName, setVaccineName] = useState<ImmunizationRecord['vaccineName']>('BCG');
  const [doseNumber, setDoseNumber] = useState(1);
  const [dateGiven, setDateGiven] = useState(new Date().toISOString().split('T')[0]);
  const [givenBy, setGivenBy] = useState('Yvonne Galang, RN');
  const [vacRemarks, setVacRemarks] = useState('');

  // Midwife Prenatal Form States
  const [includePrenatal, setIncludePrenatal] = useState(true);
  const [lmp, setLmp] = useState('');
  const [edc, setEdc] = useState('');
  const [gravida, setGravida] = useState(1);
  const [para, setPara] = useState(0);
  const [abortion, setAbortion] = useState(0);
  const [stillBirth, setStillBirth] = useState(0);
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState(12);
  const [fundalHeightCm, setFundalHeightCm] = useState(15);
  const [fetalHeartToneBpm, setFetalHeartToneBpm] = useState(140);
  const [tetanusToxoidStatus, setTetanusToxoidStatus] = useState('TT1');
  const [ironFolicAcidGiven, setIronFolicAcidGiven] = useState(true);
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [riskClassification, setRiskClassification] = useState<'Low Risk' | 'Medium Risk' | 'High Risk'>('Low Risk');
  const [preRemarks, setPreRemarks] = useState('');
  const [nextPrenatalVisit, setNextPrenatalVisit] = useState('');

  const calculateEDC = (lmpString: string): string => {
    if (!lmpString) return '';
    const date = new Date(lmpString);
    if (isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + 280);
    return date.toISOString().split('T')[0];
  };

  const calculateGestationalAge = (lmpString: string): number => {
    if (!lmpString) return 0;
    const lmpDate = new Date(lmpString);
    if (isNaN(lmpDate.getTime())) return 0;
    const diffTime = Math.abs(new Date().getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  const handleLmpChange = (val: string) => {
    setLmp(val);
    if (val) {
      setEdc(calculateEDC(val));
      const weeks = calculateGestationalAge(val);
      if (weeks > 0 && weeks <= 42) {
        setGestationalAgeWeeks(weeks);
      }
    }
  };

  useEffect(() => {
    if (initialPatientId) {
      const match = patients.find((p) => p.id === initialPatientId);
      if (match) {
        setSelectedPatient(match);
        setLastName(match.lastName);
        setFirstName(match.firstName);
        setMiddleName(match.middleName || '');
        setSuffix(match.suffix || '');
        setBirthDate(match.birthDate);
        setGender(match.gender);
        setCivilStatus(match.civilStatus);
        setPurok(match.purok);
        setPhoneNumber(match.phoneNumber);
        setPhilHealthId(match.philHealthId || '');
        setPhilHealthCategory(match.philHealthCategory || 'Not Enrolled');
        setIsIndigent(match.isIndigent);
        setBloodType(match.bloodType || 'O+');
        setAllergies(match.allergies || '');
        setActivePrograms(match.activePrograms);
        setHouseholdId(match.householdId);
        setPhoto(match.photo || '');
        setIsEditing(true);
        setIsRegistering(false);
      }
    }
  }, [initialPatientId, patients]);

  // Registration Form State
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married' | 'Widowed' | 'Separated'>('Single');
  const [purok, setPurok] = useState<Purok>('Purok 1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [philHealthId, setPhilHealthId] = useState('');
  const [philHealthCategory, setPhilHealthCategory] = useState<Patient['philHealthCategory']>('Not Enrolled');
  const [isIndigent, setIsIndigent] = useState(false);
  const [bloodType, setBloodType] = useState<Patient['bloodType']>('O+');
  const [allergies, setAllergies] = useState('');
  const [activePrograms, setActivePrograms] = useState<DOHProgram[]>([]);
  const [householdId, setHouseholdId] = useState(households[0]?.id || '');
  const [photo, setPhoto] = useState<string>('');

  // Inline Household Creation States
  const [isAddingHH, setIsAddingHH] = useState(false);
  const [newHHId, setNewHHId] = useState('');
  const [newHHHead, setNewHHHead] = useState('');
  const [newHHPurok, setNewHHPurok] = useState<Purok>('Purok 1');
  const [newHHWater, setNewHHWater] = useState<'Level I (Point Source)' | 'Level II (Communal Faucet)' | 'Level III (Waterworks System)' | 'Unsanitary/Unprotected'>('Level III (Waterworks System)');
  const [newHHSanitary, setNewHHSanitary] = useState(true);
  const [newHHSolid, setNewHHSolid] = useState<'Segregated' | 'Disposed/Burned' | 'Open Dumping'>('Segregated');
  const [newHHIndigent, setNewHHIndigent] = useState(false);

  const handleCreateHouseholdInline = () => {
    if (!newHHId.trim() || !newHHHead.trim()) {
      alert('Tiyaking napunan ang Household Number/ID at pangalan ng Ulo ng Pamilya (Please enter a valid Household Number and Head Name).');
      return;
    }

    const hhExists = households.some((h) => h.id.toLowerCase() === newHHId.trim().toLowerCase());
    if (hhExists) {
      alert(`Ang Sambahayan ID/Num "${newHHId}" ay mayroon na. Gumamit ng iba o piliin ito sa dropdown list.`);
      return;
    }

    const newHH: Household = {
      id: newHHId.trim(),
      householdHead: newHHHead.trim(),
      purok: newHHPurok,
      numberOfMembers: 1,
      waterSource: newHHWater,
      sanitaryToilet: newHHSanitary,
      solidWasteManagement: newHHSolid,
      indigentStatus: newHHIndigent,
    };

    if (onAddHousehold) {
      onAddHousehold(newHH);
    }
    setHouseholdId(newHH.id);
    setIsAddingHH(false);
    // Reset states
    setNewHHId('');
    setNewHHHead('');
    alert(`Matagumpay na nairerehistro ang Bagong Sambahayan: ${newHH.householdHead} (${newHH.id})`);
  };

  // Edit Initiator
  const startEditing = () => {
    if (!selectedPatient) return;
    setLastName(selectedPatient.lastName);
    setFirstName(selectedPatient.firstName);
    setMiddleName(selectedPatient.middleName || '');
    setSuffix(selectedPatient.suffix || '');
    setBirthDate(selectedPatient.birthDate);
    setGender(selectedPatient.gender);
    setCivilStatus(selectedPatient.civilStatus);
    setPurok(selectedPatient.purok);
    setPhoneNumber(selectedPatient.phoneNumber);
    setPhilHealthId(selectedPatient.philHealthId || '');
    setPhilHealthCategory(selectedPatient.philHealthCategory || 'Not Enrolled');
    setIsIndigent(selectedPatient.isIndigent);
    setBloodType(selectedPatient.bloodType || 'O+');
    setAllergies(selectedPatient.allergies || '');
    setActivePrograms(selectedPatient.activePrograms);
    setHouseholdId(selectedPatient.householdId);
    setPhoto(selectedPatient.photo || '');
    setIsEditing(true);
    setIsRegistering(false);
  };

  const handleDeletePatientClick = () => {
    if (!selectedPatient) return;
    const isConfirmed = confirm(`Sigurado ka bang nais mong burahin ang record ni ${selectedPatient.firstName} ${selectedPatient.lastName} (${selectedPatient.id})? Desisyon na hindi na maaaring bawiin ito.`);
    if (isConfirmed) {
      onDeletePatient(selectedPatient.id);
      setSelectedPatient(patients.find((p) => p.id !== selectedPatient.id) || null);
      alert('Matagumpay na nabura ang pasyente. (Patient deleted successfully).');
    }
  };

  // Form Submission Validator
  const handleAddNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !firstName || !birthDate) {
      alert('Tiyaking napunan ang Apelyido, Pangalan at Araw ng Kapanganakan (Please fill in Surname, First Name and Birthdate).');
      return;
    }

    const birthYear = parseInt(birthDate.substring(0, 4), 10);
    if (birthYear > 2026) {
      alert('Hindi pinahihintulutan ang taon ng kapanganakan na higit sa 2026. (Birth year cannot be more than 2026).');
      return;
    }
    if (birthYear <= 1950) {
      alert('Hindi pinahihintulutan ang taon ng kapanganakan na 1950 pababa. (Birth year cannot be 1950 or below).');
      return;
    }

    if (isEditing && selectedPatient) {
      const updatedPat: Patient = {
        ...selectedPatient,
        householdId,
        lastName,
        firstName,
        middleName,
        suffix: suffix || undefined,
        birthDate,
        gender,
        civilStatus,
        purok,
        phoneNumber,
        philHealthId: philHealthId || 'Not Enrolled',
        philHealthCategory: philHealthCategory || 'Not Enrolled',
        isIndigent,
        bloodType,
        allergies,
        activePrograms,
        photo,
      };
      onUpdatePatient(updatedPat);
      setSelectedPatient(updatedPat);
      setIsEditing(false);
      alert('Matagumpay na na-update ang impormasyon ng pasyente! (Patient info updated successfully).');
    } else {
      const nextId = `PAT-2026-000${patients.length + 1}`;
      
      const programsCopy = [...activePrograms];
      if (activeRole === 'NURSE' && includeImmunization && !programsCopy.includes('EPI')) {
        programsCopy.push('EPI');
      }
      if (activeRole === 'MIDWIFE' && includePrenatal && !programsCopy.includes('MCH')) {
        programsCopy.push('MCH');
      }

      const newPat: Patient = {
        id: nextId,
        householdId,
        lastName,
        firstName,
        middleName,
        suffix: suffix || undefined,
        birthDate,
        gender,
        civilStatus,
        purok,
        phoneNumber,
        philHealthId: philHealthId || 'Not Enrolled',
        philHealthCategory: philHealthCategory || 'Not Enrolled',
        isIndigent,
        bloodType,
        allergies,
        activePrograms: programsCopy,
        createdAt: new Date().toISOString().split('T')[0],
        photo,
        registeredBy: activeRole as Role,
      };

      onAddPatient(newPat);

      // Handle nurse immunization submission
      if (activeRole === 'NURSE' && includeImmunization && onAddVaccination) {
        const newVac: ImmunizationRecord = {
          id: `VAC-2026-000${Date.now()}`,
          patientId: nextId,
          motherName: motherName || 'Hindi Alám',
          vaccineName,
          doseNumber,
          dateGiven,
          givenBy: givenBy || 'Yvonne Galang, RN',
          remarks: vacRemarks || 'Added during initial nurse registration',
        };
        onAddVaccination(newVac);
      }

      // Handle midwife prenatal submission
      if (activeRole === 'MIDWIFE' && includePrenatal && onAddPrenatal) {
        const newPre: PrenatalRecord = {
          id: `PRE-2026-000${Date.now()}`,
          patientId: nextId,
          lmp,
          edc: edc || calculateEDC(lmp),
          gravida,
          para,
          abortion: abortion || 0,
          stillBirth: stillBirth || 0,
          gestationalAgeWeeks,
          fundalHeightCm: fundalHeightCm || undefined,
          fetalHeartToneBpm: fetalHeartToneBpm || undefined,
          tetanusToxoidStatus,
          ironFolicAcidGiven,
          bloodPressure: bloodPressure || '120/80',
          riskClassification,
          remarks: preRemarks || 'Added during initial midwife prenatal registration',
          nextPrenatalVisit: nextPrenatalVisit || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
        onAddPrenatal(newPre);
      }

      setSelectedPatient(newPat);
      setIsRegistering(false);

      let msg = `Matagumpay na nairerehistro si ${firstName} ${lastName}! (Registered successfully).`;
      if (activeRole === 'NURSE' && includeImmunization) {
        msg += `\n✓ Na-log din ang vaccine record na "${vaccineName}" sa ilalim ng patient ID: ${nextId}.`;
      } else if (activeRole === 'MIDWIFE' && includePrenatal) {
        msg += `\n✓ Na-log din ang prenatal care record sa pregnancy registry sa ilalim ng patient ID: ${nextId}.`;
      }
      alert(msg);
    }
    
    // Clear registration records
    setLastName('');
    setFirstName('');
    setMiddleName('');
    setSuffix('');
    setBirthDate('');
    setPhoneNumber('');
    setPhilHealthId('');
    setPhoto('');
    // Clear immunization fields
    setMotherName('');
    setVacRemarks('');
    setDoseNumber(1);
    // Clear prenatal fields
    setLmp('');
    setEdc('');
    setGravida(1);
    setPara(0);
    setAbortion(0);
    setStillBirth(0);
    setPreRemarks('');
    setNextPrenatalVisit('');
  };

  const handleProgramCheck = (prog: DOHProgram) => {
    if (activePrograms.includes(prog)) {
      setActivePrograms(activePrograms.filter((p) => p !== prog));
    } else {
      setActivePrograms([...activePrograms, prog]);
    }
  };

  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Tanging mga larawan lamang ang pinahihintulutan (Only images are allowed).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const filteredPatients = patients.filter((pat) => {
    const full = `${pat.lastName} ${pat.firstName} ${pat.middleName} ${pat.id} ${pat.philHealthId}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="patient-registration-panel">
      {/* Search and control Header */}
      <div className="bg-slate-50 border-b border-zinc-200 px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-zinc-400"
            placeholder={text.searchPatient}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="patient-search-input"
          />
        </div>

        {['BHW', 'NURSE', 'MIDWIFE'].includes(activeRole) && (
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-center gap-1.5 touch-none"
            id="patient-register-toggle-button"
          >
            <UserPlus size={16} />
            {isRegistering ? 'Tumingin sa Directory (View Directory)' : text.registerPatient}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        {/* LEFT COLUMN: Patient Directory List */}
        {!isRegistering && (
          <div className="col-span-1 md:col-span-4 border-r border-slate-200 max-h-[500px] overflow-y-auto" id="patients-directory-drawer">
            <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Mga Nakarehistro ({filteredPatients.length})</span>
            </div>
            
            {filteredPatients.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">Walang Pasyente na Matagpuan (No patients found)</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredPatients.map((pat) => (
                  <button
                    key={pat.id}
                    onClick={() => {
                      setSelectedPatient(pat);
                      setIsRegistering(false);
                      setIsEditing(false);
                    }}
                    className={`w-full text-left p-3.5 cursor-pointer flex justify-between items-center transition-all ${
                      selectedPatient?.id === pat.id ? 'bg-emerald-50/50 border-l-4 border-emerald-600' : 'hover:bg-slate-50'
                    }`}
                    id={`patient-btn-${pat.id}`}
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{pat.lastName}, {pat.firstName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{pat.id} • {pat.purok}</p>
                    </div>
                    
                    {/* Tiny badges indicative of programs */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {pat.isIndigent && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[8px] font-black uppercase rounded-xs">MALASAKIT</span>
                      )}
                      <span className="text-[10px] text-zinc-400 font-mono">{pat.gender === 'Male' ? 'M' : 'F'}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RIGHT COLUMN: Interactive Form OR View Details screen */}
        <div className={(isRegistering || isEditing) ? 'col-span-12 p-6' : 'col-span-1 md:col-span-8 p-6'} id="patient-details-viewport">
          {(isRegistering || isEditing) ? (
            /* REGISTRATION FORM (Large labels & Touch Inputs compatible with Low Specs) */
            <form onSubmit={handleAddNewPatient} className="space-y-6" id="add-new-patient-form">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-800">
                  {isEditing ? `I-edit ang Impormasyon ng Pasyente / Patient: ${selectedPatient?.id}` : 'Form ng Bagong Pasyente (New Patient Entry Form)'}
                </h3>
              </div>

              {/* Patient Basic Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Apelyido (Last Name) *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden"
                    placeholder="e.g. Dela Cruz"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Unang Pangalan (First Name) *</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden"
                    placeholder="e.g. Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Gitnang Pangalan (Middle Name)</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden"
                    placeholder="e.g. Mercado"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>

                <div className="col-span-1 sm:col-span-1">
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Sipix (Suffix)</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden"
                    placeholder="e.g. Jr., III"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                  />
                </div>
              </div>

              {/* Personal details row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Araw ng Kapanganakan (Birthdate) *</label>
                  <input
                    type="date"
                    required
                    min="1951-01-01"
                    max="2026-12-31"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden font-mono"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Kasarian (Gender)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Male', 'Female'].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g as 'Male' | 'Female')}
                        className={`py-2 px-3 border rounded-lg text-sm cursor-pointer transition-colors ${
                          gender === g ? 'bg-emerald-600 text-white font-bold border-emerald-600' : 'bg-white text-slate-600'
                        }`}
                      >
                        {g === 'Male' ? 'Lalaki (Male)' : 'Babae (Female)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Estado Sibil (Civil Status)</label>
                  <select
                    className="w-full border border-slate-200 p-2.5 bg-white rounded-lg text-sm focus:outline-hidden"
                    value={civilStatus}
                    onChange={(e) => setCivilStatus(e.target.value as any)}
                  >
                    <option value="Single">Walang Asawa (Single)</option>
                    <option value="Married">May Asawa (Married)</option>
                    <option value="Widowed">Biyudo/a (Widowed)</option>
                    <option value="Separated">Hiwalay (Separated)</option>
                  </select>
                </div>
              </div>

              {/* Purok and Census Connection Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Purok Cluster</label>
                  <select
                    className="w-full border border-slate-200 p-2.5 bg-white rounded-lg text-sm focus:outline-hidden font-mono"
                    value={purok}
                    onChange={(e) => setPurok(e.target.value as Purok)}
                  >
                    {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black text-slate-600 uppercase flex items-center gap-1">
                      <Link size={12} className="text-emerald-600" />
                      Sambahayan (Household Census Link)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingHH(!isAddingHH);
                        if (!isAddingHH) {
                          setNewHHPurok(purok);
                        }
                      }}
                      className="text-emerald-600 hover:text-emerald-700 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer pointer-events-auto"
                    >
                      {isAddingHH ? '✕ Kanselahin' : '➕ Bagong Sambahayan'}
                    </button>
                  </div>

                  {isAddingHH ? (
                    <div className="p-3 bg-emerald-50/50 border border-emerald-200/60 rounded-lg space-y-3 shadow-2xs">
                      <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                        Pagrehistro ng Bagong Sambahayan (New Household)
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Household No. / ID *</label>
                          <input
                            type="text"
                            placeholder="e.g. 0343"
                            className="w-full bg-white border border-slate-200 p-2 rounded-md font-mono text-xs focus:outline-hidden"
                            value={newHHId}
                            onChange={(e) => setNewHHId(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Ulo ng Pamilya (Head Name) *</label>
                          <input
                            type="text"
                            placeholder="Dela Cruz, Juan"
                            className="w-full bg-white border border-slate-200 p-2 rounded-md text-xs focus:outline-hidden"
                            value={newHHHead}
                            onChange={(e) => setNewHHHead(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Purok Cluster</label>
                          <select
                            className="w-full bg-white border border-slate-200 p-1.5 rounded-md text-xs focus:outline-hidden font-mono"
                            value={newHHPurok}
                            onChange={(e) => setNewHHPurok(e.target.value as Purok)}
                          >
                            {['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7'].map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5 font-mono">Indigent?</label>
                          <div className="flex gap-2.5 mt-1.5">
                            <label className="flex items-center gap-1 font-medium text-slate-700">
                              <input
                                type="radio"
                                checked={newHHIndigent}
                                onChange={() => setNewHHIndigent(true)}
                              />
                              Oo (Yes)
                            </label>
                            <label className="flex items-center gap-1 font-medium text-slate-705">
                              <input
                                type="radio"
                                checked={!newHHIndigent}
                                onChange={() => setNewHHIndigent(false)}
                              />
                              Hindi
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-medium">Auto-certified to sanitary toilet.</span>
                        <button
                          type="button"
                          onClick={handleCreateHouseholdInline}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-md text-xs cursor-pointer transition-colors"
                        >
                          I-save Sambahayan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      className="w-full border border-slate-200 p-2.5 bg-white rounded-lg text-sm focus:outline-hidden"
                      value={householdId}
                      onChange={(e) => setHouseholdId(e.target.value)}
                    >
                      <option value="">-- Piliin ang Sambahayan (Select Household) --</option>
                      {[...households]
                        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' }))
                        .map((hh) => (
                          <option key={hh.id} value={hh.id}>
                            {hh.id} ({hh.purok})
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Numero ng Telepono</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden font-mono"
                    placeholder="e.g. 0917-0000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Subsidies programs & PhilHealth Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-black text-indigo-800 uppercase mb-1.5">{text.philhealthEligible}</label>
                  <input
                    type="text"
                    className="w-full border border-indigo-200 p-2.5 rounded-lg text-sm focus:outline-hidden font-mono bg-white"
                    placeholder="PhilHealth ID No. (e.g., XII-XII)"
                    value={philHealthId}
                    onChange={(e) => setPhilHealthId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-indigo-800 uppercase mb-1.5">PhilHealth Uri (Category)</label>
                  <select
                    className="w-full border border-indigo-200 p-2.5 bg-white rounded-lg text-sm focus:outline-hidden"
                    value={philHealthCategory}
                    onChange={(e) => setPhilHealthCategory(e.target.value as any)}
                  >
                    <option value="Not Enrolled">Walang Account (Not Enrolled)</option>
                    <option value="Indirect (Indigent)">Kulang sa Kakayahan (Indirect Indigent)</option>
                    <option value="Direct Contributor">Nagbabayad na Kasapi (Direct Contributor)</option>
                    <option value="Senior Citizen">Nakakatandang Residente (Senior Citizen)</option>
                    <option value="Sponsored">May Sponsor (Sponsored)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-rose-800 uppercase mb-1.5">Malasakit / Indigent Assist</label>
                  <button
                    type="button"
                    onClick={() => setIsIndigent(!isIndigent)}
                    className={`w-full py-2.5 px-3 border rounded-lg text-sm font-bold cursor-pointer transition-colors ${
                      isIndigent ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-600 border-rose-200'
                    }`}
                  >
                    {isIndigent ? 'Oo, Karapat-dapat (Indigent Eligible)' : 'Hindi, Karaniwang Residente'}
                  </button>
                </div>
              </div>

              {/* Diagnostic/Vital parameters blood type & Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Uri ng Dugo (Blood Type)</label>
                  <select
                    className="w-full border border-slate-200 p-2.5 bg-white rounded-lg text-sm focus:outline-hidden font-mono"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value as any)}
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black text-slate-600 uppercase mb-1.5">Mga Alerhiya (Allergies)</label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-hidden"
                    placeholder="Hal. Gamot, Pagkain, o Alikabok"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </div>
              </div>

              {/* DOH Programs Selection */}
              <div className="border-t border-slate-100 pt-4">
                <label className="block text-xs font-black text-emerald-800 uppercase mb-2">Pambansang Programa ng DOH kung saan Kasali (Elected National Health Programs)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-emerald-50/30 p-4 rounded-xl border border-emerald-100/30">
                  {[
                    { key: 'EPI', label: 'EPI Vaccination (Pagbabakuna ng Sanggol)' },
                    { key: 'MCH', label: 'MCH Prenatal (Pangangalaga sa Buntis)' },
                    { key: 'TB_DOTS', label: 'TB DOTS Program (Gamutan sa TB)' },
                    { key: 'OPT_PLUS', label: 'OPT Plus Nutrition (Kondisyon sa Nutrisyon)' },
                    { key: 'SENIOR_CITIZEN', label: 'Senior Program (Metriko sa Nakakatanda)' },
                    { key: 'FAMILY_PLANNING', label: 'Family Planning (Kontrasepsyon)' },
                    { key: 'DISEASE_SURVEILLANCE', label: 'Surveillance (Dengue, Altapresyon at iba pa)' }
                  ].map((prog) => {
                    const isChecked = activePrograms.includes(prog.key as DOHProgram);
                    return (
                      <button
                        type="button"
                        key={prog.key}
                        onClick={() => handleProgramCheck(prog.key as DOHProgram)}
                        className={`text-left p-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {prog.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NURSE - IMMUNIZATION SUB-FORM */}
              {activeRole === 'NURSE' && (
                <div className="border-t border-slate-100 pt-5 space-y-4" id="nurse-immunization-section">
                  <div className="flex items-center justify-between bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/60">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeImmunization}
                        onChange={(e) => setIncludeImmunization(e.target.checked)}
                        className="rounded-sm border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-4.5 h-4.5"
                      />
                      <div>
                        <span className="block text-sm font-black text-indigo-900">
                          I-log ang Unang Pagbabakuna (Log First Immunization Record)?
                        </span>
                        <span className="text-[11px] text-indigo-600 font-medium font-sans">
                          Awtomatikong magrerehistro sa National EPI Program.
                        </span>
                      </div>
                    </label>
                  </div>

                  {includeImmunization && (
                    <div className="bg-indigo-50/20 border border-indigo-100/40 p-4 rounded-xl space-y-4">
                      <div className="text-xs font-extrabold uppercase text-indigo-800 tracking-wider">
                        💉 Detalye ng Bakuna (Immunization Details - Nurse Desk)
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Pangalan ng Ina (Mother's Name)
                          </label>
                          <input
                            type="text"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden"
                            placeholder="e.g. Maria Clara"
                            value={motherName}
                            onChange={(e) => setMotherName(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Pangalan ng Bakuna (Vaccine Name) *
                          </label>
                          <select
                            required={includeImmunization}
                            className="w-full border border-slate-200 p-2 bg-white rounded-lg text-xs focus:outline-hidden"
                            value={vaccineName}
                            onChange={(e) => setVaccineName(e.target.value as any)}
                          >
                            <option value="BCG">BCG (Tuberculosis)</option>
                            <option value="HepB">HepB (Hepatitis B)</option>
                            <option value="Pentavalent 1">Pentavalent 1 (DPT-HepB-Hib)</option>
                            <option value="Pentavalent 2">Pentavalent 2 (DPT-HepB-Hib)</option>
                            <option value="Pentavalent 3">Pentavalent 3 (DPT-HepB-Hib)</option>
                            <option value="OPV 1">OPV 1 (Oral Polio)</option>
                            <option value="OPV 2">OPV 2 (Oral Polio)</option>
                            <option value="OPV 3">OPV 3 (Oral Polio)</option>
                            <option value="PCV 1">PCV 1 (Pneumococcal Conjugate)</option>
                            <option value="PCV 2">PCV 2 (Pneumococcal Conjugate)</option>
                            <option value="PCV 3">PCV 3 (Pneumococcal Conjugate)</option>
                            <option value="IPV">IPV (Inactivated Polio)</option>
                            <option value="MCV 1 (Measles)">MCV 1 (Measles)</option>
                            <option value="MCV 2 (MMR)">MCV 2 (MMR - Measles, Mumps, Rubella)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Dose Number *
                          </label>
                          <input
                            type="number"
                            required={includeImmunization}
                            min="1"
                            max="5"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={doseNumber}
                            onChange={(e) => setDoseNumber(parseInt(e.target.value) || 1)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Araw ng Bakuna (Date Given) *
                          </label>
                          <input
                            type="date"
                            required={includeImmunization}
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={dateGiven}
                            onChange={(e) => setDateGiven(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Nagbakuna (Administered By)
                          </label>
                          <input
                            type="text"
                            required={includeImmunization}
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden"
                            value={givenBy}
                            onChange={(e) => setGivenBy(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Mga Paalala / Remarks
                          </label>
                          <input
                            type="text"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden"
                            placeholder="e.g. No adverse reaction recorded"
                            value={vacRemarks}
                            onChange={(e) => setVacRemarks(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MIDWIFE - PRENATAL SUB-FORM */}
              {activeRole === 'MIDWIFE' && (
                <div className="border-t border-slate-100 pt-5 space-y-4" id="midwife-prenatal-section">
                  <div className="flex items-center justify-between bg-rose-50/50 p-3 rounded-lg border border-rose-100/60">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includePrenatal}
                        onChange={(e) => setIncludePrenatal(e.target.checked)}
                        className="rounded-sm border-rose-300 text-rose-600 focus:ring-rose-500 w-4.5 h-4.5"
                      />
                      <div>
                        <span className="block text-sm font-black text-rose-900">
                          I-log ang Unang Prenatal Visit Record (Log First Prenatal Visit)?
                        </span>
                        <span className="text-[11px] text-rose-600 font-medium font-sans">
                          Awtomatikong magrerehistro sa National MCH (Maternal and Child Health) Program.
                        </span>
                      </div>
                    </label>
                  </div>

                  {includePrenatal && (
                    <div className="bg-rose-50/20 border border-rose-150 p-4 rounded-xl space-y-4">
                      <div className="text-xs font-extrabold uppercase text-rose-800 tracking-wider">
                        🤰 Prenatal Check-up Parameters (Midwife Prenatal Desk)
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Huling Sumpong (LMP) *
                          </label>
                          <input
                            type="date"
                            required={includePrenatal}
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={lmp}
                            onChange={(e) => handleLmpChange(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Petsa ng Panganganak (EDC / Due Date)
                          </label>
                          <input
                            type="date"
                            required={includePrenatal}
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs bg-slate-50 focus:outline-hidden font-mono"
                            value={edc}
                            onChange={(e) => setEdc(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Bilang ng Pagbubuntis (Gravida)
                          </label>
                          <input
                            type="number"
                            required={includePrenatal}
                            min="1"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={gravida}
                            onChange={(e) => setGravida(parseInt(e.target.value) || 1)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Bilang ng Isinilang na Buhay (Para)
                          </label>
                          <input
                            type="number"
                            required={includePrenatal}
                            min="0"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={para}
                            onChange={(e) => setPara(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Abortion (Kunan kung mayroon)
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={abortion}
                            onChange={(e) => setAbortion(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Still Birth (Ipinanganak na Patay)
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={stillBirth}
                            onChange={(e) => setStillBirth(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Edad ng Pagbubuntis (Weeks)
                          </label>
                          <input
                            type="number"
                            required={includePrenatal}
                            min="1"
                            max="45"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={gestationalAgeWeeks}
                            onChange={(e) => setGestationalAgeWeeks(parseInt(e.target.value) || 12)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Fundal Height (cm)
                          </label>
                          <input
                            type="number"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={fundalHeightCm}
                            onChange={(e) => setFundalHeightCm(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Fetal Heart Tone (bpm)
                          </label>
                          <input
                            type="number"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            placeholder="e.g. 140"
                            value={fetalHeartToneBpm}
                            onChange={(e) => setFetalHeartToneBpm(parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Tetanus Toxoid Status (TT)
                          </label>
                          <select
                            className="w-full border border-slate-200 p-2 bg-white rounded-lg text-xs focus:outline-hidden"
                            value={tetanusToxoidStatus}
                            onChange={(e) => setTetanusToxoidStatus(e.target.value)}
                          >
                            <option value="TT1">TT1 (First Dose)</option>
                            <option value="TT2">TT2 (At least 1 month after TT1)</option>
                            <option value="TT3">TT3 (At least 6 months after TT2)</option>
                            <option value="TT4">TT4 (At least 1 year after TT3)</option>
                            <option value="TT5">TT5 (At least 1 year after TT4)</option>
                            <option value="None">None (Unvaccinated)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Presyon ng Dugo (Blood Pressure)
                          </label>
                          <input
                            type="text"
                            required={includePrenatal}
                            placeholder="e.g. 120/80"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={bloodPressure}
                            onChange={(e) => setBloodPressure(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-rose-800 uppercase mb-1">
                            Risk Classification *
                          </label>
                          <select
                            className="w-full border border-rose-250 p-2 bg-white rounded-lg text-xs focus:outline-hidden font-semibold"
                            value={riskClassification}
                            onChange={(e) => setRiskClassification(e.target.value as any)}
                          >
                            <option value="Low Risk">Walang Panganib (Low Risk)</option>
                            <option value="Medium Risk">Katamtamang Panganib (Medium Risk)</option>
                            <option value="High Risk">Mataas na Panganib (High Risk - Red alert)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center pt-2 select-none">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
                            <input
                              type="checkbox"
                              checked={ironFolicAcidGiven}
                              onChange={(e) => setIronFolicAcidGiven(e.target.checked)}
                              className="rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                            />
                            May Kasamang Iron & Folic Acid
                          </label>
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Susunod na Bisita (Next Visit Date) *
                          </label>
                          <input
                            type="date"
                            required={includePrenatal}
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden font-mono"
                            value={nextPrenatalVisit}
                            onChange={(e) => setNextPrenatalVisit(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-black text-slate-600 uppercase mb-1">
                            Remarks ng Midwife
                          </label>
                          <input
                            type="text"
                            className="w-full border border-slate-200 p-2 rounded-lg text-xs focus:outline-hidden"
                            placeholder="e.g. Advice on healthy diet given"
                            value={preRemarks}
                            onChange={(e) => setPreRemarks(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setIsEditing(false); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-sm cursor-pointer transition-colors"
                >
                  I-cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm cursor-pointer shadow-xs transition-colors"
                  id="patient-register-submit-button"
                >
                  {isEditing ? 'I-update ang Record (Update Patient Record)' : 'Makumpleto ang Rehistrasyon (Register Patient)'}
                </button>
              </div>
            </form>
          ) : selectedPatient ? (
            /* DETAILED VIEWING SCREEN */
            <div className="space-y-6" id="patient-details-view">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div className="flex items-center gap-4">
                  {selectedPatient.photo ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-3xs bg-white shrink-0 flex items-center justify-center">
                      <img 
                        src={selectedPatient.photo} 
                        alt={`${selectedPatient.firstName}'s photo`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 border-dashed bg-slate-100 flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider font-mono">No Photo</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800">
                      {selectedPatient.lastName}, {selectedPatient.firstName} {selectedPatient.middleName}
                      {selectedPatient.suffix ? ` ${selectedPatient.suffix}` : ''}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Patient Census ID: <strong className="text-slate-800">{selectedPatient.id}</strong> • Nakarehistro noong: {selectedPatient.createdAt}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {['BHW', 'NURSE', 'MIDWIFE'].includes(activeRole) ? (
                    <>
                      <button
                        onClick={startEditing}
                        className="bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                        id="btn-edit-patient-action"
                      >
                        I-edit (Edit Profile)
                      </button>
                      <button
                        onClick={handleDeletePatientClick}
                        className="bg-rose-600 hover:bg-rose-700 text-white py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        id="btn-delete-patient-action"
                      >
                        <Trash2 size={13} />
                        I-delete (Delete)
                      </button>
                    </>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg">
                      🔒 Read-Only Patient File
                    </span>
                  )}
                  {selectedPatient.isIndigent && (
                    <span className="bg-rose-100 text-rose-800 font-black border border-rose-200 text-xs uppercase px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                      <ShieldAlert size={14} />
                      MALASAKIT ACCREDITED
                    </span>
                  )}
                </div>
              </div>

              {/* Core attributes grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Civil Status</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedPatient.civilStatus}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Gender</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedPatient.gender}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Birthdate</span>
                  <span className="font-bold text-slate-800 text-sm">{selectedPatient.birthDate}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Location Purok</span>
                  <span className="font-bold text-emerald-800 text-sm">{selectedPatient.purok}</span>
                </div>
              </div>

              {/* Census Connection Detail Card */}
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50" id="census-connection-card">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="text-slate-500" size={16} />
                  <h4 className="text-xs font-black tracking-wide uppercase text-slate-600">Household Census Linkage & Family Details</h4>
                </div>

                {households.find((h) => h.id === selectedPatient.householdId) ? (
                  (() => {
                    const linkedHH = households.find((h) => h.id === selectedPatient.householdId)!;
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block font-mono">Household Head</span>
                          <span className="font-bold text-slate-800">{linkedHH.householdHead}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block font-mono">Water Source Compliance</span>
                          <span className="font-medium text-slate-800">{linkedHH.waterSource}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block font-mono">Sanitary Toilet status</span>
                          <span className={`font-black p-0.5 px-1.5 rounded-sm ${linkedHH.sanitaryToilet ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {linkedHH.sanitaryToilet ? 'DOH Sanitary Compliant' : 'Unsanitary Toilet Warning'}
                          </span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-xs text-rose-600">Babala: Ang pasyenteng ito ay walang wastong koneksyon sa Census (Warning: No active household linkage verified).</div>
                )}
              </div>

              {/* Health insurance panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 p-4 rounded-lg bg-zinc-50/30">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">PhilHealth ID Eligibility</span>
                  <div className="font-mono text-sm font-bold text-indigo-900 mt-2">
                    ID: {selectedPatient.philHealthId}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Membership Tier: {selectedPatient.philHealthCategory}
                  </div>
                </div>

                <div className="border border-slate-200 p-4 rounded-lg bg-zinc-50/30">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Clinical Indicators</span>
                  <div className="text-xs mt-2 space-y-1.5 font-mono">
                    <div>
                      <span className="text-slate-400">Blood Type:</span> <strong className="text-slate-800">{selectedPatient.bloodType || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Allergies:</span> <strong className="text-rose-700">{selectedPatient.allergies || text.noAllergies}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Programs lists */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">Active National Health Subsidies</h4>
                <div className="flex flex-wrap gap-2 text-xs font-bold" id="active-programs-badges">
                  {selectedPatient.activePrograms.length === 0 ? (
                    <span className="text-slate-400 border border-slate-100 bg-slate-50 py-1.5 px-3 rounded-md text-[11px] font-medium italic">Walang aktibong programa sa kasalukuyan</span>
                  ) : (
                    selectedPatient.activePrograms.map((prog) => {
                      const progMetaMap: Record<DOHProgram, { text: string; col: string }> = {
                        EPI: { text: 'Expanded Infant Immunization (EPI)', col: 'bg-emerald-100 text-emerald-800 text-xs' },
                        MCH: { text: 'Maternal Prenatal Class (MCH)', col: 'bg-teal-100 text-teal-800' },
                        TB_DOTS: { text: 'Tuberculosis DOTS Registry', col: 'bg-rose-100 text-rose-800' },
                        OPT_PLUS: { text: 'OPT Plus Malnutrition Support', col: 'bg-yellow-100 text-yellow-800' },
                        SENIOR_CITIZEN: { text: 'Senior Citizen Health Service', col: 'bg-indigo-100 text-indigo-800' },
                        DISEASE_SURVEILLANCE: { text: 'Outbreak/NCD Surveillance monitoring', col: 'bg-orange-100 text-orange-850' },
                        FAMILY_PLANNING: { text: 'Family Planning Client', col: 'bg-purple-100 text-purple-800' },
                      };
                      return (
                        <span key={prog} className={`px-2.5 py-1.5 rounded-lg border border-current font-semibold ${progMetaMap[prog]?.col || 'bg-slate-100 text-slate-800'}`}>
                          {progMetaMap[prog]?.text || prog}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">Pumili ng pasyente sa directory upang makita ang buong detalye. (Select a patient on the left drawer to view details).</div>
          )}
        </div>
      </div>
    </div>
  );
};
