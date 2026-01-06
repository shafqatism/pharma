"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useInventoryStore } from "@/store/inventoryStore";
import { InventoryAdjustment } from "@/types/inventory";

const { Title, Text } = Typography;

export default function AdjustmentsPage() {
  const { inventoryAdjustments, addInventoryAdjustment, updateInventoryAdjustment, items, batches, warehouses, warehouseLocations } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedAdj, setSelectedAdj] = useState<InventoryAdjustment | null>(null);
  const [form] = Form.useForm();

  const totalImpact = inventoryAdjustments.reduce((s, a) => s + a.financialImpact, 0);

  const stats = [
    { key: "1", title: "Total Adjustments", value: inventoryAdjustments.length, prefix: <span>📝</span>, color: "#00BFFF" },
    { key: "2", title: "Pending Approval", value: inventoryAdjustments.filter((a) => a.approvalStatus === "Pending").length, prefix: <span>⏳</span>, color: "#faad14" },
    { key: "3", title: "Approved", value: inventoryAdjustments.filter((a) => a.approvalStatus === "Approved").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "4", title: "Financial Impact", value: `PKR ${Math.abs(totalImpact).toLocaleString()}`, prefix: <span>💰</span>, color: totalImpact < 0 ? "#ff4d4f" : "#52c41a" },
  ];

  const columns = [
    { title: "Adj No", dataIndex: "adjustmentNumber", key: "adjustmentNumber", width: 120 },
    { title: "Date", dataIndex: "adjustmentDate", key: "adjustmentDate", width: 100 },
    { title: "Type", dataIndex: "adjustmentType", key: "adjustmentType", width: 100, render: (t: string) => <Tag color={t === "Damage" ? "red" : t === "Loss" ? "orange" : "blue"}>{t}</Tag> },
    { title: "Item", dataIndex: "itemName", key: "itemName", width: 180 },
    { title: "Batch", dataIndex: "batchNumber", key: "batchNumber", width: 120 },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName", width: 150 },
    { title: "Qty Adjusted", dataIndex: "quantityAdjusted", key: "quantityAdjusted", width: 100, render: (v: number) => <Text style={{ color: v < 0 ? "#ff4d4f" : "#52c41a" }}>{v > 0 ? "+" : ""}{v}</Text> },
    { title: "Impact", dataIndex: "financialImpact", key: "financialImpact", width: 100, render: (v: number) => <Text style={{ color: v < 0 ? "#ff4d4f" : "#52c41a" }}>PKR {v.toLocaleString()}</Text> },
    { title: "Status", dataIndex: "approvalStatus", key: "approvalStatus", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedAdj(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: InventoryAdjustment) => {
    setSelectedAdj(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: InventoryAdjustment) => {
    setSelectedAdj(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const item = items.find((i) => i.id === values.itemId);
    const batch = batches.find((b) => b.batchNumber === values.batchNumber);
    const warehouse = warehouses.find((w) => w.id === values.warehouseId);
    const qtyAdjusted = values.quantityAdjusted as number;
    const unitCost = item?.standardCost || 0;

    const adjData: InventoryAdjustment = {
      id: selectedAdj?.id || `adj${Date.now()}`,
      adjustmentNumber: selectedAdj?.adjustmentNumber || `ADJ-2024-${String(inventoryAdjustments.length + 1).padStart(3, "0")}`,
      adjustmentDate: values.adjustmentDate as string,
      adjustmentType: values.adjustmentType as InventoryAdjustment["adjustmentType"],
      itemId: values.itemId as string,
      itemCode: item?.itemCode || "",
      itemName: item?.itemName || "",
      batchNumber: values.batchNumber as string,
      warehouseId: values.warehouseId as string,
      warehouseName: warehouse?.warehouseName || "",
      locationCode: values.locationCode as string || "",
      quantityBefore: batch?.currentQuantity || 0,
      quantityAdjusted: qtyAdjusted,
      quantityAfter: (batch?.currentQuantity || 0) + qtyAdjusted,
      reasonCode: values.reasonCode as string,
      remarks: values.remarks as string || "",
      approvalReference: values.approvalReference as string || "",
      approvalStatus: values.approvalStatus as InventoryAdjustment["approvalStatus"] || "Pending",
      financialImpact: qtyAdjusted * unitCost,
      adjustedBy: values.adjustedBy as string,
      createdAt: selectedAdj?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedAdj) {
      updateInventoryAdjustment(selectedAdj.id, adjData);
      message.success("Adjustment updated");
    } else {
      addInventoryAdjustment(adjData);
      message.success("Adjustment created");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Inventory Adjustments</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Record stock adjustments and corrections</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>New Adjustment</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={inventoryAdjustments}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          exportFileName="inventory-adjustments"
          title="Inventory Adjustments"
        />
      </div>

      <Drawer title={selectedAdj ? "Edit Adjustment" : "New Adjustment"} width={700} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ adjustmentType: "Damage", approvalStatus: "Pending", adjustmentDate: new Date().toISOString().split("T")[0] }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="adjustmentDate" label="Adjustment Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="adjustmentType" label="Adjustment Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Damage">Damage</Select.Option>
                <Select.Option value="Loss">Loss</Select.Option>
                <Select.Option value="Audit">Audit</Select.Option>
                <Select.Option value="Correction">Correction</Select.Option>
                <Select.Option value="Write-Off">Write-Off</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="itemId" label="Item" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {items.map((i) => <Select.Option key={i.id} value={i.id}>{i.itemCode} - {i.itemName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="batchNumber" label="Batch Number" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {batches.map((b) => <Select.Option key={b.id} value={b.batchNumber}>{b.batchNumber} - {b.itemName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
              <Select>
                {warehouses.map((w) => <Select.Option key={w.id} value={w.id}>{w.warehouseName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="locationCode" label="Location">
              <Select allowClear>
                {warehouseLocations.map((l) => <Select.Option key={l.id} value={l.locationCode}>{l.locationCode}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="quantityAdjusted" label="Quantity Adjusted" rules={[{ required: true }]} extra="Use negative for reduction">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="reasonCode" label="Reason Code" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="DMG-001">DMG-001 - Physical Damage</Select.Option>
                <Select.Option value="DMG-002">DMG-002 - Water Damage</Select.Option>
                <Select.Option value="LOSS-001">LOSS-001 - Theft</Select.Option>
                <Select.Option value="LOSS-002">LOSS-002 - Miscount</Select.Option>
                <Select.Option value="AUD-001">AUD-001 - Audit Variance</Select.Option>
                <Select.Option value="COR-001">COR-001 - Data Correction</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="adjustedBy" label="Adjusted By" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="approvalStatus" label="Approval Status">
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="approvalReference" label="Approval Reference">
              <Input />
            </Form.Item>
          </div>
          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save Adjustment</Button>
        </Form>
      </Drawer>

      <Drawer title="Adjustment Details" width={600} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedAdj && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Adjustment No">{selectedAdj.adjustmentNumber}</Descriptions.Item>
            <Descriptions.Item label="Date">{selectedAdj.adjustmentDate}</Descriptions.Item>
            <Descriptions.Item label="Type"><Tag color={selectedAdj.adjustmentType === "Damage" ? "red" : "blue"}>{selectedAdj.adjustmentType}</Tag></Descriptions.Item>
            <Descriptions.Item label="Item">{selectedAdj.itemName}</Descriptions.Item>
            <Descriptions.Item label="Batch">{selectedAdj.batchNumber}</Descriptions.Item>
            <Descriptions.Item label="Warehouse">{selectedAdj.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="Location">{selectedAdj.locationCode}</Descriptions.Item>
            <Descriptions.Item label="Reason Code">{selectedAdj.reasonCode}</Descriptions.Item>
            <Descriptions.Item label="Qty Before">{selectedAdj.quantityBefore}</Descriptions.Item>
            <Descriptions.Item label="Qty Adjusted"><Text style={{ color: selectedAdj.quantityAdjusted < 0 ? "#ff4d4f" : "#52c41a" }}>{selectedAdj.quantityAdjusted}</Text></Descriptions.Item>
            <Descriptions.Item label="Qty After">{selectedAdj.quantityAfter}</Descriptions.Item>
            <Descriptions.Item label="Financial Impact"><Text style={{ color: selectedAdj.financialImpact < 0 ? "#ff4d4f" : "#52c41a" }}>PKR {selectedAdj.financialImpact.toLocaleString()}</Text></Descriptions.Item>
            <Descriptions.Item label="Adjusted By">{selectedAdj.adjustedBy}</Descriptions.Item>
            <Descriptions.Item label="Approval Status"><Tag color={selectedAdj.approvalStatus === "Approved" ? "green" : "orange"}>{selectedAdj.approvalStatus}</Tag></Descriptions.Item>
            <Descriptions.Item label="Remarks" span={2}>{selectedAdj.remarks}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
