"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, Switch, Row, Col } from "antd";
import { PlusOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { Training } from "@/types/hrm";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function TrainingsPage() {
  const { trainings, addTraining, updateTraining, deleteTraining } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Trainings", value: trainings.length, prefix: <BookOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: trainings.filter((t) => t.isActive).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "mandatory", title: "Mandatory", value: trainings.filter((t) => t.isMandatory).length, color: "#ff4d4f" },
    { key: "internal", title: "Internal", value: trainings.filter((t) => t.type === "internal").length, color: "#722ed1" },
  ];

  const columns = [
    { title: "Training Title", dataIndex: "title", key: "title", width: 200 },
    { title: "Type", dataIndex: "type", key: "type", width: 100, render: (type: string) => <Tag color={type === "internal" ? "blue" : "purple"}>{type.toUpperCase()}</Tag> },
    { title: "Trainer", dataIndex: "trainer", key: "trainer", width: 150 },
    { title: "Duration", dataIndex: "duration", key: "duration", width: 100 },
    { title: "Mandatory", dataIndex: "isMandatory", key: "isMandatory", width: 100, render: (v: boolean) => <Tag color={v ? "red" : "default"}>{v ? "Yes" : "No"}</Tag> },
    { title: "Compliance", dataIndex: "complianceCategory", key: "complianceCategory", width: 100, render: (v: string) => <Tag>{v?.toUpperCase()}</Tag> },
    { title: "Status", dataIndex: "isActive", key: "isActive", width: 80, render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedTraining(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, isMandatory: false, type: "internal" });
    setDrawerOpen(true);
  };

  const handleEdit = (record: Training) => {
    setSelectedTraining(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Training) => {
    Modal.confirm({
      title: "Delete Training",
      content: `Are you sure you want to delete ${record.title}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteTraining(record.id);
        message.success("Training deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedTraining) {
        updateTraining(selectedTraining.id, values);
        message.success("Training updated successfully");
      } else {
        addTraining(values);
        message.success("Training added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Training Master</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Training</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={trainings} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="trainings" title="Trainings" />
      </Card>

      <Drawer title={selectedTraining ? "Edit Training" : "Add Training"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Training Title" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter training title" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Type" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select type">
                  <Option value="internal">Internal</Option>
                  <Option value="external">External</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="trainer" label="Trainer">
                <Input placeholder="Enter trainer name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="duration" label="Duration">
                <Input placeholder="e.g., 2 hours, 3 days" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="complianceCategory" label="Compliance Category">
                <Select placeholder="Select category">
                  <Option value="gmp">GMP</Option>
                  <Option value="sop">SOP</Option>
                  <Option value="safety">Safety</Option>
                  <Option value="general">General</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isMandatory" label="Mandatory" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" label="Active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>
    </DashboardLayout>
  );
}
