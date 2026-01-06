"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, InputNumber, Row, Col } from "antd";
import { PlusOutlined, AimOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { KPIAssignment } from "@/types/hrm";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function KPIAssignmentsPage() {
  const { kpiAssignments, addKPIAssignment, updateKPIAssignment, deleteKPIAssignment, employees, performanceCycles } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPIAssignment | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total KPIs", value: kpiAssignments.length, prefix: <AimOutlined />, color: "#1890ff" },
    { key: "evaluated", title: "Evaluated", value: kpiAssignments.filter((k) => k.score !== undefined).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "pending", title: "Pending", value: kpiAssignments.filter((k) => k.score === undefined).length, prefix: <ClockCircleOutlined />, color: "#faad14" },
  ];

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Category", dataIndex: "kpiCategory", key: "kpiCategory", width: 120 },
    { title: "Description", dataIndex: "kpiDescription", key: "kpiDescription", width: 200, ellipsis: true },
    { title: "Target", dataIndex: "targetValue", key: "targetValue", width: 100 },
    { title: "Actual", dataIndex: "actualValue", key: "actualValue", width: 100, render: (v: number) => v ?? "N/A" },
    { title: "Weight (%)", dataIndex: "weight", key: "weight", width: 100 },
    { title: "Score", dataIndex: "score", key: "score", width: 80, render: (v: number) => v !== undefined ? <Tag color="blue">{v}</Tag> : "N/A" },
  ];

  const handleAdd = () => {
    setSelectedKPI(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (record: KPIAssignment) => {
    setSelectedKPI(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: KPIAssignment) => {
    Modal.confirm({
      title: "Delete KPI",
      content: `Are you sure you want to delete this KPI assignment?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteKPIAssignment(record.id);
        message.success("KPI deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const formData = { ...values, employeeName: employee?.fullName || "" };
      if (selectedKPI) {
        updateKPIAssignment(selectedKPI.id, formData);
        message.success("KPI updated successfully");
      } else {
        addKPIAssignment(formData);
        message.success("KPI added successfully");
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
          <Title level={4} style={{ margin: 0 }}>KPI Assignments</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add KPI</Button>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={kpiAssignments} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="kpi-assignments" title="KPI Assignments" />
      </Card>

      <Drawer title={selectedKPI ? "Edit KPI" : "Add KPI"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="cycleId" label="Performance Cycle">
            <Select placeholder="Select cycle">
              {performanceCycles.map((c) => (<Option key={c.id} value={c.id}>{c.name}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="kpiCategory" label="KPI Category" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select category">
              <Option value="sales">Sales</Option>
              <Option value="quality">Quality</Option>
              <Option value="productivity">Productivity</Option>
              <Option value="attendance">Attendance</Option>
              <Option value="teamwork">Teamwork</Option>
              <Option value="innovation">Innovation</Option>
            </Select>
          </Form.Item>
          <Form.Item name="kpiDescription" label="KPI Description" rules={[{ required: true, message: "Required" }]}>
            <TextArea rows={2} placeholder="Describe the KPI" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="targetValue" label="Target Value" rules={[{ required: true, message: "Required" }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="weight" label="Weight (%)" rules={[{ required: true, message: "Required" }]}>
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="actualValue" label="Actual Value">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="score" label="Score">
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="evaluationMethod" label="Evaluation Method">
            <Input placeholder="e.g., Monthly review, Self-assessment" />
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
