import { UserGuideProps } from "@/components/common/UserGuide";

// ==================== HRM MODULE GUIDES ====================

export const employeesGuide: UserGuideProps = {
  moduleTitle: "Employee Management",
  moduleDescription: "Manage all employee records including personal information, employment details, salary structure, and compliance documents. This is the central hub for all HR-related employee data in the organization.",
  workflows: [
    { step: 1, title: "Add New Employee", description: "Click 'Add Employee' button to open the employee form with all required fields." },
    { step: 2, title: "Fill Personal Details", description: "Enter personal information including name, CNIC, contact details, and emergency contacts." },
    { step: 3, title: "Set Employment Details", description: "Assign department, designation, job grade, reporting manager, and employment type." },
    { step: 4, title: "Configure Salary", description: "Set up basic salary, allowances, deductions, and bank account details." },
    { step: 5, title: "Upload Documents", description: "Attach required compliance documents like CNIC copy, educational certificates, etc." },
  ],
  sections: [
    {
      title: "Personal Information",
      content: "This section captures the employee's personal details including full name, father/spouse name, CNIC/Passport number, date of birth, gender, marital status, blood group, nationality, and contact information. All fields marked with * are mandatory.",
      tips: ["CNIC format should be XXXXX-XXXXXXX-X", "Keep emergency contact updated for safety purposes", "Personal email is used for non-official communications"],
    },
    {
      title: "Employment Details",
      content: "Configure the employee's organizational position including company assignment, department, designation, job grade (G1-G10), employment type (permanent/contract/intern), work location, and reporting structure.",
      tips: ["Job grades determine salary bands and benefits eligibility", "Reporting manager is required for leave approvals", "Probation period is typically 3-6 months"],
    },
    {
      title: "Salary & Compensation",
      content: "Define the complete salary structure including basic salary, house rent allowance, medical allowance, transport allowance, and other allowances. Also configure statutory deductions like tax, EOBI, and provident fund contributions.",
      tips: ["Basic salary should be at least 50% of gross salary", "EOBI contribution is mandatory for permanent employees", "Tax is calculated based on FBR slabs"],
    },
    {
      title: "Bank Details",
      content: "Enter bank account information for salary disbursement including bank name, branch, account title, and account number. This information is used for payroll processing.",
      tips: ["Account title must match employee's official name", "Verify account number before saving to avoid payment issues"],
    },
  ],
  abbreviations: [
    { term: "CNIC", fullForm: "Computerized National Identity Card", description: "13-digit national ID issued by NADRA Pakistan" },
    { term: "EOBI", fullForm: "Employees Old-Age Benefits Institution", description: "Social security contribution for retirement benefits" },
    { term: "PF", fullForm: "Provident Fund", description: "Retirement savings scheme with employer matching" },
    { term: "HR", fullForm: "Human Resources", description: "Department managing employee relations" },
    { term: "DOJ", fullForm: "Date of Joining", description: "Employee's first working day" },
    { term: "DOB", fullForm: "Date of Birth", description: "Employee's birth date for records" },
  ],
};


export const departmentsGuide: UserGuideProps = {
  moduleTitle: "Department Management",
  moduleDescription: "Organize your company structure by creating and managing departments. Each department can have a head, cost center, and defined headcount budget for workforce planning.",
  workflows: [
    { step: 1, title: "Create Department", description: "Click 'Add Department' and enter department details." },
    { step: 2, title: "Assign Department Head", description: "Select an existing employee as the department head." },
    { step: 3, title: "Set Budget", description: "Define the approved headcount for workforce planning." },
  ],
  sections: [
    {
      title: "Department Setup",
      content: "Create departments with unique codes, names, and descriptions. Each department should have a designated head who is responsible for team management and approvals.",
      tips: ["Use consistent naming conventions (e.g., DEPT-001)", "Department head should be a senior employee", "Keep descriptions clear for reporting purposes"],
    },
    {
      title: "Cost Center",
      content: "Assign cost centers to departments for financial tracking and budget allocation. This helps in expense categorization and departmental P&L analysis.",
      tips: ["Cost center codes should align with finance system", "Review cost centers quarterly"],
    },
  ],
  abbreviations: [
    { term: "HOD", fullForm: "Head of Department", description: "Senior person responsible for department operations" },
    { term: "CC", fullForm: "Cost Center", description: "Accounting code for expense tracking" },
    { term: "HC", fullForm: "Headcount", description: "Number of employees in a department" },
  ],
};

