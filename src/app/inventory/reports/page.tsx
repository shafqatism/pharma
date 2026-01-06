"use client";

import { useState } from "react";
import { Typography, Card, Row, Col, Select, Tag, Statistic, Progress } from "antd";
import DashboardLayout from "@/components/DashboardLayout";
import ReportTable from "@/components/common/ReportTable";
import UserGuide from "@/components/common/UserGuide";
import { useInventoryStore } from "@/store/inventoryStore";
import { reportsGuide } from "@/data/guideData";

const { Title, Text } = Typography;

export default function InventoryReportsPage() {
  const { items, stockOnHand, batches, warehouses, coldStorageUnits, temperatureExcursions } = useInventoryStore();
  const [reportType, setReportType] = useState("stock-on-hand");

  const totalValue = stockOnHand.reduce((s, st) => s + st.totalValue, 0);

  // Stock on Hand Report
  const stockColumns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName" },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", render: (v: number) => v.toLocaleString() },
    { title: "Available", dataIndex: "availableQuantity", key: "availableQuantity", render: (v: number) => v.toLocaleString() },
    { title: "Unit Cost", dataIndex: "unitCost", key: "unitCost", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Total Value", dataIndex: "totalValue", key: "totalValue", render: (v: number) => `PKR ${v.toLocaleString()}` },
  ];

  // Batch-wise Report
  const batchColumns = [
    { title: "Batch No", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Item", dataIndex: "itemName", key: "itemName" },
    { title: "Type", dataIndex: "batchType", key: "batchType", render: (t: string) => <Tag color={t === "Manufactured" ? "blue" : "green"}>{t}</Tag> },
    { title: "Mfg Date", dataIndex: "manufacturingDate", key: "manufacturingDate" },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "Current Qty", dataIndex: "currentQuantity", key: "currentQuantity", render: (v: number) => v.toLocaleString() },
    { title: "QC Status", dataIndex: "qcStatus", key: "qcStatus", render: (s: string) => <Tag color={s === "Approved" ? "green" : "orange"}>{s}</Tag> },
    { title: "Status", dataIndex: "batchStatus", key: "batchStatus", render: (s: string) => <Tag color={s === "Active" ? "green" : "orange"}>{s}</Tag> },
  ];

  // Warehouse Utilization
  const warehouseUtil = warehouses.map((w) => {
    const whStock = stockOnHand.filter((s) => s.warehouseId === w.id);
    const totalQty = whStock.reduce((s, st) => s + st.quantity, 0);
    const utilization = Math.min((totalQty / w.capacityUnits) * 100, 100);
    return { ...w, totalQty, utilization };
  });

  const warehouseColumns = [
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName" },
    { title: "Type", dataIndex: "warehouseType", key: "warehouseType", render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: "Capacity", dataIndex: "capacityUnits", key: "capacityUnits", render: (v: number) => v.toLocaleString() },
    { title: "Current Stock", dataIndex: "totalQty", key: "totalQty", render: (v: number) => v.toLocaleString() },
    { title: "Utilization", dataIndex: "utilization", key: "utilization", render: (v: number) => <Progress percent={Math.round(v)} size="small" status={v > 90 ? "exception" : "normal"} /> },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag> },
  ];

  // Cold Chain Compliance
  const coldChainData = coldStorageUnits.map((u) => {
    const excursions = temperatureExcursions.filter((e) => e.coldStorageUnitId === u.id);
    return { ...u, excursionCount: excursions.length, openExcursions: excursions.filter((e) => e.status === "Open").length };
  });

  const coldChainColumns = [
    { title: "Unit ID", dataIndex: "unitId", key: "unitId" },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName" },
    { title: "Temp Range", key: "tempRange", render: (_: unknown, r: typeof coldChainData[0]) => `${r.temperatureMin}°C - ${r.temperatureMax}°C` },
    { title: "Calibration", dataIndex: "calibrationDate", key: "calibrationDate" },
    { title: "Total Excursions", dataIndex: "excursionCount", key: "excursionCount" },
    { title: "Open Excursions", dataIndex: "openExcursions", key: "openExcursions", render: (v: number) => <Tag color={v > 0 ? "red" : "green"}>{v}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Active" ? "green" : "orange"}>{s}</Tag> },
  ];

  // Valuation by Category
  const categoryValuation = items.reduce((acc, item) => {
    const itemStock = stockOnHand.filter((s) => s.itemId === item.id);
    const value = itemStock.reduce((s, st) => s + st.totalValue, 0);
    acc[item.category] = (acc[item.category] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  const valuationData = Object.entries(categoryValuation).map(([category, value], i) => ({
    key: i,
    category,
    value,
    percentage: Math.round((value / totalValue) * 100),
  }));

  const valuationColumns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Value (PKR)", dataIndex: "value", key: "value", render: (v: number) => v.toLocaleString() },
    { title: "% of Total", dataIndex: "percentage", key: "percentage", render: (v: number) => <Progress percent={v} size="small" /> },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Inventory Reports</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Comprehensive inventory analytics and reports</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <UserGuide {...reportsGuide} />
          <Select value={reportType} onChange={setReportType} style={{ width: 200 }}>
            <Select.Option value="stock-on-hand">Stock on Hand</Select.Option>
            <Select.Option value="batch-wise">Batch-wise Inventory</Select.Option>
            <Select.Option value="warehouse-util">Warehouse Utilization</Select.Option>
            <Select.Option value="cold-chain">Cold Chain Compliance</Select.Option>
            <Select.Option value="valuation">Inventory Valuation</Select.Option>
          </Select>
        </div>
      </div>

      {reportType === "stock-on-hand" && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={8}><Card size="small"><Statistic title="Total Items" value={stockOnHand.length} valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={8}><Card size="small"><Statistic title="Total Quantity" value={stockOnHand.reduce((s, st) => s + st.quantity, 0)} valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={8}><Card size="small"><Statistic title="Total Value" value={totalValue} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
          </Row>
          <Card title="Stock on Hand Report" size="small">
            <ReportTable columns={stockColumns} dataSource={stockOnHand} rowKey="id" exportFileName="stock-on-hand" title="Stock on Hand Report" />
          </Card>
        </>
      )}

      {reportType === "batch-wise" && (
        <Card title="Batch-wise Inventory Report" size="small">
          <ReportTable columns={batchColumns} dataSource={batches} rowKey="id" exportFileName="batch-inventory" title="Batch-wise Inventory Report" />
        </Card>
      )}

      {reportType === "warehouse-util" && (
        <Card title="Warehouse Utilization Report" size="small">
          <ReportTable columns={warehouseColumns} dataSource={warehouseUtil} rowKey="id" exportFileName="warehouse-utilization" title="Warehouse Utilization Report" pagination={false} />
        </Card>
      )}

      {reportType === "cold-chain" && (
        <Card title="Cold Chain Compliance Report" size="small">
          <ReportTable columns={coldChainColumns} dataSource={coldChainData} rowKey="id" exportFileName="cold-chain-compliance" title="Cold Chain Compliance Report" pagination={false} />
        </Card>
      )}

      {reportType === "valuation" && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Card title="Inventory Valuation by Category" size="small">
                <ReportTable columns={valuationColumns} dataSource={valuationData} rowKey="key" exportFileName="inventory-valuation-category" title="Inventory Valuation by Category" pagination={false} />
              </Card>
            </Col>
          </Row>
          <Card title="Detailed Valuation" size="small">
            <ReportTable columns={stockColumns} dataSource={stockOnHand} rowKey="id" exportFileName="detailed-valuation" title="Detailed Inventory Valuation Report" />
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
