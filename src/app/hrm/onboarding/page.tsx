"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, DatePicker, InputNumber, Checkbox, Upload, Row, Col, Descriptions, Progress } from "antd";
import { PlusOutlined, UserAddOutlined, CheckCircleOutlined, ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { Onboarding } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function OnboardingPage() {
  const { onboardings, addOnboarding, updateOnboarding, deleteOnboarding, employees } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOnboarding, setSelectedOnboarding] = useState<Onboarding | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Onboardings", value: onboardings.length, prefix: <UserAddOutlined />, color: "#1890ff" },
    { key: "pending", title: "Pending", value: onboardings.filter((o) => o.status === "pending").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "inProgress", title: "In Progress", value: onboardings.filter((o) => o.status === "in_progress").length, prefix: <ClockCircleOutlined />, color: "#1890ff" },
    { key: "completed", title: "Completed", value: onboardings.filter((o) => o.status === "completed").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
  ];

  const getCompletionPercentage = (record: Onboarding) => {
    const checks = [record.documentsVerified, record.bankDetailsCollected, record.systemAccessCreated, record.attendanceSetup, record.idCardIssued];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Probation (days)", dataIndex: "probationPeriod", key: "probationPeriod", width: 120 },
    {
      title: "Progress",
      key: "progress",
      width: 150,
      render: (_: unknown, record: Onboarding) => <Progress percent={getCompletionPercentage(record)} size="small" />,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = { pending: "orange", in_progress: "blue", completed: "green" };
        return <Tag color={colors[status]}>{status.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedOnboarding(null);
    form.resetFields();
    form.setFieldsValue({ status: "pending", probationPeriod: 90 });
    setDrawerOpen(true);
  };

  const handleView = (record: Onboarding) => {
    setSelectedOnboarding(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: Onboarding) => {
    setSelectedOnboarding(record);
    form.setFieldsValue({
      ...record,
      orientationSchedule: record.orientationSchedule ? dayjs(record.orientationSchedule) : null,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: Onboarding) => {
    Modal.confirm({
      title: "Delete Onboarding",
      content: `Are you sure you want to delete this onboarding record?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteOnboarding(record.id);
        message.success("Onboarding deleted successfully");
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
        orientationSchedule: values.orientationSchedule?.format("YYYY-MM-DD"),
      };
      if (selectedOnboarding) {
        updateOnboarding(selectedOnboarding.id, formData);
        message.success("Onboarding updated successfully");
      } else {
        addOnboarding(formData);
        message.success("Onboarding added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Onboarding</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Onboarding</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={onboardings} rowKey="id" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} exportFileName="onboarding" title="Onboarding Records" />
      </Card>

      <Drawer title={selectedOnboarding ? "Edit Onboarding" : "Add Onboarding"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeId})</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="offerLetterUpload" label="Offer Letter">
            <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload Offer Letter</Button></Upload>
          </Form.Item>
          <Typography.Text strong style={{ display: "block", marginBottom: 16 }}>Joining Checklist</Typography.Text>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="documentsVerified" valuePropName="checked"><Checkbox>Documents Verified</Checkbox></Form.Item></Col>
            <Col span={12}><Form.Item name="bankDetailsCollected" valuePropName="checked"><Checkbox>Bank Details Collected</Checkbox></Form.Item></Col>
            <Col span={12}><Form.Item name="systemAccessCreated" valuePropName="checked"><Checkbox>System Access Created</Checkbox></Form.Item></Col>
            <Col span={12}><Form.Item name="attendanceSetup" valuePropName="checked"><Checkbox>Attendance Setup</Checkbox></Form.Item></Col>
            <Col span={12}><Form.Item name="idCardIssued" valuePropName="checked"><Checkbox>ID Card Issued</Checkbox></Form.Item></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="probationPeriod" label="Probation Period (days)">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="orientationSchedule" label="Orientation Schedule">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="trainingAssignment" label="Training Assignment">
            <Input placeholder="Enter training assignment" />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="pending">Pending</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>

      <Modal title="Onboarding Details" open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={[<Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>]} width={700}>
        {selectedOnboarding && (
          <>
            <Progress percent={getCompletionPercentage(selectedOnboarding)} style={{ marginBottom: 24 }} />
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Employee">{selectedOnboarding.employeeName}</Descriptions.Item>
              <Descriptions.Item label="Probation Period">{selectedOnboarding.probationPeriod} days</Descriptions.Item>
              <Descriptions.Item label="Documents Verified"><Tag color={selectedOnboarding.documentsVerified ? "green" : "red"}>{selectedOnboarding.documentsVerified ? "Yes" : "No"}</Tag></Descriptions.Item>
              <Descriptions.Item label="Bank Details"><Tag color={selectedOnboarding.bankDetailsCollected ? "green" : "red"}>{selectedOnboarding.bankDetailsCollected ? "Yes" : "No"}</Tag></Descriptions.Item>
              <Descriptions.Item label="System Access"><Tag color={selectedOnboarding.systemAccessCreated ? "green" : "red"}>{selectedOnboarding.systemAccessCreated ? "Yes" : "No"}</Tag></Descriptions.Item>
              <Descriptions.Item label="Attendance Setup"><Tag color={selectedOnboarding.attendanceSetup ? "green" : "red"}>{selectedOnboarding.attendanceSetup ? "Yes" : "No"}</Tag></Descriptions.Item>
              <Descriptions.Item label="ID Card Issued"><Tag color={selectedOnboarding.idCardIssued ? "green" : "red"}>{selectedOnboarding.idCardIssued ? "Yes" : "No"}</Tag></Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={selectedOnboarding.status === "completed" ? "green" : "orange"}>{selectedOnboarding.status?.replace("_", " ").toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Orientation">{selectedOnboarding.orientationSchedule || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Training">{selectedOnboarding.trainingAssignment || "N/A"}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}
