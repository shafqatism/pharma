"use client";

import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, InputNumber, DatePicker, Table, Button, Row, Col, Card, Typography, Space, Tag, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSalesStore } from "@/store/salesStore";
import { SalesOrder, SalesOrderItem } from "@/types/sales";
import dayjs from "dayjs";

const { Text } = Typography;

interface SalesOrderFormProps {
  open: boolean;
  onClose: () => void;
  editingOrder: SalesOrder | null;
}

const availableItems = [
  { id: "ITM001", code: "PARA-500", name: "Paracetamol 500mg", batches: [{ batch: "B2024-001", expiry: "2026-06-30", available: 5000, price: 25 }] },
  { id: "ITM002", code: "AMOX-250", name: "Amoxicillin 250mg", batches: [{ batch: "B2024-002", expiry: "2025-12-31", available: 3000, price: 45 }] },
  { id: "ITM003", code: "INS-100", name: "Insulin 100IU", batches: [{ batch: "B2024-003", expiry: "2025-06-30", available: 500, price: 850 }] },
  { id: "ITM004", code: "CEFT-1G", name: "Ceftriaxone 1g Inj", batches: [{ batch: "B2024-004", expiry: "2025-09-30", available: 1000, price: 120 }] },
  { id: "ITM005", code: "OMEP-20", name: "Omeprazole 20mg", batches: [{ batch: "B2024-005", expiry: "2026-03-31", available: 8000, price: 15 }] },
];

