"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, DatePicker, InputNumber, Upload, Row, Col } from "antd";
import { PlusOutlined, SafetyOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { ComplianceRecord } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function CompliancePage() {
  const { complianceRecords, addComplianceRecord, updateComplianceRecord, deleteComplianceRecord, employees } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Records", value: complianceRecords.length, prefix: <SafetyOutlined />, color: "#1890ff" },
    { key: "valid", title: "Valid", value: complianceRecords.filter((c) => c.status === "valid").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "expiring", title: "Expiring Soon", value: complianceRecords.filter((c) => c.status === "expiring_soon").length, prefix: <WarningOutlined />, color: "#faad14" },
    { key: "expired", title: "Expired", value: complianceRecords.filter((c) => c.status === "expired").length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Compliance Type", dataIndex: "complianceType", key: "complianceType", width: 150 },
    { title: "Valid From", dataIndex: "validityStart", key: "validityStart", width: 120 },
    { title: "Valid Until", dataIndex: "validityEnd", key: "validityEnd", width: 120 },
    { title: "Reminder (days)", dataIndex: "reminderDays", key: "reminderDays", width: 120 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = { valid: "green", expiring_soon: "orange", expired: "red" };
        return <Tag color={colors[status]}>{status.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: "valid", reminderDays: 30 });
    setDrawerOpen(true);
  };

  const handleEdit = (record: ComplianceRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      validityStart: record.validityStart ? dayjs(record.validityStart) : null,
      validityEnd: record.validityEnd ? dayjs(record.validityEnd) : null,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: ComplianceRecord) => {
    Modal.confirm({
      title: "Delete Record",
      content: `Are you sure you want to delete this compliance record?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteComplianceRecord(record.id);
        message.success("Record deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const formData = {
        ...values,
        employeeName: employee?.fullName || "",
        validityStart: values.validityStart?.format("YYYY-MM-DD"),
        validityEnd: values.validityEnd?.format("YYYY-MM-DD"),
      };
      if (selectedRecord) {
        updateComplianceRecord(selectedRecord.id, formData);
        message.success("Record updated successfully");
      } else {
        addComplianceRecord(formData);
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
          <Title level={4} style={{ margin: 0 }}>Compliance Tracking</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Record</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={complianceRecords} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="compliance" title="Compliance Records" />
      </Card>

      <Drawer title={selectedRecord ? "Edit Record" : "Add Record"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="complianceType" label="Compliance Type" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select type">
              <Option value="GMP Certification">GMP Certification</Option>
              <Option value="Safety Training">Safety Training</Option>
              <Option value="Medical Checkup">Medical Checkup</Option>
              <Option value="License Renewal">License Renewal</Option>
              <Option value="SOP Training">SOP Training</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="validityStart" label="Valid From" rules={[{ required: true, message: "Required" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="validityEnd" label="Valid Until" rules={[{ required: true, message: "Required" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="reminderDays" label="Reminder (days before expiry)">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="valid">Valid</Option>
              <Option value="expiring_soon">Expiring Soon</Option>
              <Option value="expired">Expired</Option>
            </Select>
          </Form.Item>
          <Form.Item name="documentUpload" label="Document">
            <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload Document</Button></Upload>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>
    </DashboardLayout>
  );
}
