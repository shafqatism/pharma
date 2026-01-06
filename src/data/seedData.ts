import type {
  Employee, JobRequisition, Candidate, Onboarding, Shift, AttendanceRecord,
  Holiday, LeaveRequest, PayrollGroup, PayrollRecord, PerformanceCycle,
  KPIAssignment, PerformanceReview, Training, TrainingAssignment, ComplianceRecord
} from '@/types/hrm';

// Seed Employees
export const seedEmployees: Employee[] = [
  {
    id: '1', employeeId: 'EMP-001', fullName: 'Ahmed Khan', fatherSpouseName: 'Muhammad Khan',
    cnicPassport: '35201-1234567-1', gender: 'male', dateOfBirth: '1990-05-15', maritalStatus: 'married',
    nationality: 'Pakistani', bloodGroup: 'A+', contactNumber: '0300-1234567', personalEmail: 'ahmed.khan@gmail.com',
    currentAddress: 'House 123, Street 5, Lahore', permanentAddress: 'House 123, Street 5, Lahore',
    emergencyContactName: 'Fatima Khan', emergencyContactRelation: 'Wife', emergencyContactNumber: '0301-7654321',
    company: 'Pharma Corp', department: 'Production', designation: 'Manager', jobGrade: 'M1',
    employmentType: 'permanent', dateOfJoining: '2020-01-15', confirmationDate: '2020-04-15',
    workLocation: 'Lahore Plant', shiftAssignment: 'morning', reportingManager: 'Ali Hassan',
    hrManager: 'Sara Ahmed', employmentStatus: 'active', companyEmail: 'ahmed.khan@pharmacorp.com',
    employeeCode: 'PC001', accessRole: 'manager', biometricId: 'BIO001', attendanceDeviceId: 'ATT001',
    officeExtension: '101', vehicleAssigned: true, bankName: 'HBL', accountTitle: 'Ahmed Khan',
    accountNumber: 'PK36HABB0000111222333444', salaryType: 'monthly', basicSalary: 150000,
    houseAllowance: 30000, medicalAllowance: 15000, transportAllowance: 10000, otherAllowance: 5000,
    taxDeduction: 15000, eobiDeduction: 500, providentFund: 7500, loanDeduction: 0, payrollGroup: 'Management',
    documents: [], createdAt: '2020-01-15', updatedAt: '2024-01-01'
  },
  {
    id: '2', employeeId: 'EMP-002', fullName: 'Sara Ahmed', fatherSpouseName: 'Imran Ahmed',
    cnicPassport: '35201-2345678-2', gender: 'female', dateOfBirth: '1992-08-20', maritalStatus: 'single',
    nationality: 'Pakistani', bloodGroup: 'B+', contactNumber: '0321-2345678', personalEmail: 'sara.ahmed@gmail.com',
    currentAddress: 'Flat 45, Block C, Karachi', permanentAddress: 'Flat 45, Block C, Karachi',
    emergencyContactName: 'Imran Ahmed', emergencyContactRelation: 'Father', emergencyContactNumber: '0322-8765432',
    company: 'Pharma Corp', department: 'Human Resources', designation: 'Manager', jobGrade: 'M1',
    employmentType: 'permanent', dateOfJoining: '2019-06-01', confirmationDate: '2019-09-01',
    workLocation: 'Head Office', shiftAssignment: 'general', reportingManager: 'CEO',
    hrManager: 'Self', employmentStatus: 'active', companyEmail: 'sara.ahmed@pharmacorp.com',
    employeeCode: 'PC002', accessRole: 'hr', biometricId: 'BIO002', attendanceDeviceId: 'ATT002',
    officeExtension: '102', vehicleAssigned: true, bankName: 'MCB', accountTitle: 'Sara Ahmed',
    accountNumber: 'PK36MCB00000222333444555', salaryType: 'monthly', basicSalary: 140000,
    houseAllowance: 28000, medicalAllowance: 14000, transportAllowance: 10000, otherAllowance: 5000,
    taxDeduction: 12000, eobiDeduction: 500, providentFund: 7000, loanDeduction: 0, payrollGroup: 'Management',
    documents: [], createdAt: '2019-06-01', updatedAt: '2024-01-01'
  },
  {
    id: '3', employeeId: 'EMP-003', fullName: 'Usman Ali', fatherSpouseName: 'Tariq Ali',
    cnicPassport: '35201-3456789-3', gender: 'male', dateOfBirth: '1995-03-10', maritalStatus: 'single',
    nationality: 'Pakistani', bloodGroup: 'O+', contactNumber: '0333-3456789', personalEmail: 'usman.ali@gmail.com',
    currentAddress: 'House 78, DHA Phase 5, Lahore', permanentAddress: 'House 78, DHA Phase 5, Lahore',
    emergencyContactName: 'Tariq Ali', emergencyContactRelation: 'Father', emergencyContactNumber: '0334-9876543',
    company: 'Pharma Corp', department: 'Quality Assurance', designation: 'Senior Executive', jobGrade: 'E2',
    employmentType: 'permanent', dateOfJoining: '2021-03-01', confirmationDate: '2021-06-01',
    workLocation: 'Lahore Plant', shiftAssignment: 'morning', reportingManager: 'Ahmed Khan',
    hrManager: 'Sara Ahmed', employmentStatus: 'active', companyEmail: 'usman.ali@pharmacorp.com',
    employeeCode: 'PC003', accessRole: 'employee', biometricId: 'BIO003', attendanceDeviceId: 'ATT003',
    officeExtension: '103', vehicleAssigned: false, bankName: 'UBL', accountTitle: 'Usman Ali',
    accountNumber: 'PK36UBL00000333444555666', salaryType: 'monthly', basicSalary: 80000,
    houseAllowance: 16000, medicalAllowance: 8000, transportAllowance: 6000, otherAllowance: 2000,
    taxDeduction: 5000, eobiDeduction: 500, providentFund: 4000, loanDeduction: 0, payrollGroup: 'Staff',
    documents: [], createdAt: '2021-03-01', updatedAt: '2024-01-01'
  },
  {
    id: '4', employeeId: 'EMP-004', fullName: 'Ayesha Malik', fatherSpouseName: 'Rashid Malik',
    cnicPassport: '35201-4567890-4', gender: 'female', dateOfBirth: '1993-11-25', maritalStatus: 'married',
    nationality: 'Pakistani', bloodGroup: 'AB+', contactNumber: '0345-4567890', personalEmail: 'ayesha.malik@gmail.com',
    currentAddress: 'House 56, Gulberg III, Lahore', permanentAddress: 'House 56, Gulberg III, Lahore',
    emergencyContactName: 'Rashid Malik', emergencyContactRelation: 'Husband', emergencyContactNumber: '0346-0987654',
    company: 'Pharma Corp', department: 'Finance', designation: 'Executive', jobGrade: 'E1',
    employmentType: 'permanent', dateOfJoining: '2022-01-10', confirmationDate: '2022-04-10',
    workLocation: 'Head Office', shiftAssignment: 'general', reportingManager: 'Finance Manager',
    hrManager: 'Sara Ahmed', employmentStatus: 'active', companyEmail: 'ayesha.malik@pharmacorp.com',
    employeeCode: 'PC004', accessRole: 'finance', biometricId: 'BIO004', attendanceDeviceId: 'ATT004',
    officeExtension: '104', vehicleAssigned: false, bankName: 'ABL', accountTitle: 'Ayesha Malik',
    accountNumber: 'PK36ABL00000444555666777', salaryType: 'monthly', basicSalary: 65000,
    houseAllowance: 13000, medicalAllowance: 6500, transportAllowance: 5000, otherAllowance: 2000,
    taxDeduction: 3000, eobiDeduction: 500, providentFund: 3250, loanDeduction: 5000, payrollGroup: 'Staff',
    documents: [], createdAt: '2022-01-10', updatedAt: '2024-01-01'
  },
  {
    id: '5', employeeId: 'EMP-005', fullName: 'Hassan Raza', fatherSpouseName: 'Akbar Raza',
    cnicPassport: '35201-5678901-5', gender: 'male', dateOfBirth: '1988-07-08', maritalStatus: 'married',
    nationality: 'Pakistani', bloodGroup: 'B-', contactNumber: '0312-5678901', personalEmail: 'hassan.raza@gmail.com',
    currentAddress: 'House 90, Model Town, Lahore', permanentAddress: 'House 90, Model Town, Lahore',
    emergencyContactName: 'Sana Raza', emergencyContactRelation: 'Wife', emergencyContactNumber: '0313-1098765',
    company: 'Pharma Corp', department: 'Sales & Marketing', designation: 'Manager', jobGrade: 'M1',
    employmentType: 'permanent', dateOfJoining: '2018-09-15', confirmationDate: '2018-12-15',
    workLocation: 'Head Office', shiftAssignment: 'general', reportingManager: 'Director Sales',
    hrManager: 'Sara Ahmed', employmentStatus: 'active', companyEmail: 'hassan.raza@pharmacorp.com',
    employeeCode: 'PC005', accessRole: 'manager', biometricId: 'BIO005', attendanceDeviceId: 'ATT005',
    officeExtension: '105', vehicleAssigned: true, bankName: 'Faysal Bank', accountTitle: 'Hassan Raza',
    accountNumber: 'PK36FAYS0000555666777888', salaryType: 'monthly', basicSalary: 160000,
    houseAllowance: 32000, medicalAllowance: 16000, transportAllowance: 12000, otherAllowance: 8000,
    taxDeduction: 18000, eobiDeduction: 500, providentFund: 8000, loanDeduction: 0, payrollGroup: 'Management',
    documents: [], createdAt: '2018-09-15', updatedAt: '2024-01-01'
  },
  {
    id: '6', employeeId: 'EMP-006', fullName: 'Zainab Hussain', fatherSpouseName: 'Hussain Shah',
    cnicPassport: '35201-6789012-6', gender: 'female', dateOfBirth: '1997-02-14', maritalStatus: 'single',
    nationality: 'Pakistani', bloodGroup: 'A-', contactNumber: '0300-6789012', personalEmail: 'zainab.hussain@gmail.com',
    currentAddress: 'Flat 12, Clifton, Karachi', permanentAddress: 'Flat 12, Clifton, Karachi',
    emergencyContactName: 'Hussain Shah', emergencyContactRelation: 'Father', emergencyContactNumber: '0301-2109876',
    company: 'Pharma Corp', department: 'IT', designation: 'Executive', jobGrade: 'E1',
    employmentType: 'contract', dateOfJoining: '2023-06-01',
    workLocation: 'Head Office', shiftAssignment: 'general', reportingManager: 'IT Manager',
    hrManager: 'Sara Ahmed', employmentStatus: 'active', companyEmail: 'zainab.hussain@pharmacorp.com',
    employeeCode: 'PC006', accessRole: 'employee', biometricId: 'BIO006', attendanceDeviceId: 'ATT006',
    officeExtension: '106', vehicleAssigned: false, bankName: 'Standard Chartered', accountTitle: 'Zainab Hussain',
    accountNumber: 'PK36SCBL0000666777888999', salaryType: 'monthly', basicSalary: 55000,
    houseAllowance: 11000, medicalAllowance: 5500, transportAllowance: 4000, otherAllowance: 1500,
    taxDeduction: 2000, eobiDeduction: 500, providentFund: 2750, loanDeduction: 0, payrollGroup: 'Staff',
    documents: [], createdAt: '2023-06-01', updatedAt: '2024-01-01'
  },
  {
    id: '7', employeeId: 'EMP-007', fullName: 'Bilal Ahmad', fatherSpouseName: 'Nasir Ahmad',
    cnicPassport: '35201-7890123-7', gender: 'male', dateOfBirth: '1994-09-30', maritalStatus: 'married',
    nationality: 'Pakistani', bloodGroup: 'O-', contactNumber: '0321-7890123', personalEmail: 'bilal.ahmad@gmail.com',
    currentAddress: 'House 34, Johar Town, Lahore', permanentAddress: 'House 34, Johar Town, Lahore',
    emergencyContactName: 'Amna Bilal', emergencyContactRelation: 'Wife', emergencyContactNumber: '0322-3210987',
    company: 'Pharma Corp', department: 'Warehouse', designation: 'Executive', jobGrade: 'E1',
    employmentType: 'permanent', dateOfJoining: '2020-08-01', confirmationDate: '2020-11-01',
    workLocation: 'Warehouse', shiftAssignment: 'morning', reportingManager: 'Warehouse Manager',
    hrManager: 'Sara Ahmed', employmentStatus: 'on_leave', companyEmail: 'bilal.ahmad@pharmacorp.com',
    employeeCode: 'PC007', accessRole: 'employee', biometricId: 'BIO007', attendanceDeviceId: 'ATT007',
    officeExtension: '107', vehicleAssigned: false, bankName: 'Bank Alfalah', accountTitle: 'Bilal Ahmad',
    accountNumber: 'PK36ALFH0000777888999000', salaryType: 'monthly', basicSalary: 50000,
    houseAllowance: 10000, medicalAllowance: 5000, transportAllowance: 4000, otherAllowance: 1000,
    taxDeduction: 1500, eobiDeduction: 500, providentFund: 2500, loanDeduction: 3000, payrollGroup: 'Staff',
    documents: [], createdAt: '2020-08-01', updatedAt: '2024-01-01'
  },
  {
    id: '8', employeeId: 'EMP-008', fullName: 'Fatima Zahra', fatherSpouseName: 'Ali Zahra',
    cnicPassport: '35201-8901234-8', gender: 'female', dateOfBirth: '1999-12-05', maritalStatus: 'single',
    nationality: 'Pakistani', bloodGroup: 'AB-', contactNumber: '0333-8901234', personalEmail: 'fatima.zahra@gmail.com',
    currentAddress: 'House 67, Bahria Town, Lahore', permanentAddress: 'House 67, Bahria Town, Lahore',
    emergencyContactName: 'Ali Zahra', emergencyContactRelation: 'Father', emergencyContactNumber: '0334-4321098',
    company: 'Pharma Corp', department: 'Production', designation: 'Trainee', jobGrade: 'T1',
    employmentType: 'intern', dateOfJoining: '2024-01-15',
    workLocation: 'Lahore Plant', shiftAssignment: 'morning', reportingManager: 'Ahmed Khan',
    hrManager: 'Sara Ahmed', employmentStatus: 'active', companyEmail: 'fatima.zahra@pharmacorp.com',
    employeeCode: 'PC008', accessRole: 'employee', biometricId: 'BIO008', attendanceDeviceId: 'ATT008',
    officeExtension: '108', vehicleAssigned: false, bankName: 'Meezan Bank', accountTitle: 'Fatima Zahra',
    accountNumber: 'PK36MEZN0000888999000111', salaryType: 'monthly', basicSalary: 35000,
    houseAllowance: 0, medicalAllowance: 0, transportAllowance: 3000, otherAllowance: 0,
    taxDeduction: 0, eobiDeduction: 0, providentFund: 0, loanDeduction: 0, payrollGroup: 'Intern',
    documents: [], createdAt: '2024-01-15', updatedAt: '2024-01-15'
  },
];


