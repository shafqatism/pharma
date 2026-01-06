"use client";

import React, { useState } from "react";
import { Typography, Select, Card, Table, Tag, Row, Col, Statistic } from "antd";
import DashboardLayout from "@/components/DashboardLayout";
import { useInventoryStore } from "@/store/inventoryStore";

const { Title, Text } = Typography;

export default function StockOnHandPage() {
  const { stockOnHand, warehouses, items } = useInventoryStore();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const filteredStock = stockOnHand.filter((s) => {
    if (selectedWarehouse && s.warehouseId !== selectedWarehouse) return false;
    if (selectedItem && s.itemId !== selectedItem) return false;
    return true;
  });

  const totalQty = filteredStock.reduce((s, st) => s + st.quantity, 0);
  const totalValue = filteredStock.reduce((s, st) => s + st.totalValue, 0);
  const totalAvailable = filteredStock.reduce((s, st) => s + st.availableQuantity, 0);

  const columns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode", width: 100 },
    { title: "Item Name", dataIndex: "itemName", key: "itemName", width: 200 },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName", width: 150 },
    { title: "Location", dataIndex: "locationCode", key: "locationCode", width: 130 },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber", width: 130 },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate", width: 100, render: (d: string) => {
      const days = Math.floor((new Date(d).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return <span style={{ color: days <= 90 ? "#ff4d4f" : days <= 180 ? "#faad14" : "inherit" }}>{d}</span>;
    }},
    { title: "Quantity", dataIndex: "quantity", key: "quantity", width: 100, render: (v: number) => v.toLocaleString() },
    { title: "Reserved", dataIndex: "reservedQuantity", key: "reservedQuantity", width: 90, render: (v: number) => v.toLocaleString() },
    { title: "Available", dataIndex: "availableQuantity", key: "availableQuantity", width: 90, render: (v: number) => <Text strong>{v.toLocaleString()}</Text> },
    { title: "Unit Cost", dataIndex: "unitCost", key: "unitCost", width: 100, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Total Value", dataIndex: "totalValue", key: "totalValue", width: 120, render: (v: number) => `PKR ${v.toLocaleString()}` },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Stock on Hand</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Real-time inventory levels by location and batch</Text>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Select
            style={{ width: 200 }}
            placeholder="Filter by Warehouse"
            allowClear
            onChange={(v) => setSelectedWarehouse(v || null)}
          >
            {warehouses.map((w) => <Select.Option key={w.id} value={w.id}>{w.warehouseName}</Select.Option>)}
          </Select>
          <Select
            style={{ width: 200 }}
            placeholder="Filter by Item"
            allowClear
            showSearch
            optionFilterProp="children"
            onChange={(v) => setSelectedItem(v || null)}
          >
            {items.map((i) => <Select.Option key={i.id} value={i.id}>{i.itemCode} - {i.itemName}</Select.Option>)}
          </Select>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Total Quantity" value={totalQty} valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Available Quantity" value={totalAvailable} valueStyle={{ fontSize: 20, color: "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Total Value" value={totalValue} prefix="PKR" valueStyle={{ fontSize: 20, color: "#00BFFF" }} />
          </Card>
        </Col>
      </Row>

      <Card size="small">
        <Table
          columns={columns}
          dataSource={filteredStock}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} records` }}
          size="small"
          scroll={{ x: 1400 }}
        />
      </Card>
    </DashboardLayout>
  );
}
