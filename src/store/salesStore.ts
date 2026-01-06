"use client";

import { create } from "zustand";
import {
  Customer,
  SalesOrder,
  DeliveryNote,
  SalesReturn,
  PriceList,
  SalesChannel,
  SalesRegion,
  Distributor,
  SalesOrderItem,
  SalesReturnItem,
} from "@/types/sales";
import {
  customers as initialCustomers,
  salesOrders as initialOrders,
  deliveryNotes as initialDeliveryNotes,
  salesReturns as initialReturns,
  priceLists as initialPriceLists,
  salesChannels as initialChannels,
  salesRegions as initialRegions,
  distributors as initialDistributors,
  salesDashboardData,
} from "@/data/salesSeedData";

interface SalesState {
  // Data
  customers: Customer[];
  salesOrders: SalesOrder[];
  deliveryNotes: DeliveryNote[];
  salesReturns: SalesReturn[];
  priceLists: PriceList[];
  salesChannels: SalesChannel[];
  salesRegions: SalesRegion[];
  distributors: Distributor[];
  dashboardData: typeof salesDashboardData;

  // Customer Actions
  addCustomer: (customer: Omit<Customer, "id" | "code" | "createdAt" | "updatedAt">) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Sales Order Actions
  addSalesOrder: (order: Omit<SalesOrder, "id" | "orderNumber" | "createdAt" | "updatedAt">) => void;
  updateSalesOrder: (id: string, data: Partial<SalesOrder>) => void;
  updateOrderStatus: (id: string, status: SalesOrder["status"]) => void;
  approveSalesOrder: (id: string, approverType: "sales" | "finance", approvedBy: string) => void;
  deleteSalesOrder: (id: string) => void;

  // Delivery Note Actions
  addDeliveryNote: (note: Omit<DeliveryNote, "id" | "deliveryNoteNumber" | "createdAt">) => void;
  updateDeliveryNote: (id: string, data: Partial<DeliveryNote>) => void;
  updateDeliveryStatus: (id: string, status: DeliveryNote["status"]) => void;

  // Sales Return Actions
  addSalesReturn: (returnReq: Omit<SalesReturn, "id" | "returnNumber" | "createdAt" | "updatedAt">) => void;
  updateSalesReturn: (id: string, data: Partial<SalesReturn>) => void;
  processSalesReturn: (id: string, qcStatus: "passed" | "failed") => void;

  // Price List Actions
  addPriceList: (priceList: Omit<PriceList, "id" | "createdAt">) => void;
  updatePriceList: (id: string, data: Partial<PriceList>) => void;

  // Distributor Actions
  updateDistributor: (id: string, data: Partial<Distributor>) => void;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  customers: initialCustomers,
  salesOrders: initialOrders,
  deliveryNotes: initialDeliveryNotes,
  salesReturns: initialReturns,
  priceLists: initialPriceLists,
  salesChannels: initialChannels,
  salesRegions: initialRegions,
  distributors: initialDistributors,
  dashboardData: salesDashboardData,

