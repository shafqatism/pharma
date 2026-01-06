"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Table, message, Modal, Space } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import TransferForm from "./TransferForm";
import { useInventoryStore } from "@/store/inventoryStore";
import { StockTransfer } from "@/types/inventory";

const { Title, Text } = Typography;

export default function TransfersPage() {
  const { stockTransfers, deleteStockTransfer } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<StockTransfer | null>(null);

  const stats = [
    { key: "1", title: "Total Transfers", value: stockTransfers.length, prefix: <span>🔄</span>, color: "#00BFFF" },
    { key: "2", title: "Pending", value: stockTransfers.filter((t) => t.completionStatus === "Pending").length, prefix: <span>⏳</span>, color: "#faad14" },
    { key: "3", title: "In Transit", value: stockTransfers.filter((t) => t.completionStatus === "In Transit").length, prefix: <span>🚚</span>, color: "#722ed1" },
    { key: "4", title: "Completed", value: stockTransfers.filter((t) => t.completionStatus === "Completed").length, prefix: <span>✅</span>, color: "#52c41a" },
  ];

  const columns = [
    { title: "Transfer No", dataIndex: "transferNumber", key: "transferNumber", width: 120 },
    { title: "Date", dataIndex: "transferDate", key: "transferDate", width: 100 },
    { title: "From", dataIndex: "fromWarehouseName", key: "fromWarehouseName", width: 150 },
    { title: "To", dataIndex: "toWarehouseName", key: "toWarehouseName", width: 150 },
    { title: "Priority", dataIndex: "priority", key: "priority", width: 90, render: (p: string) => <Tag color={p === "Emergency" ? "red" : p === "Urgent" ? "orange" : "blue"}>{p}</Tag> },
    { title: "Items", key: "items", width: 60, render: (_: unknown, r: StockTransfer) => r.items.length },
    { title: "Approval", dataIndex: "approvalStatus", key: "approvalStatus", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
    { title: "Status", dataIndex: "completionStatus", key: "completionStatus", width: 100, render: (s: string) => {
      const colors: Record<string, string> = { Draft: "default", Pending: "orange", "In Transit": "blue", Completed: "green", Cancelled: "red" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
  ];

  const handleAdd = () => {
    setSelectedTransfer(null);
    setDrawerOpen(true);
  };

  const handleView = (record: StockTransfer) => {
    setSelectedTransfer(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: StockTransfer) => {
    setSelectedTransfer(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: StockTransfer) => {
    Modal.confirm({
      title: "Delete Transfer",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.transferNumber}?`,
      onOk: () => {
        deleteStockTransfer(record.id);
        message.success("Transfer deleted");
      },
    });
  };

  const itemColumns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Source", dataIndex: "sourceLocation", key: "sourceLocation" },
    { title: "Destination", dataIndex: "destinationLocation", key: "destinationLocation" },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Stock Transfers</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage inter-warehouse stock movements</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New Transfer</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={stockTransfers}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="stock-transfers"
          title="Stock Transfers"
        />
      </div>

      <Drawer title={selectedTransfer ? "Edit Transfer" : "New Transfer"} width={900} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <TransferForm transfer={selectedTransfer} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Drawer title="Transfer Details" width={800} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedTransfer && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Transfer No">{selectedTransfer.transferNumber}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedTransfer.transferDate}</Descriptions.Item>
              <Descriptions.Item label="From Warehouse">{selectedTransfer.fromWarehouseName}</Descriptions.Item>
              <Descriptions.Item label="To Warehouse">{selectedTransfer.toWarehouseName}</Descriptions.Item>
              <Descriptions.Item label="Requested By">{selectedTransfer.requestedBy}</Descriptions.Item>
              <Descriptions.Item label="Priority"><Tag color={selectedTransfer.priority === "Emergency" ? "red" : "blue"}>{selectedTransfer.priority}</Tag></Descriptions.Item>
              <Descriptions.Item label="Dispatch Date">{selectedTransfer.dispatchDate || "-"}</Descriptions.Item>
              <Descriptions.Item label="Received">{selectedTransfer.receivingConfirmation ? <Tag color="green">Yes</Tag> : <Tag color="orange">No</Tag>}</Descriptions.Item>
            </Descriptions>
            <div>
              <Text strong style={{ fontSize: 13 }}>Transfer Items</Text>
              <Table columns={itemColumns} dataSource={selectedTransfer.items} rowKey="id" pagination={false} size="small" style={{ marginTop: 8 }} />
            </div>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Approval Status"><Tag color={selectedTransfer.approvalStatus === "Approved" ? "green" : "orange"}>{selectedTransfer.approvalStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="Completion Status"><Tag color={selectedTransfer.completionStatus === "Completed" ? "green" : "blue"}>{selectedTransfer.completionStatus}</Tag></Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
