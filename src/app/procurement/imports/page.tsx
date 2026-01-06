"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, message, Modal, Space } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useProcurementStore } from "@/store/procurementStore";
import { ImportPurchase } from "@/types/procurement";

const { Title, Text } = Typography;

export default function ImportsPage() {
  const { importPurchases, addImportPurchase, updateImportPurchase, deleteImportPurchase, vendors, purchaseOrders } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState<ImportPurchase | null>(null);
  const [form] = Form.useForm();

  const totalValue = importPurchases.reduce((s, i) => s + i.totalValue, 0);

  const stats = [
    { key: "1", title: "Total Imports", value: importPurchases.length, prefix: <span>🚢</span>, color: "#00BFFF" },
    { key: "2", title: "In Progress", value: importPurchases.filter((i) => i.status === "In Progress").length, prefix: <span>⏳</span>, color: "#faad14" },
    { key: "3", title: "Pending Clearance", value: importPurchases.filter((i) => i.status === "Pending Clearance").length, prefix: <span>📋</span>, color: "#722ed1" },
    { key: "4", title: "Total Value", value: `PKR ${(totalValue / 1000000).toFixed(2)}M`, prefix: <span>💰</span>, color: "#52c41a" },
  ];

  const columns = [
    { title: "Import Ref", dataIndex: "importRefNumber", key: "importRefNumber", width: 120 },
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName", width: 180 },
    { title: "Country", dataIndex: "supplierCountry", key: "supplierCountry", width: 100 },
    { title: "HS Code", dataIndex: "hsCode", key: "hsCode", width: 100 },
    { title: "Currency", dataIndex: "currency", key: "currency", width: 80 },
    { title: "Exchange Rate", dataIndex: "exchangeRate", key: "exchangeRate", width: 100 },
    { title: "Total Value", dataIndex: "totalValue", key: "totalValue", width: 130, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", width: 120, render: (s: string) => {
      const colors: Record<string, string> = { "In Progress": "blue", Cleared: "green", "Pending Clearance": "orange" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
  ];

  const handleAdd = () => {
    setSelectedImport(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: ImportPurchase) => {
    setSelectedImport(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: ImportPurchase) => {
    setSelectedImport(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: ImportPurchase) => {
    Modal.confirm({
      title: "Delete Import",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.importRefNumber}?`,
      onOk: () => {
        deleteImportPurchase(record.id);
        message.success("Import deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const vendor = vendors.find((v) => v.id === values.vendorId);
    const baseValue = (values.exchangeRate as number) * 1000; // Simplified calculation
    const totalValue = baseValue + (values.freightCharges as number || 0) + (values.insuranceCharges as number || 0) + (values.customsDuty as number || 0);

    const importData: ImportPurchase = {
      id: selectedImport?.id || `imp${Date.now()}`,
      importRefNumber: values.importRefNumber as string || `IMP-2024-${String(importPurchases.length + 1).padStart(3, "0")}`,
      supplierCountry: values.supplierCountry as string,
      vendorId: values.vendorId as string,
      vendorName: vendor?.legalName || "",
      hsCode: values.hsCode as string,
      importLicenseNumber: values.importLicenseNumber as string,
      currency: values.currency as string,
      exchangeRate: values.exchangeRate as number,
      freightCharges: values.freightCharges as number || 0,
      insuranceCharges: values.insuranceCharges as number || 0,
      customsDuty: values.customsDuty as number || 0,
      clearingAgent: values.clearingAgent as string || "",
      poReference: values.poReference as string || "",
      totalValue,
      status: values.status as ImportPurchase["status"],
      createdAt: selectedImport?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedImport) {
      updateImportPurchase(selectedImport.id, importData);
      message.success("Import updated");
    } else {
      addImportPurchase(importData);
      message.success("Import added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Import Purchases</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage international purchases and customs</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New Import</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={importPurchases}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="import-purchases"
          title="Import Purchases"
        />
      </div>

      <Drawer title={selectedImport ? "Edit Import" : "New Import"} width={700} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "In Progress", currency: "USD" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="vendorId" label="Vendor" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {vendors.filter((v) => v.country !== "Pakistan").map((v) => <Select.Option key={v.id} value={v.id}>{v.legalName} ({v.country})</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="supplierCountry" label="Supplier Country" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="China">China</Select.Option>
                <Select.Option value="Germany">Germany</Select.Option>
                <Select.Option value="India">India</Select.Option>
                <Select.Option value="USA">USA</Select.Option>
                <Select.Option value="UK">UK</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="hsCode" label="HS Code" rules={[{ required: true }]}>
              <Input placeholder="e.g., 9027.20.00" />
            </Form.Item>
            <Form.Item name="importLicenseNumber" label="Import License Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="CNY">CNY</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="exchangeRate" label="Exchange Rate (PKR)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="freightCharges" label="Freight Charges (PKR)">
              <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="insuranceCharges" label="Insurance Charges (PKR)">
              <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="customsDuty" label="Customs Duty (PKR)">
              <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="clearingAgent" label="Clearing Agent">
              <Input />
            </Form.Item>
            <Form.Item name="poReference" label="PO Reference">
              <Select allowClear>
                {purchaseOrders.map((p) => <Select.Option key={p.id} value={p.poNumber}>{p.poNumber}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Pending Clearance">Pending Clearance</Select.Option>
                <Select.Option value="Cleared">Cleared</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Import</Button>
        </Form>
      </Drawer>

      <Drawer title="Import Details" width={700} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedImport && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Import Ref">{selectedImport.importRefNumber}</Descriptions.Item>
              <Descriptions.Item label="Vendor">{selectedImport.vendorName}</Descriptions.Item>
              <Descriptions.Item label="Country">{selectedImport.supplierCountry}</Descriptions.Item>
              <Descriptions.Item label="HS Code">{selectedImport.hsCode}</Descriptions.Item>
              <Descriptions.Item label="Import License">{selectedImport.importLicenseNumber}</Descriptions.Item>
              <Descriptions.Item label="PO Reference">{selectedImport.poReference}</Descriptions.Item>
              <Descriptions.Item label="Currency">{selectedImport.currency}</Descriptions.Item>
              <Descriptions.Item label="Exchange Rate">PKR {selectedImport.exchangeRate}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Cost Breakdown" bordered size="small" column={2}>
              <Descriptions.Item label="Freight Charges">PKR {selectedImport.freightCharges.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Insurance">PKR {selectedImport.insuranceCharges.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Customs Duty">PKR {selectedImport.customsDuty.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Clearing Agent">{selectedImport.clearingAgent}</Descriptions.Item>
              <Descriptions.Item label="Total Value" span={2}><Text strong style={{ fontSize: 14 }}>PKR {selectedImport.totalValue.toLocaleString()}</Text></Descriptions.Item>
            </Descriptions>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Status"><Tag color={selectedImport.status === "Cleared" ? "green" : "orange"}>{selectedImport.status}</Tag></Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
