"use client";

import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Button, Steps, message, Table, Space, Divider, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useProcurementStore } from "@/store/procurementStore";
import { PurchaseRequisition, PRItem } from "@/types/procurement";

const { Text } = Typography;

interface PRFormProps {
  pr: PurchaseRequisition | null;
  onClose: () => void;
}

export default function PRForm({ pr, onClose }: PRFormProps) {
  const { addPurchaseRequisition, updatePurchaseRequisition, purchaseRequisitions, vendors } = useProcurementStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<PRItem[]>(pr?.items || []);
  const [itemForm] = Form.useForm();

  const steps = [{ title: "Header" }, { title: "Items" }, { title: "Review" }];

  const addItem = () => {
    itemForm.validateFields().then((values) => {
      const newItem: PRItem = {
        id: `pri${Date.now()}`,
        itemCode: values.itemCode,
        itemName: values.itemName,
        category: values.category,
        specification: values.specification || "",
        uom: values.uom,
        requiredQuantity: values.requiredQuantity,
        estimatedUnitCost: values.estimatedUnitCost,
        totalEstimatedCost: values.requiredQuantity * values.estimatedUnitCost,
        preferredVendor: values.preferredVendor,
      };
      setItems([...items, newItem]);
      itemForm.resetFields();
    });
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleFinish = () => {
    const values = form.getFieldsValue();
    const totalCost = items.reduce((sum, item) => sum + item.totalEstimatedCost, 0);

    const prData: PurchaseRequisition = {
      id: pr?.id || `pr${Date.now()}`,
      prNumber: pr?.prNumber || `PR-2024-${String(purchaseRequisitions.length + 1).padStart(3, "0")}`,
      requisitionDate: values.requisitionDate,
      requestedBy: values.requestedBy,
      department: values.department,
      costCenter: values.costCenter,
      priority: values.priority,
      expectedDeliveryDate: values.expectedDeliveryDate,
      budgetReference: values.budgetReference || "",
      items,
      lineManagerApproval: pr?.lineManagerApproval || { status: "Pending" },
      procurementApproval: pr?.procurementApproval || { status: "Pending" },
      financeApproval: pr?.financeApproval || { status: "Pending" },
      status: pr?.status || "Draft",
      totalEstimatedCost: totalCost,
      createdAt: pr?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (pr) {
      updatePurchaseRequisition(pr.id, prData);
      message.success("PR updated");
    } else {
      addPurchaseRequisition(prData);
      message.success("PR created");
    }
    onClose();
  };

  const itemColumns = [
    { title: "Code", dataIndex: "itemCode", key: "itemCode", width: 80 },
    { title: "Name", dataIndex: "itemName", key: "itemName", width: 150 },
    { title: "Category", dataIndex: "category", key: "category", width: 100 },
    { title: "UOM", dataIndex: "uom", key: "uom", width: 60 },
    { title: "Qty", dataIndex: "requiredQuantity", key: "requiredQuantity", width: 60 },
    { title: "Unit Cost", dataIndex: "estimatedUnitCost", key: "estimatedUnitCost", width: 100, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Total", dataIndex: "totalEstimatedCost", key: "totalEstimatedCost", width: 100, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "", key: "action", width: 40, render: (_: unknown, record: PRItem) => <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} /> },
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
        <Form form={form} layout="vertical" initialValues={pr || { priority: "Normal", requisitionDate: new Date().toISOString().split("T")[0] }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="requisitionDate" label="Requisition Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="requestedBy" label="Requested By" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Production">Production</Select.Option>
                <Select.Option value="Quality Control">Quality Control</Select.Option>
                <Select.Option value="Quality Assurance">Quality Assurance</Select.Option>
                <Select.Option value="Packaging">Packaging</Select.Option>
                <Select.Option value="R&D">R&D</Select.Option>
                <Select.Option value="Warehouse">Warehouse</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="costCenter" label="Cost Center" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Normal">Normal</Select.Option>
                <Select.Option value="Urgent">Urgent</Select.Option>
                <Select.Option value="Emergency">Emergency</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="expectedDeliveryDate" label="Expected Delivery Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="budgetReference" label="Budget Reference">
              <Input />
            </Form.Item>
          </div>
        </Form>
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
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select size="small">
                  <Select.Option value="Raw Materials">Raw Materials</Select.Option>
                  <Select.Option value="Packaging">Packaging</Select.Option>
                  <Select.Option value="Equipment">Equipment</Select.Option>
                  <Select.Option value="Consumables">Consumables</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="uom" label="UOM" rules={[{ required: true }]}>
                <Select size="small">
                  <Select.Option value="KG">KG</Select.Option>
                  <Select.Option value="LTR">LTR</Select.Option>
                  <Select.Option value="PCS">PCS</Select.Option>
                  <Select.Option value="ROLL">ROLL</Select.Option>
                  <Select.Option value="BOX">BOX</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              <Form.Item name="requiredQuantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber size="small" style={{ width: "100%" }} min={1} />
              </Form.Item>
              <Form.Item name="estimatedUnitCost" label="Est. Unit Cost" rules={[{ required: true }]}>
                <InputNumber size="small" style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="preferredVendor" label="Preferred Vendor">
                <Select size="small" allowClear>
                  {vendors.map((v) => <Select.Option key={v.id} value={v.legalName}>{v.legalName}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="specification" label="Specification">
                <Input size="small" />
              </Form.Item>
            </div>
            <Button type="dashed" icon={<PlusOutlined />} onClick={addItem} block>Add Item</Button>
          </Form>
          <Divider />
          <Table columns={itemColumns} dataSource={items} rowKey="id" pagination={false} size="small" />
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <strong>Total: PKR {items.reduce((s, i) => s + i.totalEstimatedCost, 0).toLocaleString()}</strong>
          </div>
        </>
      )}

      {currentStep === 2 && (
        <>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>Header Information</Text>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, fontSize: 12 }}>
            <div><strong>Date:</strong> {form.getFieldValue("requisitionDate")}</div>
            <div><strong>Requested By:</strong> {form.getFieldValue("requestedBy")}</div>
            <div><strong>Department:</strong> {form.getFieldValue("department")}</div>
            <div><strong>Cost Center:</strong> {form.getFieldValue("costCenter")}</div>
            <div><strong>Priority:</strong> {form.getFieldValue("priority")}</div>
            <div><strong>Expected Delivery:</strong> {form.getFieldValue("expectedDeliveryDate")}</div>
          </div>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8, marginTop: 16 }}>Items ({items.length})</Text>
          <Table columns={itemColumns.filter((c) => c.key !== "action")} dataSource={items} rowKey="id" pagination={false} size="small" />
          <div style={{ marginTop: 12, textAlign: "right", fontSize: 14 }}>
            <strong>Total Estimated Cost: PKR {items.reduce((s, i) => s + i.totalEstimatedCost, 0).toLocaleString()}</strong>
          </div>
        </>
      )}

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}
        {currentStep < 2 && <Button type="primary" onClick={next} style={{ marginLeft: "auto" }}>Next</Button>}
        {currentStep === 2 && <Button type="primary" onClick={handleFinish} style={{ marginLeft: "auto" }}>Save PR</Button>}
      </div>
    </div>
  );
}
