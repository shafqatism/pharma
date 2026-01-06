"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, Select, Typography, Modal, Descriptions, Tabs, Card, Badge } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useSalesStore } from "@/store/salesStore";
import { Customer } from "@/types/sales";
import CustomerForm from "./CustomerForm";

const { Title, Text } = Typography;

export default function CustomersPage() {
  const { customers, deleteCustomer } = useSalesStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchText.toLowerCase()) || c.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !filterType || c.type === filterType;
    const matchesStatus = !filterStatus || c.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Customer",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this customer?",
      onOk: () => deleteCustomer(id),
    });
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code", width: 100 },
    { title: "Name", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (t: string) => <Tag color={t === "distributor" ? "blue" : t === "hospital" ? "purple" : t === "pharmacy" ? "cyan" : "default"}>{t.toUpperCase()}</Tag>,
    },
    { title: "Region", dataIndex: "region", key: "region", width: 120 },
    { title: "Contact", dataIndex: "contactPerson", key: "contactPerson", width: 150 },
    {
      title: "Credit Limit",
      dataIndex: "creditLimit",
      key: "creditLimit",
      width: 130,
      render: (v: number) => `PKR ${(v / 1000000).toFixed(1)}M`,
    },
    {
      title: "Outstanding",
      dataIndex: "currentOutstanding",
      key: "currentOutstanding",
      width: 130,
      render: (v: number, r: Customer) => (
        <Text type={v > r.creditLimit * 0.8 ? "danger" : undefined}>PKR {(v / 1000000).toFixed(2)}M</Text>
      ),
    },
    {
      title: "Compliance",
      dataIndex: "complianceStatus",
      key: "complianceStatus",
      width: 100,
      render: (s: string) => <Tag color={s === "valid" ? "green" : s === "expired" ? "red" : "orange"}>{s.toUpperCase()}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: string) => <Tag color={s === "active" ? "green" : s === "suspended" ? "orange" : "red"}>{s.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: unknown, record: Customer) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setViewCustomer(record)} />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Customer Management</Title>
            <Text type="secondary">Manage customer profiles, credit limits, and compliance</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCustomer(null); setFormOpen(true); }}>
            Add Customer
          </Button>
        </div>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search customers..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Type"
            allowClear
            style={{ width: 150 }}
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: "distributor", label: "Distributor" },
              { value: "hospital", label: "Hospital" },
              { value: "pharmacy", label: "Pharmacy" },
              { value: "retailer", label: "Retailer" },
            ]}
          />
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" },
              { value: "blacklisted", label: "Blacklisted" },
            ]}
          />
        </Space>
      </div>

      <DataTable
        dataSource={filteredCustomers}
        columns={columns}
        rowKey="id"
      />

      {/* Customer Form Modal */}
      <CustomerForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingCustomer(null); }}
        editingCustomer={editingCustomer}
      />

      {/* View Customer Modal */}
      <Modal
        title={`Customer Details - ${viewCustomer?.name}`}
        open={!!viewCustomer}
        onCancel={() => setViewCustomer(null)}
        footer={null}
        width={800}
      >
        {viewCustomer && (
          <Tabs
            items={[
              {
                key: "basic",
                label: "Basic Info",
                children: (
                  <Descriptions column={2} size="small" bordered>
                    <Descriptions.Item label="Code">{viewCustomer.code}</Descriptions.Item>
                    <Descriptions.Item label="Name">{viewCustomer.name}</Descriptions.Item>
                    <Descriptions.Item label="Type"><Tag>{viewCustomer.type.toUpperCase()}</Tag></Descriptions.Item>
                    <Descriptions.Item label="Region">{viewCustomer.region}</Descriptions.Item>
                    <Descriptions.Item label="Territory">{viewCustomer.territory}</Descriptions.Item>
                    <Descriptions.Item label="Contact Person">{viewCustomer.contactPerson}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{viewCustomer.phone}</Descriptions.Item>
                    <Descriptions.Item label="Email">{viewCustomer.email}</Descriptions.Item>
                    <Descriptions.Item label="Billing Address" span={2}>{viewCustomer.billingAddress}</Descriptions.Item>
                    <Descriptions.Item label="Shipping Address" span={2}>{viewCustomer.shippingAddress}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: "regulatory",
                label: "Regulatory & Compliance",
                children: (
                  <Descriptions column={2} size="small" bordered>
                    <Descriptions.Item label="Drug License #">{viewCustomer.drugLicenseNumber}</Descriptions.Item>
                    <Descriptions.Item label="Issuing Authority">{viewCustomer.issuingAuthority}</Descriptions.Item>
                    <Descriptions.Item label="License Expiry">{viewCustomer.licenseExpiry}</Descriptions.Item>
                    <Descriptions.Item label="Compliance Status">
                      <Tag color={viewCustomer.complianceStatus === "valid" ? "green" : "red"}>{viewCustomer.complianceStatus.toUpperCase()}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Controlled Drug Auth">{viewCustomer.controlledDrugAuth ? "Yes" : "No"}</Descriptions.Item>
                    <Descriptions.Item label="Prescription Required">{viewCustomer.prescriptionRequired ? "Yes" : "No"}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: "financial",
                label: "Financial & Credit",
                children: (
                  <Descriptions column={2} size="small" bordered>
                    <Descriptions.Item label="Credit Limit">PKR {viewCustomer.creditLimit.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Payment Terms">{viewCustomer.paymentTerms.toUpperCase()}</Descriptions.Item>
                    <Descriptions.Item label="Credit Days">{viewCustomer.creditDays} days</Descriptions.Item>
                    <Descriptions.Item label="Current Outstanding">
                      <Text type={viewCustomer.currentOutstanding > viewCustomer.creditLimit * 0.8 ? "danger" : undefined}>
                        PKR {viewCustomer.currentOutstanding.toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Credit Hold">
                      <Tag color={viewCustomer.creditHold ? "red" : "green"}>{viewCustomer.creditHold ? "Yes" : "No"}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Discount Eligible">{viewCustomer.discountEligibility ? "Yes" : "No"}</Descriptions.Item>
                  </Descriptions>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
