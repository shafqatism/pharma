import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Employee, JobRequisition, Candidate, Onboarding, Shift, AttendanceRecord,
  Holiday, LeaveType, LeaveRequest, PayrollGroup, PayrollRecord,
  PerformanceCycle, KPIAssignment, PerformanceReview, Training,
  TrainingAssignment, ComplianceRecord, Department, Designation, AuditLog
} from '@/types/hrm';
import {
  seedEmployees, seedJobRequisitions, seedCandidates, seedOnboardings,
  seedShifts, seedAttendanceRecords, seedHolidays, seedLeaveRequests,
  seedPayrollGroups, seedPayrollRecords, seedPerformanceCycles,
  seedKPIAssignments, seedPerformanceReviews, seedTrainings,
  seedTrainingAssignments, seedComplianceRecords
} from '@/data/seedData';

interface HRMStore {
  // Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id' | 'employeeId' | 'createdAt' | 'updatedAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Job Requisitions
  jobRequisitions: JobRequisition[];
  addJobRequisition: (req: Omit<JobRequisition, 'id' | 'requisitionId' | 'createdAt' | 'updatedAt'>) => void;
  updateJobRequisition: (id: string, req: Partial<JobRequisition>) => void;
  deleteJobRequisition: (id: string) => void;

  // Candidates
  candidates: Candidate[];
  addCandidate: (candidate: Omit<Candidate, 'id' | 'candidateId' | 'createdAt' | 'updatedAt'>) => void;
  updateCandidate: (id: string, candidate: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;

  // Onboarding
  onboardings: Onboarding[];
  addOnboarding: (onboarding: Omit<Onboarding, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOnboarding: (id: string, onboarding: Partial<Onboarding>) => void;
  deleteOnboarding: (id: string) => void;

  // Shifts
  shifts: Shift[];
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;

  // Holidays
  holidays: Holiday[];
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  updateHoliday: (id: string, holiday: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;

  // Leave Types
  leaveTypes: LeaveType[];
  addLeaveType: (leaveType: Omit<LeaveType, 'id'>) => void;
  updateLeaveType: (id: string, leaveType: Partial<LeaveType>) => void;
  deleteLeaveType: (id: string) => void;

  // Leave Requests
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLeaveRequest: (id: string, request: Partial<LeaveRequest>) => void;
  deleteLeaveRequest: (id: string) => void;


  // Payroll Groups
  payrollGroups: PayrollGroup[];
  addPayrollGroup: (group: Omit<PayrollGroup, 'id'>) => void;
  updatePayrollGroup: (id: string, group: Partial<PayrollGroup>) => void;
  deletePayrollGroup: (id: string) => void;

  // Payroll Records
  payrollRecords: PayrollRecord[];
  addPayrollRecord: (record: Omit<PayrollRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayrollRecord: (id: string, record: Partial<PayrollRecord>) => void;
  deletePayrollRecord: (id: string) => void;

  // Performance Cycles
  performanceCycles: PerformanceCycle[];
  addPerformanceCycle: (cycle: Omit<PerformanceCycle, 'id'>) => void;
  updatePerformanceCycle: (id: string, cycle: Partial<PerformanceCycle>) => void;
  deletePerformanceCycle: (id: string) => void;

  // KPI Assignments
  kpiAssignments: KPIAssignment[];
  addKPIAssignment: (assignment: Omit<KPIAssignment, 'id'>) => void;
  updateKPIAssignment: (id: string, assignment: Partial<KPIAssignment>) => void;
  deleteKPIAssignment: (id: string) => void;

  // Performance Reviews
  performanceReviews: PerformanceReview[];
  addPerformanceReview: (review: Omit<PerformanceReview, 'id'>) => void;
  updatePerformanceReview: (id: string, review: Partial<PerformanceReview>) => void;
  deletePerformanceReview: (id: string) => void;

  // Trainings
  trainings: Training[];
  addTraining: (training: Omit<Training, 'id'>) => void;
  updateTraining: (id: string, training: Partial<Training>) => void;
  deleteTraining: (id: string) => void;

  // Training Assignments
  trainingAssignments: TrainingAssignment[];
  addTrainingAssignment: (assignment: Omit<TrainingAssignment, 'id'>) => void;
  updateTrainingAssignment: (id: string, assignment: Partial<TrainingAssignment>) => void;
  deleteTrainingAssignment: (id: string) => void;

  // Compliance Records
  complianceRecords: ComplianceRecord[];
  addComplianceRecord: (record: Omit<ComplianceRecord, 'id'>) => void;
  updateComplianceRecord: (id: string, record: Partial<ComplianceRecord>) => void;
  deleteComplianceRecord: (id: string) => void;

  // Departments
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  // Designations
  designations: Designation[];
  addDesignation: (designation: Omit<Designation, 'id'>) => void;
  updateDesignation: (id: string, designation: Partial<Designation>) => void;
  deleteDesignation: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  
  // Reset to seed data
  resetToSeedData: () => void;
}

const generateEmployeeId = () => `EMP-${String(Date.now()).slice(-6)}`;
const generateRequisitionId = () => `REQ-${String(Date.now()).slice(-6)}`;
const generateCandidateId = () => `CAN-${String(Date.now()).slice(-6)}`;


export const useHRMStore = create<HRMStore>()(
  persist(
    (set) => ({
      // Initial States with Seed Data
      employees: seedEmployees,
      jobRequisitions: seedJobRequisitions,
      candidates: seedCandidates,
      onboardings: seedOnboardings,
      shifts: seedShifts,
      attendanceRecords: seedAttendanceRecords,
      holidays: seedHolidays,
      leaveTypes: [
        { id: '1', name: 'Casual Leave', code: 'CL', daysAllowed: 12, carryForward: false, isActive: true },
        { id: '2', name: 'Sick Leave', code: 'SL', daysAllowed: 10, carryForward: false, isActive: true },
        { id: '3', name: 'Annual Leave', code: 'AL', daysAllowed: 15, carryForward: true, isActive: true },
        { id: '4', name: 'Maternity Leave', code: 'ML', daysAllowed: 90, carryForward: false, isActive: true },
        { id: '5', name: 'Paternity Leave', code: 'PL', daysAllowed: 10, carryForward: false, isActive: true },
        { id: '6', name: 'Unpaid Leave', code: 'UL', daysAllowed: 30, carryForward: false, isActive: true },
      ],
      leaveRequests: seedLeaveRequests,
      payrollGroups: seedPayrollGroups,
      payrollRecords: seedPayrollRecords,
      performanceCycles: seedPerformanceCycles,
      kpiAssignments: seedKPIAssignments,
      performanceReviews: seedPerformanceReviews,
      trainings: seedTrainings,
      trainingAssignments: seedTrainingAssignments,
      complianceRecords: seedComplianceRecords,
      departments: [
        { id: '1', name: 'Human Resources', code: 'HR', isActive: true },
        { id: '2', name: 'Finance', code: 'FIN', isActive: true },
        { id: '3', name: 'Production', code: 'PROD', isActive: true },
        { id: '4', name: 'Quality Assurance', code: 'QA', isActive: true },
        { id: '5', name: 'Sales & Marketing', code: 'SM', isActive: true },
        { id: '6', name: 'IT', code: 'IT', isActive: true },
        { id: '7', name: 'Warehouse', code: 'WH', isActive: true },
      ],
      designations: [
        { id: '1', name: 'Manager', departmentId: '1', grade: 'M1', isActive: true },
        { id: '2', name: 'Senior Executive', departmentId: '1', grade: 'E2', isActive: true },
        { id: '3', name: 'Executive', departmentId: '1', grade: 'E1', isActive: true },
        { id: '4', name: 'Trainee', departmentId: '1', grade: 'T1', isActive: true },
      ],
      auditLogs: [],

      // Employee Actions
      addEmployee: (employee) => set((state) => ({
        employees: [...state.employees, {
          ...employee,
          id: uuidv4(),
          employeeId: generateEmployeeId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateEmployee: (id, employee) => set((state) => ({
        employees: state.employees.map((e) =>
          e.id === id ? { ...e, ...employee, updatedAt: new Date().toISOString() } : e
        )
      })),
      deleteEmployee: (id) => set((state) => ({
        employees: state.employees.filter((e) => e.id !== id)
      })),

      // Job Requisition Actions
      addJobRequisition: (req) => set((state) => ({
        jobRequisitions: [...state.jobRequisitions, {
          ...req,
          id: uuidv4(),
          requisitionId: generateRequisitionId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateJobRequisition: (id, req) => set((state) => ({
        jobRequisitions: state.jobRequisitions.map((r) =>
          r.id === id ? { ...r, ...req, updatedAt: new Date().toISOString() } : r
        )
      })),
      deleteJobRequisition: (id) => set((state) => ({
        jobRequisitions: state.jobRequisitions.filter((r) => r.id !== id)
      })),

      // Candidate Actions
      addCandidate: (candidate) => set((state) => ({
        candidates: [...state.candidates, {
          ...candidate,
          id: uuidv4(),
          candidateId: generateCandidateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateCandidate: (id, candidate) => set((state) => ({
        candidates: state.candidates.map((c) =>
          c.id === id ? { ...c, ...candidate, updatedAt: new Date().toISOString() } : c
        )
      })),
      deleteCandidate: (id) => set((state) => ({
        candidates: state.candidates.filter((c) => c.id !== id)
      })),


      // Onboarding Actions
      addOnboarding: (onboarding) => set((state) => ({
        onboardings: [...state.onboardings, {
          ...onboarding,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateOnboarding: (id, onboarding) => set((state) => ({
        onboardings: state.onboardings.map((o) =>
          o.id === id ? { ...o, ...onboarding, updatedAt: new Date().toISOString() } : o
        )
      })),
      deleteOnboarding: (id) => set((state) => ({
        onboardings: state.onboardings.filter((o) => o.id !== id)
      })),

      // Shift Actions
      addShift: (shift) => set((state) => ({
        shifts: [...state.shifts, { ...shift, id: uuidv4() }]
      })),
      updateShift: (id, shift) => set((state) => ({
        shifts: state.shifts.map((s) => s.id === id ? { ...s, ...shift } : s)
      })),
      deleteShift: (id) => set((state) => ({
        shifts: state.shifts.filter((s) => s.id !== id)
      })),

      // Attendance Actions
      addAttendanceRecord: (record) => set((state) => ({
        attendanceRecords: [...state.attendanceRecords, { ...record, id: uuidv4() }]
      })),
      updateAttendanceRecord: (id, record) => set((state) => ({
        attendanceRecords: state.attendanceRecords.map((r) => r.id === id ? { ...r, ...record } : r)
      })),
      deleteAttendanceRecord: (id) => set((state) => ({
        attendanceRecords: state.attendanceRecords.filter((r) => r.id !== id)
      })),

      // Holiday Actions
      addHoliday: (holiday) => set((state) => ({
        holidays: [...state.holidays, { ...holiday, id: uuidv4() }]
      })),
      updateHoliday: (id, holiday) => set((state) => ({
        holidays: state.holidays.map((h) => h.id === id ? { ...h, ...holiday } : h)
      })),
      deleteHoliday: (id) => set((state) => ({
        holidays: state.holidays.filter((h) => h.id !== id)
      })),

      // Leave Type Actions
      addLeaveType: (leaveType) => set((state) => ({
        leaveTypes: [...state.leaveTypes, { ...leaveType, id: uuidv4() }]
      })),
      updateLeaveType: (id, leaveType) => set((state) => ({
        leaveTypes: state.leaveTypes.map((l) => l.id === id ? { ...l, ...leaveType } : l)
      })),
      deleteLeaveType: (id) => set((state) => ({
        leaveTypes: state.leaveTypes.filter((l) => l.id !== id)
      })),

      // Leave Request Actions
      addLeaveRequest: (request) => set((state) => ({
        leaveRequests: [...state.leaveRequests, {
          ...request,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updateLeaveRequest: (id, request) => set((state) => ({
        leaveRequests: state.leaveRequests.map((r) =>
          r.id === id ? { ...r, ...request, updatedAt: new Date().toISOString() } : r
        )
      })),
      deleteLeaveRequest: (id) => set((state) => ({
        leaveRequests: state.leaveRequests.filter((r) => r.id !== id)
      })),

      // Payroll Group Actions
      addPayrollGroup: (group) => set((state) => ({
        payrollGroups: [...state.payrollGroups, { ...group, id: uuidv4() }]
      })),
      updatePayrollGroup: (id, group) => set((state) => ({
        payrollGroups: state.payrollGroups.map((g) => g.id === id ? { ...g, ...group } : g)
      })),
      deletePayrollGroup: (id) => set((state) => ({
        payrollGroups: state.payrollGroups.filter((g) => g.id !== id)
      })),

      // Payroll Record Actions
      addPayrollRecord: (record) => set((state) => ({
        payrollRecords: [...state.payrollRecords, {
          ...record,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]
      })),
      updatePayrollRecord: (id, record) => set((state) => ({
        payrollRecords: state.payrollRecords.map((r) =>
          r.id === id ? { ...r, ...record, updatedAt: new Date().toISOString() } : r
        )
      })),
      deletePayrollRecord: (id) => set((state) => ({
        payrollRecords: state.payrollRecords.filter((r) => r.id !== id)
      })),


      // Performance Cycle Actions
      addPerformanceCycle: (cycle) => set((state) => ({
        performanceCycles: [...state.performanceCycles, { ...cycle, id: uuidv4() }]
      })),
      updatePerformanceCycle: (id, cycle) => set((state) => ({
        performanceCycles: state.performanceCycles.map((c) => c.id === id ? { ...c, ...cycle } : c)
      })),
      deletePerformanceCycle: (id) => set((state) => ({
        performanceCycles: state.performanceCycles.filter((c) => c.id !== id)
      })),

      // KPI Assignment Actions
      addKPIAssignment: (assignment) => set((state) => ({
        kpiAssignments: [...state.kpiAssignments, { ...assignment, id: uuidv4() }]
      })),
      updateKPIAssignment: (id, assignment) => set((state) => ({
        kpiAssignments: state.kpiAssignments.map((a) => a.id === id ? { ...a, ...assignment } : a)
      })),
      deleteKPIAssignment: (id) => set((state) => ({
        kpiAssignments: state.kpiAssignments.filter((a) => a.id !== id)
      })),

      // Performance Review Actions
      addPerformanceReview: (review) => set((state) => ({
        performanceReviews: [...state.performanceReviews, { ...review, id: uuidv4() }]
      })),
      updatePerformanceReview: (id, review) => set((state) => ({
        performanceReviews: state.performanceReviews.map((r) => r.id === id ? { ...r, ...review } : r)
      })),
      deletePerformanceReview: (id) => set((state) => ({
        performanceReviews: state.performanceReviews.filter((r) => r.id !== id)
      })),

      // Training Actions
      addTraining: (training) => set((state) => ({
        trainings: [...state.trainings, { ...training, id: uuidv4() }]
      })),
      updateTraining: (id, training) => set((state) => ({
        trainings: state.trainings.map((t) => t.id === id ? { ...t, ...training } : t)
      })),
      deleteTraining: (id) => set((state) => ({
        trainings: state.trainings.filter((t) => t.id !== id)
      })),

      // Training Assignment Actions
      addTrainingAssignment: (assignment) => set((state) => ({
        trainingAssignments: [...state.trainingAssignments, { ...assignment, id: uuidv4() }]
      })),
      updateTrainingAssignment: (id, assignment) => set((state) => ({
        trainingAssignments: state.trainingAssignments.map((a) => a.id === id ? { ...a, ...assignment } : a)
      })),
      deleteTrainingAssignment: (id) => set((state) => ({
        trainingAssignments: state.trainingAssignments.filter((a) => a.id !== id)
      })),

      // Compliance Record Actions
      addComplianceRecord: (record) => set((state) => ({
        complianceRecords: [...state.complianceRecords, { ...record, id: uuidv4() }]
      })),
      updateComplianceRecord: (id, record) => set((state) => ({
        complianceRecords: state.complianceRecords.map((r) => r.id === id ? { ...r, ...record } : r)
      })),
      deleteComplianceRecord: (id) => set((state) => ({
        complianceRecords: state.complianceRecords.filter((r) => r.id !== id)
      })),

      // Department Actions
      addDepartment: (dept) => set((state) => ({
        departments: [...state.departments, { ...dept, id: uuidv4() }]
      })),
      updateDepartment: (id, dept) => set((state) => ({
        departments: state.departments.map((d) => d.id === id ? { ...d, ...dept } : d)
      })),
      deleteDepartment: (id) => set((state) => ({
        departments: state.departments.filter((d) => d.id !== id)
      })),

      // Designation Actions
      addDesignation: (designation) => set((state) => ({
        designations: [...state.designations, { ...designation, id: uuidv4() }]
      })),
      updateDesignation: (id, designation) => set((state) => ({
        designations: state.designations.map((d) => d.id === id ? { ...d, ...designation } : d)
      })),
      deleteDesignation: (id) => set((state) => ({
        designations: state.designations.filter((d) => d.id !== id)
      })),

      // Audit Log Actions
      addAuditLog: (log) => set((state) => ({
        auditLogs: [...state.auditLogs, { ...log, id: uuidv4(), timestamp: new Date().toISOString() }]
      })),

      // Reset to seed data
      resetToSeedData: () => set({
        employees: seedEmployees,
        jobRequisitions: seedJobRequisitions,
        candidates: seedCandidates,
        onboardings: seedOnboardings,
        shifts: seedShifts,
        attendanceRecords: seedAttendanceRecords,
        holidays: seedHolidays,
        leaveRequests: seedLeaveRequests,
        payrollGroups: seedPayrollGroups,
        payrollRecords: seedPayrollRecords,
        performanceCycles: seedPerformanceCycles,
        kpiAssignments: seedKPIAssignments,
        performanceReviews: seedPerformanceReviews,
        trainings: seedTrainings,
        trainingAssignments: seedTrainingAssignments,
        complianceRecords: seedComplianceRecords,
      }),
    }),
    { name: 'hrm-storage' }
  )
);
