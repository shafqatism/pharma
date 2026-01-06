"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  InventoryItem,
  Warehouse,
  WarehouseLocation,
  Batch,
  StockOnHand,
  StockTransfer,
  ColdStorageUnit,
  TemperatureLog,
  TemperatureExcursion,
  InventoryAdjustment,
  ExpiryConfig,
  BarcodeConfig,
} from "@/types/inventory";
import { inventorySeedData } from "@/data/inventorySeedData";

interface InventoryState {
  items: InventoryItem[];
  warehouses: Warehouse[];
  warehouseLocations: WarehouseLocation[];
  batches: Batch[];
  stockOnHand: StockOnHand[];
  stockTransfers: StockTransfer[];
  coldStorageUnits: ColdStorageUnit[];
  temperatureLogs: TemperatureLog[];
  temperatureExcursions: TemperatureExcursion[];
  inventoryAdjustments: InventoryAdjustment[];
  expiryConfig: ExpiryConfig;
  barcodeConfig: BarcodeConfig[];

  // Items
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;

  // Warehouses
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;

  // Locations
  addWarehouseLocation: (location: WarehouseLocation) => void;
  updateWarehouseLocation: (id: string, location: Partial<WarehouseLocation>) => void;
  deleteWarehouseLocation: (id: string) => void;

  // Batches
  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, batch: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  // Stock
  updateStockOnHand: (id: string, stock: Partial<StockOnHand>) => void;

  // Transfers
  addStockTransfer: (transfer: StockTransfer) => void;
  updateStockTransfer: (id: string, transfer: Partial<StockTransfer>) => void;
  deleteStockTransfer: (id: string) => void;

  // Cold Storage
  addColdStorageUnit: (unit: ColdStorageUnit) => void;
  updateColdStorageUnit: (id: string, unit: Partial<ColdStorageUnit>) => void;
  deleteColdStorageUnit: (id: string) => void;

  // Temperature
  addTemperatureLog: (log: TemperatureLog) => void;
  addTemperatureExcursion: (excursion: TemperatureExcursion) => void;
  updateTemperatureExcursion: (id: string, excursion: Partial<TemperatureExcursion>) => void;

  // Adjustments
  addInventoryAdjustment: (adjustment: InventoryAdjustment) => void;
  updateInventoryAdjustment: (id: string, adjustment: Partial<InventoryAdjustment>) => void;

  // Config
  updateExpiryConfig: (config: Partial<ExpiryConfig>) => void;
  addBarcodeConfig: (config: BarcodeConfig) => void;
  updateBarcodeConfig: (id: string, config: Partial<BarcodeConfig>) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      ...inventorySeedData,

      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, item) => set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, ...item } : i)) })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      addWarehouse: (warehouse) => set((state) => ({ warehouses: [...state.warehouses, warehouse] })),
      updateWarehouse: (id, warehouse) => set((state) => ({ warehouses: state.warehouses.map((w) => (w.id === id ? { ...w, ...warehouse } : w)) })),
      deleteWarehouse: (id) => set((state) => ({ warehouses: state.warehouses.filter((w) => w.id !== id) })),

      addWarehouseLocation: (location) => set((state) => ({ warehouseLocations: [...state.warehouseLocations, location] })),
      updateWarehouseLocation: (id, location) => set((state) => ({ warehouseLocations: state.warehouseLocations.map((l) => (l.id === id ? { ...l, ...location } : l)) })),
      deleteWarehouseLocation: (id) => set((state) => ({ warehouseLocations: state.warehouseLocations.filter((l) => l.id !== id) })),

      addBatch: (batch) => set((state) => ({ batches: [...state.batches, batch] })),
      updateBatch: (id, batch) => set((state) => ({ batches: state.batches.map((b) => (b.id === id ? { ...b, ...batch } : b)) })),
      deleteBatch: (id) => set((state) => ({ batches: state.batches.filter((b) => b.id !== id) })),

      updateStockOnHand: (id, stock) => set((state) => ({ stockOnHand: state.stockOnHand.map((s) => (s.id === id ? { ...s, ...stock } : s)) })),

      addStockTransfer: (transfer) => set((state) => ({ stockTransfers: [...state.stockTransfers, transfer] })),
      updateStockTransfer: (id, transfer) => set((state) => ({ stockTransfers: state.stockTransfers.map((t) => (t.id === id ? { ...t, ...transfer } : t)) })),
      deleteStockTransfer: (id) => set((state) => ({ stockTransfers: state.stockTransfers.filter((t) => t.id !== id) })),

      addColdStorageUnit: (unit) => set((state) => ({ coldStorageUnits: [...state.coldStorageUnits, unit] })),
      updateColdStorageUnit: (id, unit) => set((state) => ({ coldStorageUnits: state.coldStorageUnits.map((u) => (u.id === id ? { ...u, ...unit } : u)) })),
      deleteColdStorageUnit: (id) => set((state) => ({ coldStorageUnits: state.coldStorageUnits.filter((u) => u.id !== id) })),

      addTemperatureLog: (log) => set((state) => ({ temperatureLogs: [...state.temperatureLogs, log] })),
      addTemperatureExcursion: (excursion) => set((state) => ({ temperatureExcursions: [...state.temperatureExcursions, excursion] })),
      updateTemperatureExcursion: (id, excursion) => set((state) => ({ temperatureExcursions: state.temperatureExcursions.map((e) => (e.id === id ? { ...e, ...excursion } : e)) })),

      addInventoryAdjustment: (adjustment) => set((state) => ({ inventoryAdjustments: [...state.inventoryAdjustments, adjustment] })),
      updateInventoryAdjustment: (id, adjustment) => set((state) => ({ inventoryAdjustments: state.inventoryAdjustments.map((a) => (a.id === id ? { ...a, ...adjustment } : a)) })),

      updateExpiryConfig: (config) => set((state) => ({ expiryConfig: { ...state.expiryConfig, ...config } })),
      addBarcodeConfig: (config) => set((state) => ({ barcodeConfig: [...state.barcodeConfig, config] })),
      updateBarcodeConfig: (id, config) => set((state) => ({ barcodeConfig: state.barcodeConfig.map((c) => (c.id === id ? { ...c, ...config } : c)) })),
    }),
    { name: "inventory-storage" }
  )
);
