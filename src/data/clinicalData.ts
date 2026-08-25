import { VitalSigns, Consultation, MedicineInventory, MedicineDispensed, Referral, HealthCertificate, DailyLogEntry } from '../types';

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
    systolic: 130,
    diastolic: 85,
    temperature: 36.8,
    heartRate: 74,
    respiratoryRate: 18,
    weightKg: 64,
    heightCm: 165,
    bmi: 23.5,
    bmiCategory: 'Normal',
    loggedBy: 'Julefe Magwate (BHW)'
  },
  {
    id: 'VIT-2026-003',
    patientId: 'PAT-2026-0004',
    date: '2026-05-28',
    systolic: 110,
    diastolic: 70,
    temperature: 36.4,
    heartRate: 80,
    respiratoryRate: 18,
    weightKg: 58,
    heightCm: 155,
    bmi: 24.1,
    bmiCategory: 'Normal',
    bloodSugar: 98,
    loggedBy: 'Mary Joy Tan (BHW)'
  },
  {
    id: 'VIT-2026-004',
    patientId: 'PAT-2026-0006',
    date: '2026-05-25',
    systolic: 155,
    diastolic: 95,
    temperature: 36.5,
    heartRate: 84,
    respiratoryRate: 20,
    weightKg: 62,
    heightCm: 162,
    bmi: 23.6,
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
    patientId: 'PAT-2026-0103',
    date: '2026-05-20',
    chiefComplaint: 'Lagnat at ubo ng 2 araw, matamlay (Fever and cough for 2 days, lethargy)',
    subjective: 'Mother reports infant has high grade fever since yesterday. Poor feeding, increased irritability, mild non-productive cough.',
    objective: 'Temp is 38.2°C. Normal breath sounds. Well hydrated, skin turgor elastic, no rashes or petechiae.',
    assessmentDiagnoses: ['J06.9 - Acute Upper Respiratory Infection', 'R50.9 - Acute Fever of Unknown Origin'],
    isTBPossible: false,
    isDenguePossible: true,
    planTreatment: 'Sponge bath guidance. Prescribed Paracetamol drops 100mg/mL, 0.8mL every 4 hrs for fever. Instruct mother to watch out for dengue warning signs (bleeding, bleeding gums, severe refusal of food, lethargy) and return or go to municipal emergency.',
    referredToHospital: false,
    mhoValidated: true,
    attendingStaff: 'Yvonne Galang, RN (Nars)'
  },
  {
    id: 'CON-2026-003',
    patientId: 'PAT-2026-0006',
    date: '2026-05-28',
    chiefComplaint: 'Sakit ng ulo, pagkahilo, at panlalabo ng paningin (Severe headache, dizziness, blurry vision)',
    subjective: 'Senior patient complains of severe occipital headache for two days, exacerbated by physical exertion. Experiences chest pressure and transient lightheadedness.',
    objective: 'BP: 155/95 mmHg on 2 checks. HR: 85 bpm. BMI normal (23.6). Blood Glucose Level: 220 mg/dL.',
    assessmentDiagnoses: ['I10 - Primary Essential Hypertension, High Risk', 'E11.9 - Type 2 Diabetes Mellitus (Uncontrolled)'],
    isTBPossible: false,
    isDenguePossible: false,
    planTreatment: 'Emergency Losartan 50mg tab given. Instructed on low-salt, low-carb diabetic diet. Refer to Municipal Health Center next Tuesday for physician-led comprehensive metabolic management panel.',
    referredToHospital: true,
    mhoValidated: false,
    attendingStaff: 'Arlene Cagas Dayama, RM (Arlusa Midwife)'
  },
  {
    id: 'CON-2026-004',
    patientId: 'PAT-2026-0003',
    date: '2026-08-10',
    chiefComplaint: 'Mataas na Presyon ng Dugo at pananakit ng batok (Elevated blood pressure, nape discomfort)',
    subjective: 'Senior citizen reports morning dizziness and heaviness in back of neck after physical activity. Compliant with maintenance medications.',
    objective: 'BP: 140/90 mmHg. HR: 76 bpm. Temp: 36.5°C. Weight: 64kg.',
    assessmentDiagnoses: ['I10 - Essential Hypertension', 'Z71.3 - Dietary Counseling and Surveillance'],
    isTBPossible: false,
    isDenguePossible: false,
    planTreatment: 'Continue Losartan 50mg OD. Reinforced low-salt diet and sodium reduction. Recheck BP in 2 weeks at Barangay Health Station.',
    referredToHospital: false,
    mhoValidated: true,
    attendingStaff: 'Dr. Arthur Sotto, MD (MHO)'
  },
  {
    id: 'CON-2026-005',
    patientId: 'PAT-2026-0004',
    date: '2026-08-15',
    chiefComplaint: 'Prenatal Routine Check-up at Pananakit ng Balakang (Third trimester prenatal checkup)',
    subjective: 'G1P0 pregnant mother in third trimester. Reports active fetal movement and mild lower back aches. No bleeding or fluid leakage.',
    objective: 'BP: 110/70 mmHg. Fundic Height: 33cm. FHT: 142 bpm regular. Temp: 36.6°C.',
    assessmentDiagnoses: ['Z34.0 - Supervision of Normal First Pregnancy', 'O99.0 - Anemia in Pregnancy (Mild)'],
    isTBPossible: false,
    isDenguePossible: false,
    planTreatment: 'Dispensed Iron + Folic Acid 30 tablets. Birthing plan reconfirmed for delivery at Municipal Rural Health Unit.',
    referredToHospital: false,
    mhoValidated: true,
    attendingStaff: 'Arlene Cagas Dayama, RM (Barangay Midwife)'
  },
  {
    id: 'CON-2026-006',
    patientId: 'PAT-2026-0101',
    date: '2026-08-18',
    chiefComplaint: 'Ubo at baradong ilong ng 3 araw (Cough and nasal congestion for 3 days)',
    subjective: 'Mother brings 6-month-old infant with clear rhinorrhea and intermittent dry cough. Feeding well, no fever.',
    objective: 'Temp: 36.8°C. Clear lungs on auscultation, no wheezing or stridor. Hydration adequate.',
    assessmentDiagnoses: ['J00 - Acute Nasopharyngitis (Common Cold)'],
    isTBPossible: false,
    isDenguePossible: false,
    planTreatment: 'Saline nasal drops advised. Increase breastfeeding frequency. Prescribed Paracetamol drops as standby for fever.',
    referredToHospital: false,
    mhoValidated: true,
    attendingStaff: 'Yvonne Galang, RN (Public Health Nurse)'
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
    currentStock: 80,
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
  },
  {
    id: 'MED-009',
    medicineName: 'Paracetamol Drops 100mg/mL',
    genericName: 'Paracetamol',
    stockInUnit: 'bottles',
    currentStock: 250,
    reorderLevel: 50,
    expiryDate: '2027-09-18',
    category: 'Analgesics'
  },
  {
    id: 'MED-010',
    medicineName: 'Amoxicillin Syrup 125mg/5mL',
    genericName: 'Amoxicillin Pediatric',
    stockInUnit: 'bottles',
    currentStock: 180,
    reorderLevel: 40,
    expiryDate: '2027-06-12',
    category: 'Antibiotics'
  }
];