export default function SalesOrderForm({ open, onClose, editingOrder }: SalesOrderFormProps) {
  const [form] = Form.useForm();
  const { addSalesOrder, updateSalesOrder, customers, salesChannels } = useSalesStore();
  const [orderItems, setOrderItems] = useState<SalesOrderItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (editingOrder) {
      form.setFieldsValue({
        ...editingOrder,
        orderDate: dayjs(editingOrder.orderDate),
        requestedDeliveryDate: dayjs(editingOrder.requestedDeliveryDate),
      });
      setOrderItems(editingOrder.items);
    } else {
      form.resetFields();
      form.setFieldsValue({
        orderDate: dayjs(),
        currency: "PKR",
        priority: "normal",
        status: "draft",
      });
      setOrderItems([]);
    }
  }, [editingOrder, form, open]);

  const handleAddItem = () => {
    if (!selectedItem) return;
    const item = availableItems.find((i) => i.id === selectedItem);
    if (!item || item.batches.length === 0) return;

    const batch = item.batches[0];
    const newItem: SalesOrderItem = {
      id: `SOI${Date.now()}`,
      itemId: item.id,
      itemCode: item.code,
      itemName: item.name,
      batchNumber: batch.batch,
      expiryDate: batch.expiry,
      availableQty: batch.available,
      orderedQty: 1,
      unitPrice: batch.price,
      discount: 0,
      taxRate: 17,
      taxAmount: batch.price * 0.17,
      lineTotal: batch.price * 1.17,
    };
    setOrderItems([...orderItems, newItem]);
    setSelectedItem(null);
  };

  const handleRemoveItem = (id: string) => {
    setOrderItems(orderItems.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: number) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const subtotal = updated.unitPrice * updated.orderedQty;
        const discountAmount = subtotal * (updated.discount / 100);
        const taxableAmount = subtotal - discountAmount;
        updated.taxAmount = taxableAmount * (updated.taxRate / 100);
        updated.lineTotal = taxableAmount + updated.taxAmount;
        return updated;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.orderedQty, 0);
    const totalDiscount = orderItems.reduce((sum, i) => sum + (i.unitPrice * i.orderedQty * i.discount) / 100, 0);
    const taxAmount = orderItems.reduce((sum, i) => sum + i.taxAmount, 0);
    const netTotal = subtotal - totalDiscount + taxAmount;
    return { subtotal, totalDiscount, taxAmount, netTotal };
  };

  const totals = calculateTotals();

  const handleSubmit = (values: any) => {
    const customer = customers.find((c) => c.id === values.customerId);
    const channel = salesChannels.find((c) => c.id === values.salesChannel);

    const orderData = {
      ...values,
      orderDate: values.orderDate.format("YYYY-MM-DD"),
      requestedDeliveryDate: values.requestedDeliveryDate.format("YYYY-MM-DD"),
      customerName: customer?.name || "",
      salesChannel: channel?.name || values.salesChannel,
      salesRepName: "Ahmed Raza", // Would come from auth
      warehouseName: values.warehouseId === "WH001" ? "Main Warehouse" : "Cold Storage",
      items: orderItems,
      ...totals,
      stockValidated: true,
      creditValidated: true,
      licenseValidated: true,
    };

    if (editingOrder) {
      updateSalesOrder(editingOrder.id, orderData);
    } else {
      addSalesOrder(orderData);
    }
    onClose();
  };

  const itemColumns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode", width: 100 },
    { title: "Item Name", dataIndex: "itemName", key: "itemName", width: 150 },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber", width: 100 },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate", width: 100 },
    { title: "Available", dataIndex: "availableQty", key: "availableQty", width: 80 },
    {
      title: "Qty",
      dataIndex: "orderedQty",
      key: "orderedQty",
      width: 80,
      render: (v: number, r: SalesOrderItem) => (
        <InputNumber size="small" min={1} max={r.availableQty} value={v} onChange={(val) => handleItemChange(r.id, "orderedQty", val || 1)} />
      ),
    },
    { title: "Price", dataIndex: "unitPrice", key: "unitPrice", width: 80, render: (v: number) => `PKR ${v}` },
    {
      title: "Disc %",
      dataIndex: "discount",
      key: "discount",
      width: 70,
      render: (v: number, r: SalesOrderItem) => (
        <InputNumber size="small" min={0} max={20} value={v} onChange={(val) => handleItemChange(r.id, "discount", val || 0)} />
      ),
    },
    { title: "Tax", dataIndex: "taxAmount", key: "taxAmount", width: 80, render: (v: number) => `PKR ${v.toFixed(0)}` },
    { title: "Total", dataIndex: "lineTotal", key: "lineTotal", width: 100, render: (v: number) => <Text strong>PKR {v.toFixed(0)}</Text> },
    {
      title: "",
      key: "action",
      width: 40,
      render: (_: unknown, r: SalesOrderItem) => <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => handleRemoveItem(r.id)} />,
    },
  ];

  return (
    <Modal
      title={editingOrder ? "Edit Sales Order" : "New Sales Order"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={1100}
      okText={editingOrder ? "Update" : "Create Order"}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="small">
        <Card title="Order Header" size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="orderDate" label="Order Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={customers.filter((c) => c.status === "active").map((c) => ({ value: c.id, label: c.name }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="salesChannel" label="Sales Channel" rules={[{ required: true }]}>
                <Select options={salesChannels.map((c) => ({ value: c.id, label: c.name }))} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: "WH001", label: "Main Warehouse" },
                    { value: "WH002", label: "Cold Storage" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="requestedDeliveryDate" label="Requested Delivery" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="priority" label="Priority">
                <Select
                  options={[
                    { value: "normal", label: "Normal" },
                    { value: "high", label: "High" },
                    { value: "urgent", label: "Urgent" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="currency" label="Currency">
                <Select options={[{ value: "PKR", label: "PKR" }, { value: "USD", label: "USD" }]} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="salesRepId" label="Sales Rep">
                <Select
                  options={[
                    { value: "SR001", label: "Ahmed Raza" },
                    { value: "SR002", label: "Fatima Noor" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="deliveryAddress" label="Delivery Address">
                <Input.TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Line Items" size="small" style={{ marginBottom: 16 }}>
          <Space style={{ marginBottom: 12 }}>
            <Select
              placeholder="Select item to add"
              style={{ width: 300 }}
              value={selectedItem}
              onChange={setSelectedItem}
              options={availableItems.map((i) => ({ value: i.id, label: `${i.code} - ${i.name}` }))}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem} disabled={!selectedItem}>
              Add Item
            </Button>
          </Space>

          <Table dataSource={orderItems} columns={itemColumns} rowKey="id" size="small" pagination={false} scroll={{ x: 1000 }} />

          <Divider />

          <Row justify="end">
            <Col span={8}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text>Subtotal:</Text>
                <Text>PKR {totals.subtotal.toLocaleString()}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text type="danger">Total Discount:</Text>
                <Text type="danger">- PKR {totals.totalDiscount.toLocaleString()}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <Text>Tax Amount:</Text>
                <Text>PKR {totals.taxAmount.toFixed(2)}</Text>
              </div>
              <Divider style={{ margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 16 }}>Net Total:</Text>
                <Text strong style={{ fontSize: 16, color: "#52c41a" }}>PKR {totals.netTotal.toFixed(2)}</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
}
