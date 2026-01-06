// Item / Product Master
export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  genericName: string;
  brandName: string;
  category: 'Raw Material' | 'Finished Goods' | 'Packaging' | 'Consumables';
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'API' | 'Cream' | 'Ointment' | 'Other';
  strength: string;
  primaryUOM: string;
  secondaryUOM: string;
  conversionFactor: number;
  shelfLifeMonths: number;
  storageCondition: 'Room Temp' | 'Cold' | 'Frozen';
  hazardClass: string;
  // Regulatory
  drugRegistrationNumber: string;
  regulatoryAuthority: string;
  controlledDrug: boolean;
  prescriptionRequired: boolean;
  importRestricted: boolean;
  // Inventory Control
  minStockLevel: number;
  maxStockLevel: number;
  reorderLevel: number;
  reorderQuantity: number;
  safetyStock: number;
  batchTrackingRequired: boolean;
  expiryTrackingRequired: boolean;
  serialTracking: boolean;
  // Financial
  valuationMethod: 'FIFO' | 'FEFO' | 'Weighted Average';
  standardCost: number;
  purchaseCost: number;
  sellingPrice: number;
  taxCategory: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  createdAt: string;
}

// Warehouse
export interface Warehouse {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  warehouseType: 'Main' | 'Distribution' | 'Quarantine' | 'Cold Storage';
  address: string;
  city: string;
  country: string;
  responsibleManager: string;
  temperatureControlled: boolean;
  capacityUnits: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

// Warehouse Location
export interface WarehouseLocation {
  id: string;
  locationCode: string;
  warehouseId: string;
  warehouseName: string;
  parentLocation: string;
  locationType: 'Zone' | 'Aisle' | 'Rack' | 'Shelf' | 'Bin';
  storageType: string;
  allowedCategories: string[];
  temperatureRange: string;
  hazardCompatibility: string;
  status: 'Active' | 'Inactive';
}

// Batch / Lot
export interface Batch {
  id: string;
  batchNumber: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  batchType: 'Manufactured' | 'Purchased';
  manufacturingDate: string;
  expiryDate: string;
  retestDate: string;
  quantityProduced: number;
  qcStatus: 'Pending' | 'Approved' | 'Rejected';
  releaseDate: string;
  releasedBy: string;
  batchStatus: 'Active' | 'Quarantine' | 'Blocked' | 'Expired';
  storageLocation: string;
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  recallEligible: boolean;
  createdAt: string;
}

// Stock on Hand
export interface StockOnHand {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unitCost: number;
  totalValue: number;
  lastUpdated: string;
}

// Stock Transfer
export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  requestedBy: string;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  transferDate: string;
  items: StockTransferItem[];
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  dispatchDate: string;
  receivingConfirmation: boolean;
  completionStatus: 'Draft' | 'Pending' | 'In Transit' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface StockTransferItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  receivedQuantity?: number;
  variance?: number;
}

// Cold Storage Unit
export interface ColdStorageUnit {
  id: string;
  unitId: string;
  warehouseId: string;
  warehouseName: string;
  temperatureMin: number;
  temperatureMax: number;
  humidityMin: number;
  humidityMax: number;
  sensorDeviceId: string;
  calibrationDate: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
}

// Temperature Log
export interface TemperatureLog {
  id: string;
  coldStorageUnitId: string;
  unitName: string;
  dateTime: string;
  recordedTemperature: number;
  recordedHumidity: number;
  status: 'Within Range' | 'Excursion';
  alertSent: boolean;
}

// Temperature Excursion
export interface TemperatureExcursion {
  id: string;
  coldStorageUnitId: string;
  unitName: string;
  excursionStartTime: string;
  excursionEndTime: string;
  maxDeviation: number;
  minDeviation: number;
  rootCause: string;
  correctiveAction: string;
  productImpactAssessment: string;
  qaApproval: 'Pending' | 'Approved' | 'Rejected';
  status: 'Open' | 'Closed';
}

// Inventory Adjustment
export interface InventoryAdjustment {
  id: string;
  adjustmentNumber: string;
  adjustmentDate: string;
  adjustmentType: 'Damage' | 'Loss' | 'Audit' | 'Correction' | 'Write-Off';
  itemId: string;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  warehouseId: string;
  warehouseName: string;
  locationCode: string;
  quantityBefore: number;
  quantityAdjusted: number;
  quantityAfter: number;
  reasonCode: string;
  remarks: string;
  approvalReference: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  financialImpact: number;
  adjustedBy: string;
  createdAt: string;
}

// Expiry Configuration
export interface ExpiryConfig {
  id: string;
  alertDays: number[];
  autoBlockOnExpiry: boolean;
  fefoEnforcement: boolean;
  updatedAt: string;
}

// Barcode Configuration
export interface BarcodeConfig {
  id: string;
  barcodeType: '1D' | '2D' | 'QR';
  level: 'Item' | 'Batch' | 'Serial';
  dataEncoded: string[];
  prefix: string;
  status: 'Active' | 'Inactive';
}
