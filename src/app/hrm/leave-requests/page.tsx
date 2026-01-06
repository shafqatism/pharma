"use client";

import React, { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Input, Select, DatePicker, Upload, Row, Col, Descriptions } from "antd";
import { PlusOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import type { LeaveRequest } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function LeaveRequestsPage() {
  const { leaveRequests, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, employees, leaveTypes } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Requests", value: leaveRequests.length, prefix: <CalendarOutlined />, color: "#1890ff" },
    { key: "pending", title: "Pending", value: leaveRequests.filter((r) => r.approvalStatus === "pending").length, prefix: <ClockCircleOutlined />, color: "#faad14" },
    { key: "approved", title: "Approved", value: leaveRequests.filter((r) => r.approvalStatus === "approved").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "rejected", title: "Rejected", value: leaveRequests.filter((r) => r.approvalStatus === "rejected").length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Leave Type", dataIndex: "leaveType", key: "leaveType", width: 120 },
    { title: "From", dataIndex: "fromDate", key: "fromDate", width: 120 },
    { title: "To", dataIndex: "toDate", key: "toDate", width: 120 },
    { title: "Days", dataIndex: "totalDays", key: "totalDays", width: 80 },
    { title: "Reason", dataIndex: "reason", key: "reason", width: 200, ellipsis: true },
    {
      title: "Status",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = { pending: "orange", approved: "green", rejected: "red" };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedRequest(null);
    form.resetFields();
    form.setFieldsValue({ approvalStatus: "pending" });
    setDrawerOpen(true);
  };

  const handleView = (record: LeaveRequest) => {
    setSelectedRequest(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: LeaveRequest) => {
    setSelectedRequest(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.fromDate), dayjs(record.toDate)],
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: LeaveRequest) => {
    Modal.confirm({
      title: "Delete Request",
      content: `Are you sure you want to delete this leave request?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteLeaveRequest(record.id);
        message.success("Request deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const [fromDate, toDate] = values.dateRange;
      const totalDays = toDate.diff(fromDate, "day") + 1;
      const formData = {
        ...values,
        employeeName: employee?.fullName || "",
        fromDate: fromDate.format("YYYY-MM-DD"),
        toDate: toDate.format("YYYY-MM-DD"),
        totalDays,
      };
      delete formData.dateRange;
      if (selectedRequest) {
        updateLeaveRequest(selectedRequest.id, formData);
        message.success("Request updated successfully");
      } else {
        addLeaveRequest(formData);
        message.success("Request added successfully");
      }
      setDrawerOpen(false);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleApprove = () => {
    if (selectedRequest) {
      updateLeaveRequest(selectedRequest.id, { approvalStatus: "approved" });
      message.success("Leave request approved");
      setViewModalOpen(false);
    }
  };

  const handleReject = () => {
    if (selectedRequest) {
      updateLeaveRequest(selectedRequest.id, { approvalStatus: "rejected" });
      message.success("Leave request rejected");
      setViewModalOpen(false);
    }
  };


  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Leave Requests</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New Request</Button>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={leaveRequests} rowKey="id" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} exportFileName="leave-requests" title="Leave Requests" />
      </Card>

      <Drawer title={selectedRequest ? "Edit Leave Request" : "New Leave Request"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeId})</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="leaveType" label="Leave Type" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select leave type">
              {leaveTypes.filter((lt) => lt.isActive).map((lt) => (<Option key={lt.id} value={lt.name}>{lt.name}</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="dateRange" label="Date Range" rules={[{ required: true, message: "Required" }]}>
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: "Required" }]}>
            <TextArea rows={3} placeholder="Enter reason for leave" />
          </Form.Item>
          <Form.Item name="attachment" label="Attachment (Medical Certificate)">
            <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload</Button></Upload>
          </Form.Item>
          <Form.Item name="approvalStatus" label="Status">
            <Select placeholder="Select status">
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item name="remarks" label="Remarks">
            <TextArea rows={2} placeholder="Enter remarks" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>

      <Modal
        title="Leave Request Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={600}
        footer={
          selectedRequest?.approvalStatus === "pending"
            ? [
                <Button key="reject" danger onClick={handleReject}>Reject</Button>,
                <Button key="approve" type="primary" onClick={handleApprove}>Approve</Button>,
              ]
            : [<Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>]
        }
      >
        {selectedRequest && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Employee">{selectedRequest.employeeName}</Descriptions.Item>
            <Descriptions.Item label="Leave Type">{selectedRequest.leaveType}</Descriptions.Item>
            <Descriptions.Item label="From Date">{selectedRequest.fromDate}</Descriptions.Item>
            <Descriptions.Item label="To Date">{selectedRequest.toDate}</Descriptions.Item>
            <Descriptions.Item label="Total Days">{selectedRequest.totalDays}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={selectedRequest.approvalStatus === "approved" ? "green" : selectedRequest.approvalStatus === "rejected" ? "red" : "orange"}>
                {selectedRequest.approvalStatus?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reason" span={2}>{selectedRequest.reason}</Descriptions.Item>
            <Descriptions.Item label="Remarks" span={2}>{selectedRequest.remarks || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="Approved By">{selectedRequest.approvedBy || "N/A"}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </DashboardLayout>
  );
}
