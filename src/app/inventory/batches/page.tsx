"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, message, Modal, Timeline } from "antd";
import { PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useInventoryStore } from "@/store/inventoryStore";
import { Batch } from "@/types/inventory";

const { Title, Text } = Typography;

export default function BatchesPage() {
  const { batches, items, addBatch, updateBatch, deleteBatch } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [form] = Form.useForm();

  const today = new Date();
  const nearExpiry = batches.filter((b) => {
    const expiry = new Date(b.expiryDate);
    const days = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 90;
  }).length;

  const stats = [
    { key: "1", title: "Total Batches", value: batches.length, prefix: <span>📦</span>, color: "#00BFFF" },
    { key: "2", title: "Active", value: batches.filter((b) => b.batchStatus === "Active").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "3", title: "Near Expiry", value: nearExpiry, prefix: <span>⏰</span>, color: "#faad14" },
    { key: "4", title: "QC Pending", value: batches.filter((b) => b.qcStatus === "Pending").length, prefix: <span>🔬</span>, color: "#722ed1" },
  ];

  const columns = [
    { title: "Batch No", dataIndex: "batchNumber", key: "batchNumber", width: 130 },
    { title: "Item", dataIndex: "itemName", key: "itemName", width: 180 },
    { title: "Type", dataIndex: "batchType", key: "batchType", width: 100, render: (t: string) => <Tag color={t === "Manufactured" ? "blue" : "green"}>{t}</Tag> },
    { title: "Mfg Date", dataIndex: "manufacturingDate", key: "manufacturingDate", width: 100 },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate", width: 100 },
    { title: "Qty", dataIndex: "currentQuantity", key: "currentQuantity", width: 80, render: (v: number) => v.toLocaleString() },
    { title: "Available", dataIndex: "availableQuantity", key: "availableQuantity", width: 80, render: (v: number) => v.toLocaleString() },
    { title: "QC Status", dataIndex: "qcStatus", key: "qcStatus", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
    { title: "Status", dataIndex: "batchStatus", key: "batchStatus", width: 100, render: (s: string) => <Tag color={s === "Active" ? "green" : s === "Quarantine" ? "orange" : s === "Expired" ? "red" : "default"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedBatch(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: Batch) => {
    setSelectedBatch(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: Batch) => {
    setSelectedBatch(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Batch) => {
    Modal.confirm({
      title: "Delete Batch",
      icon: <ExclamationCircleOutlined />,
      content: `Delete batch ${record.batchNumber}?`,
      onOk: () => {
        deleteBatch(record.id);
        message.success("Batch deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const item = items.find((i) => i.id === values.itemId);
    const batchData: Batch = {
      id: selectedBatch?.id || `batch${Date.now()}`,
      batchNumber: values.batchNumber as string,
      itemId: values.itemId as string,
      itemCode: item?.itemCode || "",
      itemName: item?.itemName || "",
      batchType: values.batchType as Batch["batchType"],
      manufacturingDate: values.manufacturingDate as string,
      expiryDate: values.expiryDate as string,
      retestDate: values.retestDate as string || "",
      quantityProduced: values.quantityProduced as number,
      qcStatus: values.qcStatus as Batch["qcStatus"],
      releaseDate: values.releaseDate as string || "",
      releasedBy: values.releasedBy as string || "",
      batchStatus: values.batchStatus as Batch["batchStatus"],
      storageLocation: values.storageLocation as string || "",
      currentQuantity: values.currentQuantity as number || values.quantityProduced as number,
      reservedQuantity: values.reservedQuantity as number || 0,
      availableQuantity: (values.currentQuantity as number || values.quantityProduced as number) - (values.reservedQuantity as number || 0),
      recallEligible: values.recallEligible as boolean || false,
      createdAt: selectedBatch?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedBatch) {
      updateBatch(selectedBatch.id, batchData);
      message.success("Batch updated");
    } else {
      addBatch(batchData);
      message.success("Batch added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Batch & Lot Tracking</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>End-to-end batch traceability</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Batch</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={batches}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="batches"
          title="Batch Master"
        />
      </div>

      <Drawer title={selectedBatch ? "Edit Batch" : "Add Batch"} width={700} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ batchType: "Manufactured", qcStatus: "Pending", batchStatus: "Quarantine" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="batchNumber" label="Batch Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="itemId" label="Item" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {items.map((i) => <Select.Option key={i.id} value={i.id}>{i.itemCode} - {i.itemName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="batchType" label="Batch Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Manufactured">Manufactured</Select.Option>
                <Select.Option value="Purchased">Purchased</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="manufacturingDate" label="Manufacturing Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="retestDate" label="Retest Date">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="quantityProduced" label="Quantity Produced/Received" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="currentQuantity" label="Current Quantity">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="reservedQuantity" label="Reserved Quantity">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="qcStatus" label="QC Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="batchStatus" label="Batch Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Quarantine">Quarantine</Select.Option>
                <Select.Option value="Blocked">Blocked</Select.Option>
                <Select.Option value="Expired">Expired</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="storageLocation" label="Storage Location">
              <Input />
            </Form.Item>
            <Form.Item name="releaseDate" label="Release Date">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="releasedBy" label="Released By">
              <Input />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Batch</Button>
        </Form>
      </Drawer>

      <Drawer title="Batch Details" width={700} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedBatch && (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Batch Number">{selectedBatch.batchNumber}</Descriptions.Item>
              <Descriptions.Item label="Item">{selectedBatch.itemName}</Descriptions.Item>
              <Descriptions.Item label="Item Code">{selectedBatch.itemCode}</Descriptions.Item>
              <Descriptions.Item label="Batch Type"><Tag color={selectedBatch.batchType === "Manufactured" ? "blue" : "green"}>{selectedBatch.batchType}</Tag></Descriptions.Item>
              <Descriptions.Item label="Mfg Date">{selectedBatch.manufacturingDate}</Descriptions.Item>
              <Descriptions.Item label="Expiry Date">{selectedBatch.expiryDate}</Descriptions.Item>
              <Descriptions.Item label="Retest Date">{selectedBatch.retestDate || "-"}</Descriptions.Item>
              <Descriptions.Item label="Storage Location">{selectedBatch.storageLocation}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Quantities" bordered size="small" column={3} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Produced">{selectedBatch.quantityProduced.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Current">{selectedBatch.currentQuantity.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Reserved">{selectedBatch.reservedQuantity.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Available" span={3}><Text strong>{selectedBatch.availableQuantity.toLocaleString()}</Text></Descriptions.Item>
            </Descriptions>
            <Descriptions title="Status" bordered size="small" column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="QC Status"><Tag color={selectedBatch.qcStatus === "Approved" ? "green" : selectedBatch.qcStatus === "Pending" ? "orange" : "red"}>{selectedBatch.qcStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="Batch Status"><Tag color={selectedBatch.batchStatus === "Active" ? "green" : "orange"}>{selectedBatch.batchStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="Release Date">{selectedBatch.releaseDate || "-"}</Descriptions.Item>
              <Descriptions.Item label="Released By">{selectedBatch.releasedBy || "-"}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: 16 }}>
              <Text strong style={{ fontSize: 13 }}>Batch Lifecycle</Text>
              <Timeline style={{ marginTop: 12 }} items={[
                { dot: <CheckCircleOutlined style={{ color: "#52c41a" }} />, children: `Created: ${selectedBatch.createdAt}` },
                { dot: selectedBatch.qcStatus === "Approved" ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <ClockCircleOutlined style={{ color: "#faad14" }} />, children: `QC: ${selectedBatch.qcStatus}` },
                { dot: selectedBatch.releaseDate ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <ClockCircleOutlined style={{ color: "#faad14" }} />, children: selectedBatch.releaseDate ? `Released: ${selectedBatch.releaseDate}` : "Pending Release" },
              ]} />
            </div>
          </>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
