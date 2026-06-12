/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Referral, HealthCertificate, Patient, Language } from '../types';
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
}) => {
  const text = LOCALIZED_TEXTS[language];
  const [activeTab, setActiveTab] = useState<'referrals' | 'certificates'>('referrals');
  const [targetPatId, setTargetPatId] = useState(patients[0]?.id || '');

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
  const [signatory, setSignatory] = useState('Arlene Cagas Dayama, RM');
  const [signatoryRole, setSignatoryRole] = useState('Barangay Midwife');

  // Print Review State
  const [printedCert, setPrintedCert] = useState<HealthCertificate | null>(certificates[0] || null);

  // Edit trackers
  const [editingReferralId, setEditingReferralId] = useState<string | null>(null);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);

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
            <div className="lg:col-span-5 p-4 border border-slate-200 rounded-xl space-y-4">
              <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
                <AlertOctagon size={14} className="text-rose-600" />
                Draft New Emergency Referral
              </h3>

              <form onSubmit={handleSaveReferral} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Select Patient</label>
                  <select
                    className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg focus:outline-hidden font-bold"
                    value={targetPatId}
                    onChange={(e) => setTargetPatId(e.target.value)}
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.lastName}, {p.firstName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Referred to Facility</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 p-2.5 rounded-lg font-semibold"
                    placeholder="e.g. Municipal Health Office Emergency"
                    value={referredTo}
                    onChange={(e) => setReferredTo(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Transit Arrangements</label>
                    <select
                      className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg"
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
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Urgency Alert</label>
                    <select
                      className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg font-bold"
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
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Reason for Referral *</label>
                  <textarea
                    required
                    rows={2}
                    className="w-full border border-slate-200 p-2.5 rounded-lg"
                    placeholder="Altapresyon, abnormal fetal tone, o patuloy na pagdurugo..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase mb-1">Clinical Summary and triage vitals</label>
                  <textarea
                    rows={2}
                    className="w-full border border-slate-200 p-2.5 rounded-lg"
                    placeholder="Ilista ang BP, temperatura, at unang gamot na binigay sa DHRMS..."
                    value={clinicalSummary}
                    onChange={(e) => setClinicalSummary(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {editingReferralId && (
                    <button
                      type="button"
                      onClick={cancelEditingReferral}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg cursor-pointer text-xs uppercase"
                    >
                      I-cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 bg-rose-650 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase"
                    id="referral-submit-button"
                  >
                    <Ambulance size={14} />
                    {editingReferralId ? 'I-update ang Referral' : 'Compile Referral Document'}
                  </button>
                </div>
              </form>
            </div>

            {/* List referrals and status checks */}
            <div className="lg:col-span-7 bg-slate-50/60 p-4 border border-slate-200 rounded-xl space-y-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider block border-b border-slate-200 pb-2">
                Active Outgoing Referral Logs
              </span>

              <div className="space-y-3 max-h-[360px] overflow-y-auto">
                {referrals.map((ref) => {
                  const pat = patients.find((p) => p.id === ref.patientId);
                  return (
                    <div key={ref.id} className="p-3.5 bg-white border border-slate-150 rounded-lg text-xs" id={`referral-card-${ref.id}`}>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-2 font-mono gap-1.5">
                        <span className="font-bold text-slate-400">ID: {ref.id} • {ref.date}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            ref.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                            ref.urgency === 'Urgent' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {ref.urgency}
                          </span>
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
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div>Pasyente: <strong className="text-slate-800">{pat ? `${pat.lastName}, ${pat.firstName}` : ref.patientId}</strong></div>
                        <div>Destinasyon sa: <span className="font-semibold text-slate-700">{ref.referredToFacility}</span></div>
                        <div className="bg-slate-50 p-2 rounded text-[11px] text-rose-950 font-medium">Rebyu: {ref.reasonForReferral}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Ambulance size={11} /> Transit arranged via: <strong>{ref.transportArranged}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* CERTIFICATE ISSUANCE & clearance templates */
          <>
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
                    {patients.map((p) => (
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
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Signatory Title</label>
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

            {/* Print live preview templates */}
            <div className="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between" id="printable-clearance-area">
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
