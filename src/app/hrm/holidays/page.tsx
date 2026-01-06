"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, DatePicker, Row, Col } from "antd";
import { PlusOutlined, CalendarOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { Holiday } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function HolidaysPage() {
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Holidays", value: holidays.length, prefix: <CalendarOutlined />, color: "#1890ff" },
    { key: "public", title: "Public", value: holidays.filter((h) => h.type === "public").length, color: "#52c41a" },
    { key: "company", title: "Company", value: holidays.filter((h) => h.type === "company").length, color: "#722ed1" },
    { key: "optional", title: "Optional", value: holidays.filter((h) => h.type === "optional").length, color: "#faad14" },
  ];

  const columns = [
    { title: "Holiday Name", dataIndex: "name", key: "name" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const colors: Record<string, string> = { public: "green", company: "purple", optional: "orange" };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedHoliday(null);
    form.resetFields();
    form.setFieldsValue({ type: "public" });
    setDrawerOpen(true);
  };

  const handleEdit = (record: Holiday) => {
    setSelectedHoliday(record);
    form.setFieldsValue({ ...record, date: dayjs(record.date) });
    setDrawerOpen(true);
  };

  const handleDelete = (record: Holiday) => {
    Modal.confirm({
      title: "Delete Holiday",
      content: `Are you sure you want to delete ${record.name}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteHoliday(record.id);
        message.success("Holiday deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = { ...values, date: values.date.format("YYYY-MM-DD") };
      if (selectedHoliday) {
        updateHoliday(selectedHoliday.id, formData);
        message.success("Holiday updated successfully");
      } else {
        addHoliday(formData);
        message.success("Holiday added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Holiday Calendar</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Holiday</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={holidays} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="holidays" title="Holidays" />
      </Card>

      <Drawer title={selectedHoliday ? "Edit Holiday" : "Add Holiday"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Holiday Name" rules={[{ required: true, message: "Required" }]}>
            <Input placeholder="Enter holiday name" />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Required" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select type">
              <Option value="public">Public Holiday</Option>
              <Option value="company">Company Holiday</Option>
              <Option value="optional">Optional Holiday</Option>
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
