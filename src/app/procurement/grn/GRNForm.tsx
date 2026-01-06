"use client";

import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Button, Steps, message, Table, Divider, Switch, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useProcurementStore } from "@/store/procurementStore";
import { GoodsReceiptNote, GRNItem } from "@/types/procurement";

const { Text } = Typography;

interface GRNFormProps {
  grn: GoodsReceiptNote | null;
  onClose: () => void;
}

export default function GRNForm({ grn, onClose }: GRNFormProps) {
  const { addGoodsReceiptNote, updateGoodsReceiptNote, goodsReceiptNotes, purchaseOrders, vendors } = useProcurementStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<GRNItem[]>(grn?.items || []);
  const [itemForm] = Form.useForm();

  const steps = [{ title: "Header" }, { title: "Items" }, { title: "QC & Inventory" }];

  const addItem = () => {
    itemForm.validateFields().then((values) => {
      const newItem: GRNItem = {
        id: `grni${Date.now()}`,
        itemCode: values.itemCode,
        itemName: values.itemName,
        orderedQuantity: values.orderedQuantity,
        receivedQuantity: values.receivedQuantity,
        rejectedQuantity: values.rejectedQuantity || 0,
        batchNumber: values.batchNumber,
        manufacturingDate: values.manufacturingDate,
        expiryDate: values.expiryDate,
        storageCondition: values.storageCondition || "",
      };
      setItems([...items, newItem]);
      itemForm.resetFields();
    });
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const handleFinish = (values: Record<string, unknown>) => {
    const po = purchaseOrders.find((p) => p.poNumber === form.getFieldValue("poReference"));
    const vendor = vendors.find((v) => v.id === po?.vendorId);

    const grnData: GoodsReceiptNote = {
      id: grn?.id || `grn${Date.now()}`,
      grnNumber: grn?.grnNumber || `GRN-2024-${String(goodsReceiptNotes.length + 1).padStart(3, "0")}`,
      grnDate: form.getFieldValue("grnDate"),
      poReference: form.getFieldValue("poReference"),
      vendorId: po?.vendorId || "",
      vendorName: vendor?.legalName || po?.vendorName || "",
      warehouseLocation: form.getFieldValue("warehouseLocation"),
      receivedBy: form.getFieldValue("receivedBy"),
      items,
      qcRequired: values.qcRequired as boolean,
      qcStatus: values.qcStatus as GoodsReceiptNote["qcStatus"],
      qcRemarks: values.qcRemarks as string || "",
      stockPosted: values.stockPosted as boolean,
      inventoryLocation: values.inventoryLocation as string || "",
      status: grn?.status || "Draft",
      createdAt: grn?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (grn) {
      updateGoodsReceiptNote(grn.id, grnData);
      message.success("GRN updated");
    } else {
      addGoodsReceiptNote(grnData);
      message.success("GRN created");
    }
    onClose();
  };

  const itemColumns = [
    { title: "Code", dataIndex: "itemCode", key: "itemCode", width: 80 },
    { title: "Name", dataIndex: "itemName", key: "itemName", width: 150 },
    { title: "Ordered", dataIndex: "orderedQuantity", key: "orderedQuantity", width: 70 },
    { title: "Received", dataIndex: "receivedQuantity", key: "receivedQuantity", width: 70 },
    { title: "Rejected", dataIndex: "rejectedQuantity", key: "rejectedQuantity", width: 70 },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber", width: 100 },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate", width: 100 },
    { title: "", key: "action", width: 40, render: (_: unknown, record: GRNItem) => <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} /> },
  ];

  const next = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields(["grnDate", "poReference", "warehouseLocation", "receivedBy"]);
        setCurrentStep(1);
      } catch { /* validation failed */ }
    } else if (currentStep === 1) {
      if (items.length === 0) {
        message.warning("Add at least one item");
        return;
      }
      setCurrentStep(2);
    }
  };

  return (
    <div>
      <Steps current={currentStep} items={steps} size="small" style={{ marginBottom: 24 }} />

      <Form form={form} layout="vertical" initialValues={grn || { grnDate: new Date().toISOString().split("T")[0], qcRequired: true, qcStatus: "Pending", stockPosted: false }} onFinish={handleFinish}>
        {currentStep === 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="grnDate" label="GRN Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="poReference" label="PO Reference" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {purchaseOrders.filter((p) => p.status !== "Closed" && p.status !== "Cancelled").map((p) => (
                  <Select.Option key={p.id} value={p.poNumber}>{p.poNumber} - {p.vendorName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="warehouseLocation" label="Warehouse Location" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Main Warehouse - Zone A">Main Warehouse - Zone A</Select.Option>
                <Select.Option value="Main Warehouse - Zone B">Main Warehouse - Zone B</Select.Option>
                <Select.Option value="Cold Storage">Cold Storage</Select.Option>
                <Select.Option value="Quarantine Area">Quarantine Area</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="receivedBy" label="Received By" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>
        )}

        {currentStep === 1 && (
          <>
            <Form form={itemForm} layout="vertical">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                <Form.Item name="itemCode" label="Item Code" rules={[{ required: true }]}>
                  <Input size="small" />
                </Form.Item>
                <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
                  <Input size="small" />
                </Form.Item>
                <Form.Item name="orderedQuantity" label="Ordered Qty" rules={[{ required: true }]}>
                  <InputNumber size="small" style={{ width: "100%" }} min={0} />
                </Form.Item>
                <Form.Item name="receivedQuantity" label="Received Qty" rules={[{ required: true }]}>
                  <InputNumber size="small" style={{ width: "100%" }} min={0} />
                </Form.Item>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                <Form.Item name="rejectedQuantity" label="Rejected Qty">
                  <InputNumber size="small" style={{ width: "100%" }} min={0} />
                </Form.Item>
                <Form.Item name="batchNumber" label="Batch Number" rules={[{ required: true }]}>
                  <Input size="small" />
                </Form.Item>
                <Form.Item name="manufacturingDate" label="Mfg Date" rules={[{ required: true }]}>
                  <Input type="date" size="small" />
                </Form.Item>
                <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
                  <Input type="date" size="small" />
                </Form.Item>
              </div>
              <Form.Item name="storageCondition" label="Storage Condition">
                <Input size="small" />
              </Form.Item>
              <Button type="dashed" icon={<PlusOutlined />} onClick={addItem} block>Add Item</Button>
            </Form>
            <Divider />
            <Table columns={itemColumns} dataSource={items} rowKey="id" pagination={false} size="small" />
          </>
        )}

        {currentStep === 2 && (
          <>
            <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>Quality Control</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="qcRequired" label="QC Required" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="qcStatus" label="QC Status">
                <Select>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Approved">Approved</Select.Option>
                  <Select.Option value="Rejected">Rejected</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="qcRemarks" label="QC Remarks">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12, marginTop: 16 }}>Inventory Integration</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="stockPosted" label="Stock Posted" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="inventoryLocation" label="Inventory Location">
                <Input placeholder="e.g., WH-A-R1-S1" />
              </Form.Item>
            </div>
          </>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}
          {currentStep < 2 && <Button type="primary" onClick={next} style={{ marginLeft: "auto" }}>Next</Button>}
          {currentStep === 2 && <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>Save GRN</Button>}
        </div>
      </Form>
    </div>
  );
}