export const attendanceGuide: UserGuideProps = {
  moduleTitle: "Attendance Management",
  moduleDescription: "Track daily attendance, working hours, overtime, and attendance patterns. Integrates with payroll for accurate salary calculations based on actual working days.",
  workflows: [
    { step: 1, title: "Mark Attendance", description: "Record check-in and check-out times for employees." },
    { step: 2, title: "Review Anomalies", description: "Check for late arrivals, early departures, or missing punches." },
    { step: 3, title: "Approve Corrections", description: "Process attendance correction requests from employees." },
    { step: 4, title: "Generate Reports", description: "Export attendance data for payroll processing." },
  ],
  sections: [
    {
      title: "Daily Attendance",
      content: "Record employee attendance with check-in/check-out times. System automatically calculates working hours, overtime, and identifies attendance issues like late arrivals or early departures.",
      tips: ["Grace period is typically 15 minutes", "Overtime requires manager approval", "Missing punches should be regularized within 48 hours"],
    },
    {
      title: "Attendance Status",
      content: "Different attendance statuses include Present (P), Absent (A), Half Day (HD), On Leave (L), Work From Home (WFH), and On Duty (OD). Each status affects payroll differently.",
      tips: ["Half day is counted as 0.5 working day", "WFH requires prior approval", "OD needs supporting documents"],
    },
  ],
  abbreviations: [
    { term: "OT", fullForm: "Overtime", description: "Hours worked beyond regular shift" },
    { term: "WFH", fullForm: "Work From Home", description: "Remote working arrangement" },
    { term: "OD", fullForm: "On Duty", description: "Working outside office premises" },
    { term: "HD", fullForm: "Half Day", description: "Working only half of the shift" },
    { term: "LOP", fullForm: "Loss of Pay", description: "Unpaid leave affecting salary" },
  ],
};

export const leaveRequestsGuide: UserGuideProps = {
  moduleTitle: "Leave Management",
  moduleDescription: "Submit, track, and approve leave requests. Manages leave balances, accruals, and ensures compliance with company leave policies.",
  workflows: [
    { step: 1, title: "Submit Request", description: "Employee submits leave request with dates and reason." },
    { step: 2, title: "Manager Review", description: "Reporting manager reviews and approves/rejects the request." },
    { step: 3, title: "HR Processing", description: "HR verifies leave balance and processes the request." },
    { step: 4, title: "Balance Update", description: "System automatically updates leave balance after approval." },
  ],
  sections: [
    {
      title: "Leave Types",
      content: "Different leave categories include Annual Leave (AL), Sick Leave (SL), Casual Leave (CL), Maternity/Paternity Leave, and Unpaid Leave. Each type has specific entitlements and approval workflows.",
      tips: ["Annual leave requires 3 days advance notice", "Sick leave beyond 2 days needs medical certificate", "Casual leave cannot exceed 2 consecutive days"],
    },
    {
      title: "Leave Balance",
      content: "Track available leave balance for each leave type. Balances are calculated based on entitlements, accruals, and consumed leaves. Some leaves may carry forward to next year.",
      tips: ["Check balance before applying", "Carry forward limit is usually 5 days", "Encashment available for unused annual leave"],
    },
  ],
  abbreviations: [
    { term: "AL", fullForm: "Annual Leave", description: "Yearly vacation entitlement" },
    { term: "SL", fullForm: "Sick Leave", description: "Leave for medical reasons" },
    { term: "CL", fullForm: "Casual Leave", description: "Short notice personal leave" },
    { term: "ML", fullForm: "Maternity Leave", description: "Leave for childbirth (female employees)" },
    { term: "PL", fullForm: "Paternity Leave", description: "Leave for childbirth (male employees)" },
    { term: "LWP", fullForm: "Leave Without Pay", description: "Unpaid leave when balance exhausted" },
  ],
};


export const payrollGuide: UserGuideProps = {
  moduleTitle: "Payroll Processing",
  moduleDescription: "Process monthly salaries including earnings, deductions, taxes, and generate payslips. Ensures accurate and timely salary disbursement to all employees.",
  workflows: [
    { step: 1, title: "Import Attendance", description: "Pull attendance data for the payroll month." },
    { step: 2, title: "Calculate Earnings", description: "System calculates basic salary, allowances, and overtime." },
    { step: 3, title: "Apply Deductions", description: "Process tax, EOBI, PF, loans, and other deductions." },
    { step: 4, title: "Review & Approve", description: "HR reviews calculations and approves payroll." },
    { step: 5, title: "Generate Payslips", description: "Create and distribute payslips to employees." },
    { step: 6, title: "Bank Transfer", description: "Process salary transfer to employee bank accounts." },
  ],
  sections: [
    {
      title: "Earnings Components",
      content: "Salary earnings include Basic Salary, House Rent Allowance (HRA), Medical Allowance, Transport Allowance, and other special allowances. Overtime and bonuses are added as applicable.",
      tips: ["Basic salary is the foundation for all calculations", "HRA is typically 45% of basic", "Overtime rate is 1.5x for weekdays, 2x for holidays"],
    },
    {
      title: "Deductions",
      content: "Statutory deductions include Income Tax (as per FBR slabs), EOBI (employer and employee contribution), and Provident Fund. Other deductions may include loans, advances, and penalties.",
      tips: ["Tax is calculated on taxable income after exemptions", "EOBI minimum wage ceiling applies", "Loan EMIs are deducted automatically"],
    },
    {
      title: "Net Pay Calculation",
      content: "Net Pay = Gross Earnings - Total Deductions. The system automatically calculates this based on attendance, leave, and configured salary structure.",
      tips: ["Verify attendance before processing", "Check for any pending adjustments", "Review tax calculations for accuracy"],
    },
  ],
  abbreviations: [
    { term: "HRA", fullForm: "House Rent Allowance", description: "Allowance for accommodation expenses" },
    { term: "FBR", fullForm: "Federal Board of Revenue", description: "Pakistan's tax authority" },
    { term: "NTN", fullForm: "National Tax Number", description: "Tax registration number" },
    { term: "EMI", fullForm: "Equated Monthly Installment", description: "Fixed monthly loan payment" },
    { term: "YTD", fullForm: "Year to Date", description: "Cumulative amount from start of year" },
    { term: "CTC", fullForm: "Cost to Company", description: "Total employment cost including benefits" },
  ],
};

