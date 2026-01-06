// Procurement Configuration
export interface ProcurementConfig {
  id: string;
  policyType: string;
  approvalLevels: number;
  budgetEnforcement: boolean;
  purchaseCategoryMapping: string[];
  currency: string;
  taxRules: string;
  dutyRules: string;
  thresholdLimits: { role: string; limit: number }[];
  emergencyPurchaseFlag: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vendor
export interface Vendor {
  id: string;
  vendorId: string;
  legalName: string;
  vendorType: 'Raw Material' | 'Packaging' | 'Equipment' | 'Services';
  businessCategory: string;
  registrationNumber: string;
  ntnVatGst: string;
  country: string;
  city: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  website: string;
  // Compliance
  gmpCertified: boolean;
  regulatoryLicenseNumber: string;
  licenseExpiryDate: string;
  qualityRating: number;
  auditStatus: 'Pending' | 'Completed' | 'Scheduled';
  blacklisted: boolean;
  riskCategory: 'Low' | 'Medium' | 'High';
  // Financial
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  paymentCurrency: string;
  paymentTerms: 'Advance' | 'Net-30' | 'Net-60' | 'Net-90';
  creditLimit: number;
  taxWithholding: number;
  // Documents
  documents: { type: string; fileName: string; uploadDate: string }[];
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
}

// Vendor Evaluation
export interface VendorEvaluation {
  id: string;
  vendorId: string;
  vendorName: string;
  evaluationPeriod: string;
  deliveryTimeliness: number;
  qualityCompliance: number;
  priceCompetitiveness: number;
  responsiveness: number;
  overallScore: number;
  status: 'Approved' | 'Conditional' | 'Rejected';
  evaluatedBy: string;
  evaluationDate: string;
  remarks: string;
}

// Purchase Requisition
export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  requisitionDate: string;
  requestedBy: string;
  department: string;
  costCenter: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  expectedDeliveryDate: string;
  budgetReference: string;
  items: PRItem[];
  lineManagerApproval: ApprovalStatus;
  procurementApproval: ApprovalStatus;
  financeApproval: ApprovalStatus;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Converted to PO';
  totalEstimatedCost: number;
  createdAt: string;
}

export interface PRItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  specification: string;
  uom: string;
  requiredQuantity: number;
  estimatedUnitCost: number;
  totalEstimatedCost: number;
  preferredVendor?: string;
}

export interface ApprovalStatus {
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
}

// Purchase Order
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  vendorId: string;
  vendorName: string;
  referencePR: string;
  currency: string;
  paymentTerms: string;
  deliveryLocation: string;
  incoterms: string;
  deliverySchedule: string;
  items: POItem[];
  subtotal: number;
  taxAmount: number;
  freightCharges: number;
  insurance: number;
  totalPOValue: number;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  status: 'Open' | 'Partial' | 'Closed' | 'Cancelled';
  amendments: { version: number; date: string; changes: string }[];
  attachments: { type: string; fileName: string }[];
  createdAt: string;
}

export interface POItem {
  id: string;
  itemCode: string;
  description: string;
  batchRequired: boolean;
  quantityOrdered: number;
  unitPrice: number;
  discount: number;
  tax: number;
  lineTotal: number;
}

// Goods Receipt Note
export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  grnDate: string;
  poReference: string;
  vendorId: string;
  vendorName: string;
  warehouseLocation: string;
  receivedBy: string;
  items: GRNItem[];
  qcRequired: boolean;
  qcStatus: 'Pending' | 'Approved' | 'Rejected';
  qcRemarks: string;
  stockPosted: boolean;
  inventoryLocation: string;
  status: 'Draft' | 'Completed' | 'Partial';
  createdAt: string;
}

export interface GRNItem {
  id: string;
  itemCode: string;
  itemName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  storageCondition: string;
  serialNumbers?: string[];
}

// Supplier Invoice
export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  vendorId: string;
  vendorName: string;
  poReference: string;
  grnReference: string;
  invoiceAmount: number;
  taxBreakdown: { taxType: string; amount: number }[];
  dueDate: string;
  status: 'Pending' | 'Partially Paid' | 'Paid' | 'Overdue';
  createdAt: string;
}

// Payment
export interface SupplierPayment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Online';
  paymentDate: string;
  paidAmount: number;
  withholdingTax: number;
  advanceAdjustments: number;
  paymentReference: string;
  status: 'Completed' | 'Pending' | 'Failed';
  createdAt: string;
}

// Vendor Ledger Entry
export interface VendorLedgerEntry {
  id: string;
  vendorId: string;
  vendorName: string;
  date: string;
  type: 'Invoice' | 'Payment' | 'Adjustment';
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  description: string;
}

// Import Purchase
export interface ImportPurchase {
  id: string;
  importRefNumber: string;
  supplierCountry: string;
  vendorId: string;
  vendorName: string;
  hsCode: string;
  importLicenseNumber: string;
  currency: string;
  exchangeRate: number;
  freightCharges: number;
  insuranceCharges: number;
  customsDuty: number;
  clearingAgent: string;
  poReference: string;
  totalValue: number;
  status: 'In Progress' | 'Cleared' | 'Pending Clearance';
  createdAt: string;
}

// Shipment Tracking
export interface ShipmentTracking {
  id: string;
  importRefNumber: string;
  shipmentMode: 'Air' | 'Sea' | 'Road';
  containerNumber: string;
  billOfLading: string;
  estimatedArrival: string;
  actualArrival?: string;
  portOfEntry: string;
  clearanceStatus: 'Pending' | 'In Progress' | 'Cleared' | 'Held';
  documents: { type: string; fileName: string; status: string }[];
  status: 'In Transit' | 'Arrived' | 'Cleared' | 'Delivered';
  createdAt: string;
}
