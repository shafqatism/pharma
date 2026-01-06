"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, InputNumber, Row, Col, Descriptions } from "antd";
import { PlusOutlined, FileSearchOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { JobRequisition } from "@/types/hrm";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function JobRequisitionsPage() {
  const { jobRequisitions, addJobRequisition, updateJobRequisition, deleteJobRequisition, departments } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequisition, setSelectedRequisition] = useState<JobRequisition | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Requisitions", value: jobRequisitions.length, prefix: <FileSearchOutlined />, color: "#1890ff" },
    { key: "open", title: "Open", value: jobRequisitions.filter((r) => r.status === "open").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "pending", title: "Pending Approval", value: jobRequisitions.filter((r) => r.approvalStatus === "pending").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "closed", title: "Closed", value: jobRequisitions.filter((r) => r.status === "closed").length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Requisition ID", dataIndex: "requisitionId", key: "requisitionId", width: 130 },
    { title: "Job Title", dataIndex: "jobTitle", key: "jobTitle", width: 180 },
    { title: "Department", dataIndex: "department", key: "department", width: 150 },
    { title: "Positions", dataIndex: "numberOfPositions", key: "numberOfPositions", width: 100 },
    { title: "Job Type", dataIndex: "jobType", key: "jobType", width: 120, render: (type: string) => <Tag>{type.replace("_", " ").toUpperCase()}</Tag> },
    {
      title: "Approval",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = { draft: "default", pending: "orange", approved: "green", rejected: "red" };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = { draft: "default", approved: "blue", open: "green", closed: "red" };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedRequisition(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", approvalStatus: "draft" });
    setDrawerOpen(true);
  };

  const handleView = (record: JobRequisition) => {
    setSelectedRequisition(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: JobRequisition) => {
    setSelectedRequisition(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: JobRequisition) => {
    Modal.confirm({
      title: "Delete Requisition",
      content: `Are you sure you want to delete ${record.requisitionId}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteJobRequisition(record.id);
        message.success("Requisition deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedRequisition) {
        updateJobRequisition(selectedRequisition.id, values);
        message.success("Requisition updated successfully");
      } else {
        addJobRequisition(values);
        message.success("Requisition added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Job Requisitions</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Requisition</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={jobRequisitions} rowKey="id" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} exportFileName="job-requisitions" title="Job Requisitions" />
      </Card>

      <Drawer title={selectedRequisition ? "Edit Requisition" : "Add Requisition"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="jobTitle" label="Job Title" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter job title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Department" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select department">
                  {departments.map((dept) => (<Option key={dept.id} value={dept.name}>{dept.name}</Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numberOfPositions" label="Number of Positions" rules={[{ required: true, message: "Required" }]}>
                <InputNumber style={{ width: "100%" }} min={1} placeholder="Enter number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="jobType" label="Job Type" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select type">
                  <Option value="full_time">Full Time</Option>
                  <Option value="part_time">Part Time</Option>
                  <Option value="contract">Contract</Option>
                  <Option value="intern">Intern</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="requiredExperience" label="Required Experience">
                <Input placeholder="e.g., 3-5 years" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="qualification" label="Qualification">
                <TextArea rows={2} placeholder="Enter required qualifications" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salaryRangeMin" label="Salary Range (Min)">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Min salary" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salaryRangeMax" label="Salary Range (Max)">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Max salary" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hiringManager" label="Hiring Manager">
                <Input placeholder="Enter hiring manager" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="approvalStatus" label="Approval Status">
                <Select placeholder="Select status">
                  <Option value="draft">Draft</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="rejected">Rejected</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Select status">
                  <Option value="draft">Draft</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="open">Open</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>

      <Modal title="Requisition Details" open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={[<Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>]} width={700}>
        {selectedRequisition && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Requisition ID">{selectedRequisition.requisitionId}</Descriptions.Item>
            <Descriptions.Item label="Job Title">{selectedRequisition.jobTitle}</Descriptions.Item>
            <Descriptions.Item label="Department">{selectedRequisition.department}</Descriptions.Item>
            <Descriptions.Item label="Positions">{selectedRequisition.numberOfPositions}</Descriptions.Item>
            <Descriptions.Item label="Job Type">{selectedRequisition.jobType}</Descriptions.Item>
            <Descriptions.Item label="Experience">{selectedRequisition.requiredExperience}</Descriptions.Item>
            <Descriptions.Item label="Qualification" span={2}>{selectedRequisition.qualification}</Descriptions.Item>
            <Descriptions.Item label="Salary Range">Rs. {selectedRequisition.salaryRangeMin?.toLocaleString()} - Rs. {selectedRequisition.salaryRangeMax?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Hiring Manager">{selectedRequisition.hiringManager}</Descriptions.Item>
            <Descriptions.Item label="Approval Status"><Tag color={selectedRequisition.approvalStatus === "approved" ? "green" : "orange"}>{selectedRequisition.approvalStatus?.toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedRequisition.status === "open" ? "green" : "default"}>{selectedRequisition.status?.toUpperCase()}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </DashboardLayout>
  );
}
