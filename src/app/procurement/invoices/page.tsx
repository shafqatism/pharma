"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, message, Modal, Table } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useProcurementStore } from "@/store/procurementStore";
import { SupplierInvoice } from "@/types/procurement";

const { Title, Text } = Typography;

export default function InvoicesPage() {
  const { supplierInvoices, addSupplierInvoice, updateSupplierInvoice, deleteSupplierInvoice, vendors, purchaseOrders, goodsReceiptNotes } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [form] = Form.useForm();

  const totalPending = supplierInvoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.invoiceAmount, 0);
  const totalOverdue = supplierInvoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.invoiceAmount, 0);

  const stats = [
    { key: "1", title: "Total Invoices", value: supplierInvoices.length, prefix: <span>📄</span>, color: "#00BFFF" },
    { key: "2", title: "Pending", value: supplierInvoices.filter((i) => i.status === "Pending").length, prefix: <span>⏳</span>, color: "#faad14" },
    { key: "3", title: "Pending Amount", value: `PKR ${(totalPending / 1000).toFixed(0)}K`, prefix: <span>💰</span>, color: "#722ed1" },
    { key: "4", title: "Overdue Amount", value: `PKR ${(totalOverdue / 1000).toFixed(0)}K`, prefix: <span>⚠️</span>, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Invoice No", dataIndex: "invoiceNumber", key: "invoiceNumber", width: 140 },
    { title: "Date", dataIndex: "invoiceDate", key: "invoiceDate", width: 100 },
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName", width: 180 },
    { title: "PO Ref", dataIndex: "poReference", key: "poReference", width: 110 },
    { title: "Amount", dataIndex: "invoiceAmount", key: "invoiceAmount", width: 130, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Due Date", dataIndex: "dueDate", key: "dueDate", width: 100 },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (s: string) => {
      const colors: Record<string, string> = { Pending: "orange", "Partially Paid": "blue", Paid: "green", Overdue: "red" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
  ];

  const handleAdd = () => {
    setSelectedInvoice(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: SupplierInvoice) => {
    setSelectedInvoice(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: SupplierInvoice) => {
    setSelectedInvoice(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: SupplierInvoice) => {
    Modal.confirm({
      title: "Delete Invoice",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.invoiceNumber}?`,
      onOk: () => {
        deleteSupplierInvoice(record.id);
        message.success("Invoice deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const vendor = vendors.find((v) => v.id === values.vendorId);
    const invoiceData: SupplierInvoice = {
      id: selectedInvoice?.id || `inv${Date.now()}`,
      invoiceNumber: values.invoiceNumber as string,
      invoiceDate: values.invoiceDate as string,
      vendorId: values.vendorId as string,
      vendorName: vendor?.legalName || "",
      poReference: values.poReference as string,
      grnReference: values.grnReference as string || "",
      invoiceAmount: values.invoiceAmount as number,
      taxBreakdown: [{ taxType: "GST 17%", amount: (values.invoiceAmount as number) * 0.17 / 1.17 }],
      dueDate: values.dueDate as string,
      status: values.status as SupplierInvoice["status"],
      createdAt: selectedInvoice?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedInvoice) {
      updateSupplierInvoice(selectedInvoice.id, invoiceData);
      message.success("Invoice updated");
    } else {
      addSupplierInvoice(invoiceData);
      message.success("Invoice added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Supplier Invoices</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage supplier invoices and track payments</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Invoice</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={supplierInvoices}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="supplier-invoices"
          title="Supplier Invoices"
        />
      </div>

      <Drawer title={selectedInvoice ? "Edit Invoice" : "Add Invoice"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "Pending" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="invoiceDate" label="Invoice Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="vendorId" label="Vendor" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {vendors.map((v) => <Select.Option key={v.id} value={v.id}>{v.legalName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="poReference" label="PO Reference" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {purchaseOrders.map((p) => <Select.Option key={p.id} value={p.poNumber}>{p.poNumber}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="grnReference" label="GRN Reference">
              <Select allowClear showSearch optionFilterProp="children">
                {goodsReceiptNotes.map((g) => <Select.Option key={g.id} value={g.grnNumber}>{g.grnNumber}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="invoiceAmount" label="Invoice Amount" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Partially Paid">Partially Paid</Select.Option>
                <Select.Option value="Paid">Paid</Select.Option>
                <Select.Option value="Overdue">Overdue</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Invoice</Button>
        </Form>
      </Drawer>

      <Drawer title="Invoice Details" width={600} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedInvoice && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Invoice Number">{selectedInvoice.invoiceNumber}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedInvoice.invoiceDate}</Descriptions.Item>
            <Descriptions.Item label="Vendor">{selectedInvoice.vendorName}</Descriptions.Item>
            <Descriptions.Item label="PO Reference">{selectedInvoice.poReference}</Descriptions.Item>
            <Descriptions.Item label="GRN Reference">{selectedInvoice.grnReference}</Descriptions.Item>
            <Descriptions.Item label="Due Date">{selectedInvoice.dueDate}</Descriptions.Item>
            <Descriptions.Item label="Invoice Amount" span={2}><Text strong>PKR {selectedInvoice.invoiceAmount.toLocaleString()}</Text></Descriptions.Item>
            <Descriptions.Item label="Tax Breakdown" span={2}>
              {selectedInvoice.taxBreakdown.map((t, i) => <Tag key={i}>{t.taxType}: PKR {t.amount.toLocaleString()}</Tag>)}
            </Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedInvoice.status === "Paid" ? "green" : selectedInvoice.status === "Overdue" ? "red" : "orange"}>{selectedInvoice.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
