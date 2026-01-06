"use client";

import React from "react";
import { Row, Col, Card, Typography, Progress, List, Tag, Table } from "antd";
import {
  InboxOutlined,
  WarningOutlined,
  ThunderboltOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import { useInventoryStore } from "@/store/inventoryStore";

const { Title, Text } = Typography;

export default function InventoryDashboard() {
  const { items, stockOnHand, batches, temperatureExcursions, coldStorageUnits } = useInventoryStore();

  const totalInventoryValue = stockOnHand.reduce((sum, s) => sum + s.totalValue, 0);
  const totalItems = items.length;
  const activeBatches = batches.filter((b) => b.batchStatus === "Active").length;

  // Near expiry (within 90 days)
  const today = new Date();
  const nearExpiryBatches = batches.filter((b) => {
    const expiry = new Date(b.expiryDate);
    const diffDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 90 && b.batchStatus === "Active";
  });

  const expiredBatches = batches.filter((b) => {
    const expiry = new Date(b.expiryDate);
    return expiry < today;
  });

  const openExcursions = temperatureExcursions.filter((e) => e.status === "Open").length;

  const stats = [
    { key: "1", title: "Total Inventory Value", value: `PKR ${(totalInventoryValue / 1000000).toFixed(2)}M`, prefix: <DollarOutlined />, color: "#00BFFF" },
    { key: "2", title: "Active Items", value: totalItems, prefix: <InboxOutlined />, color: "#52c41a" },
    { key: "3", title: "Near-Expiry Batches", value: nearExpiryBatches.length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "4", title: "Cold Chain Excursions", value: openExcursions, prefix: <ThunderboltOutlined />, color: "#ff4d4f" },
  ];

  const stockColumns = [
    { title: "Item", dataIndex: "itemName", key: "itemName" },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName" },
    { title: "Qty", dataIndex: "quantity", key: "quantity", render: (v: number) => v.toLocaleString() },
    { title: "Value", dataIndex: "totalValue", key: "totalValue", render: (v: number) => `PKR ${v.toLocaleString()}` },
  ];

  const expiryColumns = [
    { title: "Item", dataIndex: "itemName", key: "itemName" },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "Days Left", key: "daysLeft", render: (_: unknown, r: typeof nearExpiryBatches[0]) => {
      const days = Math.floor((new Date(r.expiryDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return <Tag color={days <= 30 ? "red" : days <= 60 ? "orange" : "gold"}>{days} days</Tag>;
    }},
    { title: "Qty", dataIndex: "currentQuantity", key: "currentQuantity", render: (v: number) => v.toLocaleString() },
  ];

  // Category distribution
  const categoryDist = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>Inventory Dashboard</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>Real-time inventory visibility and KPIs</Text>
      </div>

      <StatsCard stats={stats} columns={4} />

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="Stock Overview" size="small" styles={{ body: { padding: 12 } }}>
            <Table columns={stockColumns} dataSource={stockOnHand.slice(0, 5)} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Inventory by Category" size="small" styles={{ body: { padding: 12 } }}>
            {Object.entries(categoryDist).map(([cat, count]) => (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>{cat}</Text>
                  <Text style={{ fontSize: 11 }}>{count} items</Text>
                </div>
                <Progress percent={Math.round((count / totalItems) * 100)} size="small" strokeColor="#00BFFF" />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={<><WarningOutlined style={{ color: "#faad14", marginRight: 8 }} />Near-Expiry Stock (90 days)</>} size="small" styles={{ body: { padding: 0 } }}>
            {nearExpiryBatches.length > 0 ? (
              <Table columns={expiryColumns} dataSource={nearExpiryBatches} rowKey="id" pagination={false} size="small" />
            ) : (
              <div style={{ padding: 24, textAlign: "center" }}>
                <Text type="secondary" style={{ fontSize: 12 }}>No near-expiry stock</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><ThunderboltOutlined style={{ color: "#00BFFF", marginRight: 8 }} />Cold Chain Status</>} size="small" styles={{ body: { padding: 0 } }}>
            <List
              size="small"
              dataSource={coldStorageUnits}
              renderItem={(unit) => (
                <List.Item style={{ padding: "8px 12px" }}>
                  <List.Item.Meta
                    title={<Text style={{ fontSize: 12 }}>{unit.unitId}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 11 }}>{unit.warehouseName}</Text>}
                  />
                  <div style={{ textAlign: "right" }}>
                    <Text style={{ fontSize: 12 }}>{unit.temperatureMin}°C - {unit.temperatureMax}°C</Text>
                    <br />
                    <Tag color={unit.status === "Active" ? "green" : "orange"} style={{ fontSize: 10 }}>{unit.status}</Tag>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Batch Status Summary" size="small">
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 24, fontWeight: 700, color: "#52c41a" }}>{activeBatches}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>Active Batches</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 24, fontWeight: 700, color: "#faad14" }}>{batches.filter((b) => b.batchStatus === "Quarantine").length}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>In Quarantine</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 24, fontWeight: 700, color: "#ff4d4f" }}>{expiredBatches.length}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>Expired</Text>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 24, fontWeight: 700, color: "#1890ff" }}>{batches.filter((b) => b.qcStatus === "Pending").length}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>QC Pending</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
