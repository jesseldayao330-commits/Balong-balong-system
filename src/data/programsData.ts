import { PrenatalRecord, ImmunizationRecord, FamilyPlanningRecord } from '../types';

export const MOCK_PRENATAL: PrenatalRecord[] = [
  {
    id: 'PRE-2026-001',
    patientId: 'PAT-2026-0004', // Andrada, Eutheria (Purok 1)
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
    remarks: 'Active healthy pregnancy, third trimester. Safe birthing plan established for delivery at Municipal Lying-In clinic.',
    nextPrenatalVisit: '2026-06-05'
  },
  {
    id: 'PRE-2026-002',
    patientId: 'PAT-2026-0011', // Andilab, Daisy (Purok 2)
    lmp: '2025-11-20',
    edc: '2026-08-27',
    gravida: 2,
    para: 1,
    gestationalAgeWeeks: 29,
    fundalHeightCm: 27,
    fetalHeartToneBpm: 145,
    tetanusToxoidStatus: 'TT3',
    ironFolicAcidGiven: true,
    bloodPressure: '120/80',
    riskClassification: 'Low Risk',
    remarks: 'Regular prenatal checkups. Normal fetal heart rate, mild fatigue reported. Given iron and folic acid supplements.',
    nextPrenatalVisit: '2026-06-25'
  },
  {
    id: 'PRE-2026-003',
    patientId: 'PAT-2026-0014', // Bantilan, Mardi (Purok 2)
    lmp: '2025-09-01',
    edc: '2026-06-08',
    gravida: 1,
    para: 0,
    gestationalAgeWeeks: 40,
    fundalHeightCm: 37,
    fetalHeartToneBpm: 140,
    tetanusToxoidStatus: 'TT2',
    ironFolicAcidGiven: true,
    bloodPressure: '135/85',
    riskClassification: 'High Risk',
    remarks: 'Term pregnancy. Mild hypertensive symptoms noted. Monitored closely for labor onset. Advised delivery at district hospital.',
    nextPrenatalVisit: '2026-06-15'
  },
  {
    id: 'PRE-2026-004',
    patientId: 'PAT-2026-0017', // Bargayo, Pina (Purok 3)
    lmp: '2026-01-15',
    edc: '2026-10-22',
    gravida: 3,
    para: 2,
    gestationalAgeWeeks: 21,
    fundalHeightCm: 20,
    fetalHeartToneBpm: 148,
    tetanusToxoidStatus: 'TT4',
    ironFolicAcidGiven: true,
    bloodPressure: '110/68',
    riskClassification: 'Low Risk',
    remarks: 'Second trimester, healthy progress. Quickening active. Instructed on nutritional needs and regular tetanus checkups.',
    nextPrenatalVisit: '2026-06-30'
  },
  {
    id: 'PRE-2026-005',
    patientId: 'PAT-2026-0024', // Camache, Hicel (Purok 3)
    lmp: '2025-12-10',
    edc: '2026-09-16',
    gravida: 1,
    para: 0,
    gestationalAgeWeeks: 26,
    fundalHeightCm: 25,
    fetalHeartToneBpm: 144,
    tetanusToxoidStatus: 'TT1',
    ironFolicAcidGiven: true,
    bloodPressure: '115/72',
    riskClassification: 'Low Risk',
    remarks: 'Glucose test normal. Healthy fetal heartbeat. Encouraged compliance with iron supplements.',
    nextPrenatalVisit: '2026-06-20'
  },
  {
    id: 'PRE-2026-006',
    patientId: 'PAT-2026-0026', // Candado, Peligrena (Purok 4)
    lmp: '2025-10-18',
    edc: '2026-07-25',
    gravida: 2,
    para: 1,
    gestationalAgeWeeks: 34,
    fundalHeightCm: 31,
    fetalHeartToneBpm: 142,
    tetanusToxoidStatus: 'TT2',
    ironFolicAcidGiven: true,
    bloodPressure: '120/75',
    riskClassification: 'Low Risk',
    remarks: 'Third trimester. Cephalic presentation. Normal parameters. Safe birthing plan discussed.',
    nextPrenatalVisit: '2026-06-18'
  }
];

