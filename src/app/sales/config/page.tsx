"use client";

import { useState } from "react";
import { Card, Tabs, Table, Button, Tag, Space, Modal, Form, Input, Select, InputNumber, Switch, Typography, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import { useSalesStore } from "@/store/salesStore";

const { Title, Text } = Typography;

export default function SalesConfigPage() {
  const { salesChannels, salesRegions } = useSalesStore();
  const [activeTab, setActiveTab] = useState("channels");

  const channelColumns = [
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type", render: (t: string) => <Tag>{t.toUpperCase()}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "active" ? "green" : "red"}>{s}</Tag> },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  const regionColumns = [
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Territories", dataIndex: "territories", key: "territories", render: (t: string[]) => t.join(", ") },
    { title: "Manager", dataIndex: "manager", key: "manager" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "active" ? "green" : "red"}>{s}</Tag> },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  const taxRules = [
    { id: 1, name: "Standard VAT", rate: 17, type: "VAT", status: "active" },
    { id: 2, name: "Zero Rated", rate: 0, type: "VAT", status: "active" },
    { id: 3, name: "Reduced Rate", rate: 5, type: "VAT", status: "active" },
  ];

  const creditRules = [
    { id: 1, customerType: "Distributor", maxLimit: 5000000, maxDays: 30, autoBlock: true, grace: 7 },
    { id: 2, customerType: "Hospital", maxLimit: 10000000, maxDays: 60, autoBlock: true, grace: 14 },
    { id: 3, customerType: "Pharmacy", maxLimit: 1000000, maxDays: 15, autoBlock: true, grace: 3 },
  ];

  const discountThresholds = [
    { id: 1, name: "Standard Discount", type: "Percentage", maxDiscount: 10, approval: false },
    { id: 2, name: "Volume Discount", type: "Volume", maxDiscount: 15, approval: true },
    { id: 3, name: "Special Discount", type: "Fixed", maxDiscount: 20, approval: true },
  ];

  const tabItems = [
    {
      key: "channels",
      label: "Sales Channels",
      children: (
        <Card
          title="Sales Channels"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Channel</Button>}
        >
          <Table dataSource={salesChannels} columns={channelColumns} rowKey="id" size="small" pagination={false} />
        </Card>
      ),
    },
    {
      key: "regions",
      label: "Regions & Territories",
      children: (
        <Card
          title="Sales Regions"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Region</Button>}
        >
          <Table dataSource={salesRegions} columns={regionColumns} rowKey="id" size="small" pagination={false} />
        </Card>
      ),
    },
    {
      key: "tax",
      label: "Tax Rules",
      children: (
        <Card
          title="Tax & VAT Rules"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Tax Rule</Button>}
        >
          <Table
            dataSource={taxRules}
            columns={[
              { title: "Name", dataIndex: "name", key: "name" },
              { title: "Rate (%)", dataIndex: "rate", key: "rate" },
              { title: "Type", dataIndex: "type", key: "type" },
              { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color="green">{s}</Tag> },
              { title: "Actions", key: "actions", render: () => <Space><Button type="text" icon={<EditOutlined />} size="small" /></Space> },
            ]}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: "credit",
      label: "Credit Control",
      children: (
        <Card
          title="Credit Control Rules"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Rule</Button>}
        >
          <Table
            dataSource={creditRules}
            columns={[
              { title: "Customer Type", dataIndex: "customerType", key: "customerType" },
              { title: "Max Credit Limit", dataIndex: "maxLimit", key: "maxLimit", render: (v: number) => `PKR ${v.toLocaleString()}` },
              { title: "Max Days", dataIndex: "maxDays", key: "maxDays" },
              { title: "Auto Block", dataIndex: "autoBlock", key: "autoBlock", render: (v: boolean) => <Tag color={v ? "red" : "default"}>{v ? "Yes" : "No"}</Tag> },
              { title: "Grace Period", dataIndex: "grace", key: "grace", render: (v: number) => `${v} days` },
              { title: "Actions", key: "actions", render: () => <Space><Button type="text" icon={<EditOutlined />} size="small" /></Space> },
            ]}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: "discounts",
      label: "Discount Thresholds",
      children: (
        <Card
          title="Discount Thresholds"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Threshold</Button>}
        >
          <Table
            dataSource={discountThresholds}
            columns={[
              { title: "Name", dataIndex: "name", key: "name" },
              { title: "Type", dataIndex: "type", key: "type" },
              { title: "Max Discount (%)", dataIndex: "maxDiscount", key: "maxDiscount" },
              { title: "Approval Required", dataIndex: "approval", key: "approval", render: (v: boolean) => <Tag color={v ? "orange" : "green"}>{v ? "Yes" : "No"}</Tag> },
              { title: "Actions", key: "actions", render: () => <Space><Button type="text" icon={<EditOutlined />} size="small" /></Space> },
            ]}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Card>
      ),
    },
    {
      key: "approval",
      label: "Approval Levels",
      children: (
        <Card title="Order Approval Levels">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card size="small" title="Sales Approval">
                <Form layout="vertical" size="small">
                  <Form.Item label="Approval Required Above">
                    <InputNumber style={{ width: "100%" }} defaultValue={100000} formatter={(v) => `PKR ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                  </Form.Item>
                  <Form.Item label="Approver Role">
                    <Select defaultValue="sales_manager" options={[{ value: "sales_manager", label: "Sales Manager" }, { value: "sales_head", label: "Sales Head" }]} />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Finance Approval">
                <Form layout="vertical" size="small">
                  <Form.Item label="Approval Required Above">
                    <InputNumber style={{ width: "100%" }} defaultValue={500000} formatter={(v) => `PKR ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
                  </Form.Item>
                  <Form.Item label="Approver Role">
                    <Select defaultValue="finance_manager" options={[{ value: "finance_manager", label: "Finance Manager" }, { value: "cfo", label: "CFO" }]} />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      key: "batch",
      label: "Batch & Expiry",
      children: (
        <Card title="Batch & Expiry Enforcement">
          <Form layout="vertical" size="small" style={{ maxWidth: 500 }}>
            <Form.Item label="Batch Number Mandatory">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="Expiry Validation">
              <Select defaultValue="mandatory" options={[{ value: "mandatory", label: "Mandatory" }, { value: "optional", label: "Optional" }, { value: "disabled", label: "Disabled" }]} />
            </Form.Item>
            <Form.Item label="Minimum Shelf Life (Days)">
              <InputNumber style={{ width: "100%" }} defaultValue={90} />
            </Form.Item>
            <Form.Item label="FEFO Enforcement">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="Cold Chain Tracking">
              <Switch defaultChecked />
            </Form.Item>
            <Button type="primary">Save Settings</Button>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Sales Configuration</Title>
        <Text type="secondary">Configure sales channels, regions, tax rules, and approval workflows</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
    </DashboardLayout>
  );
}
