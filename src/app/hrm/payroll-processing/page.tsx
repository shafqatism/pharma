"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, InputNumber, Row, Col, Descriptions } from "antd";
import { PlusOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { PayrollRecord } from "@/types/hrm";

const { Title } = Typography;
const { Option } = Select;

export default function PayrollProcessingPage() {
  const { payrollRecords, addPayrollRecord, updatePayrollRecord, deletePayrollRecord, employees } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [form] = Form.useForm();

  const totalGross = payrollRecords.reduce((sum, r) => sum + r.grossSalary, 0);
  const totalNet = payrollRecords.reduce((sum, r) => sum + r.netPay, 0);

  const stats = [
    { key: "total", title: "Total Records", value: payrollRecords.length, prefix: <FileTextOutlined />, color: "#1890ff" },
    { key: "gross", title: "Total Gross", value: `Rs. ${totalGross.toLocaleString()}`, prefix: <DollarOutlined />, color: "#52c41a" },
    { key: "net", title: "Total Net Pay", value: `Rs. ${totalNet.toLocaleString()}`, prefix: <DollarOutlined />, color: "#722ed1" },
    { key: "pending", title: "Pending", value: payrollRecords.filter((r) => r.status === "draft").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
  ];

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Month", dataIndex: "payrollMonth", key: "payrollMonth", width: 120 },
    { title: "Payable Days", dataIndex: "payableDays", key: "payableDays", width: 100 },
    { title: "Gross Salary", dataIndex: "grossSalary", key: "grossSalary", width: 130, render: (v: number) => `Rs. ${v?.toLocaleString()}` },
    { title: "Deductions", dataIndex: "totalDeductions", key: "totalDeductions", width: 120, render: (v: number) => `Rs. ${v?.toLocaleString()}` },
    { title: "Net Pay", dataIndex: "netPay", key: "netPay", width: 130, render: (v: number) => <strong>Rs. {v?.toLocaleString()}</strong> },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = { draft: "default", processed: "blue", approved: "green", paid: "purple" };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", payableDays: 30 });
    setDrawerOpen(true);
  };

  const handleView = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: PayrollRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: PayrollRecord) => {
    Modal.confirm({
      title: "Delete Payroll Record",
      content: `Are you sure you want to delete this payroll record?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deletePayrollRecord(record.id);
        message.success("Record deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const netPay = values.grossSalary + values.totalAllowances - values.totalDeductions;
      const formData = { ...values, employeeName: employee?.fullName || "", netPay };
      if (selectedRecord) {
        updatePayrollRecord(selectedRecord.id, formData);
        message.success("Record updated successfully");
      } else {
        addPayrollRecord(formData);
        message.success("Record added successfully");
      }
      setDrawerOpen(false);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };


  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Monthly Payroll Processing</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Payroll</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={payrollRecords} rowKey="id" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} exportFileName="payroll" title="Payroll Records" />
      </Card>

      <Drawer title={selectedRecord ? "Edit Payroll" : "Add Payroll"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select employee" showSearch optionFilterProp="children">
                  {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName}</Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="payrollMonth" label="Payroll Month" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="e.g., January 2024" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="payableDays" label="Payable Days" rules={[{ required: true, message: "Required" }]}>
                <InputNumber style={{ width: "100%" }} min={0} max={31} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="grossSalary" label="Gross Salary" rules={[{ required: true, message: "Required" }]}>
                <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `Rs. ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalAllowances" label="Total Allowances">
                <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `Rs. ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalDeductions" label="Total Deductions">
                <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `Rs. ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Select status">
                  <Option value="draft">Draft</Option>
                  <Option value="processed">Processed</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="paid">Paid</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>

      <Modal title="Payroll Details" open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={[<Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>]} width={600}>
        {selectedRecord && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Employee">{selectedRecord.employeeName}</Descriptions.Item>
            <Descriptions.Item label="Payroll Month">{selectedRecord.payrollMonth}</Descriptions.Item>
            <Descriptions.Item label="Payable Days">{selectedRecord.payableDays}</Descriptions.Item>
            <Descriptions.Item label="Gross Salary">Rs. {selectedRecord.grossSalary?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Total Allowances">Rs. {selectedRecord.totalAllowances?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Total Deductions">Rs. {selectedRecord.totalDeductions?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Net Pay" span={2}><strong style={{ fontSize: 18, color: "#52c41a" }}>Rs. {selectedRecord.netPay?.toLocaleString()}</strong></Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedRecord.status === "paid" ? "green" : "blue"}>{selectedRecord.status?.toUpperCase()}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </DashboardLayout>
  );
}
