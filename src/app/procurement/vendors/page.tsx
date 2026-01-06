"use client";

import { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Rate, Space, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import UserGuide from "@/components/common/UserGuide";
import VendorForm from "./VendorForm";
import { useProcurementStore } from "@/store/procurementStore";
import { vendorsGuide } from "@/data/guideData";
import { Vendor } from "@/types/procurement";

const { Title, Text } = Typography;

export default function VendorsPage() {
  const { vendors, deleteVendor } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editMode, setEditMode] = useState(false);

  const stats = [
    { key: "1", title: "Total Vendors", value: vendors.length, prefix: <span>👥</span>, color: "#00BFFF" },
    { key: "2", title: "Active", value: vendors.filter((v) => v.status === "Active").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "3", title: "GMP Certified", value: vendors.filter((v) => v.gmpCertified).length, prefix: <span>🏆</span>, color: "#faad14" },
    { key: "4", title: "High Risk", value: vendors.filter((v) => v.riskCategory === "High").length, prefix: <span>⚠️</span>, color: "#ff4d4f" },
  ];

  const columns = [
    { title: "Vendor ID", dataIndex: "vendorId", key: "vendorId", width: 100 },
    { title: "Legal Name", dataIndex: "legalName", key: "legalName", width: 200 },
    { title: "Type", dataIndex: "vendorType", key: "vendorType", width: 120, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: "Country", dataIndex: "country", key: "country", width: 100 },
    { title: "GMP", dataIndex: "gmpCertified", key: "gmpCertified", width: 80, render: (v: boolean) => v ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag> },
    { title: "Rating", dataIndex: "qualityRating", key: "qualityRating", width: 120, render: (r: number) => <Rate disabled defaultValue={r} style={{ fontSize: 12 }} /> },
    { title: "Risk", dataIndex: "riskCategory", key: "riskCategory", width: 90, render: (r: string) => <Tag color={r === "Low" ? "green" : r === "Medium" ? "orange" : "red"}>{r}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", width: 90, render: (s: string) => <Tag color={s === "Active" ? "green" : s === "Inactive" ? "default" : "red"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedVendor(null);
    setEditMode(false);
    setDrawerOpen(true);
  };

  const handleView = (record: Vendor) => {
    setSelectedVendor(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: Vendor) => {
    setSelectedVendor(record);
    setEditMode(true);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Vendor) => {
    Modal.confirm({
      title: "Delete Vendor",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${record.legalName}?`,
      onOk: () => {
        deleteVendor(record.id);
        message.success("Vendor deleted successfully");
      },
    });
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Vendor Master</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage vendor information and compliance</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <UserGuide {...vendorsGuide} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Vendor</Button>
        </div>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={vendors}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="vendors"
          title="Vendor List"
        />
      </div>

      <Drawer title={editMode ? "Edit Vendor" : "Add Vendor"} width={800} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <VendorForm vendor={selectedVendor} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Drawer title="Vendor Details" width={700} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedVendor && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions title="Basic Information" bordered size="small" column={2}>
              <Descriptions.Item label="Vendor ID">{selectedVendor.vendorId}</Descriptions.Item>
              <Descriptions.Item label="Legal Name">{selectedVendor.legalName}</Descriptions.Item>
              <Descriptions.Item label="Type">{selectedVendor.vendorType}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedVendor.businessCategory}</Descriptions.Item>
              <Descriptions.Item label="Registration No">{selectedVendor.registrationNumber}</Descriptions.Item>
              <Descriptions.Item label="NTN/VAT/GST">{selectedVendor.ntnVatGst}</Descriptions.Item>
              <Descriptions.Item label="Country">{selectedVendor.country}</Descriptions.Item>
              <Descriptions.Item label="City">{selectedVendor.city}</Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>{selectedVendor.address}</Descriptions.Item>
              <Descriptions.Item label="Contact Person">{selectedVendor.contactPerson}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedVendor.contactNumber}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedVendor.email}</Descriptions.Item>
              <Descriptions.Item label="Website">{selectedVendor.website}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Compliance & Qualification" bordered size="small" column={2}>
              <Descriptions.Item label="GMP Certified">{selectedVendor.gmpCertified ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>}</Descriptions.Item>
              <Descriptions.Item label="License No">{selectedVendor.regulatoryLicenseNumber}</Descriptions.Item>
              <Descriptions.Item label="License Expiry">{selectedVendor.licenseExpiryDate}</Descriptions.Item>
              <Descriptions.Item label="Quality Rating"><Rate disabled defaultValue={selectedVendor.qualityRating} style={{ fontSize: 12 }} /></Descriptions.Item>
              <Descriptions.Item label="Audit Status"><Tag color={selectedVendor.auditStatus === "Completed" ? "green" : "orange"}>{selectedVendor.auditStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="Risk Category"><Tag color={selectedVendor.riskCategory === "Low" ? "green" : selectedVendor.riskCategory === "Medium" ? "orange" : "red"}>{selectedVendor.riskCategory}</Tag></Descriptions.Item>
              <Descriptions.Item label="Blacklisted">{selectedVendor.blacklisted ? <Tag color="red">Yes</Tag> : <Tag color="green">No</Tag>}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Financial Details" bordered size="small" column={2}>
              <Descriptions.Item label="Bank">{selectedVendor.bankName}</Descriptions.Item>
              <Descriptions.Item label="Account Title">{selectedVendor.accountTitle}</Descriptions.Item>
              <Descriptions.Item label="Account/IBAN">{selectedVendor.accountNumber}</Descriptions.Item>
              <Descriptions.Item label="Currency">{selectedVendor.paymentCurrency}</Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{selectedVendor.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label="Credit Limit">PKR {selectedVendor.creditLimit.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Tax Withholding">{selectedVendor.taxWithholding}%</Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