export const performanceGuide: UserGuideProps = {
  moduleTitle: "Performance Management",
  moduleDescription: "Manage performance review cycles, KPI assignments, and employee evaluations. Track goals, competencies, and development areas for continuous improvement.",
  workflows: [
    { step: 1, title: "Define KPIs", description: "Set Key Performance Indicators for each role/employee." },
    { step: 2, title: "Assign Goals", description: "Assign specific, measurable goals with deadlines." },
    { step: 3, title: "Track Progress", description: "Monitor goal progress throughout the review period." },
    { step: 4, title: "Conduct Review", description: "Manager conducts performance review meeting." },
    { step: 5, title: "Rate & Feedback", description: "Provide ratings and constructive feedback." },
    { step: 6, title: "Development Plan", description: "Create improvement plan for next cycle." },
  ],
  sections: [
    {
      title: "KPI Framework",
      content: "KPIs are measurable values that demonstrate how effectively an employee is achieving key business objectives. Each KPI should be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.",
      tips: ["Limit to 5-7 KPIs per employee", "Include both quantitative and qualitative measures", "Align KPIs with department goals"],
    },
    {
      title: "Rating Scale",
      content: "Performance is rated on a 5-point scale: 1-Needs Improvement, 2-Below Expectations, 3-Meets Expectations, 4-Exceeds Expectations, 5-Outstanding. Final rating determines increment and promotion eligibility.",
      tips: ["Avoid rating inflation", "Provide specific examples for each rating", "Document throughout the year, not just at review time"],
    },
  ],
  abbreviations: [
    { term: "KPI", fullForm: "Key Performance Indicator", description: "Measurable value showing goal achievement" },
    { term: "KRA", fullForm: "Key Result Area", description: "Critical areas of responsibility" },
    { term: "PIP", fullForm: "Performance Improvement Plan", description: "Structured plan for underperformers" },
    { term: "MBO", fullForm: "Management by Objectives", description: "Goal-setting methodology" },
    { term: "360°", fullForm: "360-Degree Feedback", description: "Multi-source performance feedback" },
  ],
};

export const trainingGuide: UserGuideProps = {
  moduleTitle: "Training Management",
  moduleDescription: "Plan, schedule, and track employee training programs. Manage training calendars, assignments, attendance, and effectiveness evaluation.",
  workflows: [
    { step: 1, title: "Identify Needs", description: "Assess training needs based on performance gaps." },
    { step: 2, title: "Create Program", description: "Design training program with objectives and content." },
    { step: 3, title: "Schedule Sessions", description: "Set dates, venue, and trainer details." },
    { step: 4, title: "Assign Employees", description: "Nominate employees for the training." },
    { step: 5, title: "Conduct Training", description: "Execute training and track attendance." },
    { step: 6, title: "Evaluate", description: "Assess training effectiveness and gather feedback." },
  ],
  sections: [
    {
      title: "Training Types",
      content: "Training categories include Technical Skills, Soft Skills, Compliance/Regulatory, Safety, Leadership Development, and Product Knowledge. Each type has specific objectives and evaluation criteria.",
      tips: ["Mandatory trainings must be completed within deadline", "GMP training is required for production staff", "Leadership training for manager-level and above"],
    },
    {
      title: "Training Records",
      content: "Maintain comprehensive training records including attendance, assessment scores, certificates, and feedback. These records are essential for compliance audits and career development tracking.",
      tips: ["Keep certificates in employee file", "Track training hours for compliance", "Update skills matrix after training completion"],
    },
  ],
  abbreviations: [
    { term: "TNA", fullForm: "Training Needs Assessment", description: "Process to identify skill gaps" },
    { term: "L&D", fullForm: "Learning & Development", description: "Employee development function" },
    { term: "ROI", fullForm: "Return on Investment", description: "Training effectiveness measure" },
    { term: "CBT", fullForm: "Computer-Based Training", description: "Online/digital training" },
    { term: "OJT", fullForm: "On-the-Job Training", description: "Practical workplace training" },
  ],
};


// ==================== INVENTORY MODULE GUIDES ====================

