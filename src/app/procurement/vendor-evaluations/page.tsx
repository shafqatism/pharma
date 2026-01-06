"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Form, Input, Select, InputNumber, Rate, message, Modal, Descriptions } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useProcurementStore } from "@/store/procurementStore";
import { VendorEvaluation } from "@/types/procurement";

const { Title, Text } = Typography;

export default function VendorEvaluationsPage() {
  const { vendorEvaluations, vendors, addVendorEvaluation, updateVendorEvaluation, deleteVendorEvaluation } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState<VendorEvaluation | null>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName", width: 200 },
    { title: "Period", dataIndex: "evaluationPeriod", key: "evaluationPeriod", width: 100 },
    { title: "Delivery", dataIndex: "deliveryTimeliness", key: "deliveryTimeliness", width: 100, render: (v: number) => <Rate disabled defaultValue={v} style={{ fontSize: 10 }} /> },
    { title: "Quality", dataIndex: "qualityCompliance", key: "qualityCompliance", width: 100, render: (v: number) => <Rate disabled defaultValue={v} style={{ fontSize: 10 }} /> },
    { title: "Price", dataIndex: "priceCompetitiveness", key: "priceCompetitiveness", width: 100, render: (v: number) => <Rate disabled defaultValue={v} style={{ fontSize: 10 }} /> },
    { title: "Overall", dataIndex: "overallScore", key: "overallScore", width: 80, render: (v: number) => <Tag color={v >= 4 ? "green" : v >= 3 ? "orange" : "red"}>{v.toFixed(1)}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Conditional" ? "orange" : "red"}>{s}</Tag> },
    { title: "Date", dataIndex: "evaluationDate", key: "evaluationDate", width: 100 },
  ];

  const handleAdd = () => {
    setSelectedEval(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: VendorEvaluation) => {
    setSelectedEval(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: VendorEvaluation) => {
    setSelectedEval(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: VendorEvaluation) => {
    Modal.confirm({
      title: "Delete Evaluation",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this evaluation?",
      onOk: () => {
        deleteVendorEvaluation(record.id);
        message.success("Evaluation deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const vendor = vendors.find((v) => v.id === values.vendorId);
    const overall = ((values.deliveryTimeliness as number) + (values.qualityCompliance as number) + (values.priceCompetitiveness as number) + (values.responsiveness as number)) / 4;
    
    const evalData: VendorEvaluation = {
      id: selectedEval?.id || `ve${Date.now()}`,
      vendorId: values.vendorId as string,
      vendorName: vendor?.legalName || "",
      evaluationPeriod: values.evaluationPeriod as string,
      deliveryTimeliness: values.deliveryTimeliness as number,
      qualityCompliance: values.qualityCompliance as number,
      priceCompetitiveness: values.priceCompetitiveness as number,
      responsiveness: values.responsiveness as number,
      overallScore: overall,
      status: values.status as VendorEvaluation["status"],
      evaluatedBy: values.evaluatedBy as string,
      evaluationDate: values.evaluationDate as string,
      remarks: values.remarks as string || "",
    };

    if (selectedEval) {
      updateVendorEvaluation(selectedEval.id, evalData);
      message.success("Evaluation updated");
    } else {
      addVendorEvaluation(evalData);
      message.success("Evaluation added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Vendor Performance Evaluations</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Evaluate and track vendor performance</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New Evaluation</Button>
      </div>

      <DataTable
        columns={columns}
        dataSource={vendorEvaluations}
        rowKey="id"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFileName="vendor-evaluations"
        title="Vendor Evaluations"
      />

      <Drawer title={selectedEval ? "Edit Evaluation" : "New Evaluation"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="vendorId" label="Vendor" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {vendors.map((v) => <Select.Option key={v.id} value={v.id}>{v.legalName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="evaluationPeriod" label="Evaluation Period" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Q1 2024">Q1 2024</Select.Option>
                <Select.Option value="Q2 2024">Q2 2024</Select.Option>
                <Select.Option value="Q3 2024">Q3 2024</Select.Option>
                <Select.Option value="Q4 2024">Q4 2024</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="deliveryTimeliness" label="Delivery Timeliness" rules={[{ required: true }]}>
              <Rate />
            </Form.Item>
            <Form.Item name="qualityCompliance" label="Quality Compliance" rules={[{ required: true }]}>
              <Rate />
            </Form.Item>
            <Form.Item name="priceCompetitiveness" label="Price Competitiveness" rules={[{ required: true }]}>
              <Rate />
            </Form.Item>
            <Form.Item name="responsiveness" label="Responsiveness" rules={[{ required: true }]}>
              <Rate />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Conditional">Conditional</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="evaluatedBy" label="Evaluated By" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="evaluationDate" label="Evaluation Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
          </div>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save Evaluation</Button>
        </Form>
      </Drawer>

      <Drawer title="Evaluation Details" width={600} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedEval && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Vendor">{selectedEval.vendorName}</Descriptions.Item>
            <Descriptions.Item label="Period">{selectedEval.evaluationPeriod}</Descriptions.Item>
            <Descriptions.Item label="Delivery"><Rate disabled defaultValue={selectedEval.deliveryTimeliness} style={{ fontSize: 12 }} /></Descriptions.Item>
            <Descriptions.Item label="Quality"><Rate disabled defaultValue={selectedEval.qualityCompliance} style={{ fontSize: 12 }} /></Descriptions.Item>
            <Descriptions.Item label="Price"><Rate disabled defaultValue={selectedEval.priceCompetitiveness} style={{ fontSize: 12 }} /></Descriptions.Item>
            <Descriptions.Item label="Responsiveness"><Rate disabled defaultValue={selectedEval.responsiveness} style={{ fontSize: 12 }} /></Descriptions.Item>
            <Descriptions.Item label="Overall Score"><Tag color={selectedEval.overallScore >= 4 ? "green" : "orange"}>{selectedEval.overallScore.toFixed(1)}</Tag></Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedEval.status === "Approved" ? "green" : selectedEval.status === "Conditional" ? "orange" : "red"}>{selectedEval.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="Evaluated By">{selectedEval.evaluatedBy}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedEval.evaluationDate}</Descriptions.Item>
            <Descriptions.Item label="Remarks" span={2}>{selectedEval.remarks}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
