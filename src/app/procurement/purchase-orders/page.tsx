"use client";

import { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Table, Space, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import UserGuide from "@/components/common/UserGuide";
import POForm from "./POForm";
import { useProcurementStore } from "@/store/procurementStore";
import { purchaseOrdersGuide } from "@/data/guideData";
import { PurchaseOrder } from "@/types/procurement";

const { Title, Text } = Typography;

export default function PurchaseOrdersPage() {
  const { purchaseOrders, deletePurchaseOrder } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const stats = [
    { key: "1", title: "Total POs", value: purchaseOrders.length, prefix: <span>📦</span>, color: "#00BFFF" },
    { key: "2", title: "Open", value: purchaseOrders.filter((p) => p.status === "Open").length, prefix: <span>📂</span>, color: "#faad14" },
    { key: "3", title: "Closed", value: purchaseOrders.filter((p) => p.status === "Closed").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "4", title: "Total Value", value: `PKR ${(purchaseOrders.reduce((s, p) => s + p.totalPOValue, 0) / 1000000).toFixed(2)}M`, prefix: <span>💰</span>, color: "#722ed1" },
  ];

  const columns = [
    { title: "PO Number", dataIndex: "poNumber", key: "poNumber", width: 120 },
    { title: "Date", dataIndex: "poDate", key: "poDate", width: 100 },
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName", width: 180 },
    { title: "PR Ref", dataIndex: "referencePR", key: "referencePR", width: 110 },
    { title: "Currency", dataIndex: "currency", key: "currency", width: 80 },
    { title: "Total Value", dataIndex: "totalPOValue", key: "totalPOValue", width: 130, render: (v: number, r: PurchaseOrder) => `${r.currency} ${v.toLocaleString()}` },
    { title: "Approval", dataIndex: "approvalStatus", key: "approvalStatus", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", width: 90, render: (s: string) => {
      const colors: Record<string, string> = { Open: "blue", Partial: "orange", Closed: "green", Cancelled: "red" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
  ];

  const handleAdd = () => {
    setSelectedPO(null);
    setDrawerOpen(true);
  };

  const handleView = (record: PurchaseOrder) => {
    setSelectedPO(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: PurchaseOrder) => {
    setSelectedPO(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: PurchaseOrder) => {
    Modal.confirm({
      title: "Delete Purchase Order",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.poNumber}?`,
      onOk: () => {
        deletePurchaseOrder(record.id);
        message.success("PO deleted");
      },
    });
  };

  const itemColumns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Batch Req", dataIndex: "batchRequired", key: "batchRequired", render: (v: boolean) => v ? "Yes" : "No" },
    { title: "Qty", dataIndex: "quantityOrdered", key: "quantityOrdered" },
    { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice", render: (v: number) => v.toLocaleString() },
    { title: "Discount %", dataIndex: "discount", key: "discount" },
    { title: "Tax %", dataIndex: "tax", key: "tax" },
    { title: "Line Total", dataIndex: "lineTotal", key: "lineTotal", render: (v: number) => v.toLocaleString() },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Purchase Orders</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage purchase orders and track deliveries</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <UserGuide {...purchaseOrdersGuide} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New PO</Button>
        </div>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={purchaseOrders}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="purchase-orders"
          title="Purchase Orders"
        />
      </div>

      <Drawer title={selectedPO ? "Edit PO" : "New Purchase Order"} width={900} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <POForm po={selectedPO} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Drawer title="PO Details" width={800} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedPO && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions title="PO Header" bordered size="small" column={2}>
              <Descriptions.Item label="PO Number">{selectedPO.poNumber}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedPO.poDate}</Descriptions.Item>
              <Descriptions.Item label="Vendor">{selectedPO.vendorName}</Descriptions.Item>
              <Descriptions.Item label="Reference PR">{selectedPO.referencePR}</Descriptions.Item>
              <Descriptions.Item label="Currency">{selectedPO.currency}</Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{selectedPO.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label="Delivery Location" span={2}>{selectedPO.deliveryLocation}</Descriptions.Item>
              <Descriptions.Item label="Incoterms">{selectedPO.incoterms}</Descriptions.Item>
              <Descriptions.Item label="Delivery Schedule">{selectedPO.deliverySchedule}</Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 13 }}>Line Items</Text>
              <Table columns={itemColumns} dataSource={selectedPO.items} rowKey="id" pagination={false} size="small" style={{ marginTop: 8 }} />
            </div>

            <Descriptions title="Commercial Summary" bordered size="small" column={2}>
              <Descriptions.Item label="Subtotal">{selectedPO.currency} {selectedPO.subtotal.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Tax Amount">{selectedPO.currency} {selectedPO.taxAmount.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Freight">{selectedPO.currency} {selectedPO.freightCharges.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Insurance">{selectedPO.currency} {selectedPO.insurance.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Total PO Value" span={2}><Text strong style={{ fontSize: 14 }}>{selectedPO.currency} {selectedPO.totalPOValue.toLocaleString()}</Text></Descriptions.Item>
            </Descriptions>

            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Approval Status"><Tag color={selectedPO.approvalStatus === "Approved" ? "green" : "orange"}>{selectedPO.approvalStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="PO Status"><Tag color={selectedPO.status === "Closed" ? "green" : selectedPO.status === "Open" ? "blue" : "orange"}>{selectedPO.status}</Tag></Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
