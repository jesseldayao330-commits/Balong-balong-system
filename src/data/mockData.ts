/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Household, Patient, VitalSigns, Consultation, MedicineInventory, MedicineDispensed, PrenatalRecord, ImmunizationRecord, FamilyPlanningRecord, Referral, HealthCertificate, DailyLogEntry, Language } from '../types';

export const LOCALIZED_TEXTS: Record<Language, Record<string, string>> = {
  EN: {
    title: 'Development of a Health Records Management System',
    subheading: 'Primary Healthcare Delivery Portal • RA 10173 Compliant',
    online: 'Online (Connected to Municipal EHR)',
    offline: 'Offline Mode (Local Storage Synced)',
    bhw: 'Barangay Health Worker (BHW)',
    midwife: 'Barangay Midwife',
    mho: 'Municipal Health Officer (MHO)',
    admin: 'Barangay Captain / Admin',
    nurse: 'Public Health Nurse',
    pharmacist: 'Pharmacist / Dispenser',
    activeRole: 'Active Role: ',
    searchPatient: 'Search Patient by Name, ID, or PhilHealth Rank',
    registerPatient: 'Register New Patient',
    dailyLog: 'Daily Visitor logs',
    census: 'Household Census Connection',
    consultations: 'Clinical Consultations',
    medicines: 'Pharmacy Dispensing',
    prenatal: 'Maternal & Prenatal MCH',
    immunization: 'Vaccination Programs (EPI)',
    familyPlanning: 'Family Planning Tracking',
    healthMap: 'Barangay Disease Surveillance Map',
    reports: 'FHSIS Monthly Reports Generator',
    certificates: 'Health Clearances & Vouchers',
    activeAlerts: 'Active Surveillance Alerts',
    unvaccinatedInfants: 'Unvaccinated Infants',
    malnourishedChildren: 'Malnourished Toddlers (OPT+)',
    highBPResidents: 'Hypertensive Residents',
    activeTBCases: 'TB Presumptive Core Contacts',
    syncButton: 'Backup / Sync Local DB',
    purokDistribution: 'Purok Resident Distribution',
    philhealthEligible: 'PhilHealth Eligibility Check',
    malasakitEligibility: 'Malasakit Indigent Status',
    environmentalHygiene: 'Water & Toilet Sanitary Metrics',
    referralHospital: 'Outgoing Referrals',
    savePrompt: 'Record Saved Successfully!',
    addRecord: 'Add New Record',
    noAllergies: 'No known allergies',
  },
  TL: {
    title: 'Sistemang Rekord ng Barangay Health Center',
    subheading: 'Pangunahing Portal sa Pangangalagang Pangkalusugan • Alinsunod sa RA 10173',
    online: 'Online (Impormasyong Sentral ng Munisipyo)',
    offline: 'Offline Mode (Lokal na Storage ay Ligtas)',
    bhw: 'Barangay Health Worker (BHW)',
    midwife: 'Barangay Kumadrona (Midwife)',
    mho: 'Municipal Health Officer (MHO)',
    admin: 'Kapitan ng Barangay / Admin',
    nurse: 'Pampublikong Nars',
    pharmacist: 'Parmasya / Tagahanda ng Gamot',
    activeRole: 'Aktibong Gampanin: ',
    searchPatient: 'Maghanap ng Pasyente gamit ang Pangalan, ID o PhilHealth',
    registerPatient: 'Irehistro ang Bagong Pasyente',
    dailyLog: 'Talaan ng mga Bisita Ngayong Araw',
    census: 'Senso at Linkage ng Sambahayan',
    consultations: 'Klinikal na Konsultasyon',
    medicines: 'Pamamahagi ng Gamot',
    prenatal: 'Pangangalaga sa Buntis / MCH',
    immunization: 'Programa sa Pagbabakuna (EPI)',
    familyPlanning: 'Pagpaplano ng Pamilya',
    healthMap: 'Mapa para sa Pagsubaybay sa Sakit sa Barangay',
    reports: 'Buwanang FHSIS Report Generator',
    certificates: 'Katunayan sa Kalusugan at Vouchers',
    activeAlerts: 'Mga Aktibong Babala sa Kalusugan',
    unvaccinatedInfants: 'Mga Sanggol na Kulang sa Bakuna',
    malnourishedChildren: 'Mga Batang Kulang sa Timbang (OPT+)',
    highBPResidents: 'Mga Preskong may Altapresyon',
    activeTBCases: 'Mga Presumptive sa TB para sa Pagsusuri',
    syncButton: 'I-backup / I-sync ang Lokal na DB',
    purokDistribution: 'Bilang ng Tao bawat Purok',
    philhealthEligible: 'Kasapatan sa PhilHealth',
    malasakitEligibility: 'Katayuan sa Malasakit / Indigent',
    environmentalHygiene: 'Metriko ng Malinis na Tubig at Palikuran',
    referralHospital: 'Mga Pinapasa sa Ospital (Referrals)',
    savePrompt: 'Matagumpay na Naitabi ang Rekord!',
    addRecord: 'Magdagdag ng Rekord',
    noAllergies: 'Walang alam na alerhiya',
  },
  BY: {
    title: 'Sistemang Rekord sa Barangay Health Center',
    subheading: 'Pangunahing Portal sa Pangalaga sa Panglawas • Sigun sa RA 10173',
    online: 'Online (Sumpay sa Municipal EHR)',
    offline: 'Offline Mode (Naka-save sa Lokal nga Storage)',
    bhw: 'Barangay Health Worker (BHW)',
    midwife: 'Barangay Kumadrona (Midwife)',
    mho: 'Municipal Health Officer (MHO)',
    admin: 'Kapitan sa Barangay / Admin',
    nurse: 'Pampublikong Nars',
    pharmacist: 'Parmasya / Tig-apod-apod og Tambal',
    activeRole: 'Aktibong Papel: ',
    searchPatient: 'Pangitaa ang Pasyente pinaagi sa Ngalan, ID o PhilHealth',
    registerPatient: 'Irehistro ang Bagong Pasyente',
    dailyLog: 'Talaan sa mga Bisita Karon',
    census: 'Sensus sa Panimalay',
    consultations: 'Klinikal nga Konsultasyon',
    medicines: 'Pang-apod-apod og Tambal',
    prenatal: 'Atensyon sa Buntis / MCH',
    immunization: 'Programa sa Pagbakuna (EPI)',
    familyPlanning: 'Pagplano sa Pamilya',
    healthMap: 'Mapa sa Pagpaniid sa Sakit sa Barangay',
    reports: 'Buwanang FHSIS Report Generator',
    certificates: 'Sertipiko sa Panglawas ug Vouchers',
    activeAlerts: 'Mga Aktibong Pahibalo sa Panglawas',
    unvaccinatedInfants: 'Mga Sanggol nga Kulang sa Bakuna',
    malnourishedChildren: 'Mga Bata nga Kulang sa Timbang (OPT+)',
    highBPResidents: 'Mga Residente nga Aduna’y Alta Presyon',
    activeTBCases: 'Mga Presumptive nga TB sa Barangay',
    syncButton: 'I-backup / I-sync ang Lokal nga DB',
    purokDistribution: 'Gidaghanon sa Tao kada Purok',
    philhealthEligible: 'Kasayuran sa PhilHealth',
    malasakitEligibility: 'Sitwasyon sa Malasakit / Indigent',
    environmentalHygiene: 'Sustansya sa Tubig ug Kasilyas',
    referralHospital: 'Gipadala nga mga Pasyente (Referrals)',
    savePrompt: 'Malamposong Na-save ang Rekord!',
    addRecord: 'Idugang ang Rekord',
    noAllergies: 'Walang hibal-an nga alerhiya',
  }
};