export const MOCK_DISPENSED: MedicineDispensed[] = [
  {
    id: 'DISP-001',
    date: '2026-05-15',
    patientId: 'PAT-2026-0001',
    medicineName: 'Losartan 50mg',
    quantityDispensed: 30,
    instructions: 'Inumin ang isang tableta minsan sa isang araw sa umaga (Losartan 50mg OD morning).',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  },
  {
    id: 'DISP-002',
    date: '2026-05-20',
    patientId: 'PAT-2026-0103',
    medicineName: 'Paracetamol Drops 100mg/mL',
    quantityDispensed: 1,
    instructions: 'Painumin ng 0.8mL kada 4 na oras kapag may lagnat (0.8mL every 4 hrs for fever prn).',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  },
  {
    id: 'DISP-003',
    date: '2026-08-10',
    patientId: 'PAT-2026-0003',
    medicineName: 'Losartan 50mg',
    quantityDispensed: 60,
    instructions: '1 tableta tuwing umaga bago kumain para sa maintenance ng altapresyon.',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  },
  {
    id: 'DISP-004',
    date: '2026-08-15',
    patientId: 'PAT-2026-0004',
    medicineName: 'Iron + Folic Acid',
    quantityDispensed: 30,
    instructions: '1 tableta araw-araw para sa kalusugan ng sanggol at nanay.',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  },
  {
    id: 'DISP-005',
    date: '2026-08-18',
    patientId: 'PAT-2026-0101',
    medicineName: 'Paracetamol Drops 100mg/mL',
    quantityDispensed: 1,
    instructions: '0.6mL tuwing 4 oras kung may lagnat.',
    pharmacistDispenser: 'Lorna Cruz, RPh'
  }
];

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'REF-2026-001',
    patientId: 'PAT-2026-0006', // Eustqio Antimano
    date: '2026-05-28',
    referringFacility: 'Barangay Balong-balong DHRMS, Pitogo, ZST',
    referredToFacility: 'Mayor Ramon B. Lopez Memorial District Hospital',
    reasonForReferral: 'Uncontrolled Severely elevated Blood Pressure (155/95 mmHg) coupled with blood glucose spikes of 220 mg/dL in senior patient with occipital pain.',
    clinicalSummary: 'Patient arrived with headache & lightheadedness. Triaged by Nurse with hypertensive crisis levels. Emergency dose lossartan administered, referral drafted for specialty cardiologist and diabetic clinic.',
    urgency: 'Urgent',
    transportArranged: 'Ambulance',
    status: 'Pending',
    bhwMidwifeInCharge: 'Arlene Cagas Dayama, RM'
  },
  {
    id: 'REF-2026-002',
    patientId: 'PAT-2026-0014', // Mardi Bantilan (High Risk Prenatal)
    date: '2026-08-12',
    referringFacility: 'Barangay Balong-balong DHRMS, Pitogo, ZST',
    referredToFacility: 'Margosatubig Regional Hospital',
    reasonForReferral: 'High Risk Pregnancy (Term G1P0 with elevated BP 135/85) for hospital delivery clearance.',
    clinicalSummary: 'Third trimester checkup confirmed cephalic presentation, full term. Referred for institutional delivery facilities.',
    urgency: 'Routine',
    transportArranged: 'Private/LGU Vehicle',
    status: 'Completed',
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
  },
  {
    id: 'CERT-2026-002',
    patientId: 'PAT-2026-0003',
    dateIssued: '2026-08-11',
    certificateType: 'Barangay Health Clearance',
    purpose: 'Senior Citizen Social Pension Medical Validation',
    findings: 'Hypertension under active pharmacological control. Patient is ambulatory.',
    remarks: 'Valid for LGU Senior Pension validation.',
    signatoryName: 'Dr. Arthur Sotto, MD',
    signatoryTitle: 'Municipal Health Officer'
  }
];

