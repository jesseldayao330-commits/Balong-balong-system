/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'BHW' | 'MIDWIFE' | 'NURSE' | 'PHARMACIST' | 'MHO' | 'ADMIN';

export type Language = 'EN' | 'TL' | 'BY'; // English, Tagalog, Bisaya

export type Purok = 'Purok 1' | 'Purok 2' | 'Purok 3' | 'Purok 4' | 'Purok 5' | 'Purok 6' | 'Purok 7';

export interface Household {
  id: string; // e.g., HH-2026-001
  householdHead: string;
  purok: Purok;
  numberOfMembers: number;
  waterSource: 'Level I (Point Source)'| 'Level II (Communal Faucet)' | 'Level III (Waterworks System)' | 'Unsanitary/Unprotected';
  sanitaryToilet: boolean; // DOH environmental hygiene metric
  solidWasteManagement: 'Segregated' | 'Disposed/Burned' | 'Open Dumping';
  indigentStatus: boolean; // Eligible for Malasakit/Indigent aid
}

export interface Patient {
  id: string; // e.g., PAT-2026-0001
  householdId: string; // Linked to Household Census
  lastName: string;
  firstName: string;
  middleName: string;
  suffix?: string;
  birthDate: string;
  gender: 'Male' | 'Female';
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated';
  purok: Purok;
  phoneNumber: string;
  philHealthId?: string;
  philHealthCategory?: 'Direct Contributor' | 'Indirect (Indigent)' | 'Senior Citizen' | 'Sponsored' | 'Not Enrolled';
  isIndigent: boolean;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies?: string;
  activePrograms: DOHProgram[];
  createdAt: string;
  photo?: string; // Base64 image data-URI or reference
}

export type DOHProgram = 
  | 'EPI' // Expanded Program on Immunization
  | 'MCH' // Maternal & Child Health (Prenatal/Postnatal)
  | 'TB_DOTS' // Tuberculosis DOTS
  | 'OPT_PLUS' // Operation Timbang Plus (Nutrition)
  | 'SENIOR_CITIZEN' // Senior Citizen Program
  | 'DISEASE_SURVEILLANCE' // Dengue/NCD Monitoring
  | 'FAMILY_PLANNING'; // Family Planning

export interface VitalSigns {
  id: string;
  patientId: string;
  date: string;
  systolic: number; // mmHg
  diastolic: number; // mmHg
  temperature: number; // °C
  heartRate: number; // bpm
  respiratoryRate: number; // breaths/min
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bloodSugar?: number; // mg/dL (optional check for seniors/ncd)
  loggedBy: string; // Worker's name
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessmentDiagnoses: string[]; // ICD-10 aligned
  isTBPossible: boolean; // TB screening trigger
  isDenguePossible: boolean; // Dengue screening trigger
  planTreatment: string;
  referredToHospital: boolean;
  mhoValidated: boolean; // MHO review status
  attendingStaff: string; // Name and Role
}

export interface MedicineDispensed {
  id: string;
  date: string;
  patientId: string;
  medicineName: string;
  quantityDispensed: number;
  instructions: string;
  pharmacistDispenser: string;
}

export interface MedicineInventory {
  id: string;
  medicineName: string;
  genericName: string;
  stockInUnit: string; // e.g., 'tablets', 'bottles', 'vials'
  currentStock: number;
  reorderLevel: number;
  expiryDate: string;
  category: 'Antibiotics' | 'Hypertension' | 'Diabetes' | 'Analgesics' | 'Vitamins' | 'EPI Vaccines' | 'Contraceptives' | 'TB Drugs';
}

export interface PrenatalRecord {
  id: string;
  patientId: string;
  lmp: string; // Last Menstrual Period
  edc: string; // Expected Date of Confinement
  gravida: number; // Number of pregnancies
  para: number; // Number of viable births
  abortion?: number;
  stillBirth?: number;
  gestationalAgeWeeks: number;
  fundalHeightCm?: number;
  fetalHeartToneBpm?: number;
  tetanusToxoidStatus: string; // TT1 to TT5
  ironFolicAcidGiven: boolean;
  bloodPressure: string;
  riskClassification: 'Low Risk' | 'Medium Risk' | 'High Risk'; // Green, Yellow, Red Alerts
  remarks: string;
  nextPrenatalVisit: string;
}

export interface ImmunizationRecord {
  id: string;
  patientId: string; // Must be child (< 5 years old)
  motherName: string;
  vaccineName: 'BCG' | 'HepB' | 'Pentavalent 1' | 'Pentavalent 2' | 'Pentavalent 3' | 'OPV 1' | 'OPV 2' | 'OPV 3' | 'PCV 1' | 'PCV 2' | 'PCV 3' | 'IPV' | 'MCV 1 (Measles)' | 'MCV 2 (MMR)';
  doseNumber: number;
  dateGiven: string;
  givenBy: string;
  remarks: string;
}

export interface FamilyPlanningRecord {
  id: string;
  patientId: string; // Married or active reproductive age
  spouseName?: string;
  numberOfLivingChildren: number;
  desiredFamilySize: number;
  methodAccepted: 'Oral Contraceptives' | 'Condoms' | 'IUD' | 'DMPA Injectable' | 'Subdermal Implant' | 'Natural FP (BBT/Billings)';
  methodType: 'New Acceptor' | 'Current User' | 'Dropout Reactivated';
  sideEffectsExpressed?: string;
  remarks: string;
  nextServiceDate: string;
}

export interface Referral {
  id: string;
  patientId: string;
  date: string;
  referringFacility: string; // Name of BHC (e.g., Bagong Silang BHC)
  referredToFacility: string; // Hospital name (e.g., Municipal Health Office, Mayor Hospital)
  reasonForReferral: string;
  clinicalSummary: string; // Brief signs, vitals at referral
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  transportArranged: 'Ambulance' | 'Tricycle' | 'Private/LGU Vehicle' | 'None';
  status: 'Pending' | 'Accepted' | 'Completed';
  bhwMidwifeInCharge: string;
}

export interface HealthCertificate {
  id: string;
  patientId: string;
  dateIssued: string;
  certificateType: 'Medical Fit to Work' | 'Barangay Health Clearance' | 'Indigency Medical Voucher' | 'Student Medical Certificate';
  purpose: string;
  findings: string;
  remarks: string;
  signatoryName: string;
  signatoryTitle: string; // e.g., "Barangay Midwife" or "Municipal Health Officer"
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  role: Role;
  user: string;
  action: string;
  details: string;
}

export interface DailyLogEntry {
  id: string;
  timestamp: string;
  patientId: string;
  patientName: string;
  purpose: 'Checkup' | 'Vaccination' | 'Prenatal' | 'Family Planning' | 'Medicine Pickup' | 'Certificate Request' | 'Referral';
  status: 'Waiting' | 'In Progress' | 'Completed' | 'Referred';
  purok: Purok;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time?: string;
  appointmentType: 'Checkup' | 'Vaccination' | 'Prenatal' | 'Family Planning' | 'Dental' | 'Sputum Test' | 'Hypertension Follow-up';
  notes?: string;
  purok: Purok;
  status: 'Scheduled' | 'Completed' | 'No Show' | 'Cancelled';
  assignedStaff: string;
  reminderSent: boolean;
  reminderChannel: 'SMS' | 'BHW Visit' | 'None';
  reminderDate?: string;
}