// Seed Job Requisitions
export const seedJobRequisitions: JobRequisition[] = [
  {
    id: '1', requisitionId: 'REQ-001', department: 'Production', jobTitle: 'Production Supervisor',
    numberOfPositions: 2, jobType: 'full_time', requiredExperience: '3-5 years',
    qualification: 'B.Sc in Chemistry or Pharmacy', salaryRangeMin: 80000, salaryRangeMax: 120000,
    hiringManager: 'Ahmed Khan', approvalStatus: 'approved', status: 'open',
    createdAt: '2024-01-01', updatedAt: '2024-01-05'
  },
  {
    id: '2', requisitionId: 'REQ-002', department: 'Quality Assurance', jobTitle: 'QA Analyst',
    numberOfPositions: 1, jobType: 'full_time', requiredExperience: '2-3 years',
    qualification: 'B.Sc in Chemistry', salaryRangeMin: 60000, salaryRangeMax: 80000,
    hiringManager: 'Usman Ali', approvalStatus: 'approved', status: 'open',
    createdAt: '2024-01-10', updatedAt: '2024-01-12'
  },
  {
    id: '3', requisitionId: 'REQ-003', department: 'Sales & Marketing', jobTitle: 'Sales Executive',
    numberOfPositions: 5, jobType: 'full_time', requiredExperience: '1-2 years',
    qualification: 'BBA/MBA Marketing', salaryRangeMin: 50000, salaryRangeMax: 70000,
    hiringManager: 'Hassan Raza', approvalStatus: 'pending', status: 'draft',
    createdAt: '2024-01-15', updatedAt: '2024-01-15'
  },
  {
    id: '4', requisitionId: 'REQ-004', department: 'IT', jobTitle: 'Software Developer',
    numberOfPositions: 2, jobType: 'full_time', requiredExperience: '2-4 years',
    qualification: 'BS Computer Science', salaryRangeMin: 100000, salaryRangeMax: 150000,
    hiringManager: 'IT Manager', approvalStatus: 'approved', status: 'closed',
    createdAt: '2023-11-01', updatedAt: '2024-01-01'
  },
];