export const MOCK_HOUSEHOLDS: Household[] = [
  {
    id: 'HH-2026-001',
    householdHead: 'Dela Cruz, Juan',
    purok: 'Purok 1',
    numberOfMembers: 5,
    waterSource: 'Level III (Waterworks System)',
    sanitaryToilet: true,
    solidWasteManagement: 'Segregated',
    indigentStatus: true,
  },
  {
    id: 'HH-2026-002',
    householdHead: 'Santos, Maria',
    purok: 'Purok 3',
    numberOfMembers: 4,
    waterSource: 'Level II (Communal Faucet)',
    sanitaryToilet: true,
    solidWasteManagement: 'Segregated',
    indigentStatus: false,
  },
  {
    id: 'HH-2026-003',
    householdHead: 'Aquino, Reynaldo',
    purok: 'Purok 5',
    numberOfMembers: 6,
    waterSource: 'Level I (Point Source)',
    sanitaryToilet: false,
    solidWasteManagement: 'Open Dumping',
    indigentStatus: true,
  },
  {
    id: 'HH-2026-004',
    householdHead: 'Reyes, Lourdes',
    purok: 'Purok 2',
    numberOfMembers: 3,
    waterSource: 'Level III (Waterworks System)',
    sanitaryToilet: true,
    solidWasteManagement: 'Segregated',
    indigentStatus: false,
  },
  {
    id: 'HH-2026-005',
    householdHead: 'Alcantara, Teodoro',
    purok: 'Purok 7',
    numberOfMembers: 7,
    waterSource: 'Unsanitary/Unprotected',
    sanitaryToilet: false,
    solidWasteManagement: 'Disposed/Burned',
    indigentStatus: true,
  }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'PAT-2026-0001',
    householdId: 'HH-2026-001',
    lastName: 'Dela Cruz',
    firstName: 'Juan',
    middleName: 'Mercado',
    birthDate: '1975-08-15',
    gender: 'Male',
    civilStatus: 'Married',
    purok: 'Purok 1',
    phoneNumber: '09171234567',
    philHealthId: '12-345678901-2',
    philHealthCategory: 'Indirect (Indigent)',
    isIndigent: true,
    bloodType: 'O+',
    allergies: 'Penicillin',
    activePrograms: ['TB_DOTS', 'SENIOR_CITIZEN'],
    createdAt: '2026-01-10',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'PAT-2026-0002',
    householdId: 'HH-2026-001',
    lastName: 'Dela Cruz',
    firstName: 'Angelina',
    middleName: 'Reyes',
    birthDate: '1998-05-20',
    gender: 'Female',
    civilStatus: 'Married',
    purok: 'Purok 1',
    phoneNumber: '09189876543',
    philHealthId: '23-456789012-3',
    philHealthCategory: 'Direct Contributor',
    isIndigent: true,
    bloodType: 'A+',
    allergies: '',
    activePrograms: ['MCH'],
    createdAt: '2026-02-14',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'PAT-2026-0003',
    householdId: 'HH-2026-002',
    lastName: 'Santos',
    firstName: 'Ethan',
    middleName: 'Cruz',
    birthDate: '2025-11-03',
    gender: 'Male',
    civilStatus: 'Single',
    purok: 'Purok 3',
    phoneNumber: '09194445555',
    philHealthId: 'Not Enrolled',
    philHealthCategory: 'Not Enrolled',
    isIndigent: false,
    bloodType: 'B+',
    allergies: '',
    activePrograms: ['EPI', 'OPT_PLUS'],
    createdAt: '2025-11-05',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'PAT-2026-0004',
    householdId: 'HH-2026-003',
    lastName: 'Aquino',
    firstName: 'Consuelo',
    middleName: 'Bautista',
    birthDate: '1951-01-25',
    gender: 'Female',
    civilStatus: 'Widowed',
    purok: 'Purok 5',
    phoneNumber: '09223334444',
    philHealthId: '45-123456789-0',
    philHealthCategory: 'Senior Citizen',
    isIndigent: true,
    bloodType: 'AB-',
    allergies: 'Aspirin',
    activePrograms: ['SENIOR_CITIZEN', 'DISEASE_SURVEILLANCE'],
    createdAt: '2026-01-05',
    photo: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: 'PAT-2026-0005',
    householdId: 'HH-2026-004',
    lastName: 'Reyes',
    firstName: 'Patricia',
    middleName: 'Villanueva',
    birthDate: '2001-10-12',
    gender: 'Female',
    civilStatus: 'Single',
    purok: 'Purok 2',
    phoneNumber: '09287778888',
    philHealthId: '34-234567890-1',
    philHealthCategory: 'Direct Contributor',
    isIndigent: false,
    bloodType: 'A-',
    allergies: 'Dust, Seafood',
    activePrograms: ['FAMILY_PLANNING'],
    createdAt: '2026-03-20',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
  }
];

