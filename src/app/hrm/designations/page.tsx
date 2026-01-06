"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, Switch, Row, Col } from "antd";
import { PlusOutlined, IdcardOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { Designation } from "@/types/hrm";

const { Title } = Typography;
const { Option } = Select;

export default function DesignationsPage() {
  const { designations, addDesignation, updateDesignation, deleteDesignation, departments } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Designations", value: designations.length, prefix: <IdcardOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: designations.filter((d) => d.isActive).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "inactive", title: "Inactive", value: designations.filter((d) => !d.isActive).length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Designation", dataIndex: "name", key: "name" },
    {
      title: "Department",
      dataIndex: "departmentId",
      key: "departmentId",
      render: (deptId: string) => departments.find((d) => d.id === deptId)?.name || "N/A",
    },
    { title: "Grade", dataIndex: "grade", key: "grade" },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
  ];

  const handleAdd = () => {
    setSelectedDesignation(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setDrawerOpen(true);
  };

  const handleEdit = (record: Designation) => {
    setSelectedDesignation(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Designation) => {
    Modal.confirm({
      title: "Delete Designation",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteDesignation(record.id);
        message.success("Designation deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedDesignation) {
        updateDesignation(selectedDesignation.id, values);
        message.success("Designation updated successfully");
      } else {
        addDesignation(values);
        message.success("Designation added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Designations</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Designation</Button>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={designations} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="designations" title="Designations List" />
      </Card>

      <Drawer title={selectedDesignation ? "Edit Designation" : "Add Designation"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Designation Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter designation name" />
          </Form.Item>
          <Form.Item name="departmentId" label="Department" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select department">
              {departments.map((dept) => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="grade" label="Grade" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter grade (e.g., M1, E2)" />
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