// Seed Candidates
export const seedCandidates: Candidate[] = [
  {
    id: '1', candidateId: 'CAN-001', fullName: 'Kamran Shahid', contactNumber: '0300-1112233',
    email: 'kamran.shahid@gmail.com', cnic: '35201-1122334-5', address: 'Lahore',
    education: 'B.Sc Chemistry', experience: '4 years in pharmaceutical production',
    appliedPosition: 'Production Supervisor', source: 'linkedin',
    pipelineStatus: 'interview_scheduled', createdAt: '2024-01-05', updatedAt: '2024-01-10'
  },
  {
    id: '2', candidateId: 'CAN-002', fullName: 'Nadia Farooq', contactNumber: '0321-2223344',
    email: 'nadia.farooq@gmail.com', cnic: '35201-2233445-6', address: 'Karachi',
    education: 'B.Sc Chemistry', experience: '3 years in QA',
    appliedPosition: 'QA Analyst', source: 'referral',
    pipelineStatus: 'shortlisted', createdAt: '2024-01-12', updatedAt: '2024-01-14'
  },
  {
    id: '3', candidateId: 'CAN-003', fullName: 'Imran Siddiqui', contactNumber: '0333-3334455',
    email: 'imran.siddiqui@gmail.com', cnic: '35201-3344556-7', address: 'Islamabad',
    education: 'MBA Marketing', experience: '2 years in sales',
    appliedPosition: 'Sales Executive', source: 'website',
    pipelineStatus: 'application_received', createdAt: '2024-01-16', updatedAt: '2024-01-16'
  },
  {
    id: '4', candidateId: 'CAN-004', fullName: 'Sana Tariq', contactNumber: '0345-4445566',
    email: 'sana.tariq@gmail.com', cnic: '35201-4455667-8', address: 'Lahore',
    education: 'BS Computer Science', experience: '3 years in software development',
    appliedPosition: 'Software Developer', source: 'linkedin',
    pipelineStatus: 'offer_accepted', joiningDate: '2024-02-01',
    createdAt: '2023-11-15', updatedAt: '2024-01-20'
  },
  {
    id: '5', candidateId: 'CAN-005', fullName: 'Faisal Mehmood', contactNumber: '0312-5556677',
    email: 'faisal.mehmood@gmail.com', cnic: '35201-5566778-9', address: 'Faisalabad',
    education: 'B.Sc Chemistry', experience: '5 years in production',
    appliedPosition: 'Production Supervisor', source: 'agency',
    pipelineStatus: 'interview_completed', interviewFeedback: 'Strong technical skills, good communication',
    createdAt: '2024-01-08', updatedAt: '2024-01-15'
  },
];

