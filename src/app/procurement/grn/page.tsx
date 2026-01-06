"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Table, Space, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import GRNForm from "./GRNForm";
import { useProcurementStore } from "@/store/procurementStore";
import { GoodsReceiptNote } from "@/types/procurement";

const { Title, Text } = Typography;

export default function GRNPage() {
  const { goodsReceiptNotes, deleteGoodsReceiptNote } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceiptNote | null>(null);

  const stats = [
    { key: "1", title: "Total GRNs", value: goodsReceiptNotes.length, prefix: <span>📥</span>, color: "#00BFFF" },
    { key: "2", title: "Completed", value: goodsReceiptNotes.filter((g) => g.status === "Completed").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "3", title: "Partial", value: goodsReceiptNotes.filter((g) => g.status === "Partial").length, prefix: <span>⏳</span>, color: "#faad14" },
    { key: "4", title: "QC Pending", value: goodsReceiptNotes.filter((g) => g.qcStatus === "Pending").length, prefix: <span>🔬</span>, color: "#722ed1" },
  ];

  const columns = [
    { title: "GRN Number", dataIndex: "grnNumber", key: "grnNumber", width: 120 },
    { title: "Date", dataIndex: "grnDate", key: "grnDate", width: 100 },
    { title: "PO Reference", dataIndex: "poReference", key: "poReference", width: 120 },
    { title: "Vendor", dataIndex: "vendorName", key: "vendorName", width: 180 },
    { title: "Warehouse", dataIndex: "warehouseLocation", key: "warehouseLocation", width: 150 },
    { title: "QC Status", dataIndex: "qcStatus", key: "qcStatus", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
    { title: "Stock Posted", dataIndex: "stockPosted", key: "stockPosted", width: 100, render: (v: boolean) => v ? <Tag color="green">Yes</Tag> : <Tag color="orange">No</Tag> },
    { title: "Status", dataIndex: "status", key: "status", width: 90, render: (s: string) => <Tag color={s === "Completed" ? "green" : s === "Partial" ? "orange" : "default"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedGRN(null);
    setDrawerOpen(true);
  };

  const handleView = (record: GoodsReceiptNote) => {
    setSelectedGRN(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: GoodsReceiptNote) => {
    setSelectedGRN(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: GoodsReceiptNote) => {
    Modal.confirm({
      title: "Delete GRN",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.grnNumber}?`,
      onOk: () => {
        deleteGoodsReceiptNote(record.id);
        message.success("GRN deleted");
      },
    });
  };

  const itemColumns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Ordered", dataIndex: "orderedQuantity", key: "orderedQuantity" },
    { title: "Received", dataIndex: "receivedQuantity", key: "receivedQuantity" },
    { title: "Rejected", dataIndex: "rejectedQuantity", key: "rejectedQuantity" },
    { title: "Batch No", dataIndex: "batchNumber", key: "batchNumber" },
    { title: "Mfg Date", dataIndex: "manufacturingDate", key: "manufacturingDate" },
    { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Goods Receipt Notes</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Record and manage goods receipts</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New GRN</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={goodsReceiptNotes}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="goods-receipt-notes"
          title="Goods Receipt Notes"
        />
      </div>

      <Drawer title={selectedGRN ? "Edit GRN" : "New GRN"} width={900} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <GRNForm grn={selectedGRN} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Drawer title="GRN Details" width={800} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedGRN && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions title="GRN Header" bordered size="small" column={2}>
              <Descriptions.Item label="GRN Number">{selectedGRN.grnNumber}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedGRN.grnDate}</Descriptions.Item>
              <Descriptions.Item label="PO Reference">{selectedGRN.poReference}</Descriptions.Item>
              <Descriptions.Item label="Vendor">{selectedGRN.vendorName}</Descriptions.Item>
              <Descriptions.Item label="Warehouse">{selectedGRN.warehouseLocation}</Descriptions.Item>
              <Descriptions.Item label="Received By">{selectedGRN.receivedBy}</Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 13 }}>Items Received</Text>
              <Table columns={itemColumns} dataSource={selectedGRN.items} rowKey="id" pagination={false} size="small" style={{ marginTop: 8 }} />
            </div>

            <Descriptions title="Quality Control" bordered size="small" column={2}>
              <Descriptions.Item label="QC Required">{selectedGRN.qcRequired ? "Yes" : "No"}</Descriptions.Item>
              <Descriptions.Item label="QC Status"><Tag color={selectedGRN.qcStatus === "Approved" ? "green" : selectedGRN.qcStatus === "Pending" ? "orange" : "red"}>{selectedGRN.qcStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="QC Remarks" span={2}>{selectedGRN.qcRemarks}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="Inventory" bordered size="small" column={2}>
              <Descriptions.Item label="Stock Posted">{selectedGRN.stockPosted ? <Tag color="green">Yes</Tag> : <Tag color="orange">No</Tag>}</Descriptions.Item>
              <Descriptions.Item label="Inventory Location">{selectedGRN.inventoryLocation}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag color={selectedGRN.status === "Completed" ? "green" : "orange"}>{selectedGRN.status}</Tag></Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
