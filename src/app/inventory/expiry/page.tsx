"use client";

import React, { useState } from "react";
import { Typography, Card, Table, Tag, Row, Col, Statistic, Select, Progress, Switch, InputNumber, Button, message } from "antd";
import { WarningOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import { useInventoryStore } from "@/store/inventoryStore";

const { Title, Text } = Typography;

export default function ExpiryManagementPage() {
  const { batches, expiryConfig, updateExpiryConfig } = useInventoryStore();
  const [alertDays, setAlertDays] = useState(90);

  const today = new Date();

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const diffDays = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { status: "Expired", color: "red", days: diffDays };
    if (diffDays <= 30) return { status: "Critical", color: "red", days: diffDays };
    if (diffDays <= 60) return { status: "Warning", color: "orange", days: diffDays };
    if (diffDays <= 90) return { status: "Near Expiry", color: "gold", days: diffDays };
    return { status: "OK", color: "green", days: diffDays };
  };

  const expiredBatches = batches.filter((b) => getExpiryStatus(b.expiryDate).days < 0);
  const criticalBatches = batches.filter((b) => {
    const days = getExpiryStatus(b.expiryDate).days;
    return days >= 0 && days <= 30;
  });
  const warningBatches = batches.filter((b) => {
    const days = getExpiryStatus(b.expiryDate).days;
    return days > 30 && days <= 60;
  });
  const nearExpiryBatches = batches.filter((b) => {
    const days = getExpiryStatus(b.expiryDate).days;
    return days > 60 && days <= alertDays;
  });

  const filteredBatches = batches.filter((b) => {
    const days = getExpiryStatus(b.expiryDate).days;
    return days <= alertDays;
  }).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  const columns = [
    { title: "Batch No", dataIndex: "batchNumber", key: "batchNumber", width: 130 },
    { title: "Item", dataIndex: "itemName", key: "itemName", width: 200 },
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode", width: 100 },
    { title: "Expiry Date", dataIndex: "expiryDate", key: "expiryDate", width: 100 },
    { title: "Days Left", key: "daysLeft", width: 100, render: (_: unknown, r: typeof batches[0]) => {
      const { days, color } = getExpiryStatus(r.expiryDate);
      return <Tag color={color}>{days < 0 ? `${Math.abs(days)} days ago` : `${days} days`}</Tag>;
    }},
    { title: "Status", key: "status", width: 100, render: (_: unknown, r: typeof batches[0]) => {
      const { status, color } = getExpiryStatus(r.expiryDate);
      return <Tag color={color}>{status}</Tag>;
    }},
    { title: "Location", dataIndex: "storageLocation", key: "storageLocation", width: 130 },
    { title: "Quantity", dataIndex: "currentQuantity", key: "currentQuantity", width: 100, render: (v: number) => v.toLocaleString() },
    { title: "Batch Status", dataIndex: "batchStatus", key: "batchStatus", width: 100, render: (s: string) => <Tag color={s === "Active" ? "green" : "orange"}>{s}</Tag> },
  ];

  const handleSaveConfig = () => {
    updateExpiryConfig({ alertDays: [30, 60, alertDays], updatedAt: new Date().toISOString().split("T")[0] });
    message.success("Configuration saved");
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>Expiry Date Management</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>Monitor and manage product expiry dates</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title={<><WarningOutlined style={{ color: "#ff4d4f", marginRight: 4 }} />Expired</>}
              value={expiredBatches.length}
              valueStyle={{ fontSize: 20, color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Critical (≤30 days)"
              value={criticalBatches.length}
              valueStyle={{ fontSize: 20, color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="Warning (31-60 days)"
              value={warningBatches.length}
              valueStyle={{ fontSize: 20, color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title={`Near Expiry (61-${alertDays} days)`}
              value={nearExpiryBatches.length}
              valueStyle={{ fontSize: 20, color: "#d4b106" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Expiry Distribution" size="small">
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11 }}>Expired</Text>
                <Text style={{ fontSize: 11 }}>{expiredBatches.length} batches</Text>
              </div>
              <Progress percent={Math.round((expiredBatches.length / batches.length) * 100)} strokeColor="#ff4d4f" size="small" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11 }}>Critical (≤30 days)</Text>
                <Text style={{ fontSize: 11 }}>{criticalBatches.length} batches</Text>
              </div>
              <Progress percent={Math.round((criticalBatches.length / batches.length) * 100)} strokeColor="#ff7a45" size="small" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11 }}>Warning (31-60 days)</Text>
                <Text style={{ fontSize: 11 }}>{warningBatches.length} batches</Text>
              </div>
              <Progress percent={Math.round((warningBatches.length / batches.length) * 100)} strokeColor="#faad14" size="small" />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <Text style={{ fontSize: 11 }}>Near Expiry (61-{alertDays} days)</Text>
                <Text style={{ fontSize: 11 }}>{nearExpiryBatches.length} batches</Text>
              </div>
              <Progress percent={Math.round((nearExpiryBatches.length / batches.length) * 100)} strokeColor="#d4b106" size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Expiry Configuration" size="small">
            <div style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 11, display: "block", marginBottom: 4 }}>Alert Days Threshold</Text>
              <InputNumber value={alertDays} onChange={(v) => setAlertDays(v || 90)} min={30} max={365} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 11, display: "block", marginBottom: 4 }}>Auto Block on Expiry</Text>
              <Switch checked={expiryConfig.autoBlockOnExpiry} checkedChildren="Yes" unCheckedChildren="No" disabled />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 11, display: "block", marginBottom: 4 }}>FEFO Enforcement</Text>
              <Switch checked={expiryConfig.fefoEnforcement} checkedChildren="Yes" unCheckedChildren="No" disabled />
            </div>
            <Button type="primary" size="small" block onClick={handleSaveConfig}>Save Configuration</Button>
          </Card>
        </Col>
      </Row>

      <Card title={<><ClockCircleOutlined style={{ marginRight: 8 }} />Near-Expiry Stock Report</>} size="small">
        <Table
          columns={columns}
          dataSource={filteredBatches}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>
    </DashboardLayout>
  );
}
