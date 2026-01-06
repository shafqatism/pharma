"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useProcurementStore } from "@/store/procurementStore";
import { SupplierPayment } from "@/types/procurement";

const { Title, Text } = Typography;

export default function PaymentsPage() {
  const { supplierPayments, addSupplierPayment, updateSupplierPayment, deleteSupplierPayment, supplierInvoices, vendors } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<SupplierPayment | null>(null);
  const [form] = Form.useForm();

  const totalPaid = supplierPayments.filter((p) => p.status === "Completed").reduce((s, p) => s + p.paidAmount, 0);

  const stats = [
    { key: "1", title: "Total Payments", value: supplierPayments.length, prefix: <span>💳</span>, color: "#00BFFF" },
    { key: "2", title: "Completed", value: supplierPayments.filter((p) => p.status === "Completed").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "3", title: "Total Paid", value: `PKR ${(totalPaid / 1000000).toFixed(2)}M`, prefix: <span>💰</span>, color: "#722ed1" },
    { key: "4", title: "Pending", value: supplierPayments.filter((p) => p.status === "Pending").length, prefix: <span>⏳</span>, color: "#faad14" },
  ];

  const columns = [
    { title: "Payment No", dataIndex: "paymentNumber", key: "paymentNumber", width: 120 },
    { title: "Date", dataIndex: "paymentDate", key: "paymentDate", width: 100 },
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName", width: 180 },
    { title: "Invoice", dataIndex: "invoiceNumber", key: "invoiceNumber", width: 140 },
    { title: "Method", dataIndex: "paymentMethod", key: "paymentMethod", width: 110, render: (m: string) => <Tag color="blue">{m}</Tag> },
    { title: "Paid Amount", dataIndex: "paidAmount", key: "paidAmount", width: 130, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "WHT", dataIndex: "withholdingTax", key: "withholdingTax", width: 100, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", width: 90, render: (s: string) => <Tag color={s === "Completed" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedPayment(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: SupplierPayment) => {
    setSelectedPayment(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: SupplierPayment) => {
    setSelectedPayment(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: SupplierPayment) => {
    Modal.confirm({
      title: "Delete Payment",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.paymentNumber}?`,
      onOk: () => {
        deleteSupplierPayment(record.id);
        message.success("Payment deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const invoice = supplierInvoices.find((i) => i.id === values.invoiceId);
    const vendor = vendors.find((v) => v.id === invoice?.vendorId);

    const paymentData: SupplierPayment = {
      id: selectedPayment?.id || `pay${Date.now()}`,
      paymentNumber: values.paymentNumber as string || `PAY-2024-${String(supplierPayments.length + 1).padStart(3, "0")}`,
      invoiceId: values.invoiceId as string,
      invoiceNumber: invoice?.invoiceNumber || "",
      vendorId: invoice?.vendorId || "",
      vendorName: vendor?.legalName || invoice?.vendorName || "",
      paymentMethod: values.paymentMethod as SupplierPayment["paymentMethod"],
      paymentDate: values.paymentDate as string,
      paidAmount: values.paidAmount as number,
      withholdingTax: values.withholdingTax as number || 0,
      advanceAdjustments: values.advanceAdjustments as number || 0,
      paymentReference: values.paymentReference as string || "",
      status: values.status as SupplierPayment["status"],
      createdAt: selectedPayment?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedPayment) {
      updateSupplierPayment(selectedPayment.id, paymentData);
      message.success("Payment updated");
    } else {
      addSupplierPayment(paymentData);
      message.success("Payment added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Supplier Payments</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Process and track supplier payments</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New Payment</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={supplierPayments}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="supplier-payments"
          title="Supplier Payments"
        />
      </div>

      <Drawer title={selectedPayment ? "Edit Payment" : "New Payment"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "Pending", paymentMethod: "Bank Transfer" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="invoiceId" label="Invoice" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {supplierInvoices.filter((i) => i.status !== "Paid").map((i) => (
                  <Select.Option key={i.id} value={i.id}>{i.invoiceNumber} - {i.vendorName} (PKR {i.invoiceAmount.toLocaleString()})</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="paymentDate" label="Payment Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Bank Transfer">Bank Transfer</Select.Option>
                <Select.Option value="Cheque">Cheque</Select.Option>
                <Select.Option value="Online">Online</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="paidAmount" label="Paid Amount" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="withholdingTax" label="Withholding Tax">
              <InputNumber style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="advanceAdjustments" label="Advance Adjustments">
              <InputNumber style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
            <Form.Item name="paymentReference" label="Payment Reference">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Failed">Failed</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Payment</Button>
        </Form>
      </Drawer>

      <Drawer title="Payment Details" width={600} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedPayment && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Payment Number">{selectedPayment.paymentNumber}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedPayment.paymentDate}</Descriptions.Item>
            <Descriptions.Item label="Vendor">{selectedPayment.vendorName}</Descriptions.Item>
            <Descriptions.Item label="Invoice">{selectedPayment.invoiceNumber}</Descriptions.Item>
            <Descriptions.Item label="Payment Method"><Tag color="blue">{selectedPayment.paymentMethod}</Tag></Descriptions.Item>
            <Descriptions.Item label="Payment Reference">{selectedPayment.paymentReference}</Descriptions.Item>
            <Descriptions.Item label="Paid Amount"><Text strong>PKR {selectedPayment.paidAmount.toLocaleString()}</Text></Descriptions.Item>
            <Descriptions.Item label="Withholding Tax">PKR {selectedPayment.withholdingTax.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Advance Adjustments">PKR {selectedPayment.advanceAdjustments.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedPayment.status === "Completed" ? "green" : "orange"}>{selectedPayment.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
