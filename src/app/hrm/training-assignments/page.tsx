"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Select, DatePicker, Upload, Row, Col } from "antd";
import { PlusOutlined, BookOutlined, CheckCircleOutlined, ClockCircleOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { TrainingAssignment } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function TrainingAssignmentsPage() {
  const { trainingAssignments, addTrainingAssignment, updateTrainingAssignment, deleteTrainingAssignment, employees, trainings } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<TrainingAssignment | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Assignments", value: trainingAssignments.length, prefix: <BookOutlined />, color: "#1890ff" },
    { key: "completed", title: "Completed", value: trainingAssignments.filter((t) => t.status === "completed").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "scheduled", title: "Scheduled", value: trainingAssignments.filter((t) => t.status === "scheduled").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "inProgress", title: "In Progress", value: trainingAssignments.filter((t) => t.status === "in_progress").length, color: "#1890ff" },
  ];

  const columns = [
    { title: "Training", dataIndex: "trainingTitle", key: "trainingTitle", width: 200 },
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Scheduled Date", dataIndex: "scheduledDate", key: "scheduledDate", width: 130 },
    { title: "Completion Date", dataIndex: "completionDate", key: "completionDate", width: 130, render: (v: string) => v || "N/A" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = { scheduled: "orange", in_progress: "blue", completed: "green", cancelled: "red" };
        return <Tag color={colors[status]}>{status.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedAssignment(null);
    form.resetFields();
    form.setFieldsValue({ status: "scheduled" });
    setDrawerOpen(true);
  };

  const handleEdit = (record: TrainingAssignment) => {
    setSelectedAssignment(record);
    form.setFieldsValue({
      ...record,
      scheduledDate: record.scheduledDate ? dayjs(record.scheduledDate) : null,
      completionDate: record.completionDate ? dayjs(record.completionDate) : null,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: TrainingAssignment) => {
    Modal.confirm({
      title: "Delete Assignment",
      content: `Are you sure you want to delete this training assignment?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteTrainingAssignment(record.id);
        message.success("Assignment deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const training = trainings.find((t) => t.id === values.trainingId);
      const formData = {
        ...values,
        employeeName: employee?.fullName || "",
        trainingTitle: training?.title || "",
        scheduledDate: values.scheduledDate?.format("YYYY-MM-DD"),
        completionDate: values.completionDate?.format("YYYY-MM-DD"),
      };
      if (selectedAssignment) {
        updateTrainingAssignment(selectedAssignment.id, formData);
        message.success("Assignment updated successfully");
      } else {
        addTrainingAssignment(formData);
        message.success("Assignment added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Training Assignments</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Assignment</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={trainingAssignments} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="training-assignments" title="Training Assignments" />
      </Card>

      <Drawer title={selectedAssignment ? "Edit Assignment" : "Add Assignment"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="trainingId" label="Training" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select training">
              {trainings.filter((t) => t.isActive).map((t) => (<Option key={t.id} value={t.id}>{t.title}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName}</Option>))}
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="scheduledDate" label="Scheduled Date" rules={[{ required: true, message: "Required" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="completionDate" label="Completion Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="scheduled">Scheduled</Option>
              <Option value="in_progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="certificationUpload" label="Certification">
            <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload Certificate</Button></Upload>
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
