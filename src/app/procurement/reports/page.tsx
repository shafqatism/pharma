"use client";

import { useState } from "react";
import { Typography, Card, Row, Col, Select, Tag, Statistic, Progress } from "antd";
import { BarChartOutlined, PieChartOutlined, LineChartOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import ReportTable from "@/components/common/ReportTable";
import UserGuide from "@/components/common/UserGuide";
import { useProcurementStore } from "@/store/procurementStore";
import { reportsGuide } from "@/data/guideData";

const { Title, Text } = Typography;

export default function ProcurementReportsPage() {
  const { vendors, purchaseRequisitions, purchaseOrders, importPurchases } = useProcurementStore();
  const [reportType, setReportType] = useState("spend-analysis");

  // Spend by Category
  const spendByCategory = purchaseOrders.reduce((acc, po) => {
    po.items.forEach((item) => {
      const category = item.itemCode.startsWith("RM") ? "Raw Materials" : item.itemCode.startsWith("PKG") ? "Packaging" : item.itemCode.startsWith("EQ") ? "Equipment" : "Other";
      acc[category] = (acc[category] || 0) + item.lineTotal;
    });
    return acc;
  }, {} as Record<string, number>);

  // Top Vendors by Value
  const vendorSpend = purchaseOrders.reduce((acc, po) => {
    acc[po.vendorName] = (acc[po.vendorName] || 0) + po.totalPOValue;
    return acc;
  }, {} as Record<string, number>);

  const totalPOValue = purchaseOrders.reduce((s, p) => s + p.totalPOValue, 0);
  const topVendors = Object.entries(vendorSpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], i) => ({ key: i, vendor: name, value, percentage: Math.round((value / (totalPOValue || 1)) * 100) }));

  // PR Summary
  const prSummary = {
    total: purchaseRequisitions.length,
    draft: purchaseRequisitions.filter((p) => p.status === "Draft").length,
    submitted: purchaseRequisitions.filter((p) => p.status === "Submitted").length,
    approved: purchaseRequisitions.filter((p) => p.status === "Approved" || p.status === "Converted to PO").length,
    rejected: purchaseRequisitions.filter((p) => p.status === "Rejected").length,
  };

  // PO Summary
  const poSummary = {
    total: purchaseOrders.length,
    open: purchaseOrders.filter((p) => p.status === "Open").length,
    partial: purchaseOrders.filter((p) => p.status === "Partial").length,
    closed: purchaseOrders.filter((p) => p.status === "Closed").length,
    totalValue: totalPOValue,
  };

  // Vendor Performance Data
  const vendorPerformance = vendors.map((v) => ({
    key: v.id,
    vendorId: v.vendorId,
    vendor: v.legalName,
    type: v.vendorType,
    rating: v.qualityRating,
    riskCategory: v.riskCategory,
    status: v.status,
    gmpCertified: v.gmpCertified ? "Yes" : "No",
  }));

  const totalSpend = Object.values(spendByCategory).reduce((s, v) => s + v, 0);
  const categoryData = Object.entries(spendByCategory).map(([category, spend], i) => ({
    key: i,
    category,
    spend,
    percentage: Math.round((spend / (totalSpend || 1)) * 100),
  }));

  // PR Report Data
  const prReportData = purchaseRequisitions.map((pr) => ({
    key: pr.id,
    prNumber: pr.prNumber,
    date: pr.requisitionDate,
    requestedBy: pr.requestedBy,
    department: pr.department,
    priority: pr.priority,
    totalCost: pr.totalEstimatedCost,
    status: pr.status,
  }));

  // PO Report Data
  const poReportData = purchaseOrders.map((po) => ({
    key: po.id,
    poNumber: po.poNumber,
    date: po.poDate,
    vendor: po.vendorName,
    currency: po.currency,
    totalValue: po.totalPOValue,
    approvalStatus: po.approvalStatus,
    status: po.status,
  }));

  // Import Data
  const importData = importPurchases.map((i) => ({
    key: i.id,
    importRefNumber: i.importRefNumber,
    vendorName: i.vendorName,
    supplierCountry: i.supplierCountry,
    freightCharges: i.freightCharges,
    customsDuty: i.customsDuty,
    totalValue: i.totalValue,
    status: i.status,
  }));

  const categoryColumns = [
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Spend (PKR)", dataIndex: "spend", key: "spend", render: (v: number) => v.toLocaleString() },
    { title: "% of Total", dataIndex: "percentage", key: "percentage", render: (v: number) => <Progress percent={v} size="small" /> },
  ];

  const vendorColumns = [
    { title: "Vendor ID", dataIndex: "vendorId", key: "vendorId" },
    { title: "Vendor", dataIndex: "vendor", key: "vendor" },
    { title: "Type", dataIndex: "type", key: "type", render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: "Rating", dataIndex: "rating", key: "rating", render: (r: number) => <Tag color={r >= 4 ? "green" : r >= 3 ? "orange" : "red"}>{r}/5</Tag> },
    { title: "Risk", dataIndex: "riskCategory", key: "riskCategory", render: (r: string) => <Tag color={r === "Low" ? "green" : r === "Medium" ? "orange" : "red"}>{r}</Tag> },
    { title: "GMP", dataIndex: "gmpCertified", key: "gmpCertified", render: (v: string) => <Tag color={v === "Yes" ? "green" : "red"}>{v}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Active" ? "green" : "default"}>{s}</Tag> },
  ];

  const topVendorColumns = [
    { title: "Vendor", dataIndex: "vendor", key: "vendor" },
    { title: "Total Value (PKR)", dataIndex: "value", key: "value", render: (v: number) => v.toLocaleString() },
    { title: "% of Total", dataIndex: "percentage", key: "percentage", render: (v: number) => <Progress percent={v} size="small" /> },
  ];

  const prColumns = [
    { title: "PR Number", dataIndex: "prNumber", key: "prNumber" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Requested By", dataIndex: "requestedBy", key: "requestedBy" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Priority", dataIndex: "priority", key: "priority", render: (p: string) => <Tag color={p === "Emergency" ? "red" : p === "Urgent" ? "orange" : "blue"}>{p}</Tag> },
    { title: "Est. Cost", dataIndex: "totalCost", key: "totalCost", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Approved" || s === "Converted to PO" ? "green" : s === "Rejected" ? "red" : "orange"}>{s}</Tag> },
  ];

  const poColumns = [
    { title: "PO Number", dataIndex: "poNumber", key: "poNumber" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Vendor", dataIndex: "vendor", key: "vendor" },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    { title: "Total Value", dataIndex: "totalValue", key: "totalValue", render: (v: number) => v.toLocaleString() },
    { title: "Approval", dataIndex: "approvalStatus", key: "approvalStatus", render: (s: string) => <Tag color={s === "Approved" ? "green" : "orange"}>{s}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Closed" ? "green" : s === "Open" ? "blue" : "orange"}>{s}</Tag> },
  ];

  const importColumns = [
    { title: "Import Ref", dataIndex: "importRefNumber", key: "importRefNumber" },
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName" },
    { title: "Country", dataIndex: "supplierCountry", key: "supplierCountry" },
    { title: "Freight", dataIndex: "freightCharges", key: "freightCharges", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Duty", dataIndex: "customsDuty", key: "customsDuty", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Total", dataIndex: "totalValue", key: "totalValue", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Cleared" ? "green" : "orange"}>{s}</Tag> },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Procurement Reports & Analytics</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Comprehensive procurement insights and analysis</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <UserGuide {...reportsGuide} />
          <Select value={reportType} onChange={setReportType} style={{ width: 200 }}>
            <Select.Option value="spend-analysis">Spend Analysis</Select.Option>
            <Select.Option value="vendor-performance">Vendor Performance</Select.Option>
            <Select.Option value="pr-summary">PR Summary</Select.Option>
            <Select.Option value="po-summary">PO Summary</Select.Option>
            <Select.Option value="import-analysis">Import Analysis</Select.Option>
          </Select>
        </div>
      </div>

      {reportType === "spend-analysis" && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="Total PO Value" value={poSummary.totalValue} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Total POs" value={poSummary.total} valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Avg PO Value" value={Math.round(poSummary.totalValue / (poSummary.total || 1))} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Active Vendors" value={vendors.filter((v) => v.status === "Active").length} valueStyle={{ fontSize: 18 }} /></Card></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title={<><PieChartOutlined /> Spend by Category</>} size="small">
                <ReportTable columns={categoryColumns} dataSource={categoryData} rowKey="key" exportFileName="spend-by-category" title="Spend by Category Report" pagination={false} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title={<><BarChartOutlined /> Top Vendors by Value</>} size="small">
                <ReportTable columns={topVendorColumns} dataSource={topVendors} rowKey="key" exportFileName="top-vendors" title="Top Vendors Report" pagination={false} />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {reportType === "vendor-performance" && (
        <Card title="Vendor Performance Report" size="small">
          <ReportTable columns={vendorColumns} dataSource={vendorPerformance} rowKey="key" exportFileName="vendor-performance" title="Vendor Performance Report" />
        </Card>
      )}

      {reportType === "pr-summary" && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="Total PRs" value={prSummary.total} valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Approved" value={prSummary.approved} valueStyle={{ fontSize: 18, color: "#52c41a" }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Pending" value={prSummary.submitted + prSummary.draft} valueStyle={{ fontSize: 18, color: "#faad14" }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Rejected" value={prSummary.rejected} valueStyle={{ fontSize: 18, color: "#ff4d4f" }} /></Card></Col>
          </Row>
          <Card title="Purchase Requisition Summary" size="small">
            <ReportTable columns={prColumns} dataSource={prReportData} rowKey="key" exportFileName="pr-summary" title="Purchase Requisition Summary Report" />
          </Card>
        </>
      )}

      {reportType === "po-summary" && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="Total POs" value={poSummary.total} valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Open" value={poSummary.open} valueStyle={{ fontSize: 18, color: "#1890ff" }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Closed" value={poSummary.closed} valueStyle={{ fontSize: 18, color: "#52c41a" }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Total Value" value={poSummary.totalValue} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
          </Row>
          <Card title="Purchase Order Summary" size="small">
            <ReportTable columns={poColumns} dataSource={poReportData} rowKey="key" exportFileName="po-summary" title="Purchase Order Summary Report" />
          </Card>
        </>
      )}

      {reportType === "import-analysis" && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={6}><Card size="small"><Statistic title="Total Imports" value={importPurchases.length} valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Total Value" value={importPurchases.reduce((s, i) => s + i.totalValue, 0)} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Total Freight" value={importPurchases.reduce((s, i) => s + i.freightCharges, 0)} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
            <Col span={6}><Card size="small"><Statistic title="Total Duty" value={importPurchases.reduce((s, i) => s + i.customsDuty, 0)} prefix="PKR" valueStyle={{ fontSize: 18 }} /></Card></Col>
          </Row>
          <Card title={<><LineChartOutlined /> Import Cost Analysis</>} size="small">
            <ReportTable columns={importColumns} dataSource={importData} rowKey="key" exportFileName="import-analysis" title="Import Cost Analysis Report" />
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
