"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, TimePicker, InputNumber, Select, Switch, Row, Col } from "antd";
import { PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { Shift } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function ShiftsPage() {
  const { shifts, addShift, updateShift, deleteShift } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Shifts", value: shifts.length, prefix: <ClockCircleOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: shifts.filter((s) => s.isActive).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "inactive", title: "Inactive", value: shifts.filter((s) => !s.isActive).length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Shift Name", dataIndex: "shiftName", key: "shiftName" },
    { title: "Start Time", dataIndex: "startTime", key: "startTime" },
    { title: "End Time", dataIndex: "endTime", key: "endTime" },
    { title: "Grace Period (min)", dataIndex: "gracePeriod", key: "gracePeriod" },
    { title: "Weekly Off", dataIndex: "weeklyOff", key: "weeklyOff", render: (days: string[]) => days?.join(", ") || "N/A" },
    { title: "Status", dataIndex: "isActive", key: "isActive", render: (isActive: boolean) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedShift(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, gracePeriod: 15 });
    setDrawerOpen(true);
  };

  const handleEdit = (record: Shift) => {
    setSelectedShift(record);
    form.setFieldsValue({
      ...record,
      startTime: record.startTime ? dayjs(record.startTime, "HH:mm") : null,
      endTime: record.endTime ? dayjs(record.endTime, "HH:mm") : null,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: Shift) => {
    Modal.confirm({
      title: "Delete Shift",
      content: `Are you sure you want to delete ${record.shiftName}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteShift(record.id);
        message.success("Shift deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        startTime: values.startTime?.format("HH:mm"),
        endTime: values.endTime?.format("HH:mm"),
      };
      if (selectedShift) {
        updateShift(selectedShift.id, formData);
        message.success("Shift updated successfully");
      } else {
        addShift(formData);
        message.success("Shift added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Shift Configuration</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Shift</Button>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={shifts} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="shifts" title="Shifts" />
      </Card>

      <Drawer title={selectedShift ? "Edit Shift" : "Add Shift"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="shiftName" label="Shift Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter shift name" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "Required" }]}>
                <TimePicker style={{ width: "100%" }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: "Required" }]}>
                <TimePicker style={{ width: "100%" }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="gracePeriod" label="Grace Period (minutes)">
            <InputNumber style={{ width: "100%" }} min={0} max={60} />
          </Form.Item>
          <Form.Item name="weeklyOff" label="Weekly Off Days">
            <Select mode="multiple" placeholder="Select weekly off days">
              <Option value="Sunday">Sunday</Option>
              <Option value="Monday">Monday</Option>
              <Option value="Tuesday">Tuesday</Option>
              <Option value="Wednesday">Wednesday</Option>
              <Option value="Thursday">Thursday</Option>
              <Option value="Friday">Friday</Option>
              <Option value="Saturday">Saturday</Option>
            </Select>
          </Form.Item>
          <Form.Item name="overtimeRules" label="Overtime Rules">
            <Input.TextArea rows={2} placeholder="Enter overtime rules" />
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
