"use client";

import React, { useState } from "react";
import { Typography, Select, Card, Table, Tag, Statistic, Row, Col } from "antd";
import DashboardLayout from "@/components/DashboardLayout";
import { useProcurementStore } from "@/store/procurementStore";

const { Title, Text } = Typography;

export default function VendorLedgerPage() {
  const { vendorLedger, vendors, supplierInvoices, supplierPayments } = useProcurementStore();
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  const filteredLedger = selectedVendor
    ? vendorLedger.filter((e) => e.vendorId === selectedVendor)
    : vendorLedger;

  // Calculate aging for selected vendor
  const getVendorStats = () => {
    if (!selectedVendor) {
      const totalOutstanding = supplierInvoices
        .filter((i) => i.status !== "Paid")
        .reduce((s, i) => s + i.invoiceAmount, 0);
      return { outstanding: totalOutstanding, invoices: supplierInvoices.length, payments: supplierPayments.length };
    }

    const vendorInvoices = supplierInvoices.filter((i) => i.vendorId === selectedVendor);
    const vendorPayments = supplierPayments.filter((p) => p.vendorId === selectedVendor);
    const outstanding = vendorInvoices
      .filter((i) => i.status !== "Paid")
      .reduce((s, i) => s + i.invoiceAmount, 0);

    return { outstanding, invoices: vendorInvoices.length, payments: vendorPayments.length };
  };

  const stats = getVendorStats();

  const columns = [
    { title: "Date", dataIndex: "date", key: "date", width: 100 },
    { title: "Type", dataIndex: "type", key: "type", width: 100, render: (t: string) => <Tag color={t === "Invoice" ? "blue" : t === "Payment" ? "green" : "orange"}>{t}</Tag> },
    { title: "Reference", dataIndex: "reference", key: "reference", width: 150 },
    { title: "Description", dataIndex: "description", key: "description", width: 250 },
    { title: "Debit", dataIndex: "debit", key: "debit", width: 120, render: (v: number) => v > 0 ? `PKR ${v.toLocaleString()}` : "-" },
    { title: "Credit", dataIndex: "credit", key: "credit", width: 120, render: (v: number) => v > 0 ? `PKR ${v.toLocaleString()}` : "-" },
    { title: "Balance", dataIndex: "balance", key: "balance", width: 120, render: (v: number) => <Text strong>PKR {v.toLocaleString()}</Text> },
  ];

  // Aging Analysis
  const getAgingAnalysis = () => {
    const today = new Date();
    const pendingInvoices = supplierInvoices.filter((i) => 
      i.status !== "Paid" && (!selectedVendor || i.vendorId === selectedVendor)
    );

    const aging = { current: 0, days30: 0, days60: 0, days90: 0, over90: 0 };

    pendingInvoices.forEach((inv) => {
      const dueDate = new Date(inv.dueDate);
      const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 0) aging.current += inv.invoiceAmount;
      else if (daysDiff <= 30) aging.days30 += inv.invoiceAmount;
      else if (daysDiff <= 60) aging.days60 += inv.invoiceAmount;
      else if (daysDiff <= 90) aging.days90 += inv.invoiceAmount;
      else aging.over90 += inv.invoiceAmount;
    });

    return aging;
  };

  const aging = getAgingAnalysis();

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Vendor Ledger</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Track vendor transactions and balances</Text>
        </div>
        <Select
          style={{ width: 300 }}
          placeholder="Select Vendor (All)"
          allowClear
          showSearch
          optionFilterProp="children"
          onChange={(v) => setSelectedVendor(v || null)}
        >
          {vendors.map((v) => <Select.Option key={v.id} value={v.id}>{v.legalName}</Select.Option>)}
        </Select>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Outstanding Balance" value={stats.outstanding} prefix="PKR" valueStyle={{ color: "#ff4d4f", fontSize: 20 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Total Invoices" value={stats.invoices} valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Total Payments" value={stats.payments} valueStyle={{ color: "#52c41a", fontSize: 20 }} />
          </Card>
        </Col>
      </Row>

      <Card title="Aging Analysis" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={4}><Statistic title="Current" value={aging.current} prefix="PKR" valueStyle={{ fontSize: 14, color: "#52c41a" }} /></Col>
          <Col span={5}><Statistic title="1-30 Days" value={aging.days30} prefix="PKR" valueStyle={{ fontSize: 14, color: "#faad14" }} /></Col>
          <Col span={5}><Statistic title="31-60 Days" value={aging.days60} prefix="PKR" valueStyle={{ fontSize: 14, color: "#fa8c16" }} /></Col>
          <Col span={5}><Statistic title="61-90 Days" value={aging.days90} prefix="PKR" valueStyle={{ fontSize: 14, color: "#f5222d" }} /></Col>
          <Col span={5}><Statistic title="Over 90 Days" value={aging.over90} prefix="PKR" valueStyle={{ fontSize: 14, color: "#cf1322" }} /></Col>
        </Row>
      </Card>

      <Card title="Ledger Entries" size="small">
        <Table
          columns={columns}
          dataSource={filteredLedger}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          size="small"
        />
      </Card>
    </DashboardLayout>
  );
}
