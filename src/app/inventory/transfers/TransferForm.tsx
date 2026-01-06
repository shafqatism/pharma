"use client";

import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Button, Steps, message, Table, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useInventoryStore } from "@/store/inventoryStore";
import { StockTransfer, StockTransferItem } from "@/types/inventory";

const { Text } = Typography;

interface TransferFormProps {
  transfer: StockTransfer | null;
  onClose: () => void;
}

export default function TransferForm({ transfer, onClose }: TransferFormProps) {
  const { addStockTransfer, updateStockTransfer, stockTransfers, warehouses, batches, warehouseLocations } = useInventoryStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<StockTransferItem[]>(transfer?.items || []);
  const [itemForm] = Form.useForm();

  const steps = [{ title: "Header" }, { title: "Items" }, { title: "Review" }];

  const addItem = () => {
    itemForm.validateFields().then((values) => {
      const batch = batches.find((b) => b.id === values.batchId);
      const newItem: StockTransferItem = {
        id: `sti${Date.now()}`,
        itemId: batch?.itemId || "",
        itemCode: batch?.itemCode || "",
        itemName: batch?.itemName || "",
        batchNumber: batch?.batchNumber || "",
        expiryDate: batch?.expiryDate || "",
        quantity: values.quantity,
        sourceLocation: values.sourceLocation,
        destinationLocation: values.destinationLocation,
      };
      setItems([...items, newItem]);
      itemForm.resetFields();
    });
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const handleFinish = () => {
    const values = form.getFieldsValue();
    const fromWh = warehouses.find((w) => w.id === values.fromWarehouseId);
    const toWh = warehouses.find((w) => w.id === values.toWarehouseId);

    const transferData: StockTransfer = {
      id: transfer?.id || `st${Date.now()}`,
      transferNumber: transfer?.transferNumber || `ST-2024-${String(stockTransfers.length + 1).padStart(3, "0")}`,
      fromWarehouseId: values.fromWarehouseId,
      fromWarehouseName: fromWh?.warehouseName || "",
      toWarehouseId: values.toWarehouseId,
      toWarehouseName: toWh?.warehouseName || "",
      requestedBy: values.requestedBy,
      priority: values.priority,
      transferDate: values.transferDate,
      items,
      approvalStatus: transfer?.approvalStatus || "Pending",
      dispatchDate: transfer?.dispatchDate || "",
      receivingConfirmation: transfer?.receivingConfirmation || false,
      completionStatus: transfer?.completionStatus || "Draft",
      createdAt: transfer?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (transfer) {
      updateStockTransfer(transfer.id, transferData);
      message.success("Transfer updated");
    } else {
      addStockTransfer(transferData);
      message.success("Transfer created");
    }
    onClose();
  };

  const itemColumns = [
    { title: "Item", dataIndex: "itemName", key: "itemName", width: 150 },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber", width: 120 },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate", width: 100 },
    { title: "Qty", dataIndex: "quantity", key: "quantity", width: 80 },
    { title: "Source", dataIndex: "sourceLocation", key: "sourceLocation", width: 120 },
    { title: "Destination", dataIndex: "destinationLocation", key: "destinationLocation", width: 120 },
    { title: "", key: "action", width: 40, render: (_: unknown, record: StockTransferItem) => <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} /> },
  ];

  const next = async () => {
    if (currentStep === 0) {
      try {
        await form.validateFields();
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

      {currentStep === 0 && (
        <Form form={form} layout="vertical" initialValues={transfer || { priority: "Normal", transferDate: new Date().toISOString().split("T")[0] }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="transferDate" label="Transfer Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="requestedBy" label="Requested By" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="fromWarehouseId" label="From Warehouse" rules={[{ required: true }]}>
              <Select>
                {warehouses.map((w) => <Select.Option key={w.id} value={w.id}>{w.warehouseName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="toWarehouseId" label="To Warehouse" rules={[{ required: true }]}>
              <Select>
                {warehouses.map((w) => <Select.Option key={w.id} value={w.id}>{w.warehouseName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Normal">Normal</Select.Option>
                <Select.Option value="Urgent">Urgent</Select.Option>
                <Select.Option value="Emergency">Emergency</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      )}

      {currentStep === 1 && (
        <>
          <Form form={itemForm} layout="vertical">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              <Form.Item name="batchId" label="Batch" rules={[{ required: true }]}>
                <Select showSearch optionFilterProp="children">
                  {batches.filter((b) => b.batchStatus === "Active" && b.availableQuantity > 0).map((b) => (
                    <Select.Option key={b.id} value={b.id}>{b.batchNumber} - {b.itemName} (Avail: {b.availableQuantity})</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
              <Form.Item name="sourceLocation" label="Source Location" rules={[{ required: true }]}>
                <Select>
                  {warehouseLocations.map((l) => <Select.Option key={l.id} value={l.locationCode}>{l.locationCode}</Select.Option>)}
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="destinationLocation" label="Destination Location" rules={[{ required: true }]}>
              <Select>
                {warehouseLocations.map((l) => <Select.Option key={l.id} value={l.locationCode}>{l.locationCode}</Select.Option>)}
              </Select>
            </Form.Item>
            <Button type="dashed" icon={<PlusOutlined />} onClick={addItem} block>Add Item</Button>
          </Form>
          <div style={{ marginTop: 16 }}>
            <Table columns={itemColumns} dataSource={items} rowKey="id" pagination={false} size="small" />
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>Transfer Summary</Text>
          <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 12 }}>
            <div><strong>From:</strong> {warehouses.find((w) => w.id === form.getFieldValue("fromWarehouseId"))?.warehouseName}</div>
            <div><strong>To:</strong> {warehouses.find((w) => w.id === form.getFieldValue("toWarehouseId"))?.warehouseName}</div>
            <div><strong>Date:</strong> {form.getFieldValue("transferDate")}</div>
            <div><strong>Priority:</strong> {form.getFieldValue("priority")}</div>
          </div>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>Items ({items.length})</Text>
          <Table columns={itemColumns.filter((c) => c.key !== "action")} dataSource={items} rowKey="id" pagination={false} size="small" />
        </>
      )}

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}
        {currentStep < 2 && <Button type="primary" onClick={next} style={{ marginLeft: "auto" }}>Next</Button>}
        {currentStep === 2 && <Button type="primary" onClick={handleFinish} style={{ marginLeft: "auto" }}>Save Transfer</Button>}
      </div>
    </div>
  );
}