export const MOCK_VITALS: VitalSigns[] = [
  {
    id: 'VIT-2026-001',
    patientId: 'PAT-2026-0001',
    date: '2026-05-15',
    systolic: 135,
    diastolic: 85,
    temperature: 36.6,
    heartRate: 72,
    respiratoryRate: 18,
    weightKg: 68,
    heightCm: 170,
    bmi: 23.5,
    bmiCategory: 'Normal',
    bloodSugar: 110,
    loggedBy: 'Julefe Magwate (BHW)'
  },
  {
    id: 'VIT-2026-002',
    patientId: 'PAT-2026-0003',
    date: '2026-05-20',
    systolic: 95,
    diastolic: 60,
    temperature: 38.2, // Fever
    heartRate: 110,
    respiratoryRate: 24,
    weightKg: 7.2,
    heightCm: 68,
    bmi: 15.6,
    bmiCategory: 'Underweight',
    loggedBy: 'Julefe Magwate (BHW)'
  },
  {
    id: 'VIT-2026-003',
    patientId: 'PAT-2026-0004',
    date: '2026-05-28',
    systolic: 155, // Hypertensive stage 2
    diastolic: 95,
    temperature: 36.4,
    heartRate: 85,
    respiratoryRate: 20,
    weightKg: 52,
    heightCm: 150,
    bmi: 23.1,
    bmiCategory: 'Normal',
    bloodSugar: 220, // Diabetic indicator
    loggedBy: 'Mary Joy Tan (BHW)'
  },
  {
    id: 'VIT-2026-004',
    patientId: 'PAT-2026-0002',
    date: '2026-05-25',
    systolic: 110,
    diastolic: 70,
    temperature: 36.5,
    heartRate: 78,
    respiratoryRate: 16,
    weightKg: 58,
    heightCm: 157,
    bmi: 23.5,
    bmiCategory: 'Normal',
    loggedBy: 'Mary Joy Tan (BHW)'
  }
];

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'CON-2026-001',
    patientId: 'PAT-2026-0001',
    date: '2026-05-15',
    chiefComplaint: 'Patuloy na ubo sa loob ng 3 linggo, pangangayayat, at lagnat tuwing gabi (Cough for 3 weeks, weight loss, night sweats)',
    subjective: 'Patient reports persistent dry cough accompanied by afternoon low-grade fever and night sweats. Complaining of loss of appetite and chest discomfort.',
    objective: 'Chest auscultation yields crackles over upper lung zones. BP: 135/85, Temp: 37.2°C.',
    assessmentDiagnoses: ['A15.0 - Presumptive Pulmonary Tuberculosis', 'I10 - Essential Hypertension (mild)'],
    isTBPossible: true,
    isDenguePossible: false,
    planTreatment: 'Sputum GeneXpert scheduled tomorrow. Placed under temporary TB DOTS isolation guidelines. Advised continued bed rest and proper facial masks. Prescribed Amlodipine 5mg OD for elevated BP.',
    referredToHospital: false,
    mhoValidated: true,
    attendingStaff: 'Dr. Arthur Sotto, MD (MHO)'
  },
  {
    id: 'CON-2026-002',
    patientId: 'PAT-2026-0003',
    date: '2026-05-20',
    chiefComplaint: 'Lagnat at ubo ng 2 araw, matamlay (Fever and cough for 2 days, lethargy)',
    subjective: 'Mother reports infant has high grade fever since yesterday. Poor feeding, increased irritability, mild non-productive cough.',
    objective: 'Temp is 38.2°C. Normal breath sounds. Well hydrated, skin turgor elastic, no rashes or petechiae.',
    assessmentDiagnoses: ['J06.9 - Acute Upper Respiratory Infection', 'R50.9 - Acute Fever of Unknown Origin'],
    isTBPossible: false,
    isDenguePossible: true, // Screen for dengue in rainy season
    planTreatment: 'Sponge bath guidance. Prescribed Paracetamol drops 100mg/mL, 0.8mL every 4 hrs for fever. Instruct mother to watch out for dengue warning signs (bleeding, bleeding gums, severe refusal of food, lethargy) and return or go to municipal emergency.',
    referredToHospital: false,
    mhoValidated: true,
    attendingStaff: 'Yvonne Galang, RN (Nars)'
  },
  {
    id: 'CON-2026-003',
    patientId: 'PAT-2026-0004',
    date: '2026-05-28',
    chiefComplaint: 'Sakit ng ulo, pagkahilo, at panlalabo ng paningin (Severe headache, dizziness, blurry vision)',
    subjective: 'Senior patient complains of severe occipital headache for two days, exacerbated by physical exertion. Experiences chest pressure and transient lightheadedness.',
    objective: 'BP: 155/95 mmHg on 2 checks. HR: 85 bpm. BMI normal (23.1). Blood Glucose Level: 220 mg/dL.',
    assessmentDiagnoses: ['I10 - Primary Essential Hypertension, High Risk', 'E11.9 - Type 2 Diabetes Mellitus (Uncontrolled)'],
    isTBPossible: false,
    isDenguePossible: false,
    planTreatment: 'Emergency Losartan 50mg tab given. Instructed on low-salt, low-carb diabetic diet. Refer to Municipal Health Center next Tuesday for physician-led comprehensive metabolic management panel.',
    referredToHospital: true,
    mhoValidated: false,
    attendingStaff: 'Arlene Cagas Dayama, RM (Arlusa Midwife)'
  }
];