export const inventoryItemsGuide: UserGuideProps = {
  moduleTitle: "Inventory Items Master",
  moduleDescription: "Manage the master list of all inventory items including raw materials, packaging materials, finished goods, and equipment. Define item specifications, storage requirements, and reorder parameters.",
  workflows: [
    { step: 1, title: "Create Item", description: "Add new item with code, name, and category." },
    { step: 2, title: "Set Specifications", description: "Define unit of measure, storage conditions, and shelf life." },
    { step: 3, title: "Configure Reorder", description: "Set minimum stock level and reorder quantity." },
    { step: 4, title: "Assign Warehouse", description: "Specify default storage location." },
  ],
  sections: [
    {
      title: "Item Categories",
      content: "Items are categorized as Raw Materials (RM), Packaging Materials (PKG), Finished Goods (FG), Work in Progress (WIP), Spare Parts (SP), and Consumables. Each category has specific handling and accounting rules.",
      tips: ["Use consistent item coding (e.g., RM-001, PKG-001)", "Include batch tracking for regulated items", "Set up ABC classification for inventory control"],
    },
    {
      title: "Storage Requirements",
      content: "Define storage conditions including temperature range, humidity, light sensitivity, and special handling requirements. Critical for pharmaceutical products requiring cold chain or controlled storage.",
      tips: ["Cold storage items need temperature monitoring", "Flammable items require special storage", "FEFO (First Expiry First Out) for perishables"],
    },
    {
      title: "Reorder Management",
      content: "Configure minimum stock level (reorder point), maximum stock level, and economic order quantity. System alerts when stock falls below minimum level.",
      tips: ["Consider lead time when setting reorder point", "Review reorder quantities quarterly", "Factor in seasonal demand variations"],
    },
  ],
  abbreviations: [
    { term: "SKU", fullForm: "Stock Keeping Unit", description: "Unique identifier for each item" },
    { term: "UOM", fullForm: "Unit of Measure", description: "Standard measurement unit (kg, pcs, etc.)" },
    { term: "MOQ", fullForm: "Minimum Order Quantity", description: "Smallest quantity that can be ordered" },
    { term: "EOQ", fullForm: "Economic Order Quantity", description: "Optimal order quantity to minimize costs" },
    { term: "ROL", fullForm: "Reorder Level", description: "Stock level triggering new order" },
    { term: "FEFO", fullForm: "First Expiry First Out", description: "Inventory method for perishables" },
    { term: "FIFO", fullForm: "First In First Out", description: "Standard inventory valuation method" },
  ],
};

export const batchesGuide: UserGuideProps = {
  moduleTitle: "Batch Management",
  moduleDescription: "Track inventory by batches with manufacturing dates, expiry dates, and quality status. Essential for pharmaceutical traceability and regulatory compliance.",
  workflows: [
    { step: 1, title: "Create Batch", description: "Generate batch number for manufactured or received goods." },
    { step: 2, title: "Record Details", description: "Enter manufacturing date, expiry date, and quantity." },
    { step: 3, title: "QC Testing", description: "Submit batch for quality control testing." },
    { step: 4, title: "Release/Reject", description: "Update batch status based on QC results." },
    { step: 5, title: "Track Usage", description: "Monitor batch consumption and remaining quantity." },
  ],
  sections: [
    {
      title: "Batch Numbering",
      content: "Each batch has a unique identifier following company standards. Batch numbers typically include product code, manufacturing date, and sequence number for complete traceability.",
      tips: ["Follow consistent batch numbering format", "Include year/month in batch number", "Never reuse batch numbers"],
    },
    {
      title: "Quality Status",
      content: "Batches go through quality stages: Under Test, Approved, Rejected, Quarantine, and Expired. Only Approved batches can be used in production or sold.",
      tips: ["Quarantine batches pending investigation", "Rejected batches need disposal documentation", "Monitor batches approaching expiry"],
    },
    {
      title: "Traceability",
      content: "Maintain complete batch genealogy showing raw material batches used in finished product batches. Critical for recall management and regulatory audits.",
      tips: ["Link input batches to output batches", "Maintain batch records for 5+ years", "Enable quick recall capability"],
    },
  ],
  abbreviations: [
    { term: "BMR", fullForm: "Batch Manufacturing Record", description: "Complete production documentation" },
    { term: "BPR", fullForm: "Batch Packaging Record", description: "Packaging operation documentation" },
    { term: "COA", fullForm: "Certificate of Analysis", description: "Quality test results document" },
    { term: "QC", fullForm: "Quality Control", description: "Testing and inspection function" },
    { term: "QA", fullForm: "Quality Assurance", description: "Quality systems and compliance" },
    { term: "MFG", fullForm: "Manufacturing Date", description: "Date of production" },
    { term: "EXP", fullForm: "Expiry Date", description: "Date after which product is not usable" },
  ],
};

