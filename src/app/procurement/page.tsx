"use client";

import React from "react";
import { Row, Col, Card, Typography, Progress, List, Tag, Space, Table } from "antd";
import {
  ShoppingCartOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import { useProcurementStore } from "@/store/procurementStore";

const { Title, Text } = Typography;

export default function ProcurementDashboard() {
  const { vendors, purchaseRequisitions, purchaseOrders, goodsReceiptNotes, supplierInvoices, importPurchases } = useProcurementStore();

  const totalPurchaseValue = purchaseOrders.reduce((sum, po) => sum + po.totalPOValue, 0);
  const openRequisitions = purchaseRequisitions.filter((pr) => pr.status !== "Converted to PO" && pr.status !== "Rejected").length;
  const pendingApprovals = purchaseRequisitions.filter((pr) => pr.status === "Submitted" || pr.status === "Under Review").length;
  const avgVendorScore = vendors.length > 0 ? (vendors.reduce((sum, v) => sum + v.qualityRating, 0) / vendors.length).toFixed(1) : 0;

  const stats = [
    { key: "1", title: "Total Purchase Value", value: `PKR ${(totalPurchaseValue / 1000000).toFixed(2)}M`, prefix: <DollarOutlined />, color: "#00BFFF" },
    { key: "2", title: "Open Requisitions", value: openRequisitions, prefix: <FileTextOutlined />, color: "#faad14" },
    { key: "3", title: "Pending Approvals", value: pendingApprovals, prefix: <ClockCircleOutlined />, color: "#ff4d4f" },
    { key: "4", title: "Avg Vendor Score", value: avgVendorScore, prefix: <TrophyOutlined />, color: "#52c41a" },
  ];

  const recentPOs = purchaseOrders.slice(0, 5).map((po) => ({
    key: po.id,
    poNumber: po.poNumber,
    vendor: po.vendorName,
    value: po.totalPOValue,
    status: po.status,
  }));

  const poColumns = [
    { title: "PO Number", dataIndex: "poNumber", key: "poNumber" },
    { title: "Vendor", dataIndex: "vendor", key: "vendor" },
    { title: "Value", dataIndex: "value", key: "value", render: (v: number) => `PKR ${v.toLocaleString()}` },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s: string) => (
        <Tag color={s === "Closed" ? "green" : s === "Open" ? "blue" : s === "Partial" ? "orange" : "red"}>{s}</Tag>
      ),
    },
  ];

  const pendingInvoices = supplierInvoices.filter((inv) => inv.status === "Pending" || inv.status === "Overdue");
  const inTransitShipments = importPurchases.filter((imp) => imp.status === "In Progress" || imp.status === "Pending Clearance");

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>Procurement Dashboard</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>Overview of procurement activities and KPIs</Text>
      </div>

      <StatsCard stats={stats} columns={4} />

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={14}>
          <Card title="Recent Purchase Orders" size="small" styles={{ body: { padding: 12 } }}>
            <Table columns={poColumns} dataSource={recentPOs} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Procurement Cycle Status" size="small" styles={{ body: { padding: 12 } }}>
            <Space direction="vertical" style={{ width: "100%" }} size={12}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>PRs Converted to PO</Text>
                  <Text style={{ fontSize: 11 }}>{purchaseRequisitions.filter((p) => p.status === "Converted to PO").length}/{purchaseRequisitions.length}</Text>
                </div>
                <Progress percent={Math.round((purchaseRequisitions.filter((p) => p.status === "Converted to PO").length / purchaseRequisitions.length) * 100)} size="small" strokeColor="#00BFFF" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>POs Closed</Text>
                  <Text style={{ fontSize: 11 }}>{purchaseOrders.filter((p) => p.status === "Closed").length}/{purchaseOrders.length}</Text>
                </div>
                <Progress percent={Math.round((purchaseOrders.filter((p) => p.status === "Closed").length / purchaseOrders.length) * 100)} size="small" strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={{ fontSize: 11 }}>GRNs Completed</Text>
                  <Text style={{ fontSize: 11 }}>{goodsReceiptNotes.filter((g) => g.status === "Completed").length}/{goodsReceiptNotes.length}</Text>
                </div>
                <Progress percent={Math.round((goodsReceiptNotes.filter((g) => g.status === "Completed").length / goodsReceiptNotes.length) * 100)} size="small" strokeColor="#faad14" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={<><WarningOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />Pending Invoices</>} size="small" styles={{ body: { padding: 0 } }}>
            <List
              size="small"
              dataSource={pendingInvoices}
              renderItem={(inv) => (
                <List.Item style={{ padding: "8px 12px" }}>
                  <List.Item.Meta
                    title={<Text style={{ fontSize: 12 }}>{inv.invoiceNumber}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 11 }}>{inv.vendorName}</Text>}
                  />
                  <div style={{ textAlign: "right" }}>
                    <Text style={{ fontSize: 12 }}>PKR {inv.invoiceAmount.toLocaleString()}</Text>
                    <br />
                    <Tag color={inv.status === "Overdue" ? "red" : "orange"} style={{ fontSize: 10 }}>{inv.status}</Tag>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: <Text type="secondary" style={{ fontSize: 11 }}>No pending invoices</Text> }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><ShoppingCartOutlined style={{ color: "#00BFFF", marginRight: 8 }} />In-Transit Shipments</>} size="small" styles={{ body: { padding: 0 } }}>
            <List
              size="small"
              dataSource={inTransitShipments}
              renderItem={(imp) => (
                <List.Item style={{ padding: "8px 12px" }}>
                  <List.Item.Meta
                    title={<Text style={{ fontSize: 12 }}>{imp.importRefNumber}</Text>}
                    description={<Text type="secondary" style={{ fontSize: 11 }}>{imp.vendorName} - {imp.supplierCountry}</Text>}
                  />
                  <div style={{ textAlign: "right" }}>
                    <Text style={{ fontSize: 12 }}>{imp.currency} {imp.totalValue.toLocaleString()}</Text>
                    <br />
                    <Tag color={imp.status === "In Progress" ? "blue" : "orange"} style={{ fontSize: 10 }}>{imp.status}</Tag>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: <Text type="secondary" style={{ fontSize: 11 }}>No shipments in transit</Text> }}
            />
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