export const MOCK_INVENTORY: MedicineInventory[] = [
  {
    id: 'MED-001',
    medicineName: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    stockInUnit: 'tablets',
    currentStock: 1200,
    reorderLevel: 500,
    expiryDate: '2027-12-01',
    category: 'Antibiotics'
  },
  {
    id: 'MED-002',
    medicineName: 'Paracetamol 500mg',
    genericName: 'Paracetamol',
    stockInUnit: 'tablets',
    currentStock: 3500,
    reorderLevel: 1000,
    expiryDate: '2028-06-30',
    category: 'Analgesics'
  },
  {
    id: 'MED-003',
    medicineName: 'Losartan 50mg',
    genericName: 'Losartan Potassium',
    stockInUnit: 'tablets',
    currentStock: 80, // Low stock alert!
    reorderLevel: 200,
    expiryDate: '2027-04-15',
    category: 'Hypertension'
  },
  {
    id: 'MED-004',
    medicineName: 'Iron + Folic Acid',
    genericName: 'Ferrous Sulfate + Folic Acid',
    stockInUnit: 'tablets',
    currentStock: 1500,
    reorderLevel: 300,
    expiryDate: '2027-11-20',
    category: 'Vitamins'
  },
  {
    id: 'MED-005',
    medicineName: 'Pre-Natal Multi-Vitamins',
    genericName: 'Maternal MultiVitamins',
    stockInUnit: 'tablets',
    currentStock: 800,
    reorderLevel: 250,
    expiryDate: '2027-08-10',
    category: 'Vitamins'
  },
  {
    id: 'MED-006',
    medicineName: 'Oral Contraceptive Pills (Micropil)',
    genericName: 'Ethinyl Estradiol + Levonorgestrel',
    stockInUnit: 'cycles',
    currentStock: 150,
    reorderLevel: 40,
    expiryDate: '2027-10-31',
    category: 'Contraceptives'
  },
  {
    id: 'MED-007',
    medicineName: 'BCG Tuberculosis Vaccine',
    genericName: 'Bacillus Calmette-Guérin Vaccine',
    stockInUnit: 'vials',
    currentStock: 45,
    reorderLevel: 10,
    expiryDate: '2026-11-15',
    category: 'EPI Vaccines'
  },
  {
    id: 'MED-008',
    medicineName: 'DMPA Injectables (Depo-Trust)',
    genericName: 'Medroxyprogesterone Acetate suspension',
    stockInUnit: 'vials',
    currentStock: 60,
    reorderLevel: 15,
    expiryDate: '2027-03-24',
    category: 'Contraceptives'
  }
];