export const MOCK_IMMUNIZATION: ImmunizationRecord[] = [
  // 29 IMMUNIZATION RECORDS FOR THE 29 CHILDREN IN PICTURE 1
  {
    id: 'IMM-2026-0101',
    patientId: 'PAT-2026-0101', // Mahusay, Rhialley (7m)
    motherName: 'Clarizza Mahusay',
    vaccineName: 'Pentavalent 3',
    doseNumber: 3,
    dateGiven: '2025-10-17',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'DPT-HepB-HiB Series 3 completed'
  },
  {
    id: 'IMM-2026-0102',
    patientId: 'PAT-2026-0102', // Paghangil, Jinny Jr. (7m)
    motherName: 'Alice Paghangil',
    vaccineName: 'OPV 3',
    doseNumber: 3,
    dateGiven: '2025-10-07',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Oral Polio Vaccine 3rd dose'
  },
  {
    id: 'IMM-2026-0103',
    patientId: 'PAT-2026-0103', // Mudalla, Jhaine Mae (9m)
    motherName: 'Jovelyn Mudalla',
    vaccineName: 'MCV 1 (Measles)',
    doseNumber: 1,
    dateGiven: '2026-01-26',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Measles 1st dose administered at 9 months'
  },
  {
    id: 'IMM-2026-0104',
    patientId: 'PAT-2026-0104', // Calapana, Amalia (34m)
    motherName: 'Joebel Calapana',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-04-19',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Fully Immunized Child (FIC) Certified'
  },
  {
    id: 'IMM-2026-0105',
    patientId: 'PAT-2026-0105', // Aparado, Kayla Jade (14m)
    motherName: 'Jamaica Aparado',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2026-02-01',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Measles-Mumps-Rubella 2nd dose completed'
  },
  {
    id: 'IMM-2026-0106',
    patientId: 'PAT-2026-0106', // Enat, Junry (16m)
    motherName: 'Rosilgo Enat',
    vaccineName: 'PCV 3',
    doseNumber: 3,
    dateGiven: '2025-09-07',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Pneumococcal booster given'
  },
  {
    id: 'IMM-2026-0107',
    patientId: 'PAT-2026-0107', // Cuyos, Ashley (20m)
    motherName: 'Chinugzel Cuyos',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2025-05-04',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Fully Immunized Child (FIC)'
  },
  {
    id: 'IMM-2026-0108',
    patientId: 'PAT-2026-0108', // Ediang, Ashley Kate (23m)
    motherName: 'Salma Ediang',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2025-02-16',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Routine immunization series completed'
  },
  {
    id: 'IMM-2026-0109',
    patientId: 'PAT-2026-0109', // Teraic, Kayla Mae (35m)
    motherName: 'Jorin Teraic',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2025-02-20',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Fully protected against Measles & Rubella'
  },
  {
    id: 'IMM-2026-0110',
    patientId: 'PAT-2026-0110', // Carbaquil, Ahira Jean (28m)
    motherName: 'Janna Carbaquil',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-10-19',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Complete childhood vaccination recorded'
  },
  {
    id: 'IMM-2026-0111',
    patientId: 'PAT-2026-0111', // Taratura, Alicia (36m)
    motherName: 'Angelie Ann Taratura',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-01-08',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'FIC status active'
  },
  {
    id: 'IMM-2026-0112',
    patientId: 'PAT-2026-0112', // Alabes, Danjo (36m)
    motherName: 'Mary Joy Alabes',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-01-01',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Complete series'
  },
  {
    id: 'IMM-2026-0113',
    patientId: 'PAT-2026-0113', // Gumpatan, Jean (35m)
    motherName: 'Fe Gumpatan',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-04-10',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Immunization card updated'
  },
  {
    id: 'IMM-2026-0114',
    patientId: 'PAT-2026-0114', // Wasanne, Rhevian Jerson (35m)
    motherName: 'Reque Wasanne',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-02-21',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0115',
    patientId: 'PAT-2026-0115', // Ediang, Grayon James (45m)
    motherName: 'Glezymae Ediang',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2023-04-22',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Fully Immunized Child'
  },
  {
    id: 'IMM-2026-0116',
    patientId: 'PAT-2026-0116', // Takakura, Armando Jr. (51m)
    motherName: 'Ruby Takakura',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2022-10-22',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'All 7 mandatory EPI vaccines completed'
  },
  {
    id: 'IMM-2026-0117',
    patientId: 'PAT-2026-0117', // Niriel, Mary Flor (52m)
    motherName: 'Flordedes Niriel',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2022-09-04',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0118',
    patientId: 'PAT-2026-0118', // Yairong, Jeremie (55m)
    motherName: 'Myrna Yairong',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2022-10-05',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0119',
    patientId: 'PAT-2026-0119', // Morales, Ronnel Anthony (57m)
    motherName: 'Baby Jean Morales',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2022-04-05',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0120',
    patientId: 'PAT-2026-0120', // Yaot, Jebark (58m)
    motherName: 'Roselyn Yaot',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2022-03-24',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0121',
    patientId: 'PAT-2026-0121', // Erolon, Kodyzan Pearl (40m)
    motherName: 'Eric Erolon',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2023-08-30',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0122',
    patientId: 'PAT-2026-0122', // Cagas, Marbert (28m)
    motherName: 'Mariel Cagas',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-09-12',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0123',
    patientId: 'PAT-2026-0123', // Mangubat, Jennifer (48m)
    motherName: 'Jenny Mangubat',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2022-04-14',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0124',
    patientId: 'PAT-2026-0124', // Mangubat, Jino (28m)
    motherName: 'Jenny Mangubat',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2024-09-17',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0125',
    patientId: 'PAT-2026-0125', // Genebraldo, Ferry Jean (15m)
    motherName: 'Jecsa Genebraldo',
    vaccineName: 'MCV 1 (Measles)',
    doseNumber: 1,
    dateGiven: '2025-07-21',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Measles 1st dose given'
  },
  {
    id: 'IMM-2026-0126',
    patientId: 'PAT-2026-0126', // Kinagodes, Rheamay (13m)
    motherName: 'Clarissa Kinagodes',
    vaccineName: 'MCV 1 (Measles)',
    doseNumber: 1,
    dateGiven: '2025-08-25',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'Measles 1st dose given'
  },
  {
    id: 'IMM-2026-0127',
    patientId: 'PAT-2026-0127', // Portillano, Zyler (14m)
    motherName: 'Heart Portillano',
    vaccineName: 'MCV 1 (Measles)',
    doseNumber: 1,
    dateGiven: '2025-08-04',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Measles 1st dose given'
  },
  {
    id: 'IMM-2026-0128',
    patientId: 'PAT-2026-0128', // Luabas, Carlo (42m)
    motherName: 'Jenny Luabas',
    vaccineName: 'MCV 2 (MMR)',
    doseNumber: 2,
    dateGiven: '2023-07-08',
    givenBy: 'Arlene Cagas Dayama, RM',
    remarks: 'FIC certified'
  },
  {
    id: 'IMM-2026-0129',
    patientId: 'PAT-2026-0129', // Rato, Kyle Jean (16m)
    motherName: 'Shyralyn Rato',
    vaccineName: 'PCV 3',
    doseNumber: 3,
    dateGiven: '2025-06-09',
    givenBy: 'Yvonne Galang, RN',
    remarks: 'Pneumococcal series completed'
  }
];

