// Sales Configuration Types
export interface SalesChannel {
  id: string;
  name: string;
  code: string;
  type: "distributor" | "hospital" | "pharmacy" | "retailer" | "export";
  status: "active" | "inactive";
}

export interface SalesRegion {
  id: string;
  name: string;
  code: string;
  territories: string[];
  manager?: string;
  status: "active" | "inactive";
}

export interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: "vat" | "gst" | "sales_tax";
  applicableTo: string[];
  effectiveFrom: string;
  effectiveTo?: string;
  status: "active" | "inactive";
}

export interface CreditControlRule {
  id: string;
  customerType: string;
  maxCreditLimit: number;
  maxCreditDays: number;
  autoBlockOnOverdue: boolean;
  gracePeriodDays: number;
  status: "active" | "inactive";
}

export interface DiscountThreshold {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "volume";
  minOrderValue?: number;
  maxDiscount: number;
  approvalRequired: boolean;
  approverRole?: string;
  validFrom: string;
  validTo: string;
  status: "active" | "inactive";
}

// Customer Types
export interface Customer {
  id: string;
  code: string;
  name: string;
  type: "distributor" | "hospital" | "pharmacy" | "retailer";
  region: string;
  territory: string;
  contactPerson: string;
  phone: string;
  email: string;
  billingAddress: string;
  shippingAddress: string;
  // Regulatory
  drugLicenseNumber: string;
  issuingAuthority: string;
  licenseExpiry: string;
  controlledDrugAuth: boolean;
  prescriptionRequired: boolean;
  complianceStatus: "valid" | "expired" | "blocked";
  // Financial
  creditLimit: number;
  paymentTerms: "cash" | "net-15" | "net-30" | "net-60";
  creditDays: number;
  currentOutstanding: number;
  creditHold: boolean;
  // Commercial
  priceListId: string;
  discountEligibility: boolean;
  salesRepId: string;
  deliveryPriority: "normal" | "high" | "urgent";
  // Documents
  documents: CustomerDocument[];
  status: "active" | "suspended" | "blacklisted";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDocument {
  id: string;
  type: "drug_license" | "tax_registration" | "contract";
  fileName: string;
  uploadedAt: string;
}

// Sales Order Types
export interface SalesOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  customerId: string;
  customerName: string;
  salesChannel: string;
  salesRepId: string;
  salesRepName: string;
  warehouseId: string;
  warehouseName: string;
  deliveryAddress: string;
  requestedDeliveryDate: string;
  priority: "normal" | "high" | "urgent";
  currency: string;
  // Line Items
  items: SalesOrderItem[];
  // Summary
  subtotal: number;
  totalDiscount: number;
  taxAmount: number;
  netTotal: number;
  // Status & Workflow
  status: "draft" | "submitted" | "approved" | "picking" | "dispatched" | "delivered" | "invoiced" | "closed" | "cancelled";
  salesApproval?: ApprovalInfo;
  financeApproval?: ApprovalInfo;
  // Validation
  stockValidated: boolean;
  creditValidated: boolean;
  licenseValidated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  expiryDate: string;
  availableQty: number;
  orderedQty: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
}

export interface ApprovalInfo {
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  remarks?: string;
}

// Distribution Types
export interface DeliveryNote {
  id: string;
  deliveryNoteNumber: string;
  salesOrderId: string;
  salesOrderNumber: string;
  dispatchDate: string;
  sourceWarehouse: string;
  customerId: string;
  customerName: string;
  transportMode: "own_vehicle" | "courier" | "third_party";
  vehicleNumber?: string;
  driverName?: string;
  items: DeliveryItem[];
  coldChainRequired: boolean;
  status: "pending" | "dispatched" | "in_transit" | "delivered" | "failed";
  podUploaded: boolean;
  podDocument?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface DeliveryItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  quantityDispatched: number;
}

// Sales Return Types
export interface SalesReturn {
  id: string;
  returnNumber: string;
  customerId: string;
  customerName: string;
  originalInvoice: string;
  originalOrder: string;
  returnDate: string;
  items: SalesReturnItem[];
  totalValue: number;
  returnType: "replace" | "credit";
  status: "requested" | "approved" | "qc_pending" | "qc_passed" | "qc_failed" | "processed" | "rejected";
  qcRequired: boolean;
  qcStatus?: "pending" | "passed" | "failed";
  creditNoteNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesReturnItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  expiryDate: string;
  quantityReturned: number;
  reason: "expired" | "damaged" | "recall" | "excess" | "wrong_item";
  unitPrice: number;
  lineTotal: number;
}

// Pricing Types
export interface PriceList {
  id: string;
  name: string;
  customerType: string;
  currency: string;
  effectiveFrom: string;
  effectiveTo: string;
  region?: string;
  items: PriceListItem[];
  status: "active" | "inactive";
  createdAt: string;
}

export interface PriceListItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  basePrice: number;
  taxRate: number;
}

export interface DiscountRule {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "volume";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  campaignCode?: string;
  validFrom: string;
  validTo: string;
  approvalRequired: boolean;
  status: "active" | "inactive";
}

// Distributor Types
export interface Distributor {
  id: string;
  customerId: string;
  name: string;
  assignedTerritory: string[];
  productPortfolio: string[];
  salesTarget: number;
  currentSales: number;
  incentiveEarned: number;
  performanceRating: number;
  status: "active" | "inactive";
}

// Dashboard Types
export interface SalesDashboardData {
  totalSalesMTD: number;
  totalSalesYTD: number;
  ordersByStatus: { status: string; count: number }[];
  topCustomers: { name: string; value: number }[];
  topProducts: { name: string; quantity: number }[];
  returnsPercentage: number;
  outstandingReceivables: number;
  onTimeDeliveryRate: number;
}