// Seed Onboarding
export const seedOnboardings: Onboarding[] = [
  {
    id: '1', employeeId: '8', employeeName: 'Fatima Zahra',
    documentsVerified: true, bankDetailsCollected: true, systemAccessCreated: true,
    attendanceSetup: true, idCardIssued: false, probationPeriod: 90,
    orientationSchedule: '2024-01-16', trainingAssignment: 'GMP Basic Training',
    status: 'in_progress', createdAt: '2024-01-15', updatedAt: '2024-01-18'
  },
  {
    id: '2', employeeId: '6', employeeName: 'Zainab Hussain',
    documentsVerified: true, bankDetailsCollected: true, systemAccessCreated: true,
    attendanceSetup: true, idCardIssued: true, probationPeriod: 90,
    orientationSchedule: '2023-06-02', trainingAssignment: 'IT Security Training',
    status: 'completed', createdAt: '2023-06-01', updatedAt: '2023-09-01'
  },
];


// Seed Shifts
export const seedShifts: Shift[] = [
  { id: '1', shiftName: 'Morning Shift', startTime: '08:00', endTime: '17:00', gracePeriod: 15, overtimeRules: 'After 9 hours', weeklyOff: ['Sunday'], isActive: true },
  { id: '2', shiftName: 'Evening Shift', startTime: '14:00', endTime: '23:00', gracePeriod: 15, overtimeRules: 'After 9 hours', weeklyOff: ['Sunday'], isActive: true },
  { id: '3', shiftName: 'Night Shift', startTime: '22:00', endTime: '07:00', gracePeriod: 15, overtimeRules: 'After 9 hours', weeklyOff: ['Sunday'], isActive: true },
  { id: '4', shiftName: 'General Shift', startTime: '09:00', endTime: '18:00', gracePeriod: 30, overtimeRules: 'After 9 hours', weeklyOff: ['Saturday', 'Sunday'], isActive: true },
];

