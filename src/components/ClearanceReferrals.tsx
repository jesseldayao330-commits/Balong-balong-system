/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Referral, HealthCertificate, Patient, Language, Role } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { FileText, ArrowUpRight, Plus, Printer, ShieldAlert, Ambulance, UserCheck, AlertOctagon, Trash2, Edit3, X } from 'lucide-react';

interface ClearanceReferralsProps {
  referrals: Referral[];
  certificates: HealthCertificate[];
  patients: Patient[];
  onAddReferral: (r: Referral) => void;
  onAddCertificate: (c: HealthCertificate) => void;
  onUpdateReferral: (r: Referral) => void;
  onDeleteReferral: (id: string) => void;
  onUpdateCertificate: (c: HealthCertificate) => void;
  onDeleteCertificate: (id: string) => void;
  language: Language;
  activeRole?: Role;
}

export const ClearanceReferrals: React.FC<ClearanceReferralsProps> = ({
  referrals,
  certificates,
  patients,
  onAddReferral,
  onAddCertificate,
  onUpdateReferral,
  onDeleteReferral,
  onUpdateCertificate,
  onDeleteCertificate,
  language,
  activeRole,
}) => {
  const text = LOCALIZED_TEXTS[language];
  const [activeTab, setActiveTab] = useState<'referrals' | 'certificates'>('referrals');
  const isViewOnly = activeRole === 'ADMIN' || activeRole === 'CAPITAN' || activeRole === 'PHARMACIST' || activeRole === 'MHO';

  // Filter patients for Midwife and Nurse so only pregnant mothers ("buntis") and children/babies ("bata") appear
  const filteredPatients = React.useMemo(() => {
    if (activeRole === 'MIDWIFE' || activeRole === 'NURSE') {
      return patients.filter((p) => {
        const isBuntis = p.gender === 'Female' && (p.activePrograms.includes('MCH') || p.activePrograms.includes('FAMILY_PLANNING'));
        const age = new Date().getFullYear() - new Date(p.birthDate).getFullYear();
        const isBata = age <= 12 || p.activePrograms.includes('EPI') || p.activePrograms.includes('OPT_PLUS');
        return isBuntis || isBata;
      });
    }
    return patients;
  }, [patients, activeRole]);

  const [targetPatId, setTargetPatId] = useState(filteredPatients[0]?.id || '');

  // Auto-correct targetPatId if it's not in the filtered options
  React.useEffect(() => {
    if (filteredPatients.length > 0) {
      const isCurrentEligible = filteredPatients.some((p) => p.id === targetPatId);
      if (!isCurrentEligible) {
        setTargetPatId(filteredPatients[0].id);
      }
    } else {
      setTargetPatId('');
    }
  }, [filteredPatients, targetPatId]);

  // Forms - Referrals
  const [referredTo, setReferredTo] = useState('Mayor Ramon B. Lopez Memorial District Hospital');
  const [reason, setReason] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [transport, setTransport] = useState<'Ambulance' | 'Tricycle' | 'Private/LGU Vehicle' | 'None'>('Ambulance');

  // Forms - Certificates
  const [certType, setCertType] = useState<HealthCertificate['certificateType']>('Barangay Health Clearance');
  const [purpose, setPurpose] = useState('');
  const [findings, setFindings] = useState('');
  const [remarks, setRemarks] = useState('');
  const [signatory, setSignatory] = useState(() => {
    if (activeRole === 'NURSE') return 'Yvonne Galang, RN';
    if (activeRole === 'MIDWIFE') return 'Arlene Cagas Dayama, RM';
    if (activeRole === 'ADMIN') return 'Ericson Padunan, LGU Admin';
    if (activeRole === 'CAPITAN') return 'Ericson Padunan, Punong Barangay';
    return 'Julefe Magwate, BHW';
  });
  const [signatoryRole, setSignatoryRole] = useState(() => {
    if (activeRole === 'NURSE') return 'Public Health Nurse';
    if (activeRole === 'MIDWIFE') return 'Barangay Midwife';
    if (activeRole === 'ADMIN') return 'Health Center Administrator';
    if (activeRole === 'CAPITAN') return 'Punong Barangay (Kapitan)';
    return 'Barangay Health Worker';
  });

  // Print Review State
  const [printedCert, setPrintedCert] = useState<HealthCertificate | null>(certificates[0] || null);
  const [printedReferral, setPrintedReferral] = useState<Referral | null>(referrals[0] || null);

  // Edit trackers
  const [editingReferralId, setEditingReferralId] = useState<string | null>(null);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);

  // Synchronize Signatories on role switches
  React.useEffect(() => {
    if (activeRole === 'NURSE') {
      setSignatory('Yvonne Galang, RN');
      setSignatoryRole('Public Health Nurse');
    } else if (activeRole === 'MIDWIFE') {
      setSignatory('Arlene Cagas Dayama, RM');
      setSignatoryRole('Barangay Midwife');
    } else if (activeRole === 'ADMIN') {
      setSignatory('Ericson Padunan, LGU Admin');
      setSignatoryRole('Health Center Administrator');
    } else if (activeRole === 'CAPITAN') {
      setSignatory('Ericson Padunan, Punong Barangay');
      setSignatoryRole('Punong Barangay (Kapitan)');
    }
  }, [activeRole]);

  const startEditingReferral = (r: Referral) => {
    setTargetPatId(r.patientId);
    setReferredTo(r.referredToFacility);
    setReason(r.reasonForReferral);
    setClinicalSummary(r.clinicalSummary || '');
    setUrgency(r.urgency);
    setTransport(r.transportArranged);
    setEditingReferralId(r.id);
  };

  const cancelEditingReferral = () => {
    setEditingReferralId(null);
    setReason('');
    setClinicalSummary('');
  };

  const startEditingCertificate = (c: HealthCertificate) => {
    setTargetPatId(c.patientId);
    setCertType(c.certificateType);
    setPurpose(c.purpose);
    setFindings(c.findings || '');
    setRemarks(c.remarks || '');
    setSignatory(c.signatoryName);
    setSignatoryRole(c.signatoryTitle);
    setEditingCertificateId(c.id);
  };

  const cancelEditingCertificate = () => {
    setEditingCertificateId(null);
    setPurpose('');
    setFindings('');
    setRemarks('');
  };

  const handleDeleteReferralClick = (id: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang referral log na ito?')) {
      onDeleteReferral(id);
      alert('Nabura na ang referral log.');
    }
  };

  const handleDeleteCertificateClick = (id: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang health certificate record na ito?')) {
      onDeleteCertificate(id);
      alert('Nabura na ang certificate record.');
      if (printedCert?.id === id) {
        setPrintedCert(certificates.find(c => c.id !== id) || null);
      }
    }
  };

  const handleSaveReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatId) return;

    if (editingReferralId) {
      const updated: Referral = {
        id: editingReferralId,
        patientId: targetPatId,
        date: referrals.find(r => r.id === editingReferralId)?.date || new Date().toISOString().split('T')[0],
        referringFacility: 'Barangay Balong-balong DHRMS, Pitogo, Zamboanga del Sur',
        referredToFacility: referredTo,
        reasonForReferral: reason,
        clinicalSummary: clinicalSummary || 'Patient triaged under standard Barangay surveillance procedures.',
        urgency,
        transportArranged: transport,
        status: referrals.find(r => r.id === editingReferralId)?.status || 'Pending',
        bhwMidwifeInCharge: signatory,
      };
      onUpdateReferral(updated);
      setPrintedReferral(updated);
      alert('Matagumpay na nai-update ang Referral! (Referral updated successfully).');
      setEditingReferralId(null);
    } else {
      const newRef: Referral = {
        id: `REF-2026-00${referrals.length + 1}`,
        patientId: targetPatId,
        date: new Date().toISOString().split('T')[0],
        referringFacility: 'Barangay Balong-balong DHRMS, Pitogo, Zamboanga del Sur',
        referredToFacility: referredTo,
        reasonForReferral: reason,
        clinicalSummary: clinicalSummary || 'Patient triaged under standard Barangay surveillance procedures.',
        urgency,
        transportArranged: transport,
        status: 'Pending',
        bhwMidwifeInCharge: signatory,
      };
      onAddReferral(newRef);
      setPrintedReferral(newRef);
      alert('Matagumpay na naitala ang Referral! (Referral draft logged successfully).');
    }
    setReason('');
    setClinicalSummary('');
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatId) return;

    if (editingCertificateId) {
      const updated: HealthCertificate = {
        id: editingCertificateId,
        patientId: targetPatId,
        dateIssued: certificates.find(c => c.id === editingCertificateId)?.dateIssued || new Date().toISOString().split('T')[0],
        certificateType: certType,
        purpose,
        findings: findings || 'Fit and normal vital signs registered.',
        remarks: remarks || 'Valid for specified local administrative support requirements.',
        signatoryName: signatory,
        signatoryTitle: signatoryRole,
      };
      onUpdateCertificate(updated);
      setPrintedCert(updated);
      alert('Matagumpay na nai-update ang Sertipiko! (Certificate updated successfully).');
      setEditingCertificateId(null);
    } else {
      const newCert: HealthCertificate = {
        id: `CERT-2026-00${certificates.length + 1}`,
        patientId: targetPatId,
        dateIssued: new Date().toISOString().split('T')[0],
        certificateType: certType,
        purpose,
        findings: findings || 'Fit and normal vital signs registered.',
        remarks: remarks || 'Valid for specified local administrative support requirements.',
        signatoryName: signatory,
        signatoryTitle: signatoryRole,
      };
      onAddCertificate(newCert);
      setPrintedCert(newCert);
      alert('Matagumpay na nailabas ang Sertipiko! (Certificate generated successfully under compliance).');
    }
    setPurpose('');
    setFindings('');
    setRemarks('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="clearance-referrals-dashboard">
      <div className="flex border-b border-slate-200 pb-0.5 gap-2 mb-4">
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
            activeTab === 'referrals' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
          id="btn-tab-referrals"
        >
          Referral Document Tracker ({referrals.length})
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 text-xs font-black uppercase tracking-wider cursor-pointer border-b-2 transition-colors ${
            activeTab === 'certificates' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
          id="btn-tab-certificates"
        >
          Certificate & clearance issuance
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COMPONENT CONTENT FLOP */}
        {activeTab === 'referrals' ? (
          /* OUTGOING REFERRALS MODULE */
          <>
            {!isViewOnly && (
              <div className="lg:col-span-4 p-4 border border-slate-200 rounded-xl space-y-4">
                <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
                  <AlertOctagon size={14} className="text-rose-600" />
                  Draft New Emergency Referral
                </h3>

                <form onSubmit={handleSaveReferral} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-semibold">Select Patient</label>
                      <select
                        className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg focus:outline-hidden font-bold"
                        value={targetPatId}
                        onChange={(e) => setTargetPatId(e.target.value)}
                      >
                        {filteredPatients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.lastName}, {p.firstName} ({p.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-semibold">Referred to Facility</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-slate-200 p-2.5 rounded-lg font-semibold text-slate-800"
                        placeholder="e.g. Municipal Health Office Emergency"
                        value={referredTo}
                        onChange={(e) => setReferredTo(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1 font-semibold">Transit Arrangements</label>
                        <select
                          className="w-full border border-slate-200 py-2 px-2 bg-white rounded-lg font-bold text-xs"
                          value={transport}
                          onChange={(e) => setTransport(e.target.value as any)}
                        >
                          <option value="Ambulance">Ambulance (LGU)</option>
                          <option value="Tricycle">Barangay Tricycle/Patrol</option>
                          <option value="Private/LGU Vehicle">Sari-sariling sasakyan</option>
                          <option value="None">Walang sasakyan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1 font-semibold">Urgency Alert</label>
                        <select
                          className="w-full border border-slate-200 py-2 px-2 bg-white rounded-lg font-bold text-xs"
                          value={urgency}
                          onChange={(e) => setUrgency(e.target.value as any)}
                        >
                          <option value="Routine">Standard (Routine)</option>
                          <option value="Urgent">Mahigpit (Urgent)</option>
                          <option value="Emergency">Apurahan (Emergency - Red Alert)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-semibold">Reason for Referral *</label>
                      <textarea
                        required
                        rows={2}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-slate-700"
                        placeholder="Altapresyon, abnormal fetal tone, o patuloy na pagdurugo..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-semibold">Clinical Summary and triage vitals</label>
                      <textarea
                        rows={2}
                        className="w-full border border-slate-200 p-2.5 rounded-lg text-slate-700"
                        placeholder="Ilista ang BP, temperatura, at unang gamot na binigay sa DHRMS..."
                        value={clinicalSummary}
                        onChange={(e) => setClinicalSummary(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2 text-xs">
                      {editingReferralId && (
                        <button
                          type="button"
                          onClick={cancelEditingReferral}
                          className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg cursor-pointer uppercase text-[10px]"
                        >
                          I-cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-rose-650 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase shadow-sm font-sans"
                        id="referral-submit-button"
                      >
                        <Ambulance size={14} />
                        {editingReferralId ? 'I-update Referral' : 'Compile Referral'}
                      </button>
                    </div>
                  </form>
              </div>
            )}

            {/* List referrals and status checks */}
            <div className={`${isViewOnly ? 'lg:col-span-6' : 'lg:col-span-4'} bg-slate-50/60 p-4 border border-slate-200 rounded-xl space-y-3`}>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block border-b border-slate-200 pb-2">
                Active Outgoing Referral Logs
              </span>

              <div className="space-y-3 max-h-[380px] overflow-y-auto">
                {referrals.map((ref) => {
                  const pat = patients.find((p) => p.id === ref.patientId);
                  const isCurrentPrint = printedReferral?.id === ref.id;
                  return (
                    <div 
                      key={ref.id} 
                      onClick={() => setPrintedReferral(ref)}
                      className={`p-3 bg-white border rounded-lg text-xs cursor-pointer transition-all ${
                        isCurrentPrint ? 'border-rose-350 shadow-xs ring-1 ring-rose-350' : 'border-slate-150 hover:border-slate-300'
                      }`} 
                      id={`referral-card-${ref.id}`}
                    >
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2 font-mono gap-1.5">
                        <span className="font-bold text-slate-400 text-[10px]">{ref.id} • {ref.date}</span>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            ref.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                            ref.urgency === 'Urgent' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {ref.urgency}
                          </span>
                          {!isViewOnly && (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditingReferral(ref)}
                                className="p-1 hover:text-emerald-700 hover:bg-slate-50 rounded cursor-pointer transition-colors text-slate-400"
                                title="Edit Referral Log"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteReferralClick(ref.id)}
                                className="p-1 hover:text-rose-600 hover:bg-slate-50 rounded cursor-pointer transition-colors text-slate-400"
                                title="Delete Referral Log"
                              >
                                <Trash2 size={11} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div>Pasyente: <strong className="text-slate-800">{pat ? `${pat.lastName}, ${pat.firstName}` : ref.patientId}</strong></div>
                        <div>Destinasyon sa: <span className="font-semibold text-slate-700 text-[11px]">{ref.referredToFacility}</span></div>
                        <div className="bg-slate-50 p-1.5 rounded text-[10px] text-rose-950 font-medium line-clamp-2">Rebyu: {ref.reasonForReferral}</div>
                        <div className="text-[9px] text-slate-400 mt-1 flex items-center gap-1">
                          <Ambulance size={11} /> Transit: <strong>{ref.transportArranged}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official clinical print preview frame */}
            <div className={`${isViewOnly ? 'lg:col-span-6' : 'lg:col-span-4'} bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col justify-between`} id="printable-referral-area">
              <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase mb-3 text-center">
                OFFICIAL PRINTABLE EMERGENCY REFERRAL (DOH DHRMS COMPLIANT)
              </span>

              {printedReferral ? (
                (() => {
                  const pat = patients.find((p) => p.id === printedReferral.patientId);
                  return (
                    <div className="flex flex-col h-full justify-between">
                      <div className="bg-white border-2 border-slate-350 p-4 rounded-lg text-[10px] space-y-3.5 shadow-sm" id="referral-printout-card">
                        <div className="text-center space-y-1 pb-2 border-b border-double border-slate-300 block w-full">
                          <h4 className="font-extrabold uppercase text-[9px] tracking-wider text-slate-800 leading-none block w-full">Republic of the Philippines</h4>
                          <div className="text-[8px] text-slate-500 uppercase font-semibold block w-full pt-1">Municipality of Pitogo • Zamboanga del Sur</div>
                          <div className="text-[10px] text-rose-800 font-black uppercase tracking-wider text-center block w-full mt-1.5 pt-1.5 pb-0.5 border-t border-slate-100">EMERGENCY REFERRAL DOCUMENT</div>
                        </div>

                        <div className="text-center py-0.5 block w-full">
                          <div className="font-mono text-[9px] underline font-extrabold block text-slate-950 uppercase leading-none w-full">
                            CLINICAL OUTGOING SLIP
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono font-bold block mt-1 w-full">Control Code: BB-2026-REF-{printedReferral.id}</div>
                        </div>

                        <div className="space-y-1.5 text-slate-700 leading-normal font-medium block w-full">
                          <div className="grid grid-cols-2 gap-1 border-b border-slate-100 pb-1.5">
                            <div><strong>Date:</strong> <span className="font-mono text-slate-900">{printedReferral.date}</span></div>
                            <div><strong>Urgency:</strong> <span className="font-bold text-rose-800 uppercase text-[9px]">{printedReferral.urgency}</span></div>
                          </div>

                          <div className="space-y-1 border-b border-slate-100 pb-1.5 text-[9px]">
                            <div><strong>To Facility:</strong> <span className="font-semibold text-slate-800">{printedReferral.referredToFacility}</span></div>
                            <div><strong>Referring:</strong> <span className="text-slate-650">Barangay Balong-balong DHRMS, Pitogo, ZDS</span></div>
                          </div>

                          <div className="space-y-1.5 border-b border-slate-100 pb-1.5">
                            <div><strong>Resident Name:</strong> <strong className="text-slate-950 text-[11px]">{pat ? `${pat.firstName} ${pat.lastName}` : printedReferral.patientId}</strong></div>
                            <div className="grid grid-cols-3 gap-0.5 text-[9px]">
                              <div><strong>Sex:</strong> <span>{pat?.gender || 'N/A'}</span></div>
                              <div><strong>Purok:</strong> <span>{pat?.purok || 'N/A'}</span></div>
                              <div><strong>B-Day:</strong> <span className="font-mono">{pat?.birthDate || 'N/A'}</span></div>
                            </div>
                          </div>

                          <div className="space-y-1 border-b border-slate-100 pb-1.5">
                            <strong className="text-slate-900 block text-[9px] uppercase font-mono leading-none">Reason for Referral:</strong>
                            <div className="bg-slate-50 p-1.5 rounded text-slate-850 leading-relaxed max-h-[48px] overflow-y-auto font-sans">
                              {printedReferral.reasonForReferral}
                            </div>
                          </div>

                          <div className="space-y-1 pb-1">
                            <strong className="text-slate-900 block text-[9px] uppercase font-mono leading-none">Clinical Summary & Vitals:</strong>
                            <div className="bg-slate-50 p-1.5 rounded text-slate-850 leading-relaxed italic max-h-[48px] overflow-y-auto">
                              {printedReferral.clinicalSummary || 'Patient registered under standard Barangay medical surveillance.'}
                            </div>
                          </div>

                          <div className="text-[9px] pt-1">
                            <div>Arranged Transport: <span className="font-black text-rose-900">{printedReferral.transportArranged}</span></div>
                          </div>
                        </div>

                        <div className="text-right pt-4 space-y-1 block w-full">
                          <div className="text-[8px] text-slate-400 font-mono block w-full">Authorized Officers:</div>
                          <div className="font-extrabold block text-slate-850 underline uppercase text-[9px] pt-1.5 w-full leading-none">{printedReferral.bhwMidwifeInCharge || signatory}</div>
                          <div className="block text-[7px] text-slate-500 uppercase pt-1 w-full leading-none">Barangay Health Unit Specialist</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const printArea = document.getElementById("referral-printout-card");
                          if (printArea) {
                            const printWindow = window.open('', '', 'width=800,height=600');
                            if (printWindow) {
                              printWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Emergency Referral Slip - ${printedReferral.id}</title>
                                    <style>
                                      body {
                                        font-family: system-ui, -apple-system, sans-serif;
                                        padding: 40px;
                                        color: #334155;
                                        background-color: #ffffff;
                                      }
                                      .print-card {
                                        border: 2px solid #94a3b8;
                                        padding: 30px;
                                        border-radius: 12px;
                                        max-width: 550px;
                                        margin: 0 auto;
                                        background: white;
                                      }
                                      .text-center { text-align: center !important; }
                                      .space-y-0\\.5 > * + * { margin-top: 2px !important; }
                                      .space-y-1 > * + * { margin-top: 4px !important; }
                                      .space-y-1\\.5 > * + * { margin-top: 6px !important; }
                                      .space-y-3\\.5 > * + * { margin-top: 14px !important; }
                                      .pb-2 { padding-bottom: 8px !important; }
                                      .pb-0\\.5 { padding-bottom: 2px !important; }
                                      .border-b { border-bottom: 1px solid #e2e8f0 !important; }
                                      .border-double { border-bottom-style: double !important; }
                                      .font-extrabold { font-weight: 800 !important; }
                                      .font-black { font-weight: 900 !important; }
                                      .uppercase { text-transform: uppercase !important; }
                                      .tracking-wider { letter-spacing: 0.05em !important; }
                                      .text-slate-800 { color: #1e293b !important; }
                                      .text-slate-500 { color: #64748b !important; }
                                      .text-slate-400 { color: #94a3b8 !important; }
                                      .text-rose-800 { color: #9f1239 !important; }
                                      .text-rose-900 { color: #881337 !important; }
                                      .font-bold { font-weight: 700 !important; }
                                      .font-mono { font-family: monospace !important; }
                                      .italic { font-style: italic !important; }
                                      .grid { display: grid !important; }
                                      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
                                      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
                                      .gap-1 { gap: 4px !important; }
                                      .gap-0\\.5 { gap: 2px !important; }
                                      .bg-slate-50 { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
                                      .p-1\\.5 { padding: 6px !important; }
                                      .p-4 { padding: 16px !important; }
                                      .rounded-lg { border-radius: 8px !important; }
                                      .text-right { text-align: right !important; }
                                      .block { display: block !important; }
                                      .w-full { width: 100% !important; }
                                      .pt-1 { padding-top: 4px !important; }
                                      .pt-1\\.5 { padding-top: 6px !important; }
                                      .pt-4 { padding-top: 16px !important; }
                                      .border-t { border-top: 1px solid #e2e8f0 !important; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="print-card">
                                      ${printArea.innerHTML}
                                    </div>
                                    <script>
                                      window.onload = function() {
                                        window.print();
                                        setTimeout(function() { window.close(); }, 500);
                                      };
                                    </script>
                                  </body>
                                </html>
                              `);
                              printWindow.document.close();
                            } else {
                              window.print();
                            }
                          }
                        }}
                        className="w-full mt-3 bg-rose-650 hover:bg-rose-700 text-white font-extrabold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase shadow-sm transition-all"
                      >
                        <Printer size={13} />
                        Print Referral Slip
                      </button>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Pumili ng referral log sa gitna upang mai-print ang opisyal na slip.
                </div>
              )}
            </div>
          </>
        ) : (
          /* CERTIFICATE ISSUANCE & clearance templates */
          <>
            {!isViewOnly && (
              <div className="lg:col-span-5 p-4 border border-slate-200 rounded-xl space-y-4">
                <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                  Issue Barangay Health Certificate
                </h3>
                <form onSubmit={handleSaveCertificate} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Select Patient</label>
                      <select
                        className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg focus:outline-hidden font-bold"
                        value={targetPatId}
                        onChange={(e) => setTargetPatId(e.target.value)}
                      >
                        {filteredPatients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.lastName}, {p.firstName} 
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1 font-mono">Certificate Type</label>
                      <select
                        className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg"
                        value={certType}
                        onChange={(e) => setCertType(e.target.value as any)}
                      >
                        <option value="Barangay Health Clearance">Barangay Health Clearance (General)</option>
                        <option value="Medical Fit to Work">Medical Fit to Work</option>
                        <option value="Student Medical Certificate">Student Medical Certificate</option>
                        <option value="Indigency Medical Voucher">Indigency Medical Voucher (AICS Subsidy)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Purpose of Issuance *</label>
                      <input
                        type="text"
                        required
                        className="w-full border border-slate-200 p-2.5 rounded-lg"
                        placeholder="School enrollment / Social welfare claims / Employment..."
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Vitals Findings / Screening Result</label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 p-2.5 rounded-lg"
                        placeholder="e.g. Normal blood pressure & temperature verified."
                        value={findings}
                        onChange={(e) => setFindings(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">Signatory Officer</label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 p-2 rounded"
                          value={signatory}
                          onChange={(e) => setSignatory(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-405 uppercase mb-1">Signatory Title</label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 p-2 rounded"
                          value={signatoryRole}
                          onChange={(e) => setSignatoryRole(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingCertificateId && (
                        <button
                          type="button"
                          onClick={cancelEditingCertificate}
                          className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg cursor-pointer text-xs uppercase"
                        >
                          I-cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase"
                        id="certificate-submit-button"
                      >
                        <Printer size={14} />
                        {editingCertificateId ? 'I-update ang Sertipiko' : 'Authorize & Print Document'}
                      </button>
                    </div>
                  </form>
              </div>
            )}

            {/* Print live preview templates */}
            <div className={`${isViewOnly ? 'lg:col-span-12' : 'lg:col-span-7'} bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between`} id="printable-clearance-area">
              <span className="text-[9px] font-black tracking-widest text-slate-400 block uppercase mb-4 text-center">
                OFFICIAL PRINTABLE PREVIEW ACCREDITATION (DOH LGU COMPLIANT)
              </span>

              {printedCert ? (
                (() => {
                  const pat = patients.find((p) => p.id === printedCert.patientId);
                  return (
                    <div className="bg-white border-2 border-slate-300 p-6 rounded-lg text-xs space-y-4 max-w-[420px] mx-auto shadow-sm" id="certificate-printout-card">
                      <div className="text-center space-y-1 pb-3 border-b border-double border-slate-200">
                        <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-800">Republic of the Philippines</h4>
                        <span className="block text-[10px] text-slate-500 uppercase">Municipality of Pitogo • Zamboanga del Sur</span>
                        <strong className="block text-[11px] text-emerald-700 font-bold uppercase tracking-widest text-center">BARANGAY BALONG-BALONG DHRMS</strong>
                      </div>

                      <div className="text-center py-2">
                        <span className="font-mono text-xs underline font-extrabold block text-slate-900 uppercase">
                          {printedCert.certificateType}
                        </span>
                        <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">Control No: BB-2026-CERT-{printedCert.id}</span>
                      </div>

                      <div className="space-y-2 text-slate-700 text-[11px] leading-relaxed">
                        <p>
                          THIS IS TO CERTIFY that, <strong>{pat ? `${pat.firstName} ${pat.lastName}` : 'Eligible Resident'}</strong>, 
                          of legal age, is a registered resident of <strong>{pat?.purok || 'Purok 1'}</strong>, Barangay Balong-balong, Pitogo, Zamboanga del Sur, 
                          whose health monitoring indicators under standard Barangay Health records show:
                        </p>
                        
                        <div className="border border-dashed border-slate-200 p-2 rounded bg-slate-50 font-mono text-[10px]">
                          <strong>Clinical Findings:</strong> {printedCert.findings}
                        </div>

                        <p>
                          This certification is being issued upon request of the above-named person for the purpose of: 
                          <span className="italic underline underline-offset-2 font-semibold text-slate-800"> {printedCert.purpose}</span>.
                        </p>
                      </div>

                      <div className="text-right pt-6 space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block">Attested & Autographs by:</span>
                        <strong className="font-black block text-slate-800 underline uppercase">{printedCert.signatoryName}</strong>
                        <span className="block text-[9px] text-slate-500 uppercase">{printedCert.signatoryTitle}</span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  Walang huling sertipiko na ipinakita (Please generate a certificate on left to view print-ready output).
                </div>
              )}
            </div>

            {/* Past Issued Certificates list panel */}
            <div className="lg:col-span-12 border-t border-slate-150 mt-6 pt-5 bg-white rounded-xl">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3 font-mono">
                📋 Archives of Issued Barangay Physical Clearances & Certificates ({certificates.length})
              </span>
              
              {certificates.length === 0 ? (
                <div className="p-4 bg-slate-50 text-center text-slate-400 border border-slate-100 rounded-lg text-xs italic">
                  No health certificates have been published today.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-150 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                        <th className="p-3">Reference No</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Resident Name</th>
                        <th className="p-3">Certificate Type</th>
                        <th className="p-3">Stated Purpose</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {certificates.map((cert) => {
                        const residentObj = patients.find(p => p.id === cert.patientId);
                        const isCurrentPrint = printedCert?.id === cert.id;
                        return (
                          <tr key={cert.id} className={`hover:bg-slate-50/50 transition-colors ${isCurrentPrint ? 'bg-emerald-50/40 font-semibold' : ''}`}>
                            <td className="p-3 font-mono text-slate-500">BB-2026-{cert.id}</td>
                            <td className="p-3 text-slate-600">{cert.dateIssued}</td>
                            <td className="p-3 font-bold text-slate-800">
                              {residentObj ? `${residentObj.lastName}, ${residentObj.firstName}` : cert.patientId}
                            </td>
                            <td className="p-3 text-emerald-800 font-medium">{cert.certificateType}</td>
                            <td className="p-3 text-slate-500 italic">"{cert.purpose}"</td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-slate-400">
                                <button
                                  type="button"
                                  onClick={() => setPrintedCert(cert)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-[10px] font-bold rounded cursor-pointer transition-colors text-slate-650"
                                  title="Load Printable Preview"
                                >
                                  Preview
                                </button>
                                {!isViewOnly && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => startEditingCertificate(cert)}
                                      className="p-1 hover:text-indigo-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                                      title="Edit Certificate"
                                    >
                                      <Edit3 size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCertificateClick(cert.id)}
                                      className="p-1 hover:text-rose-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                                      title="Delete Certificate"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
