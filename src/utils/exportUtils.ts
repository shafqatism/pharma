import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Company Info
const COMPANY = {
  name: "VALOR PHARMACEUTICALS",
  address: "124/A Industrial Triangle, Kahuta Road, Islamabad PAKISTAN",
  phone: "+92-51-1234567",
  email: "info@valorpharma.com",
  website: "www.valorpharma.com",
};

export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${filename}.csv`);
};

export const exportToExcel = (data: Record<string, unknown>[], filename: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// Draw company header on PDF
const drawPDFHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background
  doc.setFillColor(13, 17, 23);
  doc.rect(0, 0, pageWidth, 35, "F");
  
  // Cyan accent line
  doc.setFillColor(0, 191, 255);
  doc.rect(0, 35, pageWidth, 2, "F");
  
  // Company Name - VALOR
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(0, 191, 255);
  doc.text("VALOR", 15, 18);
  
  // PHARMACEUTICALS
  doc.setFontSize(8);
  doc.setTextColor(0, 191, 255);
  doc.text("PHARMACEUTICALS", 15, 25);
  
  // Company Address (right side)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(COMPANY.address, pageWidth - 15, 15, { align: "right" });
  doc.text(`Tel: ${COMPANY.phone} | ${COMPANY.email}`, pageWidth - 15, 22, { align: "right" });
  
  // Report Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 15, 48);
  
  // Generated date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, pageWidth - 15, 48, { align: "right" });
  
  return 55; // Return Y position after header
};

// Draw footer on PDF
const drawPDFFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Footer line
  doc.setDrawColor(226, 232, 240);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
  
  // Footer text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Confidential - For Internal Use Only", 15, pageHeight - 12);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 12, { align: "center" });
  doc.text(COMPANY.website, pageWidth - 15, pageHeight - 12, { align: "right" });
};

export const exportToPDF = (
  data: Record<string, unknown>[],
  columns: { header: string; dataKey: string }[],
  filename: string,
  title?: string
) => {
  const doc = new jsPDF();
  const startY = drawPDFHeader(doc, title || "Report");

  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: data.map((row) => columns.map((col) => String(row[col.dataKey] ?? ""))),
    startY: startY,
    styles: { 
      fontSize: 9, 
      cellPadding: 4,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: { 
      fillColor: [0, 191, 255], 
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 15, right: 15 },
  });

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawPDFFooter(doc, i, pageCount);
  }

  doc.save(`${filename}.pdf`);
};


export const generateEmployeePDF = (employee: Record<string, unknown>) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  const startY = drawPDFHeader(doc, "Employee Profile");
  
  let y = startY + 5;
  const leftCol = 15;
  const rightCol = pageWidth / 2 + 5;
  const labelWidth = 45;
  const lineHeight = 7;

  const addField = (label: string, value: unknown, x: number, yPos: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`${label}:`, x, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text(String(value || "N/A"), x + labelWidth, yPos);
  };

  const addSection = (title: string, yPos: number) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(15, yPos - 4, pageWidth - 30, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 191, 255);
    doc.text(title, 18, yPos + 1);
    return yPos + 12;
  };

  // Employee ID Badge
  doc.setFillColor(0, 191, 255);
  doc.roundedRect(pageWidth - 60, y - 5, 45, 12, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(String(employee.employeeId || "N/A"), pageWidth - 37.5, y + 2, { align: "center" });

  // Personal Information
  y = addSection("Personal Information", y + 15);
  
  addField("Full Name", employee.fullName, leftCol, y);
  addField("Gender", employee.gender, rightCol, y);
  y += lineHeight;
  
  addField("Father/Spouse", employee.fatherSpouseName, leftCol, y);
  addField("Date of Birth", employee.dateOfBirth, rightCol, y);
  y += lineHeight;
  
  addField("CNIC/Passport", employee.cnicPassport, leftCol, y);
  addField("Marital Status", employee.maritalStatus, rightCol, y);
  y += lineHeight;
  
  addField("Nationality", employee.nationality, leftCol, y);
  addField("Blood Group", employee.bloodGroup, rightCol, y);
  y += lineHeight;
  
  addField("Contact", employee.contactNumber, leftCol, y);
  addField("Email", employee.personalEmail, rightCol, y);
  y += lineHeight + 5;

  // Employment Details
  y = addSection("Employment Details", y);
  
  addField("Company", employee.company, leftCol, y);
  addField("Department", employee.department, rightCol, y);
  y += lineHeight;
  
  addField("Designation", employee.designation, leftCol, y);
  addField("Job Grade", employee.jobGrade, rightCol, y);
  y += lineHeight;
  
  addField("Employment Type", employee.employmentType, leftCol, y);
  addField("Date of Joining", employee.dateOfJoining, rightCol, y);
  y += lineHeight;
  
  addField("Work Location", employee.workLocation, leftCol, y);
  addField("Status", employee.employmentStatus, rightCol, y);
  y += lineHeight;
  
  addField("Reporting To", employee.reportingManager, leftCol, y);
  addField("HR Manager", employee.hrManager, rightCol, y);
  y += lineHeight + 5;

  // Bank & Payroll Details
  y = addSection("Bank & Payroll Details", y);
  
  addField("Bank Name", employee.bankName, leftCol, y);
  addField("Account Title", employee.accountTitle, rightCol, y);
  y += lineHeight;
  
  addField("Account No", employee.accountNumber, leftCol, y);
  addField("Salary Type", employee.salaryType, rightCol, y);
  y += lineHeight;
  
  addField("Basic Salary", `Rs. ${Number(employee.basicSalary || 0).toLocaleString()}`, leftCol, y);
  addField("Payroll Group", employee.payrollGroup, rightCol, y);
  y += lineHeight;

  // Salary Breakdown Table
  y += 10;
  autoTable(doc, {
    head: [["Component", "Amount (Rs.)"]],
    body: [
      ["Basic Salary", Number(employee.basicSalary || 0).toLocaleString()],
      ["House Allowance", Number(employee.houseAllowance || 0).toLocaleString()],
      ["Medical Allowance", Number(employee.medicalAllowance || 0).toLocaleString()],
      ["Transport Allowance", Number(employee.transportAllowance || 0).toLocaleString()],
      ["Other Allowance", Number(employee.otherAllowance || 0).toLocaleString()],
      ["Tax Deduction", `(${Number(employee.taxDeduction || 0).toLocaleString()})`],
      ["EOBI", `(${Number(employee.eobiDeduction || 0).toLocaleString()})`],
      ["Provident Fund", `(${Number(employee.providentFund || 0).toLocaleString()})`],
    ],
    startY: y,
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [0, 191, 255], textColor: [255, 255, 255] },
    columnStyles: { 1: { halign: "right" } },
    margin: { left: 15, right: pageWidth / 2 + 15 },
    tableWidth: pageWidth / 2 - 20,
  });

  // Footer
  drawPDFFooter(doc, 1, 1);

  doc.save(`Employee_${employee.employeeId}.pdf`);
};

export const generatePayslipPDF = (record: {
  employeeName: string;
  employeeId?: string;
  payrollMonth: string;
  payableDays: number;
  grossSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  netPay: number;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  const startY = drawPDFHeader(doc, "Salary Slip");
  
  let y = startY + 5;

  // Employee Info Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 25, 3, 3, "F");
  doc.setDrawColor(0, 191, 255);
  doc.roundedRect(15, y, pageWidth - 30, 25, 3, 3, "S");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(record.employeeName, 22, y + 10);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Pay Period: ${record.payrollMonth}`, 22, y + 18);
  doc.text(`Working Days: ${record.payableDays}`, pageWidth - 22, y + 18, { align: "right" });
  
  y += 35;

  // Earnings & Deductions Table
  autoTable(doc, {
    head: [["Earnings", "Amount", "Deductions", "Amount"]],
    body: [
      ["Gross Salary", `Rs. ${record.grossSalary.toLocaleString()}`, "Total Deductions", `Rs. ${record.totalDeductions.toLocaleString()}`],
      ["Allowances", `Rs. ${record.totalAllowances.toLocaleString()}`, "", ""],
    ],
    startY: y,
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [0, 191, 255], textColor: [255, 255, 255] },
    columnStyles: { 
      1: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });

  y = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

  // Net Pay Box
  doc.setFillColor(0, 191, 255);
  doc.roundedRect(15, y, pageWidth - 30, 20, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("NET PAY", 22, y + 13);
  doc.setFontSize(16);
  doc.text(`Rs. ${record.netPay.toLocaleString()}`, pageWidth - 22, y + 13, { align: "right" });

  y += 35;

  // Note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("This is a computer-generated payslip and does not require a signature.", pageWidth / 2, y, { align: "center" });

  // Footer
  drawPDFFooter(doc, 1, 1);

  doc.save(`Payslip_${record.employeeName}_${record.payrollMonth.replace(/\s/g, "_")}.pdf`);
};