// Seed Attendance Records
export const seedAttendanceRecords: AttendanceRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Ahmed Khan', date: '2024-01-22', checkInTime: '08:05', checkOutTime: '17:30', totalWorkingHours: 9.5, lateArrival: 5, earlyDeparture: 0, overtimeHours: 0.5, status: 'present' },
  { id: '2', employeeId: '2', employeeName: 'Sara Ahmed', date: '2024-01-22', checkInTime: '09:00', checkOutTime: '18:00', totalWorkingHours: 9, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
  { id: '3', employeeId: '3', employeeName: 'Usman Ali', date: '2024-01-22', checkInTime: '08:00', checkOutTime: '17:00', totalWorkingHours: 9, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
  { id: '4', employeeId: '4', employeeName: 'Ayesha Malik', date: '2024-01-22', checkInTime: '09:15', checkOutTime: '18:00', totalWorkingHours: 8.75, lateArrival: 15, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
  { id: '5', employeeId: '5', employeeName: 'Hassan Raza', date: '2024-01-22', checkInTime: '09:00', checkOutTime: '19:00', totalWorkingHours: 10, lateArrival: 0, earlyDeparture: 0, overtimeHours: 1, status: 'present' },
  { id: '6', employeeId: '6', employeeName: 'Zainab Hussain', date: '2024-01-22', checkInTime: '09:00', checkOutTime: '18:00', totalWorkingHours: 9, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
  { id: '7', employeeId: '7', employeeName: 'Bilal Ahmad', date: '2024-01-22', status: 'on_leave', totalWorkingHours: 0, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0 },
  { id: '8', employeeId: '8', employeeName: 'Fatima Zahra', date: '2024-01-22', checkInTime: '08:00', checkOutTime: '17:00', totalWorkingHours: 9, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
  { id: '9', employeeId: '1', employeeName: 'Ahmed Khan', date: '2024-01-21', checkInTime: '08:00', checkOutTime: '17:00', totalWorkingHours: 9, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
  { id: '10', employeeId: '2', employeeName: 'Sara Ahmed', date: '2024-01-21', checkInTime: '09:00', checkOutTime: '18:00', totalWorkingHours: 9, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0, status: 'present' },
];

// Seed Holidays
export const seedHolidays: Holiday[] = [
  { id: '1', name: 'Kashmir Day', date: '2024-02-05', type: 'public' },
  { id: '2', name: 'Pakistan Day', date: '2024-03-23', type: 'public' },
  { id: '3', name: 'Labour Day', date: '2024-05-01', type: 'public' },
  { id: '4', name: 'Independence Day', date: '2024-08-14', type: 'public' },
  { id: '5', name: 'Iqbal Day', date: '2024-11-09', type: 'public' },
  { id: '6', name: 'Quaid-e-Azam Day', date: '2024-12-25', type: 'public' },
  { id: '7', name: 'Company Foundation Day', date: '2024-04-15', type: 'company' },
  { id: '8', name: 'Eid ul Fitr', date: '2024-04-10', type: 'public' },
  { id: '9', name: 'Eid ul Fitr', date: '2024-04-11', type: 'public' },
  { id: '10', name: 'Eid ul Adha', date: '2024-06-17', type: 'public' },
];

// Seed Leave Requests
export const seedLeaveRequests: LeaveRequest[] = [
  { id: '1', employeeId: '7', employeeName: 'Bilal Ahmad', leaveType: 'Sick Leave', fromDate: '2024-01-20', toDate: '2024-01-25', totalDays: 6, reason: 'Medical treatment', approvalStatus: 'approved', approvedBy: 'Sara Ahmed', createdAt: '2024-01-19', updatedAt: '2024-01-19' },
  { id: '2', employeeId: '4', employeeName: 'Ayesha Malik', leaveType: 'Casual Leave', fromDate: '2024-02-01', toDate: '2024-02-02', totalDays: 2, reason: 'Personal work', approvalStatus: 'pending', createdAt: '2024-01-22', updatedAt: '2024-01-22' },
  { id: '3', employeeId: '3', employeeName: 'Usman Ali', leaveType: 'Annual Leave', fromDate: '2024-03-10', toDate: '2024-03-15', totalDays: 6, reason: 'Family vacation', approvalStatus: 'pending', createdAt: '2024-01-20', updatedAt: '2024-01-20' },
  { id: '4', employeeId: '5', employeeName: 'Hassan Raza', leaveType: 'Casual Leave', fromDate: '2024-01-15', toDate: '2024-01-15', totalDays: 1, reason: 'Personal emergency', approvalStatus: 'approved', approvedBy: 'Sara Ahmed', createdAt: '2024-01-14', updatedAt: '2024-01-14' },
  { id: '5', employeeId: '2', employeeName: 'Sara Ahmed', leaveType: 'Annual Leave', fromDate: '2024-02-10', toDate: '2024-02-14', totalDays: 5, reason: 'Vacation', approvalStatus: 'approved', approvedBy: 'CEO', createdAt: '2024-01-18', updatedAt: '2024-01-19' },
];


// Seed Payroll Groups
export const seedPayrollGroups: PayrollGroup[] = [
  { id: '1', name: 'Management', description: 'Payroll structure for management level employees', salaryComponents: [], deductionRules: [], isActive: true },
  { id: '2', name: 'Staff', description: 'Payroll structure for staff level employees', salaryComponents: [], deductionRules: [], isActive: true },
  { id: '3', name: 'Intern', description: 'Payroll structure for interns and trainees', salaryComponents: [], deductionRules: [], isActive: true },
  { id: '4', name: 'Contract', description: 'Payroll structure for contract employees', salaryComponents: [], deductionRules: [], isActive: true },
];

// Seed Payroll Records
export const seedPayrollRecords: PayrollRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Ahmed Khan', payrollMonth: 'January 2024', payableDays: 31, grossSalary: 210000, totalAllowances: 60000, totalDeductions: 23000, netPay: 247000, status: 'paid', createdAt: '2024-01-31', updatedAt: '2024-02-01' },
  { id: '2', employeeId: '2', employeeName: 'Sara Ahmed', payrollMonth: 'January 2024', payableDays: 31, grossSalary: 197000, totalAllowances: 57000, totalDeductions: 19500, netPay: 234500, status: 'paid', createdAt: '2024-01-31', updatedAt: '2024-02-01' },
  { id: '3', employeeId: '3', employeeName: 'Usman Ali', payrollMonth: 'January 2024', payableDays: 31, grossSalary: 112000, totalAllowances: 32000, totalDeductions: 9500, netPay: 134500, status: 'paid', createdAt: '2024-01-31', updatedAt: '2024-02-01' },
  { id: '4', employeeId: '4', employeeName: 'Ayesha Malik', payrollMonth: 'January 2024', payableDays: 31, grossSalary: 91500, totalAllowances: 26500, totalDeductions: 11750, netPay: 106250, status: 'paid', createdAt: '2024-01-31', updatedAt: '2024-02-01' },
  { id: '5', employeeId: '5', employeeName: 'Hassan Raza', payrollMonth: 'January 2024', payableDays: 30, grossSalary: 228000, totalAllowances: 68000, totalDeductions: 26500, netPay: 269500, status: 'paid', createdAt: '2024-01-31', updatedAt: '2024-02-01' },
  { id: '6', employeeId: '6', employeeName: 'Zainab Hussain', payrollMonth: 'January 2024', payableDays: 31, grossSalary: 77000, totalAllowances: 22000, totalDeductions: 5250, netPay: 93750, status: 'processed', createdAt: '2024-01-31', updatedAt: '2024-01-31' },
  { id: '7', employeeId: '7', employeeName: 'Bilal Ahmad', payrollMonth: 'January 2024', payableDays: 25, grossSalary: 56450, totalAllowances: 16130, totalDeductions: 7000, netPay: 65580, status: 'draft', createdAt: '2024-01-31', updatedAt: '2024-01-31' },
  { id: '8', employeeId: '8', employeeName: 'Fatima Zahra', payrollMonth: 'January 2024', payableDays: 15, grossSalary: 19355, totalAllowances: 1935, totalDeductions: 0, netPay: 21290, status: 'draft', createdAt: '2024-01-31', updatedAt: '2024-01-31' },
];

// Seed Performance Cycles
export const seedPerformanceCycles: PerformanceCycle[] = [
  { id: '1', name: 'Annual Review 2023', periodStart: '2023-01-01', periodEnd: '2023-12-31', evaluationType: 'annual', kpiWeightage: 70, ratingScale: 5, status: 'completed' },
  { id: '2', name: 'Q1 2024 Review', periodStart: '2024-01-01', periodEnd: '2024-03-31', evaluationType: 'quarterly', kpiWeightage: 80, ratingScale: 5, status: 'active' },
  { id: '3', name: 'Annual Review 2024', periodStart: '2024-01-01', periodEnd: '2024-12-31', evaluationType: 'annual', kpiWeightage: 70, ratingScale: 5, status: 'draft' },
];

// Seed KPI Assignments
export const seedKPIAssignments: KPIAssignment[] = [
  { id: '1', employeeId: '1', employeeName: 'Ahmed Khan', cycleId: '2', kpiCategory: 'productivity', kpiDescription: 'Achieve 95% production target', targetValue: 95, weight: 30, evaluationMethod: 'Monthly production reports', actualValue: 92, score: 85 },
  { id: '2', employeeId: '1', employeeName: 'Ahmed Khan', cycleId: '2', kpiCategory: 'quality', kpiDescription: 'Maintain batch rejection rate below 2%', targetValue: 2, weight: 25, evaluationMethod: 'QA reports', actualValue: 1.5, score: 90 },
  { id: '3', employeeId: '3', employeeName: 'Usman Ali', cycleId: '2', kpiCategory: 'quality', kpiDescription: 'Complete 100% batch testing on time', targetValue: 100, weight: 40, evaluationMethod: 'Testing logs', actualValue: 98, score: 88 },
  { id: '4', employeeId: '5', employeeName: 'Hassan Raza', cycleId: '2', kpiCategory: 'sales', kpiDescription: 'Achieve quarterly sales target of 50M', targetValue: 50, weight: 50, evaluationMethod: 'Sales reports', actualValue: 48, score: 82 },
  { id: '5', employeeId: '5', employeeName: 'Hassan Raza', cycleId: '2', kpiCategory: 'teamwork', kpiDescription: 'Train 5 new sales executives', targetValue: 5, weight: 20, evaluationMethod: 'Training records', actualValue: 5, score: 100 },
];

// Seed Performance Reviews
export const seedPerformanceReviews: PerformanceReview[] = [
  { id: '1', employeeId: '1', employeeName: 'Ahmed Khan', cycleId: '1', selfEvaluation: 'Met all production targets', selfScore: 85, managerEvaluation: 'Excellent leadership', managerScore: 88, hrReview: 'Recommended for increment', finalScore: 87, performanceRating: 'exceeds', remarks: 'Strong performer', promotionRecommendation: false, incrementRecommendation: true, status: 'completed' },
  { id: '2', employeeId: '3', employeeName: 'Usman Ali', cycleId: '1', selfEvaluation: 'Improved QA processes', selfScore: 80, managerEvaluation: 'Good technical skills', managerScore: 82, hrReview: 'Consistent performer', finalScore: 81, performanceRating: 'meets', remarks: 'Keep up the good work', promotionRecommendation: false, incrementRecommendation: true, status: 'completed' },
  { id: '3', employeeId: '5', employeeName: 'Hassan Raza', cycleId: '1', selfEvaluation: 'Exceeded sales targets', selfScore: 90, managerEvaluation: 'Outstanding sales performance', managerScore: 92, hrReview: 'Top performer in sales', finalScore: 91, performanceRating: 'exceptional', remarks: 'Recommended for promotion', promotionRecommendation: true, incrementRecommendation: true, status: 'completed' },
  { id: '4', employeeId: '2', employeeName: 'Sara Ahmed', cycleId: '2', selfEvaluation: 'Streamlined HR processes', selfScore: 85, managerEvaluation: 'Pending', status: 'self_review', performanceRating: 'meets', promotionRecommendation: false, incrementRecommendation: false },
];


// Seed Trainings
export const seedTrainings: Training[] = [
  { id: '1', title: 'GMP Basic Training', type: 'internal', trainer: 'QA Department', duration: '2 days', isMandatory: true, complianceCategory: 'gmp', description: 'Good Manufacturing Practices fundamentals', isActive: true },
  { id: '2', title: 'Safety & Fire Fighting', type: 'internal', trainer: 'Safety Officer', duration: '1 day', isMandatory: true, complianceCategory: 'safety', description: 'Workplace safety and emergency procedures', isActive: true },
  { id: '3', title: 'SOP Documentation', type: 'internal', trainer: 'QA Manager', duration: '4 hours', isMandatory: true, complianceCategory: 'sop', description: 'Standard Operating Procedures writing and compliance', isActive: true },
  { id: '4', title: 'Leadership Development', type: 'external', trainer: 'HR Consultants', duration: '3 days', isMandatory: false, complianceCategory: 'general', description: 'Leadership skills for managers', isActive: true },
  { id: '5', title: 'IT Security Awareness', type: 'internal', trainer: 'IT Department', duration: '2 hours', isMandatory: true, complianceCategory: 'general', description: 'Cybersecurity best practices', isActive: true },
  { id: '6', title: 'First Aid Training', type: 'external', trainer: 'Red Crescent', duration: '1 day', isMandatory: false, complianceCategory: 'safety', description: 'Basic first aid and CPR', isActive: true },
];

// Seed Training Assignments
export const seedTrainingAssignments: TrainingAssignment[] = [
  { id: '1', trainingId: '1', trainingTitle: 'GMP Basic Training', employeeId: '8', employeeName: 'Fatima Zahra', scheduledDate: '2024-01-20', status: 'scheduled' },
  { id: '2', trainingId: '2', trainingTitle: 'Safety & Fire Fighting', employeeId: '8', employeeName: 'Fatima Zahra', scheduledDate: '2024-01-25', status: 'scheduled' },
  { id: '3', trainingId: '5', trainingTitle: 'IT Security Awareness', employeeId: '6', employeeName: 'Zainab Hussain', scheduledDate: '2023-06-05', completionDate: '2023-06-05', status: 'completed' },
  { id: '4', trainingId: '1', trainingTitle: 'GMP Basic Training', employeeId: '3', employeeName: 'Usman Ali', scheduledDate: '2021-03-15', completionDate: '2021-03-16', status: 'completed' },
  { id: '5', trainingId: '4', trainingTitle: 'Leadership Development', employeeId: '1', employeeName: 'Ahmed Khan', scheduledDate: '2024-02-15', status: 'scheduled' },
  { id: '6', trainingId: '4', trainingTitle: 'Leadership Development', employeeId: '5', employeeName: 'Hassan Raza', scheduledDate: '2024-02-15', status: 'scheduled' },
];

// Seed Compliance Records
export const seedComplianceRecords: ComplianceRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Ahmed Khan', complianceType: 'GMP Certification', validityStart: '2023-06-01', validityEnd: '2024-05-31', reminderDays: 30, status: 'valid' },
  { id: '2', employeeId: '3', employeeName: 'Usman Ali', complianceType: 'GMP Certification', validityStart: '2023-03-15', validityEnd: '2024-03-14', reminderDays: 30, status: 'expiring_soon' },
  { id: '3', employeeId: '1', employeeName: 'Ahmed Khan', complianceType: 'Safety Training', validityStart: '2023-01-01', validityEnd: '2024-12-31', reminderDays: 60, status: 'valid' },
  { id: '4', employeeId: '5', employeeName: 'Hassan Raza', complianceType: 'Medical Checkup', validityStart: '2023-09-01', validityEnd: '2024-08-31', reminderDays: 30, status: 'valid' },
  { id: '5', employeeId: '7', employeeName: 'Bilal Ahmad', complianceType: 'Forklift License', validityStart: '2022-08-01', validityEnd: '2023-07-31', reminderDays: 30, status: 'expired' },
  { id: '6', employeeId: '2', employeeName: 'Sara Ahmed', complianceType: 'HR Certification', validityStart: '2023-01-01', validityEnd: '2025-12-31', reminderDays: 90, status: 'valid' },
];