  // Customer Actions
  addCustomer: (customer) => {
    const id = `CUST${String(get().customers.length + 1).padStart(3, "0")}`;
    const newCustomer: Customer = {
      ...customer,
      id,
      code: id,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ customers: [...state.customers, newCustomer] }));
  },

  updateCustomer: (id, data) => {
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString().split("T")[0] } : c
      ),
    }));
  },

  deleteCustomer: (id) => {
    set((state) => ({ customers: state.customers.filter((c) => c.id !== id) }));
  },

  // Sales Order Actions
  addSalesOrder: (order) => {
    const orderCount = get().salesOrders.length + 1;
    const id = `SO${String(orderCount).padStart(3, "0")}`;
    const orderNumber = `SO-${new Date().getFullYear()}-${String(orderCount).padStart(4, "0")}`;
    const newOrder: SalesOrder = {
      ...order,
      id,
      orderNumber,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ salesOrders: [...state.salesOrders, newOrder] }));
  },

  updateSalesOrder: (id, data) => {
    set((state) => ({
      salesOrders: state.salesOrders.map((o) =>
        o.id === id ? { ...o, ...data, updatedAt: new Date().toISOString().split("T")[0] } : o
      ),
    }));
  },

  updateOrderStatus: (id, status) => {
    set((state) => ({
      salesOrders: state.salesOrders.map((o) =>
        o.id === id ? { ...o, status, updatedAt: new Date().toISOString().split("T")[0] } : o
      ),
    }));
  },

  approveSalesOrder: (id, approverType, approvedBy) => {
    set((state) => ({
      salesOrders: state.salesOrders.map((o) => {
        if (o.id !== id) return o;
        const approval = { status: "approved" as const, approvedBy, approvedAt: new Date().toISOString().split("T")[0] };
        if (approverType === "sales") {
          return { ...o, salesApproval: approval, status: "approved" as const, updatedAt: new Date().toISOString().split("T")[0] };
        }
        return { ...o, financeApproval: approval, updatedAt: new Date().toISOString().split("T")[0] };
      }),
    }));
  },

  deleteSalesOrder: (id) => {
    set((state) => ({ salesOrders: state.salesOrders.filter((o) => o.id !== id) }));
  },

  // Delivery Note Actions
  addDeliveryNote: (note) => {
    const count = get().deliveryNotes.length + 1;
    const id = `DN${String(count).padStart(3, "0")}`;
    const deliveryNoteNumber = `DN-${new Date().getFullYear()}-${String(count).padStart(4, "0")}`;
    const newNote: DeliveryNote = {
      ...note,
      id,
      deliveryNoteNumber,
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ deliveryNotes: [...state.deliveryNotes, newNote] }));
  },

  updateDeliveryNote: (id, data) => {
    set((state) => ({
      deliveryNotes: state.deliveryNotes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    }));
  },

  updateDeliveryStatus: (id, status) => {
    set((state) => ({
      deliveryNotes: state.deliveryNotes.map((n) =>
        n.id === id ? { ...n, status, ...(status === "delivered" ? { deliveredAt: new Date().toISOString().split("T")[0] } : {}) } : n
      ),
    }));
  },

  // Sales Return Actions
  addSalesReturn: (returnReq) => {
    const count = get().salesReturns.length + 1;
    const id = `SR${String(count).padStart(3, "0")}`;
    const returnNumber = `RET-${new Date().getFullYear()}-${String(count).padStart(4, "0")}`;
    const newReturn: SalesReturn = {
      ...returnReq,
      id,
      returnNumber,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ salesReturns: [...state.salesReturns, newReturn] }));
  },

  updateSalesReturn: (id, data) => {
    set((state) => ({
      salesReturns: state.salesReturns.map((r) =>
        r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString().split("T")[0] } : r
      ),
    }));
  },

  processSalesReturn: (id, qcStatus) => {
    set((state) => ({
      salesReturns: state.salesReturns.map((r) => {
        if (r.id !== id) return r;
        const status = qcStatus === "passed" ? "processed" : "qc_failed";
        const creditNoteNumber = qcStatus === "passed" ? `CN-${new Date().getFullYear()}-${String(Math.random()).slice(2, 6)}` : undefined;
        return { ...r, qcStatus, status, creditNoteNumber, updatedAt: new Date().toISOString().split("T")[0] };
      }),
    }));
  },

  // Price List Actions
  addPriceList: (priceList) => {
    const id = `PL${String(get().priceLists.length + 1).padStart(3, "0")}`;
    const newPriceList: PriceList = {
      ...priceList,
      id,
      createdAt: new Date().toISOString().split("T")[0],
    };
    set((state) => ({ priceLists: [...state.priceLists, newPriceList] }));
  },

  updatePriceList: (id, data) => {
    set((state) => ({
      priceLists: state.priceLists.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  // Distributor Actions
  updateDistributor: (id, data) => {
    set((state) => ({
      distributors: state.distributors.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }));
  },
}));