export const MOCK_DISPENSED: MedicineDispensed[] = [
  {
    id: 'DISP-001',
    date: '2026-05-15',
    patientId: 'PAT-2026-0001',
    medicineName: 'Losartan 50mg',
    quantityDispensed: 30,
    instructions: 'Inumin ang isang tableta minsan sa isang araw sa umaga (Amlodipine 5mg/Losartan 50mg OD morning).',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  },
  {
    id: 'DISP-002',
    date: '2026-05-20',
    patientId: 'PAT-2026-0003',
    medicineName: 'Paracetamol Drops 100mg/mL',
    quantityDispensed: 1,
    instructions: 'Painumin ng 0.8mL kada 4 na oras kapag may lagnat (0.8mL every 4 hrs for fever prn).',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  }
];

export const MOCK_PRENATAL: PrenatalRecord[] = [
  {
    id: 'PRE-2026-001',
    patientId: 'PAT-2026-0002', // Angelina Dela Cruz
    lmp: '2025-10-05',
    edc: '2026-07-12',
    gravida: 1,
    para: 0,
    gestationalAgeWeeks: 34,
    fundalHeightCm: 32,
    fetalHeartToneBpm: 142,
    tetanusToxoidStatus: 'TT2',
    ironFolicAcidGiven: true,
    bloodPressure: '110/70',
    riskClassification: 'Low Risk',
    remarks: 'Active healthy pregnancy, third trimester. Safe birthing plan established to deliver at Municipal Lying-In clinic.',
    nextPrenatalVisit: '2026-06-05'
  }
];

