"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Table, Space, message, Modal, Timeline } from "antd";
import { PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import PRForm from "./PRForm";
import { useProcurementStore } from "@/store/procurementStore";
import { PurchaseRequisition } from "@/types/procurement";

const { Title, Text } = Typography;

export default function PurchaseRequisitionsPage() {
  const { purchaseRequisitions, deletePurchaseRequisition } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PurchaseRequisition | null>(null);

  const stats = [
    { key: "1", title: "Total PRs", value: purchaseRequisitions.length, prefix: <span>📋</span>, color: "#00BFFF" },
    { key: "2", title: "Pending Approval", value: purchaseRequisitions.filter((p) => p.status === "Submitted" || p.status === "Under Review").length, prefix: <span>⏳</span>, color: "#faad14" },
    { key: "3", title: "Approved", value: purchaseRequisitions.filter((p) => p.status === "Approved" || p.status === "Converted to PO").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "4", title: "Total Value", value: `PKR ${(purchaseRequisitions.reduce((s, p) => s + p.totalEstimatedCost, 0) / 1000000).toFixed(2)}M`, prefix: <span>💰</span>, color: "#722ed1" },
  ];

  const columns = [
    { title: "PR Number", dataIndex: "prNumber", key: "prNumber", width: 120 },
    { title: "Date", dataIndex: "requisitionDate", key: "requisitionDate", width: 100 },
    { title: "Requested By", dataIndex: "requestedBy", key: "requestedBy", width: 140 },
    { title: "Department", dataIndex: "department", key: "department", width: 120 },
    { title: "Priority", dataIndex: "priority", key: "priority", width: 90, render: (p: string) => <Tag color={p === "Emergency" ? "red" : p === "Urgent" ? "orange" : "blue"}>{p}</Tag> },
    { title: "Items", key: "items", width: 60, render: (_: unknown, r: PurchaseRequisition) => r.items.length },
    { title: "Est. Cost", dataIndex: "totalEstimatedCost", key: "totalEstimatedCost", width: 120, render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Status", dataIndex: "status", key: "status", width: 120, render: (s: string) => {
      const colors: Record<string, string> = { Draft: "default", Submitted: "blue", "Under Review": "orange", Approved: "green", Rejected: "red", "Converted to PO": "cyan" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
  ];

  const handleAdd = () => {
    setSelectedPR(null);
    setDrawerOpen(true);
  };

  const handleView = (record: PurchaseRequisition) => {
    setSelectedPR(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: PurchaseRequisition) => {
    setSelectedPR(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: PurchaseRequisition) => {
    Modal.confirm({
      title: "Delete Purchase Requisition",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.prNumber}?`,
      onOk: () => {
        deletePurchaseRequisition(record.id);
        message.success("PR deleted");
      },
    });
  };

  const itemColumns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "UOM", dataIndex: "uom", key: "uom" },
    { title: "Qty", dataIndex: "requiredQuantity", key: "requiredQuantity" },
    { title: "Unit Cost", dataIndex: "estimatedUnitCost", key: "estimatedUnitCost", render: (v: number) => `PKR ${v.toLocaleString()}` },
    { title: "Total", dataIndex: "totalEstimatedCost", key: "totalEstimatedCost", render: (v: number) => `PKR ${v.toLocaleString()}` },
  ];

  const getApprovalIcon = (status: string) => {
    if (status === "Approved") return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    if (status === "Rejected") return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
    return <ClockCircleOutlined style={{ color: "#faad14" }} />;
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Purchase Requisitions</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Create and manage purchase requisitions</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New PR</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={purchaseRequisitions}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="purchase-requisitions"
          title="Purchase Requisitions"
        />
      </div>

      <Drawer title={selectedPR ? "Edit PR" : "New Purchase Requisition"} width={900} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <PRForm pr={selectedPR} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Drawer title="PR Details" width={800} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedPR && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="PR Number">{selectedPR.prNumber}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedPR.requisitionDate}</Descriptions.Item>
              <Descriptions.Item label="Requested By">{selectedPR.requestedBy}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedPR.department}</Descriptions.Item>
              <Descriptions.Item label="Cost Center">{selectedPR.costCenter}</Descriptions.Item>
              <Descriptions.Item label="Priority"><Tag color={selectedPR.priority === "Emergency" ? "red" : selectedPR.priority === "Urgent" ? "orange" : "blue"}>{selectedPR.priority}</Tag></Descriptions.Item>
              <Descriptions.Item label="Expected Delivery">{selectedPR.expectedDeliveryDate}</Descriptions.Item>
              <Descriptions.Item label="Budget Ref">{selectedPR.budgetReference}</Descriptions.Item>
              <Descriptions.Item label="Total Est. Cost" span={2}><Text strong>PKR {selectedPR.totalEstimatedCost.toLocaleString()}</Text></Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 13 }}>Items</Text>
              <Table columns={itemColumns} dataSource={selectedPR.items} rowKey="id" pagination={false} size="small" style={{ marginTop: 8 }} />
            </div>

            <div>
              <Text strong style={{ fontSize: 13 }}>Approval Workflow</Text>
              <Timeline style={{ marginTop: 12 }} items={[
                { dot: getApprovalIcon(selectedPR.lineManagerApproval.status), children: <><Text style={{ fontSize: 12 }}>Line Manager: {selectedPR.lineManagerApproval.status}</Text>{selectedPR.lineManagerApproval.approvedBy && <Text type="secondary" style={{ fontSize: 11, display: "block" }}>By {selectedPR.lineManagerApproval.approvedBy} on {selectedPR.lineManagerApproval.approvedDate}</Text>}</> },
                { dot: getApprovalIcon(selectedPR.procurementApproval.status), children: <><Text style={{ fontSize: 12 }}>Procurement: {selectedPR.procurementApproval.status}</Text>{selectedPR.procurementApproval.approvedBy && <Text type="secondary" style={{ fontSize: 11, display: "block" }}>By {selectedPR.procurementApproval.approvedBy} on {selectedPR.procurementApproval.approvedDate}</Text>}</> },
                { dot: getApprovalIcon(selectedPR.financeApproval.status), children: <><Text style={{ fontSize: 12 }}>Finance: {selectedPR.financeApproval.status}</Text>{selectedPR.financeApproval.approvedBy && <Text type="secondary" style={{ fontSize: 11, display: "block" }}>By {selectedPR.financeApproval.approvedBy} on {selectedPR.financeApproval.approvedDate}</Text>}</> },
              ]} />
            </div>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