export const warehousesGuide: UserGuideProps = {
  moduleTitle: "Warehouse Management",
  moduleDescription: "Configure and manage warehouse locations, storage zones, and bin locations. Track warehouse capacity, utilization, and organize inventory storage efficiently.",
  workflows: [
    { step: 1, title: "Create Warehouse", description: "Add warehouse with code, name, and address." },
    { step: 2, title: "Define Zones", description: "Create storage zones (ambient, cold, quarantine)." },
    { step: 3, title: "Setup Locations", description: "Configure bin/rack locations within zones." },
    { step: 4, title: "Assign Items", description: "Map items to default storage locations." },
  ],
  sections: [
    {
      title: "Warehouse Types",
      content: "Different warehouse types include Raw Material Warehouse, Finished Goods Warehouse, Cold Storage, Quarantine Area, and Rejected Goods Store. Each has specific access controls and handling procedures.",
      tips: ["Separate quarantine area is mandatory", "Cold storage needs backup power", "Maintain pest control records"],
    },
    {
      title: "Location Hierarchy",
      content: "Warehouse → Zone → Aisle → Rack → Shelf → Bin. This hierarchy enables precise inventory placement and efficient picking operations.",
      tips: ["Use logical location codes", "Place fast-moving items near dispatch", "Reserve locations for specific items"],
    },
  ],
  abbreviations: [
    { term: "WH", fullForm: "Warehouse", description: "Storage facility" },
    { term: "WMS", fullForm: "Warehouse Management System", description: "Software for warehouse operations" },
    { term: "PUT", fullForm: "Putaway", description: "Process of storing received goods" },
    { term: "PICK", fullForm: "Picking", description: "Process of retrieving items for dispatch" },
    { term: "CC", fullForm: "Cycle Count", description: "Periodic inventory verification" },
  ],
};

export const stockTransfersGuide: UserGuideProps = {
  moduleTitle: "Stock Transfers",
  moduleDescription: "Transfer inventory between warehouses or locations. Track transfer requests, approvals, and movement history for complete inventory visibility.",
  workflows: [
    { step: 1, title: "Create Request", description: "Initiate transfer request with items and quantities." },
    { step: 2, title: "Approval", description: "Get approval from warehouse manager." },
    { step: 3, title: "Issue Stock", description: "Pick and issue items from source location." },
    { step: 4, title: "In Transit", description: "Track items during movement." },
    { step: 5, title: "Receive Stock", description: "Receive and verify at destination." },
  ],
  sections: [
    {
      title: "Transfer Types",
      content: "Transfers can be between warehouses (inter-warehouse), within same warehouse (intra-warehouse), or to production (material issue). Each type has different approval workflows.",
      tips: ["Plan transfers to minimize handling", "Verify batch numbers during transfer", "Update system immediately after physical movement"],
    },
  ],
  abbreviations: [
    { term: "STO", fullForm: "Stock Transfer Order", description: "Document for inventory movement" },
    { term: "GIT", fullForm: "Goods in Transit", description: "Inventory being transferred" },
    { term: "DN", fullForm: "Delivery Note", description: "Document accompanying transferred goods" },
  ],
};


export const coldChainGuide: UserGuideProps = {
  moduleTitle: "Cold Chain Management",
  moduleDescription: "Monitor and manage temperature-controlled storage for pharmaceutical products. Track temperature excursions, calibration schedules, and ensure product integrity.",
  workflows: [
    { step: 1, title: "Setup Units", description: "Register cold storage units with temperature ranges." },
    { step: 2, title: "Configure Monitoring", description: "Set up temperature sensors and alert thresholds." },
    { step: 3, title: "Daily Monitoring", description: "Record temperature readings at defined intervals." },
    { step: 4, title: "Excursion Management", description: "Investigate and document any temperature deviations." },
    { step: 5, title: "Calibration", description: "Maintain calibration schedule for sensors." },
  ],
  sections: [
    {
      title: "Temperature Zones",
      content: "Different storage zones: Refrigerated (2-8°C), Frozen (-20°C), Deep Frozen (-70°C), and Controlled Room Temperature (15-25°C). Each zone has specific monitoring requirements.",
      tips: ["Log temperatures at least twice daily", "Investigate any excursion immediately", "Keep backup thermometers available"],
    },
    {
      title: "Excursion Handling",
      content: "Temperature excursion occurs when storage temperature goes outside specified range. Document excursion details, duration, affected products, and corrective actions taken.",
      tips: ["Quarantine affected products immediately", "Assess product stability data", "Report significant excursions to QA"],
    },
  ],
  abbreviations: [
    { term: "CRT", fullForm: "Controlled Room Temperature", description: "15-25°C storage condition" },
    { term: "GDP", fullForm: "Good Distribution Practice", description: "Quality standards for distribution" },
    { term: "MKT", fullForm: "Mean Kinetic Temperature", description: "Calculated average temperature" },
    { term: "VVM", fullForm: "Vaccine Vial Monitor", description: "Temperature indicator on vaccines" },
  ],
};

