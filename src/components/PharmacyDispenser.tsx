/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MedicineInventory, MedicineDispensed, Patient, Language } from '../types';
import { LOCALIZED_TEXTS } from '../data/mockData';
import { Pill, AlertTriangle, ArrowRight, User, Sparkles, Trash2, Edit3, Plus, X } from 'lucide-react';

interface PharmacyDispenserProps {
  inventory: MedicineInventory[];
  dispensed: MedicineDispensed[];
  patients: Patient[];
  onDispense: (d: MedicineDispensed) => void;
  onUpdateInventory: (i: MedicineInventory) => void;
  onDeleteInventory: (id: string) => void;
  onUpdateDispensed: (d: MedicineDispensed) => void;
  onDeleteDispensed: (id: string) => void;
  language: Language;
}

export const PharmacyDispenser: React.FC<PharmacyDispenserProps> = ({
  inventory,
  dispensed,
  patients,
  onDispense,
  onUpdateInventory,
  onDeleteInventory,
  onUpdateDispensed,
  onDeleteDispensed,
  language,
}) => {
  const text = LOCALIZED_TEXTS[language];
  const [selectedMedId, setSelectedMedId] = useState(inventory[0]?.id || '');
  const [selectedPatId, setSelectedPatId] = useState(patients[0]?.id || '');
  const [qty, setQty] = useState(10);
  const [useTranslationHelp, setUseTranslationHelp] = useState(true);

  // Common dosage options to auto-generate Philippine instructions
  const [frequency, setFrequency] = useState('3_times_day'); // 3 times a da, 2 times, once, before bed
  const [duration, setDuration] = useState('7_days');

  // Edit trackers
  const [editingInventoryId, setEditingInventoryId] = useState<string | null>(null);
  const [editingDispensedId, setEditingDispensedId] = useState<string | null>(null);

  // Form states for adding/editing inventory
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [invName, setInvName] = useState('');
  const [invGeneric, setInvGeneric] = useState('');
  const [invCategory, setInvCategory] = useState<'Antibiotics' | 'Vitamins/Supplements' | 'Analgesics' | 'Contraceptives' | 'Chronic Care'>('Antibiotics');
  const [invStock, setInvStock] = useState(100);
  const [invReorder, setInvReorder] = useState(25);
  const [invUnit, setInvUnit] = useState('tablets');

  // Form states for edit dispensed record
  const [dispRecordInstructions, setDispRecordInstructions] = useState('');
  const [dispRecordQty, setDispRecordQty] = useState(10);

  const selectedMed = inventory.find((m) => m.id === selectedMedId);

  // Auto instructions translation helper
  const translateInstruction = (freq: string, dur: string, lang: Language): string => {
    let freqText = '';
    let durText = '';

    if (lang === 'TL') { // Tagalog translations
      freqText = freq === '3_times_day' ? 'Inumin ang tatlong beses sa isang araw pagkatapos kumain (1 tab, 3x a day pc)' :
                 freq === '2_times_day' ? 'Inumin ang dalawang beses sa isang araw sa umaga at gabi' :
                 freq === 'once_day_morning' ? 'Inumin ang isang beses sa isang araw tuwing umaga bago kumain' :
                 'Inumin ang isang beses bago matulog sa gabi';
      durText = dur === '7_days' ? 'sa loob ng pitong (7) araw.' : 'sa loob ng tatlong (3) araw.';
    } else if (lang === 'BY') { // Bisaya translations
      freqText = freq === '3_times_day' ? 'Tumarug katulo sa usa ka adlaw pagkahuman og kaon (1 tab, 3x a day)' :
                 freq === '2_times_day' ? 'Tumarug kaduha sa usa ka adlaw sa buntag og gabii' :
                 freq === 'once_day_morning' ? 'Tumarug kausa sa usa ka adlaw kada buntag sa dili pa mokaon' :
                 'Tumarug kausa sa dili pa matulog sa gabii';
      durText = dur === '7_days' ? 'sulod sa pito (7) ka adlaw.' : 'sulod sa tulo (3) ka adlaw.';
    } else { // Default English
      freqText = freq === '3_times_day' ? 'Take 1 tablet three times a day after meals' :
                 freq === '2_times_day' ? 'Take 1 tablet twice a day (morning and evening)' :
                 freq === 'once_day_morning' ? 'Take 1 tablet once daily in the morning before breakfast' :
                 'Take 1 tablet once daily at bedtime';
      durText = dur === '7_days' ? 'for seven (7) days.' : 'for three (3) days.';
    }

    return `${freqText} ${durText}`;
  };

  const startEditingInventory = (item: MedicineInventory) => {
    setInvName(item.medicineName);
    setInvGeneric(item.genericName);
    setInvCategory(item.category as any);
    setInvStock(item.currentStock);
    setInvReorder(item.reorderLevel);
    setInvUnit(item.stockInUnit);
    setEditingInventoryId(item.id);
    setShowInventoryForm(true);
  };

  const cancelEditingInventory = () => {
    setEditingInventoryId(null);
    setShowInventoryForm(false);
    setInvName('');
    setInvGeneric('');
    setInvStock(100);
  };

  const startEditingDispensed = (rec: MedicineDispensed) => {
    setDispRecordQty(rec.quantityDispensed);
    setDispRecordInstructions(rec.instructions || '');
    setEditingDispensedId(rec.id);
  };

  const cancelEditingDispensed = () => {
    setEditingDispensedId(null);
    setDispRecordInstructions('');
  };

  const handleDeleteInventoryClick = (id: string) => {
    if (confirm('Sigurado ka bang nais mong burahin ang gamot na ito sa database?')) {
      onDeleteInventory(id);
      alert('Nabura na ang gamot.');
    }
  };

  const handleDeleteDispensedClick = (id: string) => {
    if (confirm('Sigurado ka bang nais mong i-reverse/burahin ang pamamahagi ng gamot na ito? I-babalik ang stock sa inventory.')) {
      onDeleteDispensed(id);
      alert('Na-reverse na ang pamamahagi at naibalik ang stock.');
    }
  };

  const handleSaveInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName) return;

    if (editingInventoryId) {
      const existing = inventory.find(i => i.id === editingInventoryId);
      const updated: MedicineInventory = {
        id: editingInventoryId,
        medicineName: invName,
        genericName: invGeneric,
        category: invCategory,
        currentStock: invStock,
        reorderLevel: invReorder,
        stockInUnit: invUnit,
        expiryDate: existing?.expiryDate || '2027-12-31',
      };
      onUpdateInventory(updated);
      alert('Na-update ang medicine inventory stock!');
      setEditingInventoryId(null);
    } else {
      const newItem: MedicineInventory = {
        id: `MED-2026-00${inventory.length + 1}`,
        medicineName: invName,
        genericName: invGeneric,
        category: invCategory,
        currentStock: invStock,
        reorderLevel: invReorder,
        stockInUnit: invUnit,
        expiryDate: '2028-12-31',
      };
      onUpdateInventory(newItem);
      alert('Naidagdag ang bago ninyong gamot!');
    }
    setShowInventoryForm(false);
    setInvName('');
    setInvGeneric('');
  };

  const handleUpdateDispensedAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDispensedId) return;
    const rec = dispensed.find(d => d.id === editingDispensedId);
    if (!rec) return;

    // Find difference in stock and check/adjust inventory
    const medItem = inventory.find(i => i.medicineName === rec.medicineName);
    if (medItem) {
      const diff = dispRecordQty - rec.quantityDispensed;
      if (medItem.currentStock < diff) {
        alert('Babala: Kulang ang stock para sa pagbabagong ito!');
        return;
      }
      medItem.currentStock -= diff;
      onUpdateInventory({ ...medItem });
    }

    const updated: MedicineDispensed = {
      ...rec,
      quantityDispensed: dispRecordQty,
      instructions: dispRecordInstructions,
    };
    onUpdateDispensed(updated);
    alert('Na-update ang dispensing log!');
    setEditingDispensedId(null);
  };

  const handleDispenseAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed || !selectedPatId) return;

    if (selectedMed.currentStock < qty) {
      alert('Babala: Kulang ang kasalukuyang stock para sa hininging dami! (Insufficient stock in inventory).');
      return;
    }

    const generatedInstruction = translateInstruction(frequency, duration, language);

    const newDisp: MedicineDispensed = {
      id: `DISP-2026-00${dispensed.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      patientId: selectedPatId,
      medicineName: selectedMed.medicineName,
      quantityDispensed: qty,
      instructions: generatedInstruction,
      pharmacistDispenser: 'Lorna Cruz, RPh',
    };

    onDispense(newDisp);
    
    // Deduct inventory stock manually
    selectedMed.currentStock -= qty;

    alert('Matagumpay na naipamahagi ang gamot! (Medicine dispensed successfully).');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs" id="pharmacy-dispensing-panel">
      <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
        <Pill className="text-indigo-600" size={20} />
        <div>
          <h2 className="text-md font-bold text-slate-800">Parmasya at Pamamahagi ng Gamot (E-Pharmacy Depot)</h2>
          <p className="text-xs text-slate-500">Monitor vaccine, contraceptive, antibiotic stocks and log patient dispatches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COMPONENT: Inventory Levels with low alerts */}
        <div className="lg:col-span-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50" id="pharmacy-stock-list">
          <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 pb-2 gap-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Medicine Stock Database</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (showInventoryForm) {
                    cancelEditingInventory();
                  } else {
                    setShowInventoryForm(true);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-1 rounded transition-colors cursor-pointer text-[10px] flex items-center gap-1 uppercase px-1.5"
              >
                {showInventoryForm ? <X size={10} /> : <Plus size={10} />}
                <span>Ibagong Gamot</span>
              </button>
              <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-mono rounded">
                {inventory.length} items
              </span>
            </div>
          </div>

          {/* INVENTORY FORM */}
          {showInventoryForm && (
            <form onSubmit={handleSaveInventory} className="bg-white p-3.5 border border-slate-150 rounded-lg text-xs space-y-3 mb-3">
              <h4 className="font-extrabold uppercase text-[10px] text-slate-500 tracking-wider">
                {editingInventoryId ? '✏️ I-update ang Gamot' : '➕ Idagdag/Dagdagan ang supply ng gamot'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Pangalan ng Gamot (Brand)</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 p-1.5 rounded"
                    placeholder="e.g. Paracetamol"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Generic Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 p-1.5 rounded"
                    placeholder="e.g. 500mg tab"
                    value={invGeneric}
                    onChange={(e) => setInvGeneric(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Current Stock</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-slate-200 p-1.5 rounded"
                    value={invStock}
                    onChange={(e) => setInvStock(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Reorder Level</label>
                  <input
                    type="number"
                    required
                    className="w-full border border-slate-200 p-1.5 rounded"
                    value={invReorder}
                    onChange={(e) => setInvReorder(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">Stock Unit</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 p-1.5 rounded"
                    value={invUnit}
                    onChange={(e) => setInvUnit(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={cancelEditingInventory}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold px-3 py-1 rounded"
                >
                  I-cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded"
                >
                  I-save
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {inventory.map((item) => {
              const isLowStock = item.currentStock <= item.reorderLevel;
              return (
                <div key={item.id} className="p-3 bg-white border border-slate-150 rounded-lg flex justify-between items-center text-xs">
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="font-extrabold text-slate-800 block truncate">{item.medicineName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono truncate">Generic: {item.genericName} • Category: {item.category}</span>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div>
                      <span className={`font-mono font-bold text-sm block ${isLowStock ? 'text-rose-600' : 'text-slate-700'}`}>
                        {item.currentStock} {item.stockInUnit}
                      </span>
                      {isLowStock ? (
                        <span className="px-1 py-0.5 bg-rose-50 border border-rose-100 text-rose-800 text-[8px] font-black uppercase rounded block mt-0.5 font-mono">
                          REORDER
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-600 font-medium block">Optimal</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-slate-100 pl-2 text-slate-400">
                      <button
                        type="button"
                        onClick={() => startEditingInventory(item)}
                        className="p-1 hover:text-indigo-600 hover:bg-slate-50 rounded cursor-pointer"
                        title="Edit supply"
                      >
                        <Edit3 size={11} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteInventoryClick(item.id)}
                        className="p-1 hover:text-rose-600 hover:bg-slate-55 rounded cursor-pointer"
                        title="Delete supply"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COMPONENT: Fast Dispense Dispatch Form */}
        <div className="lg:col-span-6 bg-white p-4 border border-slate-150 rounded-xl" id="dispensing-dispatch-form">
          <form onSubmit={handleDispenseAction} className="space-y-4">
            <h3 className="text-xs font-black text-indigo-950 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
              Dispense Medication Intake
            </h3>

            {/* Choose receiver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1 font-mono">Select Patient</label>
                <select
                  className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg focus:outline-hidden"
                  value={selectedPatId}
                  onChange={(e) => setSelectedPatId(e.target.value)}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.lastName}, {p.firstName} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1 font-mono">Select Medicine</label>
                <select
                  className="w-full border border-slate-200 py-2 px-3 bg-white rounded-lg focus:outline-hidden"
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                >
                  {inventory.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.medicineName} ({m.currentStock} left)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="text-xs font-semibold">
              <label className="block text-[10px] text-slate-400 uppercase mb-1 font-mono">Quantity to Dispense (Bilang)</label>
              <input
                type="number"
                min="1"
                max={selectedMed?.currentStock || 100}
                className="w-full border border-slate-200 py-2.5 px-3 rounded-lg text-sm text-center font-mono font-bold"
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Smart instruction translator details */}
            <div className="border border-dashed border-indigo-200 rounded-lg p-3 bg-indigo-50/20 text-xs">
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-bold text-indigo-900 flex items-center gap-1">
                  <Sparkles size={12} />
                  Dosage Translation Intelligence Engine
                </span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-indigo-600"
                    checked={useTranslationHelp}
                    onChange={(e) => setUseTranslationHelp(e.target.checked)}
                  />
                  <span className="text-[10px] text-indigo-700 font-bold uppercase">Translate Form</span>
                </label>
              </div>

              {useTranslationHelp && (
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Gaano Kadalas (Frequency)</span>
                    <select
                      className="w-full border border-indigo-200 px-2 py-1.5 bg-white rounded font-semibold"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                    >
                      <option value="3_times_day">3x a day (pc) / Umaga-Hapon-Gabi</option>
                      <option value="2_times_day">2x a day (bid) / Umaga-Gabi</option>
                      <option value="once_day_morning">1x a day morning (od) / Umaga</option>
                      <option value="once_day_night">1x a day bedtime (hs) / Gabi bago matulog</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Gaano Katagal (Duration)</span>
                    <select
                      className="w-full border border-indigo-200 px-2 py-1.5 bg-white rounded font-semibold"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="7_days">7 Days cycle (Pitong Araw)</option>
                      <option value="3_days">3 Days check (Tatlong Araw)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Instant translation preview rendering */}
              <div className="mt-3 pt-2.5 border-t border-indigo-100">
                <span className="text-[10px] text-slate-400 block mb-0.5 uppercase font-black tracking-wider">Preview of generated prescription labeling:</span>
                <p className="font-mono text-xs font-bold text-indigo-950 bg-white p-2 rounded border border-indigo-150">
                  {translateInstruction(frequency, duration, language)}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              id="dispense-entry-submit-button"
            >
              Dispense now
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* EDIT DISPENSED LOG CONTEXT FORM */}
      {editingDispensedId && (
        <form onSubmit={handleUpdateDispensedAction} className="mt-5 p-4 border border-dashed border-indigo-300 bg-indigo-50/10 rounded-xl text-xs space-y-3">
          <div className="flex justify-between items-center border-b border-indigo-100 pb-2">
            <span className="font-bold text-indigo-900 uppercase tracking-wider text-[10px]">
              ✏️ I-update ang detalye ng Naipamahaging Gamot: {editingDispensedId}
            </span>
            <button
              type="button"
              onClick={cancelEditingDispensed}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Quantity (Dami)</label>
              <input
                type="number"
                required
                className="w-full border border-slate-200 p-2 rounded bg-white"
                value={dispRecordQty}
                onChange={(e) => setDispRecordQty(parseInt(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Instructions (Gabay sa Paggamit ng Gamot)</label>
              <input
                type="text"
                required
                className="w-full border border-slate-200 p-2 rounded bg-white"
                value={dispRecordInstructions}
                onChange={(e) => setDispRecordInstructions(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEditingDispensed}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 font-bold rounded"
            >
              I-cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded"
            >
              I-update ang Log
            </button>
          </div>
        </form>
      )}

      {/* DISPENSED HISTORY */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
          📋 Kasaysayan ng Pamamahagi ng Gamot (Recent Dispensed Logs)
        </h3>
        
        {dispensed.length === 0 ? (
          <div className="p-4 bg-slate-50 text-center text-slate-400 border border-slate-100 rounded-lg text-xs">
            Walang naitalang pamamahagi ngayon araw. (No dispensing history found).
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-150 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-extrabold text-slate-400 uppercase font-mono">
                  <th className="p-3">Petsa / ID</th>
                  <th className="p-3">Pangalan ng Patient</th>
                  <th className="p-3">Gamot</th>
                  <th className="p-3">Dami</th>
                  <th className="p-3">Instructions & Dispenser</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispensed.map((rec) => {
                  const patientObj = patients.find(p => p.id === rec.patientId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-mono">
                        <span className="font-extrabold block text-slate-700">{rec.date}</span>
                        <span className="text-[9px] text-slate-450">{rec.id}</span>
                      </td>
                      <td className="p-3 font-semibold text-slate-700">
                        {patientObj ? `${patientObj.lastName}, ${patientObj.firstName}` : rec.patientId}
                      </td>
                      <td className="p-3 font-bold text-indigo-900">{rec.medicineName}</td>
                      <td className="p-3 font-mono font-bold text-slate-800">{rec.quantityDispensed} pcs</td>
                      <td className="p-3 text-slate-500 max-w-[250px]">
                        <p className="font-medium text-slate-700 italic">"{rec.instructions}"</p>
                        <span className="text-[9px] block text-slate-400 mt-1">Dispenser: {rec.pharmacistDispenser}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-400">
                          <button
                            type="button"
                            onClick={() => startEditingDispensed(rec)}
                            className="p-1.5 hover:text-indigo-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                            title="Edit dispensing record"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDispensedClick(rec.id)}
                            className="p-1.5 hover:text-rose-600 hover:bg-slate-100 rounded cursor-pointer transition-colors"
                            title="Delete dispensing record"
                          >
                            <Trash2 size={12} />
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
    </div>
  );
};
