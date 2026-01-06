"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, DatePicker, InputNumber, Row, Col } from "antd";
import { PlusOutlined, TrophyOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { PerformanceCycle } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function PerformanceCyclesPage() {
  const { performanceCycles, addPerformanceCycle, updatePerformanceCycle, deletePerformanceCycle } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<PerformanceCycle | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Cycles", value: performanceCycles.length, prefix: <TrophyOutlined />, color: "#1890ff" },
    { key: "active", title: "Active", value: performanceCycles.filter((c) => c.status === "active").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "draft", title: "Draft", value: performanceCycles.filter((c) => c.status === "draft").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
  ];

  const columns = [
    { title: "Cycle Name", dataIndex: "name", key: "name" },
    { title: "Period Start", dataIndex: "periodStart", key: "periodStart" },
    { title: "Period End", dataIndex: "periodEnd", key: "periodEnd" },
    { title: "Type", dataIndex: "evaluationType", key: "evaluationType", render: (v: string) => <Tag>{v?.toUpperCase()}</Tag> },
    { title: "KPI Weightage", dataIndex: "kpiWeightage", key: "kpiWeightage", render: (v: number) => `${v}%` },
    { title: "Rating Scale", dataIndex: "ratingScale", key: "ratingScale" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors: Record<string, string> = { draft: "default", active: "green", completed: "blue" };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedCycle(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", kpiWeightage: 100, ratingScale: 5 });
    setDrawerOpen(true);
  };

  const handleEdit = (record: PerformanceCycle) => {
    setSelectedCycle(record);
    form.setFieldsValue({
      ...record,
      period: [dayjs(record.periodStart), dayjs(record.periodEnd)],
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: PerformanceCycle) => {
    Modal.confirm({
      title: "Delete Cycle",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deletePerformanceCycle(record.id);
        message.success("Cycle deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [periodStart, periodEnd] = values.period;
      const formData = {
        ...values,
        periodStart: periodStart.format("YYYY-MM-DD"),
        periodEnd: periodEnd.format("YYYY-MM-DD"),
      };
      delete formData.period;
      if (selectedCycle) {
        updatePerformanceCycle(selectedCycle.id, formData);
        message.success("Cycle updated successfully");
      } else {
        addPerformanceCycle(formData);
        message.success("Cycle added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Performance Cycles</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Cycle</Button>
        </div>
        <StatsCard stats={stats} columns={3} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={performanceCycles} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="performance-cycles" title="Performance Cycles" />
      </Card>

      <Drawer title={selectedCycle ? "Edit Cycle" : "Add Cycle"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Cycle Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="e.g., Q1 2024 Review" />
          </Form.Item>
          <Form.Item name="period" label="Period" rules={[{ required: true, message: "Required" }]}>
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="evaluationType" label="Evaluation Type" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select type">
              <Option value="monthly">Monthly</Option>
              <Option value="quarterly">Quarterly</Option>
              <Option value="annual">Annual</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="kpiWeightage" label="KPI Weightage (%)">
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ratingScale" label="Rating Scale">
                <InputNumber style={{ width: "100%" }} min={1} max={10} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="draft">Draft</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
            </Select>
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
