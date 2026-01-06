"use client";

import { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import UserGuide from "@/components/common/UserGuide";
import ItemForm from "./ItemForm";
import { useInventoryStore } from "@/store/inventoryStore";
import { inventoryItemsGuide } from "@/data/guideData";
import { InventoryItem } from "@/types/inventory";

const { Title, Text } = Typography;

export default function ItemsPage() {
  const { items, deleteItem } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const stats = [
    { key: "1", title: "Total Items", value: items.length, prefix: <span>📦</span>, color: "#00BFFF" },
    { key: "2", title: "Raw Materials", value: items.filter((i) => i.category === "Raw Material").length, prefix: <span>🧪</span>, color: "#faad14" },
    { key: "3", title: "Finished Goods", value: items.filter((i) => i.category === "Finished Goods").length, prefix: <span>💊</span>, color: "#52c41a" },
    { key: "4", title: "Cold Storage", value: items.filter((i) => i.storageCondition === "Cold").length, prefix: <span>❄️</span>, color: "#722ed1" },
  ];

  const columns = [
    { title: "Item Code", dataIndex: "itemCode", key: "itemCode", width: 100 },
    { title: "Item Name", dataIndex: "itemName", key: "itemName", width: 200 },
    { title: "Category", dataIndex: "category", key: "category", width: 120, render: (c: string) => <Tag color="blue">{c}</Tag> },
    { title: "Dosage Form", dataIndex: "dosageForm", key: "dosageForm", width: 100 },
    { title: "Strength", dataIndex: "strength", key: "strength", width: 80 },
    { title: "UOM", dataIndex: "primaryUOM", key: "primaryUOM", width: 60 },
    { title: "Storage", dataIndex: "storageCondition", key: "storageCondition", width: 100, render: (s: string) => <Tag color={s === "Cold" ? "cyan" : s === "Frozen" ? "blue" : "default"}>{s}</Tag> },
    { title: "Reorder Level", dataIndex: "reorderLevel", key: "reorderLevel", width: 100 },
    { title: "Status", dataIndex: "status", key: "status", width: 80, render: (s: string) => <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setDrawerOpen(true);
  };

  const handleView = (record: InventoryItem) => {
    setSelectedItem(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: InventoryItem) => {
    setSelectedItem(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: InventoryItem) => {
    Modal.confirm({
      title: "Delete Item",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.itemName}?`,
      onOk: () => {
        deleteItem(record.id);
        message.success("Item deleted");
      },
    });
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Item / Product Master</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage inventory items and products</Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <UserGuide {...inventoryItemsGuide} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Item</Button>
        </div>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={items}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="inventory-items"
          title="Item Master"
        />
      </div>

      <Drawer title={selectedItem ? "Edit Item" : "Add Item"} width={900} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <ItemForm item={selectedItem} onClose={() => setDrawerOpen(false)} />
      </Drawer>

      <Drawer title="Item Details" width={800} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedItem && (
          <>
            <Descriptions title="Basic Information" bordered size="small" column={2}>
              <Descriptions.Item label="Item Code">{selectedItem.itemCode}</Descriptions.Item>
              <Descriptions.Item label="Item Name">{selectedItem.itemName}</Descriptions.Item>
              <Descriptions.Item label="Generic Name">{selectedItem.genericName}</Descriptions.Item>
              <Descriptions.Item label="Brand Name">{selectedItem.brandName}</Descriptions.Item>
              <Descriptions.Item label="Category"><Tag color="blue">{selectedItem.category}</Tag></Descriptions.Item>
              <Descriptions.Item label="Dosage Form">{selectedItem.dosageForm}</Descriptions.Item>
              <Descriptions.Item label="Strength">{selectedItem.strength}</Descriptions.Item>
              <Descriptions.Item label="Primary UOM">{selectedItem.primaryUOM}</Descriptions.Item>
              <Descriptions.Item label="Shelf Life">{selectedItem.shelfLifeMonths} months</Descriptions.Item>
              <Descriptions.Item label="Storage"><Tag color={selectedItem.storageCondition === "Cold" ? "cyan" : "default"}>{selectedItem.storageCondition}</Tag></Descriptions.Item>
            </Descriptions>
            <Descriptions title="Regulatory" bordered size="small" column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Registration No">{selectedItem.drugRegistrationNumber}</Descriptions.Item>
              <Descriptions.Item label="Authority">{selectedItem.regulatoryAuthority}</Descriptions.Item>
              <Descriptions.Item label="Controlled Drug">{selectedItem.controlledDrug ? <Tag color="red">Yes</Tag> : <Tag color="green">No</Tag>}</Descriptions.Item>
              <Descriptions.Item label="Prescription Required">{selectedItem.prescriptionRequired ? <Tag color="orange">Yes</Tag> : <Tag color="green">No</Tag>}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Inventory Control" bordered size="small" column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Min Stock">{selectedItem.minStockLevel}</Descriptions.Item>
              <Descriptions.Item label="Max Stock">{selectedItem.maxStockLevel}</Descriptions.Item>
              <Descriptions.Item label="Reorder Level">{selectedItem.reorderLevel}</Descriptions.Item>
              <Descriptions.Item label="Reorder Qty">{selectedItem.reorderQuantity}</Descriptions.Item>
              <Descriptions.Item label="Safety Stock">{selectedItem.safetyStock}</Descriptions.Item>
              <Descriptions.Item label="Batch Tracking">{selectedItem.batchTrackingRequired ? "Yes" : "No"}</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Financial" bordered size="small" column={2} style={{ marginTop: 16 }}>
              <Descriptions.Item label="Valuation Method">{selectedItem.valuationMethod}</Descriptions.Item>
              <Descriptions.Item label="Standard Cost">PKR {selectedItem.standardCost}</Descriptions.Item>
              <Descriptions.Item label="Purchase Cost">PKR {selectedItem.purchaseCost}</Descriptions.Item>
              <Descriptions.Item label="Selling Price">PKR {selectedItem.sellingPrice}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
