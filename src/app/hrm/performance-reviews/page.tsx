"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, InputNumber, Switch, Row, Col, Descriptions, Rate } from "antd";
import { PlusOutlined, TrophyOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { PerformanceReview } from "@/types/hrm";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function PerformanceReviewsPage() {
  const { performanceReviews, addPerformanceReview, updatePerformanceReview, deletePerformanceReview, employees, performanceCycles } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Reviews", value: performanceReviews.length, prefix: <TrophyOutlined />, color: "#1890ff" },
    { key: "pending", title: "Pending", value: performanceReviews.filter((r) => r.status === "pending").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "completed", title: "Completed", value: performanceReviews.filter((r) => r.status === "completed").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "exceptional", title: "Exceptional", value: performanceReviews.filter((r) => r.performanceRating === "exceptional").length, color: "#722ed1" },
  ];

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Final Score", dataIndex: "finalScore", key: "finalScore", width: 100, render: (v: number) => v ? `${v}%` : "N/A" },
    {
      title: "Rating",
      dataIndex: "performanceRating",
      key: "performanceRating",
      width: 150,
      render: (rating: string) => {
        const colors: Record<string, string> = { exceptional: "purple", exceeds: "green", meets: "blue", needs_improvement: "orange", unsatisfactory: "red" };
        return <Tag color={colors[rating]}>{rating?.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
    { title: "Promotion", dataIndex: "promotionRecommendation", key: "promotionRecommendation", width: 100, render: (v: boolean) => <Tag color={v ? "green" : "default"}>{v ? "Yes" : "No"}</Tag> },
    { title: "Increment", dataIndex: "incrementRecommendation", key: "incrementRecommendation", width: 100, render: (v: boolean) => <Tag color={v ? "green" : "default"}>{v ? "Yes" : "No"}</Tag> },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        const colors: Record<string, string> = { pending: "default", self_review: "orange", manager_review: "blue", hr_review: "purple", completed: "green" };
        return <Tag color={colors[status]}>{status?.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedReview(null);
    form.resetFields();
    form.setFieldsValue({ status: "pending", performanceRating: "meets", promotionRecommendation: false, incrementRecommendation: false });
    setDrawerOpen(true);
  };

  const handleView = (record: PerformanceReview) => {
    setSelectedReview(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: PerformanceReview) => {
    setSelectedReview(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: PerformanceReview) => {
    Modal.confirm({
      title: "Delete Review",
      content: `Are you sure you want to delete this performance review?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deletePerformanceReview(record.id);
        message.success("Review deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const formData = { ...values, employeeName: employee?.fullName || "" };
      if (selectedReview) {
        updatePerformanceReview(selectedReview.id, formData);
        message.success("Review updated successfully");
      } else {
        addPerformanceReview(formData);
        message.success("Review added successfully");
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
          <Title level={4} style={{ margin: 0 }}>Performance Reviews</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Review</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={performanceReviews} rowKey="id" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} exportFileName="performance-reviews" title="Performance Reviews" />
      </Card>

      <Drawer title={selectedReview ? "Edit Review" : "Add Review"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select employee" showSearch optionFilterProp="children">
                  {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName}</Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cycleId" label="Performance Cycle">
                <Select placeholder="Select cycle">
                  {performanceCycles.map((c) => (<Option key={c.id} value={c.id}>{c.name}</Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="selfEvaluation" label="Self Evaluation">
            <TextArea rows={3} placeholder="Enter self evaluation" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="selfScore" label="Self Score (%)">
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="managerScore" label="Manager Score (%)">
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="managerEvaluation" label="Manager Evaluation">
            <TextArea rows={3} placeholder="Enter manager evaluation" />
          </Form.Item>
          <Form.Item name="hrReview" label="HR Review">
            <TextArea rows={2} placeholder="Enter HR review" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="finalScore" label="Final Score (%)">
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="performanceRating" label="Performance Rating" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select rating">
                  <Option value="exceptional">Exceptional</Option>
                  <Option value="exceeds">Exceeds Expectations</Option>
                  <Option value="meets">Meets Expectations</Option>
                  <Option value="needs_improvement">Needs Improvement</Option>
                  <Option value="unsatisfactory">Unsatisfactory</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="remarks" label="Remarks">
            <TextArea rows={2} placeholder="Enter remarks" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="promotionRecommendation" label="Promotion" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="incrementRecommendation" label="Increment" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="status" label="Status">
                <Select placeholder="Select status">
                  <Option value="pending">Pending</Option>
                  <Option value="self_review">Self Review</Option>
                  <Option value="manager_review">Manager Review</Option>
                  <Option value="hr_review">HR Review</Option>
                  <Option value="completed">Completed</Option>
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

      <Modal title="Performance Review Details" open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={[<Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>]} width={700}>
        {selectedReview && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Employee">{selectedReview.employeeName}</Descriptions.Item>
            <Descriptions.Item label="Final Score">{selectedReview.finalScore ? `${selectedReview.finalScore}%` : "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Self Score">{selectedReview.selfScore ? `${selectedReview.selfScore}%` : "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Manager Score">{selectedReview.managerScore ? `${selectedReview.managerScore}%` : "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Rating"><Tag color="blue">{selectedReview.performanceRating?.replace("_", " ").toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color="green">{selectedReview.status?.replace("_", " ").toUpperCase()}</Tag></Descriptions.Item>
            <Descriptions.Item label="Promotion"><Tag color={selectedReview.promotionRecommendation ? "green" : "default"}>{selectedReview.promotionRecommendation ? "Recommended" : "No"}</Tag></Descriptions.Item>
            <Descriptions.Item label="Increment"><Tag color={selectedReview.incrementRecommendation ? "green" : "default"}>{selectedReview.incrementRecommendation ? "Recommended" : "No"}</Tag></Descriptions.Item>
            <Descriptions.Item label="Self Evaluation" span={2}>{selectedReview.selfEvaluation || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Manager Evaluation" span={2}>{selectedReview.managerEvaluation || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="HR Review" span={2}>{selectedReview.hrReview || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Remarks" span={2}>{selectedReview.remarks || "N/A"}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </DashboardLayout>
  );
}
