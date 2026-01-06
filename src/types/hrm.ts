// Employee Types
export interface Employee {
  id: string;
  employeeId: string;
  // Personal Information
  fullName: string;
  fatherSpouseName: string;
  cnicPassport: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  nationality: string;
  bloodGroup: string;
  photograph?: string;
  contactNumber: string;
  personalEmail: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;
  // Employment Details
  company: string;
  department: string;
  designation: string;
  jobGrade: string;
  employmentType: 'permanent' | 'contract' | 'intern' | 'daily_wages';
  dateOfJoining: string;
  confirmationDate?: string;
  workLocation: string;
  shiftAssignment: string;
  reportingManager: string;
  hrManager: string;
  employmentStatus: 'active' | 'on_leave' | 'suspended' | 'terminated';
  // Official Details
  companyEmail: string;
  employeeCode: string;
  accessRole: string;
  biometricId?: string;
  attendanceDeviceId?: string;
  officeExtension?: string;
  vehicleAssigned: boolean;
  // Bank & Payroll
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  salaryType: 'monthly' | 'daily' | 'hourly';
  basicSalary: number;
  houseAllowance: number;
  medicalAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  taxDeduction: number;
  eobiDeduction: number;
  providentFund: number;
  loanDeduction: number;
  payrollGroup: string;
  // Documents
  documents: EmployeeDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDocument {
  id: string;
  type: 'cnic' | 'appointment_letter' | 'contract' | 'education' | 'experience' | 'nda' | 'medical';
  name: string;
  url: string;
  uploadedAt: string;
}


// Recruitment Types
export interface JobRequisition {
  id: string;
  requisitionId: string;
  department: string;
  jobTitle: string;
  numberOfPositions: number;
  jobType: 'full_time' | 'part_time' | 'contract' | 'intern';
  requiredExperience: string;
  qualification: string;
  salaryRangeMin: number;
  salaryRangeMax: number;
  hiringManager: string;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  status: 'draft' | 'approved' | 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  candidateId: string;
  fullName: string;
  contactNumber: string;
  email: string;
  cnic: string;
  address: string;
  education: string;
  experience: string;
  appliedPosition: string;
  source: 'linkedin' | 'referral' | 'website' | 'agency' | 'other';
  cvUrl?: string;
  pipelineStatus: 'application_received' | 'shortlisted' | 'interview_scheduled' | 'interview_completed' | 'offer_issued' | 'offer_accepted' | 'offer_rejected' | 'joined';
  interviewFeedback?: string;
  joiningDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Onboarding {
  id: string;
  employeeId: string;
  employeeName: string;
  offerLetterUrl?: string;
  documentsVerified: boolean;
  bankDetailsCollected: boolean;
  systemAccessCreated: boolean;
  attendanceSetup: boolean;
  idCardIssued: boolean;
  probationPeriod: number;
  orientationSchedule?: string;
  trainingAssignment?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// Attendance Types
export interface Shift {
  id: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  gracePeriod: number;
  overtimeRules: string;
  weeklyOff: string[];
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalWorkingHours: number;
  lateArrival: number;
  earlyDeparture: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'half_day' | 'on_leave' | 'holiday';
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'company' | 'optional';
}


// Leave Types
export interface LeaveType {
  id: string;
  name: string;
  code: string;
  daysAllowed: number;
  carryForward: boolean;
  isActive: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveType: string;
  totalEntitled: number;
  availed: number;
  remaining: number;
}

// Payroll Types
export interface PayrollGroup {
  id: string;
  name: string;
  description: string;
  salaryComponents: SalaryComponent[];
  deductionRules: DeductionRule[];
  isActive: boolean;
}

export interface SalaryComponent {
  id: string;
  name: string;
  type: 'basic' | 'allowance' | 'bonus' | 'overtime';
  calculationType: 'fixed' | 'percentage';
  value: number;
}

export interface DeductionRule {
  id: string;
  name: string;
  type: 'tax' | 'loan' | 'advance' | 'absentee' | 'statutory';
  calculationType: 'fixed' | 'percentage';
  value: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payrollMonth: string;
  payableDays: number;
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'approved' | 'paid';
  createdAt: string;
  updatedAt: string;
}

// Performance Types
export interface PerformanceCycle {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  evaluationType: 'monthly' | 'quarterly' | 'annual';
  kpiWeightage: number;
  ratingScale: number;
  status: 'draft' | 'active' | 'completed';
}

export interface KPIAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  cycleId: string;
  kpiCategory: string;
  kpiDescription: string;
  targetValue: number;
  weight: number;
  evaluationMethod: string;
  actualValue?: number;
  score?: number;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  cycleId: string;
  selfEvaluation?: string;
  selfScore?: number;
  managerEvaluation?: string;
  managerScore?: number;
  hrReview?: string;
  finalScore?: number;
  performanceRating: 'exceptional' | 'exceeds' | 'meets' | 'needs_improvement' | 'unsatisfactory';
  remarks?: string;
  promotionRecommendation: boolean;
  incrementRecommendation: boolean;
  status: 'pending' | 'self_review' | 'manager_review' | 'hr_review' | 'completed';
}


// Training Types
export interface Training {
  id: string;
  title: string;
  type: 'internal' | 'external';
  trainer: string;
  duration: string;
  isMandatory: boolean;
  complianceCategory: 'gmp' | 'sop' | 'safety' | 'general';
  description?: string;
  isActive: boolean;
}

export interface TrainingAssignment {
  id: string;
  trainingId: string;
  trainingTitle: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  scheduledDate: string;
  completionDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  certificationUrl?: string;
}

export interface ComplianceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  complianceType: string;
  validityStart: string;
  validityEnd: string;
  reminderDays: number;
  status: 'valid' | 'expiring_soon' | 'expired';
  documentUrl?: string;
}

// Common Types
export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  isActive: boolean;
}

export interface Designation {
  id: string;
  name: string;
  departmentId: string;
  grade: string;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  module: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  recordId: string;
  userId: string;
  userName: string;
  changes: string;
  timestamp: string;
}