export const expiryManagementGuide: UserGuideProps = {
  moduleTitle: "Expiry Management",
  moduleDescription: "Track and manage product expiry dates. Get alerts for approaching expiry, manage near-expiry stock disposition, and prevent expired product usage.",
  workflows: [
    { step: 1, title: "Monitor Expiry", description: "Review dashboard for items approaching expiry." },
    { step: 2, title: "Alert Review", description: "Check items within 90/60/30 day expiry windows." },
    { step: 3, title: "Disposition Decision", description: "Decide on return, discount sale, or destruction." },
    { step: 4, title: "Execute Action", description: "Process the decided disposition." },
    { step: 5, title: "Documentation", description: "Maintain records of expired stock handling." },
  ],
  sections: [
    {
      title: "Expiry Alerts",
      content: "System generates alerts at configurable intervals (90, 60, 30 days before expiry). Different alert levels trigger different actions and escalations.",
      tips: ["Review expiry report weekly", "Prioritize FEFO in dispatches", "Negotiate returns with suppliers for slow-moving items"],
    },
    {
      title: "Expired Stock Handling",
      content: "Expired products must be segregated, documented, and disposed of properly. Pharmaceutical waste requires special handling and certified destruction.",
      tips: ["Never use expired products", "Maintain destruction certificates", "Analyze expiry patterns to improve ordering"],
    },
  ],
  abbreviations: [
    { term: "SLOB", fullForm: "Slow and Obsolete", description: "Slow-moving or outdated inventory" },
    { term: "FEFO", fullForm: "First Expiry First Out", description: "Dispatch method for perishables" },
    { term: "BBD", fullForm: "Best Before Date", description: "Quality guarantee date" },
    { term: "USL", fullForm: "Use By Date", description: "Safety expiry date" },
  ],
};

// ==================== PROCUREMENT MODULE GUIDES ====================

export const vendorsGuide: UserGuideProps = {
  moduleTitle: "Vendor Management",
  moduleDescription: "Manage supplier database including registration, qualification, evaluation, and performance tracking. Ensure compliance with GMP requirements for pharmaceutical vendors.",
  workflows: [
    { step: 1, title: "Vendor Registration", description: "Collect vendor details and documentation." },
    { step: 2, title: "Qualification", description: "Verify GMP compliance and quality certifications." },
    { step: 3, title: "Approval", description: "QA approves vendor for specific materials." },
    { step: 4, title: "Onboarding", description: "Set up vendor in system with payment terms." },
    { step: 5, title: "Performance Review", description: "Periodic evaluation of vendor performance." },
  ],
  sections: [
    {
      title: "Vendor Types",
      content: "Vendors are categorized as Raw Material Suppliers, Packaging Suppliers, Service Providers, Equipment Suppliers, and Contract Manufacturers. Each type has specific qualification requirements.",
      tips: ["Maintain at least 2 approved vendors per critical material", "Verify GMP certificates annually", "Visit critical vendors periodically"],
    },
    {
      title: "Vendor Qualification",
      content: "Qualification process includes document review, quality questionnaire, site audit (for critical vendors), and sample testing. Only qualified vendors can supply regulated materials.",
      tips: ["Keep qualification records updated", "Re-qualify after significant changes", "Track qualification expiry dates"],
    },
    {
      title: "Performance Metrics",
      content: "Track vendor performance on Quality (rejection rate), Delivery (on-time delivery), Price competitiveness, and Service responsiveness. Use scorecard for periodic evaluation.",
      tips: ["Review performance quarterly", "Share feedback with vendors", "Develop improvement plans for underperformers"],
    },
  ],
  abbreviations: [
    { term: "GMP", fullForm: "Good Manufacturing Practice", description: "Quality standards for manufacturing" },
    { term: "AVL", fullForm: "Approved Vendor List", description: "List of qualified suppliers" },
    { term: "MOA", fullForm: "Memorandum of Agreement", description: "Formal vendor agreement" },
    { term: "NDA", fullForm: "Non-Disclosure Agreement", description: "Confidentiality agreement" },
    { term: "QAA", fullForm: "Quality Assurance Agreement", description: "Quality terms with vendor" },
    { term: "OTD", fullForm: "On-Time Delivery", description: "Delivery performance metric" },
  ],
};

export const purchaseRequisitionsGuide: UserGuideProps = {
  moduleTitle: "Purchase Requisitions",
  moduleDescription: "Create and manage internal purchase requests. Initiate procurement process with proper approvals before converting to purchase orders.",
  workflows: [
    { step: 1, title: "Create PR", description: "Raise purchase requisition with item details." },
    { step: 2, title: "Add Items", description: "Specify items, quantities, and required dates." },
    { step: 3, title: "Submit", description: "Submit PR for approval workflow." },
    { step: 4, title: "Approval", description: "Department head and finance approve based on value." },
    { step: 5, title: "Convert to PO", description: "Procurement converts approved PR to PO." },
  ],
  sections: [
    {
      title: "PR Creation",
      content: "Purchase requisition captures the internal need for materials or services. Include item details, quantity, estimated cost, required date, and justification for the purchase.",
      tips: ["Check existing stock before raising PR", "Consolidate requirements to get better prices", "Allow adequate lead time"],
    },
    {
      title: "Approval Workflow",
      content: "PRs follow approval hierarchy based on value: Department Head → Finance → Management. Higher value PRs require additional approvals.",
      tips: ["Ensure budget availability before submitting", "Provide clear justification for urgent requests", "Track PR status regularly"],
    },
  ],
  abbreviations: [
    { term: "PR", fullForm: "Purchase Requisition", description: "Internal purchase request" },
    { term: "RFQ", fullForm: "Request for Quotation", description: "Formal quote request to vendors" },
    { term: "BOM", fullForm: "Bill of Materials", description: "List of materials for production" },
    { term: "MRP", fullForm: "Material Requirements Planning", description: "System for planning material needs" },
  ],
};