export const MOCK_IMMUNIZATION: ImmunizationRecord[] = [
  {
    id: 'IMM-2026-001',
    patientId: 'PAT-2026-0003', // Ethan Santos, 7 months old
    motherName: 'Maria Santos',
    vaccineName: 'BCG',
    doseNumber: 1,
    dateGiven: '2025-11-05',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Delivered at birth'
  },
  {
    id: 'IMM-2026-002',
    patientId: 'PAT-2026-0003',
    motherName: 'Maria Santos',
    vaccineName: 'Pentavalent 1',
    doseNumber: 1,
    dateGiven: '2025-12-15',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Healthy'
  },
  {
    id: 'IMM-2026-003',
    patientId: 'PAT-2026-0003',
    motherName: 'Maria Santos',
    vaccineName: 'OPV 1',
    doseNumber: 1,
    dateGiven: '2025-12-15',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Polio vaccine drop'
  }
];

export const MOCK_FAMILYPLANNING: FamilyPlanningRecord[] = [
  {
    id: 'FP-2026-001',
    patientId: 'PAT-2026-0005', // Patricia Reyes
    spouseName: 'Reyes, Carlos',
    numberOfLivingChildren: 1,
    desiredFamilySize: 2,
    methodAccepted: 'Oral Contraceptives',
    methodType: 'Current User',
    sideEffectsExpressed: 'None reported',
    remarks: 'Prefers standard low-dose combination pills. Regular user. Visited DHRMS for quarterly packaging pickup.',
    nextServiceDate: '2026-08-20'
  }
];

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'REF-2026-001',
    patientId: 'PAT-2026-0004', // Consuelo Aquino
    date: '2026-05-28',
    referringFacility: 'Barangay Balong-balong DHRMS, Pitogo, ZST',
    referredToFacility: 'Mayor Ramon B. Lopez Memorial District Hospital',
    reasonForReferral: 'Uncontrolled Severely elevated Blood Pressure (155/95 mmHg) coupled with blood glucose spikes of 220 mg/dL in senior patient with occipital pain.',
    clinicalSummary: 'Patient arrived with headache & lightheadedness. Triaged by Nurse with hypertensive crisis levels. Emergency dose lossartan administered, referral drafted for specialty cardiologist and diabetic clinic.',
    urgency: 'Urgent',
    transportArranged: 'Ambulance',
    status: 'Pending',
    bhwMidwifeInCharge: 'Arlene Cagas Dayama, RM'
  }
];

export const MOCK_CERTIFICATES: HealthCertificate[] = [
  {
    id: 'CERT-2026-001',
    patientId: 'PAT-2026-0001',
    dateIssued: '2026-05-30',
    certificateType: 'Barangay Health Clearance',
    purpose: 'Social Welfare Assistance Requirements (AICS program)',
    findings: 'Patient is treated under Barangay DOTS regimen. Vital signs stable, on anti-hypertensive maintenance.',
    remarks: 'Given for indigent local support program requirement.',
    signatoryName: 'Dr. Arthur Sotto, MD',
    signatoryTitle: 'Municipal Health Officer'
  }
];

export const MOCK_DAILY_LOG: DailyLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-06-01T08:00:00Z',
    patientId: 'PAT-2026-0001',
    patientName: 'Dela Cruz, Juan',
    purpose: 'Checkup',
    status: 'In Progress',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-06-01T08:20:00Z',
    patientId: 'PAT-2026-0003',
    patientName: 'Santos, Ethan',
    purpose: 'Vaccination',
    status: 'Waiting',
    purok: 'Purok 3'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-06-01T08:45:00Z',
    patientId: 'PAT-2026-0002',
    patientName: 'Dela Cruz, Angelina',
    purpose: 'Prenatal',
    status: 'Completed',
    purok: 'Purok 1'
  }
];
