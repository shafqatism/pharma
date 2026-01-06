"use client";

import { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Switch, Tabs, Row, Col, DatePicker } from "antd";
import { useSalesStore } from "@/store/salesStore";
import { Customer } from "@/types/sales";
import dayjs from "dayjs";

interface CustomerFormProps {
  open: boolean;
  onClose: () => void;
  editingCustomer: Customer | null;
}

export default function CustomerForm({ open, onClose, editingCustomer }: CustomerFormProps) {
  const [form] = Form.useForm();
  const { addCustomer, updateCustomer, salesRegions, priceLists } = useSalesStore();

  useEffect(() => {
    if (editingCustomer) {
      form.setFieldsValue({
        ...editingCustomer,
        licenseExpiry: editingCustomer.licenseExpiry ? dayjs(editingCustomer.licenseExpiry) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingCustomer, form]);

  const handleSubmit = (values: Omit<Customer, "id" | "code" | "createdAt" | "updatedAt" | "documents">) => {
    const data = {
      ...values,
      licenseExpiry: values.licenseExpiry?.format("YYYY-MM-DD"),
      documents: editingCustomer?.documents || [],
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
    } else {
      addCustomer(data);
    }
    onClose();
    form.resetFields();
  };

  const tabItems = [
    {
      key: "basic",
      label: "Basic Information",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="type" label="Customer Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: "distributor", label: "Distributor" },
                  { value: "hospital", label: "Hospital" },
                  { value: "pharmacy", label: "Pharmacy" },
                  { value: "retailer", label: "Retailer" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="region" label="Region" rules={[{ required: true }]}>
              <Select options={salesRegions.map((r) => ({ value: r.name, label: r.name }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="territory" label="Territory" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status" initialValue="active">
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "suspended", label: "Suspended" },
                  { value: "blacklisted", label: "Blacklisted" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="billingAddress" label="Billing Address" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="shippingAddress" label="Shipping Address" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "regulatory",
      label: "Regulatory & Compliance",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="drugLicenseNumber" label="Drug License Number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="issuingAuthority" label="Issuing Authority" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: "DRAP", label: "DRAP" },
                  { value: "Provincial Authority", label: "Provincial Authority" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="licenseExpiry" label="License Expiry Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="complianceStatus" label="Compliance Status" initialValue="valid">
              <Select
                options={[
                  { value: "valid", label: "Valid" },
                  { value: "expired", label: "Expired" },
                  { value: "blocked", label: "Blocked" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="controlledDrugAuth" label="Controlled Drug Authorization" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="prescriptionRequired" label="Prescription Required" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "financial",
      label: "Financial & Credit",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="creditLimit" label="Credit Limit (PKR)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="paymentTerms" label="Payment Terms" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: "cash", label: "Cash" },
                  { value: "net-15", label: "Net 15" },
                  { value: "net-30", label: "Net 30" },
                  { value: "net-60", label: "Net 60" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="creditDays" label="Credit Days" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} max={90} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="currentOutstanding" label="Current Outstanding (PKR)" initialValue={0}>
              <InputNumber style={{ width: "100%" }} min={0} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="creditHold" label="Credit Hold" valuePropName="checked" initialValue={false}>
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="discountEligibility" label="Discount Eligible" valuePropName="checked" initialValue={true}>
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
    {
      key: "commercial",
      label: "Commercial Settings",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="priceListId" label="Price List" rules={[{ required: true }]}>
              <Select options={priceLists.map((p) => ({ value: p.id, label: p.name }))} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="salesRepId" label="Sales Representative">
              <Select
                options={[
                  { value: "SR001", label: "Ahmed Raza" },
                  { value: "SR002", label: "Fatima Noor" },
                  { value: "SR003", label: "Kamran Ali" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deliveryPriority" label="Delivery Priority" initialValue="normal">
              <Select
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Modal
      title={editingCustomer ? "Edit Customer" : "Add New Customer"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      width={800}
      okText={editingCustomer ? "Update" : "Create"}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="small">
        <Tabs items={tabItems} />
      </Form>
    </Modal>
  );
}