export const purchaseOrdersGuide: UserGuideProps = {
  moduleTitle: "Purchase Orders",
  moduleDescription: "Create and manage purchase orders to vendors. Track order status, deliveries, and ensure timely procurement of materials and services.",
  workflows: [
    { step: 1, title: "Create PO", description: "Generate PO from approved PR or directly." },
    { step: 2, title: "Select Vendor", description: "Choose vendor from approved vendor list." },
    { step: 3, title: "Add Items", description: "Enter items, quantities, prices, and delivery schedule." },
    { step: 4, title: "Approval", description: "Get PO approved based on value thresholds." },
    { step: 5, title: "Send to Vendor", description: "Dispatch PO to vendor for confirmation." },
    { step: 6, title: "Track Delivery", description: "Monitor delivery status and receive goods." },
  ],
  sections: [
    {
      title: "PO Types",
      content: "Standard PO (one-time purchase), Blanket PO (framework agreement for multiple deliveries), and Service PO (for services). Each type has different terms and tracking requirements.",
      tips: ["Use blanket PO for regular purchases", "Include all terms and conditions", "Get vendor acknowledgment"],
    },
    {
      title: "Pricing & Terms",
      content: "PO includes unit price, discounts, taxes, freight terms (FOB, CIF), payment terms, and delivery schedule. Ensure alignment with negotiated contracts.",
      tips: ["Verify prices against quotations", "Include penalty clauses for delays", "Specify quality requirements clearly"],
    },
    {
      title: "PO Amendments",
      content: "Changes to PO after issuance require formal amendment. Track all changes with version history and get necessary approvals for amendments.",
      tips: ["Minimize amendments to maintain vendor relations", "Document reasons for changes", "Re-approve if value increases significantly"],
    },
  ],
  abbreviations: [
    { term: "PO", fullForm: "Purchase Order", description: "Formal order to vendor" },
    { term: "FOB", fullForm: "Free on Board", description: "Shipping term - seller's responsibility ends at port" },
    { term: "CIF", fullForm: "Cost, Insurance, Freight", description: "Shipping term - seller pays to destination" },
    { term: "LC", fullForm: "Letter of Credit", description: "Bank guarantee for payment" },
    { term: "TT", fullForm: "Telegraphic Transfer", description: "Wire transfer payment" },
    { term: "COD", fullForm: "Cash on Delivery", description: "Payment upon receipt" },
  ],
};

export const grnGuide: UserGuideProps = {
  moduleTitle: "Goods Receipt Note (GRN)",
  moduleDescription: "Record receipt of goods against purchase orders. Verify quantities, inspect quality, and update inventory upon goods receipt.",
  workflows: [
    { step: 1, title: "Receive Goods", description: "Physical receipt of goods at warehouse." },
    { step: 2, title: "Verify Documents", description: "Check delivery note, invoice against PO." },
    { step: 3, title: "Quantity Check", description: "Count and verify received quantities." },
    { step: 4, title: "Quality Inspection", description: "Inspect goods and collect samples for QC." },
    { step: 5, title: "Create GRN", description: "Record receipt in system with batch details." },
    { step: 6, title: "Putaway", description: "Store goods in designated locations." },
  ],
  sections: [
    {
      title: "Receipt Process",
      content: "Goods receipt involves physical verification, documentation check, quantity counting, and quality inspection. Any discrepancies must be documented and reported.",
      tips: ["Never receive without valid PO", "Document damages with photos", "Quarantine goods pending QC approval"],
    },
    {
      title: "Quality Sampling",
      content: "Collect samples as per sampling plan for QC testing. Goods remain in quarantine until QC releases the batch. Rejected goods are returned or destroyed.",
      tips: ["Follow sampling SOP strictly", "Label samples properly", "Maintain sample retention as required"],
    },
  ],
  abbreviations: [
    { term: "GRN", fullForm: "Goods Receipt Note", description: "Document recording goods receipt" },
    { term: "DN", fullForm: "Delivery Note", description: "Vendor's dispatch document" },
    { term: "POD", fullForm: "Proof of Delivery", description: "Signed receipt confirmation" },
    { term: "QC", fullForm: "Quality Control", description: "Testing and inspection" },
    { term: "MRN", fullForm: "Material Receipt Note", description: "Alternative term for GRN" },
  ],
};

