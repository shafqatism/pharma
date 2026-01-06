"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, DatePicker, Upload, Row, Col, Descriptions, Steps } from "antd";
import { PlusOutlined, UserAddOutlined, UploadOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { Candidate } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const pipelineSteps = [
  { key: "application_received", title: "Applied" },
  { key: "shortlisted", title: "Shortlisted" },
  { key: "interview_scheduled", title: "Interview" },
  { key: "interview_completed", title: "Evaluated" },
  { key: "offer_issued", title: "Offer" },
  { key: "offer_accepted", title: "Accepted" },
  { key: "joined", title: "Joined" },
];

export default function CandidatesPage() {
  const { candidates, addCandidate, updateCandidate, deleteCandidate, jobRequisitions } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Candidates", value: candidates.length, prefix: <UserAddOutlined />, color: "#1890ff" },
    { key: "shortlisted", title: "Shortlisted", value: candidates.filter((c) => c.pipelineStatus === "shortlisted").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "interview", title: "In Interview", value: candidates.filter((c) => ["interview_scheduled", "interview_completed"].includes(c.pipelineStatus)).length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "joined", title: "Joined", value: candidates.filter((c) => c.pipelineStatus === "joined").length, prefix: <CheckCircleOutlined />, color: "#722ed1" },
  ];

  const columns = [
    { title: "Candidate ID", dataIndex: "candidateId", key: "candidateId", width: 120 },
    { title: "Full Name", dataIndex: "fullName", key: "fullName", width: 180 },
    { title: "Contact", dataIndex: "contactNumber", key: "contactNumber", width: 130 },
    { title: "Email", dataIndex: "email", key: "email", width: 200 },
    { title: "Applied Position", dataIndex: "appliedPosition", key: "appliedPosition", width: 150 },
    { title: "Source", dataIndex: "source", key: "source", width: 100, render: (source: string) => <Tag>{source.toUpperCase()}</Tag> },
    {
      title: "Pipeline Status",
      dataIndex: "pipelineStatus",
      key: "pipelineStatus",
      width: 150,
      render: (status: string) => {
        const colors: Record<string, string> = {
          application_received: "default", shortlisted: "blue", interview_scheduled: "orange",
          interview_completed: "cyan", offer_issued: "purple", offer_accepted: "green",
          offer_rejected: "red", joined: "green",
        };
        return <Tag color={colors[status]}>{status.replace(/_/g, " ").toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedCandidate(null);
    form.resetFields();
    form.setFieldsValue({ pipelineStatus: "application_received" });
    setDrawerOpen(true);
  };

  const handleView = (record: Candidate) => {
    setSelectedCandidate(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: Candidate) => {
    setSelectedCandidate(record);
    form.setFieldsValue({ ...record, joiningDate: record.joiningDate ? dayjs(record.joiningDate) : null });
    setDrawerOpen(true);
  };

  const handleDelete = (record: Candidate) => {
    Modal.confirm({
      title: "Delete Candidate",
      content: `Are you sure you want to delete ${record.fullName}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteCandidate(record.id);
        message.success("Candidate deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = { ...values, joiningDate: values.joiningDate?.format("YYYY-MM-DD") };
      if (selectedCandidate) {
        updateCandidate(selectedCandidate.id, formData);
        message.success("Candidate updated successfully");
      } else {
        addCandidate(formData);
        message.success("Candidate added successfully");
      }
      setDrawerOpen(false);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const getCurrentStep = (status: string) => pipelineSteps.findIndex((s) => s.key === status);


  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Candidate Management</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Candidate</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={candidates} rowKey="id" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} exportFileName="candidates" title="Candidates" />
      </Card>

      <Drawer title={selectedCandidate ? "Edit Candidate" : "Add Candidate"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
                <Input placeholder="Enter email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cnic" label="CNIC">
                <Input placeholder="Enter CNIC" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Address">
                <TextArea rows={2} placeholder="Enter address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="education" label="Education">
                <Input placeholder="Enter education" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="experience" label="Experience">
                <Input placeholder="Enter experience" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="appliedPosition" label="Applied Position" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select position">
                  {jobRequisitions.filter((r) => r.status === "open").map((req) => (
                    <Option key={req.id} value={req.jobTitle}>{req.jobTitle}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="source" label="Source" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select source">
                  <Option value="linkedin">LinkedIn</Option>
                  <Option value="referral">Referral</Option>
                  <Option value="website">Website</Option>
                  <Option value="agency">Agency</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pipelineStatus" label="Pipeline Status">
                <Select placeholder="Select status">
                  <Option value="application_received">Application Received</Option>
                  <Option value="shortlisted">Shortlisted</Option>
                  <Option value="interview_scheduled">Interview Scheduled</Option>
                  <Option value="interview_completed">Interview Completed</Option>
                  <Option value="offer_issued">Offer Issued</Option>
                  <Option value="offer_accepted">Offer Accepted</Option>
                  <Option value="offer_rejected">Offer Rejected</Option>
                  <Option value="joined">Joined</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="joiningDate" label="Joining Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="interviewFeedback" label="Interview Feedback">
                <TextArea rows={3} placeholder="Enter interview feedback" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cvUpload" label="CV Upload">
                <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload CV</Button></Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>

      <Modal title="Candidate Details" open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={[<Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>]} width={800}>
        {selectedCandidate && (
          <>
            <Steps current={getCurrentStep(selectedCandidate.pipelineStatus)} items={pipelineSteps} size="small" style={{ marginBottom: 24 }} />
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Candidate ID">{selectedCandidate.candidateId}</Descriptions.Item>
              <Descriptions.Item label="Full Name">{selectedCandidate.fullName}</Descriptions.Item>
              <Descriptions.Item label="Contact">{selectedCandidate.contactNumber}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedCandidate.email}</Descriptions.Item>
              <Descriptions.Item label="CNIC">{selectedCandidate.cnic}</Descriptions.Item>
              <Descriptions.Item label="Education">{selectedCandidate.education}</Descriptions.Item>
              <Descriptions.Item label="Experience">{selectedCandidate.experience}</Descriptions.Item>
              <Descriptions.Item label="Applied Position">{selectedCandidate.appliedPosition}</Descriptions.Item>
              <Descriptions.Item label="Source"><Tag>{selectedCandidate.source?.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Pipeline Status"><Tag color="blue">{selectedCandidate.pipelineStatus?.replace(/_/g, " ").toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>{selectedCandidate.address}</Descriptions.Item>
              <Descriptions.Item label="Interview Feedback" span={2}>{selectedCandidate.interviewFeedback || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Joining Date">{selectedCandidate.joiningDate || "N/A"}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}
