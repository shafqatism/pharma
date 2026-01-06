"use client";

import React, { useState } from "react";
import { Card, Form, Input, InputNumber, Switch, Select, Button, Space, Typography, Divider, Table, Tag, message } from "antd";
import { SaveOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import { useProcurementStore } from "@/store/procurementStore";

const { Title, Text } = Typography;

export default function ProcurementConfigPage() {
  const { config, setConfig } = useProcurementStore();
  const [form] = Form.useForm();
  const [thresholds, setThresholds] = useState(config?.thresholdLimits || []);
  const [newRole, setNewRole] = useState("");
  const [newLimit, setNewLimit] = useState<number>(0);

  const handleSave = (values: Record<string, unknown>) => {
    const updatedConfig = {
      id: config?.id || "config-1",
      ...values,
      thresholdLimits: thresholds,
      createdAt: config?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setConfig(updatedConfig as typeof config & { id: string; createdAt: string; updatedAt: string });
    message.success("Configuration saved successfully");
  };

  const addThreshold = () => {
    if (newRole && newLimit > 0) {
      setThresholds([...thresholds, { role: newRole, limit: newLimit }]);
      setNewRole("");
      setNewLimit(0);
    }
  };

  const removeThreshold = (index: number) => {
    setThresholds(thresholds.filter((_, i) => i !== index));
  };

  const thresholdColumns = [
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Limit (PKR)", dataIndex: "limit", key: "limit", render: (v: number) => v.toLocaleString() },
    {
      title: "Action", key: "action",
      render: (_: unknown, __: unknown, index: number) => (
        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => removeThreshold(index)} />
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>Procurement Configuration</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>Setup procurement policies, approval levels, and thresholds</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          policyType: config?.policyType || "Standard Pharmaceutical Procurement",
          approvalLevels: config?.approvalLevels || 3,
          budgetEnforcement: config?.budgetEnforcement ?? true,
          purchaseCategoryMapping: config?.purchaseCategoryMapping || [],
          currency: config?.currency || "PKR",
          taxRules: config?.taxRules || "",
          dutyRules: config?.dutyRules || "",
          emergencyPurchaseFlag: config?.emergencyPurchaseFlag ?? true,
        }}
        onFinish={handleSave}
      >
        <Card title="General Settings" size="small" style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <Form.Item name="policyType" label="Procurement Policy Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Standard Pharmaceutical Procurement">Standard Pharmaceutical Procurement</Select.Option>
                <Select.Option value="Emergency Procurement">Emergency Procurement</Select.Option>
                <Select.Option value="Capital Equipment">Capital Equipment</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="approvalLevels" label="Approval Levels" rules={[{ required: true }]}>
              <InputNumber min={1} max={5} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="currency" label="Default Currency" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="PKR">PKR - Pakistani Rupee</Select.Option>
                <Select.Option value="USD">USD - US Dollar</Select.Option>
                <Select.Option value="EUR">EUR - Euro</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Form.Item name="budgetEnforcement" label="Budget Enforcement" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
            <Form.Item name="emergencyPurchaseFlag" label="Allow Emergency Purchase" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </div>
        </Card>

        <Card title="Category & Tax Settings" size="small" style={{ marginBottom: 16 }}>
          <Form.Item name="purchaseCategoryMapping" label="Purchase Categories">
            <Select mode="tags" placeholder="Add categories">
              <Select.Option value="Raw Materials">Raw Materials</Select.Option>
              <Select.Option value="Packaging">Packaging</Select.Option>
              <Select.Option value="Equipment">Equipment</Select.Option>
              <Select.Option value="Services">Services</Select.Option>
              <Select.Option value="Consumables">Consumables</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Form.Item name="taxRules" label="Tax Rules">
              <Input.TextArea rows={2} placeholder="e.g., GST 17%, WHT 4.5%" />
            </Form.Item>
            <Form.Item name="dutyRules" label="Duty Rules">
              <Input.TextArea rows={2} placeholder="e.g., Custom Duty as per HS Code" />
            </Form.Item>
          </div>
        </Card>

        <Card title="Threshold Limits per Role" size="small" style={{ marginBottom: 16 }}>
          <Space style={{ marginBottom: 12 }}>
            <Input placeholder="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} style={{ width: 150 }} />
            <InputNumber placeholder="Limit" value={newLimit} onChange={(v) => setNewLimit(v || 0)} style={{ width: 150 }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
            <Button type="primary" icon={<PlusOutlined />} onClick={addThreshold}>Add</Button>
          </Space>
          <Table columns={thresholdColumns} dataSource={thresholds.map((t, i) => ({ ...t, key: i }))} pagination={false} size="small" />
        </Card>

        <div style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>Save Configuration</Button>
        </div>
      </Form>
    </DashboardLayout>
  );
}
