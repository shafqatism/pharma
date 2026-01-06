"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Switch, Row, Col } from "antd";
import { PlusOutlined, DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { PayrollGroup } from "@/types/hrm";

const { Title } = Typography;
const { TextArea } = Input;

export default function PayrollGroupsPage() {
  const { payrollGroups, addPayrollGroup, updatePayrollGroup, deletePayrollGroup } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<PayrollGroup | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Groups", value: payrollGroups.length, prefix: <DollarOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: payrollGroups.filter((g) => g.isActive).length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "inactive", title: "Inactive", value: payrollGroups.filter((g) => !g.isActive).length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Group Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description", ellipsis: true },
    { title: "Status", dataIndex: "isActive", key: "isActive", render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Active" : "Inactive"}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedGroup(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true, salaryComponents: [], deductionRules: [] });
    setDrawerOpen(true);
  };

  const handleEdit = (record: PayrollGroup) => {
    setSelectedGroup(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: PayrollGroup) => {
    Modal.confirm({
      title: "Delete Payroll Group",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deletePayrollGroup(record.id);
        message.success("Payroll group deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedGroup) {
        updatePayrollGroup(selectedGroup.id, values);
        message.success("Payroll group updated successfully");
      } else {
        addPayrollGroup(values);
        message.success("Payroll group added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Payroll Structure</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Payroll Group</Button>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={payrollGroups} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="payroll-groups" title="Payroll Groups" />
      </Card>

      <Drawer title={selectedGroup ? "Edit Payroll Group" : "Add Payroll Group"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Group Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter group name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Enter description" />
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
