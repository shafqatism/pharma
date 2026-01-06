"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ProcurementConfig,
  Vendor,
  VendorEvaluation,
  PurchaseRequisition,
  PurchaseOrder,
  GoodsReceiptNote,
  SupplierInvoice,
  SupplierPayment,
  VendorLedgerEntry,
  ImportPurchase,
  ShipmentTracking,
} from "@/types/procurement";
import { procurementSeedData } from "@/data/procurementSeedData";

interface ProcurementState {
  config: ProcurementConfig | null;
  vendors: Vendor[];
  vendorEvaluations: VendorEvaluation[];
  purchaseRequisitions: PurchaseRequisition[];
  purchaseOrders: PurchaseOrder[];
  goodsReceiptNotes: GoodsReceiptNote[];
  supplierInvoices: SupplierInvoice[];
  supplierPayments: SupplierPayment[];
  vendorLedger: VendorLedgerEntry[];
  importPurchases: ImportPurchase[];
  shipmentTracking: ShipmentTracking[];

  // Config
  setConfig: (config: ProcurementConfig) => void;

  // Vendors
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // Vendor Evaluations
  addVendorEvaluation: (evaluation: VendorEvaluation) => void;
  updateVendorEvaluation: (id: string, evaluation: Partial<VendorEvaluation>) => void;
  deleteVendorEvaluation: (id: string) => void;

  // Purchase Requisitions
  addPurchaseRequisition: (pr: PurchaseRequisition) => void;
  updatePurchaseRequisition: (id: string, pr: Partial<PurchaseRequisition>) => void;
  deletePurchaseRequisition: (id: string) => void;

  // Purchase Orders
  addPurchaseOrder: (po: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;

  // GRN
  addGoodsReceiptNote: (grn: GoodsReceiptNote) => void;
  updateGoodsReceiptNote: (id: string, grn: Partial<GoodsReceiptNote>) => void;
  deleteGoodsReceiptNote: (id: string) => void;

  // Invoices
  addSupplierInvoice: (invoice: SupplierInvoice) => void;
  updateSupplierInvoice: (id: string, invoice: Partial<SupplierInvoice>) => void;
  deleteSupplierInvoice: (id: string) => void;

  // Payments
  addSupplierPayment: (payment: SupplierPayment) => void;
  updateSupplierPayment: (id: string, payment: Partial<SupplierPayment>) => void;
  deleteSupplierPayment: (id: string) => void;

  // Ledger
  addVendorLedgerEntry: (entry: VendorLedgerEntry) => void;

  // Import
  addImportPurchase: (importPurchase: ImportPurchase) => void;
  updateImportPurchase: (id: string, importPurchase: Partial<ImportPurchase>) => void;
  deleteImportPurchase: (id: string) => void;

  // Shipment
  addShipmentTracking: (shipment: ShipmentTracking) => void;
  updateShipmentTracking: (id: string, shipment: Partial<ShipmentTracking>) => void;
  deleteShipmentTracking: (id: string) => void;
}

export const useProcurementStore = create<ProcurementState>()(
  persist(
    (set) => ({
      ...procurementSeedData,

      setConfig: (config) => set({ config }),

      addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
      updateVendor: (id, vendor) =>
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...vendor } : v)),
        })),
      deleteVendor: (id) => set((state) => ({ vendors: state.vendors.filter((v) => v.id !== id) })),

      addVendorEvaluation: (evaluation) =>
        set((state) => ({ vendorEvaluations: [...state.vendorEvaluations, evaluation] })),
      updateVendorEvaluation: (id, evaluation) =>
        set((state) => ({
          vendorEvaluations: state.vendorEvaluations.map((e) =>
            e.id === id ? { ...e, ...evaluation } : e
          ),
        })),
      deleteVendorEvaluation: (id) =>
        set((state) => ({ vendorEvaluations: state.vendorEvaluations.filter((e) => e.id !== id) })),

      addPurchaseRequisition: (pr) =>
        set((state) => ({ purchaseRequisitions: [...state.purchaseRequisitions, pr] })),
      updatePurchaseRequisition: (id, pr) =>
        set((state) => ({
          purchaseRequisitions: state.purchaseRequisitions.map((p) =>
            p.id === id ? { ...p, ...pr } : p
          ),
        })),
      deletePurchaseRequisition: (id) =>
        set((state) => ({
          purchaseRequisitions: state.purchaseRequisitions.filter((p) => p.id !== id),
        })),

      addPurchaseOrder: (po) =>
        set((state) => ({ purchaseOrders: [...state.purchaseOrders, po] })),
      updatePurchaseOrder: (id, po) =>
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((p) => (p.id === id ? { ...p, ...po } : p)),
        })),
      deletePurchaseOrder: (id) =>
        set((state) => ({ purchaseOrders: state.purchaseOrders.filter((p) => p.id !== id) })),

      addGoodsReceiptNote: (grn) =>
        set((state) => ({ goodsReceiptNotes: [...state.goodsReceiptNotes, grn] })),
      updateGoodsReceiptNote: (id, grn) =>
        set((state) => ({
          goodsReceiptNotes: state.goodsReceiptNotes.map((g) =>
            g.id === id ? { ...g, ...grn } : g
          ),
        })),
      deleteGoodsReceiptNote: (id) =>
        set((state) => ({ goodsReceiptNotes: state.goodsReceiptNotes.filter((g) => g.id !== id) })),

      addSupplierInvoice: (invoice) =>
        set((state) => ({ supplierInvoices: [...state.supplierInvoices, invoice] })),
      updateSupplierInvoice: (id, invoice) =>
        set((state) => ({
          supplierInvoices: state.supplierInvoices.map((i) =>
            i.id === id ? { ...i, ...invoice } : i
          ),
        })),
      deleteSupplierInvoice: (id) =>
        set((state) => ({ supplierInvoices: state.supplierInvoices.filter((i) => i.id !== id) })),

      addSupplierPayment: (payment) =>
        set((state) => ({ supplierPayments: [...state.supplierPayments, payment] })),
      updateSupplierPayment: (id, payment) =>
        set((state) => ({
          supplierPayments: state.supplierPayments.map((p) =>
            p.id === id ? { ...p, ...payment } : p
          ),
        })),
      deleteSupplierPayment: (id) =>
        set((state) => ({ supplierPayments: state.supplierPayments.filter((p) => p.id !== id) })),

      addVendorLedgerEntry: (entry) =>
        set((state) => ({ vendorLedger: [...state.vendorLedger, entry] })),

      addImportPurchase: (importPurchase) =>
        set((state) => ({ importPurchases: [...state.importPurchases, importPurchase] })),
      updateImportPurchase: (id, importPurchase) =>
        set((state) => ({
          importPurchases: state.importPurchases.map((i) =>
            i.id === id ? { ...i, ...importPurchase } : i
          ),
        })),
      deleteImportPurchase: (id) =>
        set((state) => ({ importPurchases: state.importPurchases.filter((i) => i.id !== id) })),

      addShipmentTracking: (shipment) =>
        set((state) => ({ shipmentTracking: [...state.shipmentTracking, shipment] })),
      updateShipmentTracking: (id, shipment) =>
        set((state) => ({
          shipmentTracking: state.shipmentTracking.map((s) =>
            s.id === id ? { ...s, ...shipment } : s
          ),
        })),
      deleteShipmentTracking: (id) =>
        set((state) => ({ shipmentTracking: state.shipmentTracking.filter((s) => s.id !== id) })),
    }),
    { name: "procurement-storage" }
  )
);