export const MOCK_DAILY_LOG: DailyLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-06-01T08:00:00Z',
    patientId: 'PAT-2026-0001',
    patientName: 'Absin, Jose',
    purpose: 'Checkup',
    status: 'Completed',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-06-01T08:20:00Z',
    patientId: 'PAT-2026-0103',
    patientName: 'Mudalla, Jhaine Mae',
    purpose: 'Vaccination',
    status: 'Completed',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-06-01T08:45:00Z',
    patientId: 'PAT-2026-0004',
    patientName: 'Andrada, Eutheria',
    purpose: 'Prenatal',
    status: 'Completed',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-08-10T08:15:00Z',
    patientId: 'PAT-2026-0003',
    patientName: 'Antimano, Carmelo',
    purpose: 'Checkup',
    status: 'Completed',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-005',
    timestamp: '2026-08-15T09:00:00Z',
    patientId: 'PAT-2026-0004',
    patientName: 'Andrada, Eutheria',
    purpose: 'Prenatal',
    status: 'Completed',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-006',
    timestamp: '2026-08-18T09:30:00Z',
    patientId: 'PAT-2026-0101',
    patientName: 'Mahusay, Rhialley',
    purpose: 'Vaccination',
    status: 'Completed',
    purok: 'Purok 1'
  },
  {
    id: 'LOG-007',
    timestamp: '2026-08-24T08:00:00Z',
    patientId: 'PAT-2026-0002',
    patientName: 'Aquino, Lowen',
    purpose: 'Checkup',
    status: 'Waiting',
    purok: 'Purok 1'
  }
];
