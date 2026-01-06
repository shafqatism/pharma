"use client";

import { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Switch, Row, Col } from "antd";
import { PlusOutlined, ApartmentOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import UserGuide from "@/components/common/UserGuide";
import { useHRMStore } from "@/store/hrmStore";
import { departmentsGuide } from "@/data/guideData";
import type { Department } from "@/types/hrm";

const { Title } = Typography;

export default function DepartmentsPage() {
  const { departments, addDepartment, updateDepartment, deleteDepartment, employees } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Departments", value: departments.length, prefix: <ApartmentOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: departments.filter((d) => d.isActive).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "inactive", title: "Inactive", value: departments.filter((d) => !d.isActive).length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Department Name", dataIndex: "name", key: "name" },
    { title: "Code", dataIndex: "code", key: "code" },
    {
      title: "Employees",
      key: "employeeCount",
      render: (_: unknown, record: Department) => employees.filter((e) => e.department === record.name).length,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>,
    },
  ];

  const handleAdd = () => {
    setSelectedDepartment(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setDrawerOpen(true);
  };

  const handleEdit = (record: Department) => {
    setSelectedDepartment(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Department) => {
    Modal.confirm({
      title: "Delete Department",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteDepartment(record.id);
        message.success("Department deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedDepartment) {
        updateDepartment(selectedDepartment.id, values);
        message.success("Department updated successfully");
      } else {
        addDepartment(values);
        message.success("Department added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Departments</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <UserGuide {...departmentsGuide} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Department</Button>
          </div>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={departments} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="departments" title="Departments List" />
      </Card>

      <Drawer title={selectedDepartment ? "Edit Department" : "Add Department"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Department Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter department name" />
          </Form.Item>
          <Form.Item name="code" label="Department Code" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter department code" />
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