export const MOCK_FAMILYPLANNING: FamilyPlanningRecord[] = [
  // ==========================================
  // 5 ACTIVE FAMILY PLANNING FEMALE ACCEPTORS (WRA) FROM HOUSEHOLD LIST
  // ==========================================
  {
    id: 'FP-2026-001',
    patientId: 'PAT-2026-0015', // Bacus, Jolibee (HH 015, Purok 2, Female, 35yo)
    spouseName: 'Bacus, Ronald Torres',
    numberOfLivingChildren: 2,
    desiredFamilySize: 2,
    methodAccepted: 'IUD',
    methodType: 'Current User',
    sideEffectsExpressed: 'None',
    remarks: 'TCu 380A IUD in place. Strings checked and normal. Annual pelvic inspection completed.',
    nextServiceDate: '2026-11-20'
  },
  {
    id: 'FP-2026-002',
    patientId: 'PAT-2026-0031', // Dag-uman, Warlita (HH 031, Purok 4, Female, 37yo)
    spouseName: 'Dag-uman, Mario Perez',
    numberOfLivingChildren: 2,
    desiredFamilySize: 2,
    methodAccepted: 'DMPA Injectable',
    methodType: 'Current User',
    sideEffectsExpressed: 'Amenorrhea (counseled as normal response to progesterone)',
    remarks: 'Quarterly Depo-Provera (DMPA 150mg/mL) intramuscular injection administered.',
    nextServiceDate: '2026-08-25'
  },
  {
    id: 'FP-2026-003',
    patientId: 'PAT-2026-0034', // Pableo, Rowena (HH 034, Purok 5, Female, 31yo)
    spouseName: 'Pableo, Wine Torres',
    numberOfLivingChildren: 1,
    desiredFamilySize: 2,
    methodAccepted: 'Oral Contraceptives',
    methodType: 'Current User',
    sideEffectsExpressed: 'None reported',
    remarks: 'Combination low-dose oral contraceptive pills (3 cycles provided). High compliance.',
    nextServiceDate: '2026-08-20'
  },
  {
    id: 'FP-2026-004',
    patientId: 'PAT-2026-0038', // Peris, May (HH 038, Purok 5, Female, 34yo)
    spouseName: 'Peris, Daniel Cruz',
    numberOfLivingChildren: 2,
    desiredFamilySize: 2,
    methodAccepted: 'Subdermal Implant',
    methodType: 'Current User',
    sideEffectsExpressed: 'None',
    remarks: 'Implanon NXT subdermal implant (valid for 3 years until 2028). Insertion site healthy.',
    nextServiceDate: '2027-01-15'
  },
  {
    id: 'FP-2026-005',
    patientId: 'PAT-2026-0043', // Salcedo, Edita (HH 043, Purok 6, Female, 32yo)
    spouseName: 'Salcedo, Dimetreo Santos',
    numberOfLivingChildren: 2,
    desiredFamilySize: 2,
    methodAccepted: 'DMPA Injectable',
    methodType: 'Current User',
    sideEffectsExpressed: 'None',
    remarks: 'Depo-Provera quarterly dose administered smoothly by BHC midwife.',
    nextServiceDate: '2026-09-10'
  }
];
