"use client";

import { useState } from "react";
import { Card, Tabs, Table, Button, Tag, Space, Modal, Form, Input, Select, InputNumber, DatePicker, Typography, Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import { useSalesStore } from "@/store/salesStore";
import { PriceList } from "@/types/sales";

const { Title, Text } = Typography;

export default function PricingPage() {
  const { priceLists } = useSalesStore();
  const [activeTab, setActiveTab] = useState("pricelists");
  const [viewPriceList, setViewPriceList] = useState<PriceList | null>(null);

  const discountRules = [
    { id: 1, name: "Standard Trade Discount", type: "Percentage", value: 10, minOrder: 50000, approval: false, validFrom: "2024-01-01", validTo: "2024-12-31", status: "active" },
    { id: 2, name: "Volume Discount", type: "Volume", value: 15, minOrder: 200000, approval: true, validFrom: "2024-01-01", validTo: "2024-12-31", status: "active" },
    { id: 3, name: "Seasonal Promotion", type: "Percentage", value: 20, minOrder: 100000, approval: true, validFrom: "2024-12-01", validTo: "2024-12-31", status: "active" },
  ];

  const overrideLog = [
    { id: 1, order: "SO-2024-0045", customer: "MedPlus Distributors", originalDiscount: 10, overrideDiscount: 15, reason: "Bulk order commitment", approver: "Sales Manager", date: "2024-12-15" },
    { id: 2, order: "SO-2024-0052", customer: "City General Hospital", originalDiscount: 5, overrideDiscount: 12, reason: "Annual contract renewal", approver: "Sales Head", date: "2024-12-18" },
  ];

  const priceListColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Customer Type", dataIndex: "customerType", key: "customerType", render: (t: string) => <Tag>{t.toUpperCase()}</Tag> },
    { title: "Currency", dataIndex: "currency", key: "currency" },
    { title: "Effective From", dataIndex: "effectiveFrom", key: "effectiveFrom" },
    { title: "Effective To", dataIndex: "effectiveTo", key: "effectiveTo" },
    { title: "Items", dataIndex: "items", key: "items", render: (items: any[]) => items.length },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "active" ? "green" : "red"}>{s.toUpperCase()}</Tag> },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: PriceList) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setViewPriceList(record)} />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  const discountColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type", render: (t: string) => <Tag>{t}</Tag> },
    { title: "Value (%)", dataIndex: "value", key: "value" },
    { title: "Min Order", dataIndex: "minOrder", key: "minOrder", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Approval", dataIndex: "approval", key: "approval", render: (v: boolean) => <Tag color={v ? "orange" : "green"}>{v ? "Required" : "Auto"}</Tag> },
    { title: "Valid From", dataIndex: "validFrom", key: "validFrom" },
    { title: "Valid To", dataIndex: "validTo", key: "validTo" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color="green">{s.toUpperCase()}</Tag> },
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

  const overrideColumns = [
    { title: "Order #", dataIndex: "order", key: "order" },
    { title: "Customer", dataIndex: "customer", key: "customer" },
    { title: "Original %", dataIndex: "originalDiscount", key: "originalDiscount" },
    { title: "Override %", dataIndex: "overrideDiscount", key: "overrideDiscount", render: (v: number) => <Text type="warning">{v}%</Text> },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Approver", dataIndex: "approver", key: "approver" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const tabItems = [
    {
      key: "pricelists",
      label: "Price Lists",
      children: (
        <Card
          title="Price Lists"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Price List</Button>}
        >
          <Table dataSource={priceLists} columns={priceListColumns} rowKey="id" size="small" />
        </Card>
      ),
    },
    {
      key: "discounts",
      label: "Discount Rules",
      children: (
        <Card
          title="Discount Rules"
          extra={<Button type="primary" icon={<PlusOutlined />} size="small">Add Discount Rule</Button>}
        >
          <Table dataSource={discountRules} columns={discountColumns} rowKey="id" size="small" />
        </Card>
      ),
    },
    {
      key: "overrides",
      label: "Override Audit Log",
      children: (
        <Card title="Discount Override Audit Log">
          <Table dataSource={overrideLog} columns={overrideColumns} rowKey="id" size="small" />
        </Card>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Pricing & Discounts</Title>
        <Text type="secondary">Manage price lists, discount rules, and audit overrides</Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* View Price List Modal */}
      <Modal
        title={`Price List - ${viewPriceList?.name}`}
        open={!!viewPriceList}
        onCancel={() => setViewPriceList(null)}
        footer={null}
        width={800}
      >
        {viewPriceList && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Text type="secondary">Customer Type:</Text>
                <div><Tag>{viewPriceList.customerType.toUpperCase()}</Tag></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Currency:</Text>
                <div><Text strong>{viewPriceList.currency}</Text></div>
              </Col>
              <Col span={8}>
                <Text type="secondary">Validity:</Text>
                <div><Text>{viewPriceList.effectiveFrom} to {viewPriceList.effectiveTo}</Text></div>
              </Col>
            </Row>

            <Table
              dataSource={viewPriceList.items}
              columns={[
                { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
                { title: "Item Name", dataIndex: "itemName", key: "itemName" },
                { title: "Base Price", dataIndex: "basePrice", key: "basePrice", render: (v: number) => `PKR ${v}` },
                { title: "Tax Rate", dataIndex: "taxRate", key: "taxRate", render: (v: number) => `${v}%` },
              ]}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}
