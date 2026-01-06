"use client";

import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Button, Steps, message, Table, Divider, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useProcurementStore } from "@/store/procurementStore";
import { PurchaseOrder, POItem } from "@/types/procurement";

const { Text } = Typography;

interface POFormProps {
  po: PurchaseOrder | null;
  onClose: () => void;
}

export default function POForm({ po, onClose }: POFormProps) {
  const { addPurchaseOrder, updatePurchaseOrder, purchaseOrders, vendors, purchaseRequisitions } = useProcurementStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [items, setItems] = useState<POItem[]>(po?.items || []);
  const [itemForm] = Form.useForm();

  const steps = [{ title: "Header" }, { title: "Items" }, { title: "Summary" }];

  const addItem = () => {
    itemForm.validateFields().then((values) => {
      const qty = values.quantityOrdered;
      const price = values.unitPrice;
      const discount = values.discount || 0;
      const tax = values.tax || 0;
      const subtotal = qty * price * (1 - discount / 100);
      const lineTotal = subtotal * (1 + tax / 100);

      const newItem: POItem = {
        id: `poi${Date.now()}`,
        itemCode: values.itemCode,
        description: values.description,
        batchRequired: values.batchRequired || false,
        quantityOrdered: qty,
        unitPrice: price,
        discount,
        tax,
        lineTotal,
      };
      setItems([...items, newItem]);
      itemForm.resetFields();
    });
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.id !== id));

  const calculateTotals = () => {
    const subtotal = items.reduce((s, i) => s + i.quantityOrdered * i.unitPrice * (1 - i.discount / 100), 0);
    const taxAmount = items.reduce((s, i) => s + i.quantityOrdered * i.unitPrice * (1 - i.discount / 100) * (i.tax / 100), 0);
    return { subtotal, taxAmount };
  };

  const handleFinish = () => {
    const values = form.getFieldsValue();
    const vendor = vendors.find((v) => v.id === values.vendorId);
    const { subtotal, taxAmount } = calculateTotals();
    const freight = values.freightCharges || 0;
    const insurance = values.insurance || 0;

    const poData: PurchaseOrder = {
      id: po?.id || `po${Date.now()}`,
      poNumber: po?.poNumber || `PO-2024-${String(purchaseOrders.length + 1).padStart(3, "0")}`,
      poDate: values.poDate,
      vendorId: values.vendorId,
      vendorName: vendor?.legalName || "",
      referencePR: values.referencePR || "",
      currency: values.currency,
      paymentTerms: values.paymentTerms,
      deliveryLocation: values.deliveryLocation,
      incoterms: values.incoterms,
      deliverySchedule: values.deliverySchedule,
      items,
      subtotal,
      taxAmount,
      freightCharges: freight,
      insurance,
      totalPOValue: subtotal + taxAmount + freight + insurance,
      approvalStatus: po?.approvalStatus || "Pending",
      status: po?.status || "Open",
      amendments: po?.amendments || [],
      attachments: po?.attachments || [],
      createdAt: po?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (po) {
      updatePurchaseOrder(po.id, poData);
      message.success("PO updated");
    } else {
      addPurchaseOrder(poData);
      message.success("PO created");
    }
    onClose();
  };

  const itemColumns = [
    { title: "Code", dataIndex: "itemCode", key: "itemCode", width: 80 },
    { title: "Description", dataIndex: "description", key: "description", width: 180 },
    { title: "Qty", dataIndex: "quantityOrdered", key: "quantityOrdered", width: 60 },
    { title: "Price", dataIndex: "unitPrice", key: "unitPrice", width: 80, render: (v: number) => v.toLocaleString() },
    { title: "Disc %", dataIndex: "discount", key: "discount", width: 60 },
    { title: "Tax %", dataIndex: "tax", key: "tax", width: 60 },
    { title: "Total", dataIndex: "lineTotal", key: "lineTotal", width: 100, render: (v: number) => v.toLocaleString() },
    { title: "", key: "action", width: 40, render: (_: unknown, record: POItem) => <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} /> },
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

  const { subtotal, taxAmount } = calculateTotals();
  const freight = form.getFieldValue("freightCharges") || 0;
  const insurance = form.getFieldValue("insurance") || 0;

  return (
    <div>
      <Steps current={currentStep} items={steps} size="small" style={{ marginBottom: 24 }} />

      {currentStep === 0 && (
        <Form form={form} layout="vertical" initialValues={po || { currency: "PKR", paymentTerms: "Net-30", incoterms: "DDP", poDate: new Date().toISOString().split("T")[0] }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="poDate" label="PO Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="vendorId" label="Vendor" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {vendors.filter((v) => v.status === "Active").map((v) => <Select.Option key={v.id} value={v.id}>{v.legalName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="referencePR" label="Reference PR">
              <Select allowClear>
                {purchaseRequisitions.filter((p) => p.status === "Approved").map((p) => <Select.Option key={p.id} value={p.prNumber}>{p.prNumber}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="PKR">PKR</Select.Option>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="paymentTerms" label="Payment Terms" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Advance">Advance</Select.Option>
                <Select.Option value="Net-30">Net-30</Select.Option>
                <Select.Option value="Net-60">Net-60</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="incoterms" label="Incoterms" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="FOB">FOB</Select.Option>
                <Select.Option value="CIF">CIF</Select.Option>
                <Select.Option value="DDP">DDP</Select.Option>
                <Select.Option value="EXW">EXW</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="deliverySchedule" label="Delivery Schedule" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
          </div>
          <Form.Item name="deliveryLocation" label="Delivery Location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="freightCharges" label="Freight Charges">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="insurance" label="Insurance">
              <InputNumber style={{ width: "100%" }} min={0} />
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
              <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                <Input size="small" />
              </Form.Item>
              <Form.Item name="quantityOrdered" label="Quantity" rules={[{ required: true }]}>
                <InputNumber size="small" style={{ width: "100%" }} min={1} />
              </Form.Item>
              <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true }]}>
                <InputNumber size="small" style={{ width: "100%" }} min={0} />
              </Form.Item>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              <Form.Item name="discount" label="Discount %">
                <InputNumber size="small" style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
              <Form.Item name="tax" label="Tax %">
                <InputNumber size="small" style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
              <Form.Item name="batchRequired" label="Batch Required">
                <Select size="small">
                  <Select.Option value={true}>Yes</Select.Option>
                  <Select.Option value={false}>No</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Button type="dashed" icon={<PlusOutlined />} onClick={addItem} block>Add Item</Button>
          </Form>
          <Divider />
          <Table columns={itemColumns} dataSource={items} rowKey="id" pagination={false} size="small" />
        </>
      )}

      {currentStep === 2 && (
        <>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>Summary</Text>
          <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
              <div>Subtotal:</div><div style={{ textAlign: "right" }}>{form.getFieldValue("currency")} {subtotal.toLocaleString()}</div>
              <div>Tax Amount:</div><div style={{ textAlign: "right" }}>{form.getFieldValue("currency")} {taxAmount.toLocaleString()}</div>
              <div>Freight:</div><div style={{ textAlign: "right" }}>{form.getFieldValue("currency")} {freight.toLocaleString()}</div>
              <div>Insurance:</div><div style={{ textAlign: "right" }}>{form.getFieldValue("currency")} {insurance.toLocaleString()}</div>
              <Divider style={{ margin: "8px 0", gridColumn: "span 2" }} />
              <div style={{ fontWeight: 600 }}>Total PO Value:</div>
              <div style={{ textAlign: "right", fontWeight: 600, fontSize: 14 }}>{form.getFieldValue("currency")} {(subtotal + taxAmount + freight + insurance).toLocaleString()}</div>
            </div>
          </div>
          <Text strong style={{ fontSize: 13, display: "block", marginBottom: 8, marginTop: 16 }}>Items ({items.length})</Text>
          <Table columns={itemColumns.filter((c) => c.key !== "action")} dataSource={items} rowKey="id" pagination={false} size="small" />
        </>
      )}

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}
        {currentStep < 2 && <Button type="primary" onClick={next} style={{ marginLeft: "auto" }}>Next</Button>}
        {currentStep === 2 && <Button type="primary" onClick={handleFinish} style={{ marginLeft: "auto" }}>Save PO</Button>}
      </div>
    </div>
  );
}
