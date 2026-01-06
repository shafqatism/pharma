"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, InputNumber, Switch, Row, Col } from "antd";
import { PlusOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { LeaveType } from "@/types/hrm";

const { Title } = Typography;

export default function LeaveTypesPage() {
  const { leaveTypes, addLeaveType, updateLeaveType, deleteLeaveType } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Leave Types", value: leaveTypes.length, prefix: <CalendarOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: leaveTypes.filter((lt) => lt.isActive).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "inactive", title: "Inactive", value: leaveTypes.filter((lt) => !lt.isActive).length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Leave Name", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Days Allowed", dataIndex: "daysAllowed", key: "daysAllowed" },
    { title: "Carry Forward", dataIndex: "carryForward", key: "carryForward", render: (cf: boolean) => <Tag color={cf ? "green" : "default"}>{cf ? "Yes" : "No"}</Tag> },
    { title: "Status", dataIndex: "isActive", key: "isActive", render: (isActive: boolean) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedLeaveType(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, carryForward: false });
    setDrawerOpen(true);
  };

  const handleEdit = (record: LeaveType) => {
    setSelectedLeaveType(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: LeaveType) => {
    Modal.confirm({
      title: "Delete Leave Type",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteLeaveType(record.id);
        message.success("Leave type deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedLeaveType) {
        updateLeaveType(selectedLeaveType.id, values);
        message.success("Leave type updated successfully");
      } else {
        addLeaveType(values);
        message.success("Leave type added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Leave Types</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Leave Type</Button>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={leaveTypes} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="leave-types" title="Leave Types" />
      </Card>

      <Drawer title={selectedLeaveType ? "Edit Leave Type" : "Add Leave Type"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Leave Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter leave name" />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter code (e.g., CL, SL)" />
          </Form.Item>
          <Form.Item name="daysAllowed" label="Days Allowed" rules={[{ required: true, message: "Required" }]}>
            <InputNumber style={{ width: "100%" }} min={1} placeholder="Enter days allowed" />
          </Form.Item>
          <Form.Item name="carryForward" label="Carry Forward" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
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