export const invoicesGuide: UserGuideProps = {
  moduleTitle: "Supplier Invoices",
  moduleDescription: "Process and manage supplier invoices. Match invoices with GRN and PO, verify amounts, and process for payment.",
  workflows: [
    { step: 1, title: "Receive Invoice", description: "Receive invoice from vendor." },
    { step: 2, title: "3-Way Match", description: "Match invoice with PO and GRN." },
    { step: 3, title: "Verify Amounts", description: "Check quantities, prices, taxes, and totals." },
    { step: 4, title: "Resolve Discrepancies", description: "Address any mismatches with vendor." },
    { step: 5, title: "Approve", description: "Get invoice approved for payment." },
    { step: 6, title: "Post to Accounts", description: "Record in accounts payable." },
  ],
  sections: [
    {
      title: "Invoice Matching",
      content: "Three-way matching compares invoice with PO (ordered) and GRN (received). Quantities and prices must match within tolerance. Discrepancies require investigation.",
      tips: ["Set tolerance limits for minor variances", "Reject invoices with major discrepancies", "Track invoice aging"],
    },
    {
      title: "Tax Compliance",
      content: "Verify tax calculations including GST/Sales Tax, Withholding Tax, and any applicable duties. Ensure vendor's tax registration is valid.",
      tips: ["Verify vendor NTN/STRN", "Check tax rates are correct", "Maintain tax invoices for audit"],
    },
  ],
  abbreviations: [
    { term: "AP", fullForm: "Accounts Payable", description: "Money owed to vendors" },
    { term: "GST", fullForm: "General Sales Tax", description: "Indirect tax on goods/services" },
    { term: "WHT", fullForm: "Withholding Tax", description: "Tax deducted at source" },
    { term: "STRN", fullForm: "Sales Tax Registration Number", description: "Vendor's tax registration" },
    { term: "CN", fullForm: "Credit Note", description: "Document reducing amount owed" },
    { term: "DN", fullForm: "Debit Note", description: "Document increasing amount owed" },
  ],
};

export const importsGuide: UserGuideProps = {
  moduleTitle: "Import Purchases",
  moduleDescription: "Manage international procurement including import documentation, customs clearance, and landed cost calculation.",
  workflows: [
    { step: 1, title: "Place Order", description: "Create PO for international vendor." },
    { step: 2, title: "Arrange Payment", description: "Open LC or arrange advance payment." },
    { step: 3, title: "Track Shipment", description: "Monitor shipment from origin to port." },
    { step: 4, title: "Customs Clearance", description: "Process customs documentation and pay duties." },
    { step: 5, title: "Receive Goods", description: "Take delivery and create GRN." },
    { step: 6, title: "Calculate Landed Cost", description: "Compute total cost including all charges." },
  ],
  sections: [
    {
      title: "Import Documentation",
      content: "Key documents include Commercial Invoice, Packing List, Bill of Lading/Airway Bill, Certificate of Origin, Insurance Certificate, and Import License (if required).",
      tips: ["Verify documents before shipment", "Keep copies of all documents", "Ensure HS codes are correct"],
    },
    {
      title: "Landed Cost",
      content: "Total cost of imported goods including product cost, freight, insurance, customs duty, clearing charges, and local transport. Used for accurate inventory valuation.",
      tips: ["Include all costs in landed cost", "Allocate costs to items proportionally", "Review duty rates periodically"],
    },
  ],
  abbreviations: [
    { term: "LC", fullForm: "Letter of Credit", description: "Bank payment guarantee" },
    { term: "BL", fullForm: "Bill of Lading", description: "Sea freight document" },
    { term: "AWB", fullForm: "Airway Bill", description: "Air freight document" },
    { term: "HS", fullForm: "Harmonized System", description: "International product classification" },
    { term: "CIF", fullForm: "Cost, Insurance, Freight", description: "Incoterm including delivery to port" },
    { term: "FOB", fullForm: "Free on Board", description: "Incoterm - buyer arranges shipping" },
    { term: "C&F", fullForm: "Cost and Freight", description: "Incoterm - seller pays freight" },
  ],
};

export const reportsGuide: UserGuideProps = {
  moduleTitle: "Reports & Analytics",
  moduleDescription: "Access comprehensive reports and analytics for data-driven decision making. Export reports in multiple formats for further analysis.",
  workflows: [
    { step: 1, title: "Select Report", description: "Choose report type from available options." },
    { step: 2, title: "Set Filters", description: "Apply date range and other filters." },
    { step: 3, title: "Generate", description: "Run the report with selected parameters." },
    { step: 4, title: "Analyze", description: "Review data and insights." },
    { step: 5, title: "Export", description: "Download in PDF, Excel, or CSV format." },
  ],
  sections: [
    {
      title: "Report Types",
      content: "Available reports include Summary Reports, Detail Reports, Trend Analysis, Comparison Reports, and Compliance Reports. Each serves different analytical needs.",
      tips: ["Use filters to focus on relevant data", "Schedule regular reports for monitoring", "Compare periods for trend analysis"],
    },
    {
      title: "Export Options",
      content: "Reports can be exported as PDF (for sharing/printing), Excel (for further analysis), or CSV (for data import). Print option available for hard copies.",
      tips: ["Use Excel for pivot table analysis", "PDF for formal distribution", "CSV for system integration"],
    },
  ],
  abbreviations: [
    { term: "KPI", fullForm: "Key Performance Indicator", description: "Measurable performance metric" },
    { term: "YTD", fullForm: "Year to Date", description: "From start of year to current date" },
    { term: "MTD", fullForm: "Month to Date", description: "From start of month to current date" },
    { term: "QoQ", fullForm: "Quarter over Quarter", description: "Comparison with previous quarter" },
    { term: "YoY", fullForm: "Year over Year", description: "Comparison with same period last year" },
  ],
};
