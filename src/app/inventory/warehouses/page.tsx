"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, Switch, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useInventoryStore } from "@/store/inventoryStore";
import { Warehouse } from "@/types/inventory";

const { Title, Text } = Typography;

export default function WarehousesPage() {
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "1", title: "Total Warehouses", value: warehouses.length, prefix: <span>🏭</span>, color: "#00BFFF" },
    { key: "2", title: "Active", value: warehouses.filter((w) => w.status === "Active").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "3", title: "Cold Storage", value: warehouses.filter((w) => w.temperatureControlled).length, prefix: <span>❄️</span>, color: "#722ed1" },
    { key: "4", title: "Total Capacity", value: `${(warehouses.reduce((s, w) => s + w.capacityUnits, 0) / 1000).toFixed(0)}K`, prefix: <span>📦</span>, color: "#faad14" },
  ];

  const columns = [
    { title: "Code", dataIndex: "warehouseCode", key: "warehouseCode", width: 100 },
    { title: "Name", dataIndex: "warehouseName", key: "warehouseName", width: 200 },
    { title: "Type", dataIndex: "warehouseType", key: "warehouseType", width: 120, render: (t: string) => <Tag color={t === "Cold Storage" ? "cyan" : t === "Quarantine" ? "orange" : "blue"}>{t}</Tag> },
    { title: "City", dataIndex: "city", key: "city", width: 100 },
    { title: "Manager", dataIndex: "responsibleManager", key: "responsibleManager", width: 150 },
    { title: "Temp Controlled", dataIndex: "temperatureControlled", key: "temperatureControlled", width: 120, render: (v: boolean) => v ? <Tag color="cyan">Yes</Tag> : <Tag>No</Tag> },
    { title: "Capacity", dataIndex: "capacityUnits", key: "capacityUnits", width: 100, render: (v: number) => v.toLocaleString() },
    { title: "Status", dataIndex: "status", key: "status", width: 80, render: (s: string) => <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedWarehouse(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: Warehouse) => {
    setSelectedWarehouse(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: Warehouse) => {
    setSelectedWarehouse(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Warehouse) => {
    Modal.confirm({
      title: "Delete Warehouse",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.warehouseName}?`,
      onOk: () => {
        deleteWarehouse(record.id);
        message.success("Warehouse deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const warehouseData: Warehouse = {
      id: selectedWarehouse?.id || `wh${Date.now()}`,
      warehouseCode: values.warehouseCode as string || `WH-${String(warehouses.length + 1).padStart(3, "0")}`,
      warehouseName: values.warehouseName as string,
      warehouseType: values.warehouseType as Warehouse["warehouseType"],
      address: values.address as string,
      city: values.city as string,
      country: values.country as string || "Pakistan",
      responsibleManager: values.responsibleManager as string,
      temperatureControlled: values.temperatureControlled as boolean || false,
      capacityUnits: values.capacityUnits as number || 0,
      status: values.status as Warehouse["status"] || "Active",
      createdAt: selectedWarehouse?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedWarehouse) {
      updateWarehouse(selectedWarehouse.id, warehouseData);
      message.success("Warehouse updated");
    } else {
      addWarehouse(warehouseData);
      message.success("Warehouse added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Warehouse Master</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage warehouses and storage facilities</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Warehouse</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={warehouses}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="warehouses"
          title="Warehouses"
        />
      </div>

      <Drawer title={selectedWarehouse ? "Edit Warehouse" : "Add Warehouse"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "Active", warehouseType: "Main", country: "Pakistan" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="warehouseCode" label="Warehouse Code">
              <Input placeholder="Auto-generated if empty" />
            </Form.Item>
            <Form.Item name="warehouseName" label="Warehouse Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="warehouseType" label="Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Main">Main</Select.Option>
                <Select.Option value="Distribution">Distribution</Select.Option>
                <Select.Option value="Quarantine">Quarantine</Select.Option>
                <Select.Option value="Cold Storage">Cold Storage</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="responsibleManager" label="Responsible Manager" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="country" label="Country">
              <Input />
            </Form.Item>
            <Form.Item name="capacityUnits" label="Capacity (Units)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="temperatureControlled" label="Temperature Controlled" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </div>
          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Save Warehouse</Button>
        </Form>
      </Drawer>

      <Drawer title="Warehouse Details" width={600} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedWarehouse && (
          <Descriptions bordered size="small" column={2}>
            <Descriptions.Item label="Code">{selectedWarehouse.warehouseCode}</Descriptions.Item>
            <Descriptions.Item label="Name">{selectedWarehouse.warehouseName}</Descriptions.Item>
            <Descriptions.Item label="Type"><Tag color="blue">{selectedWarehouse.warehouseType}</Tag></Descriptions.Item>
            <Descriptions.Item label="Manager">{selectedWarehouse.responsibleManager}</Descriptions.Item>
            <Descriptions.Item label="City">{selectedWarehouse.city}</Descriptions.Item>
            <Descriptions.Item label="Country">{selectedWarehouse.country}</Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>{selectedWarehouse.address}</Descriptions.Item>
            <Descriptions.Item label="Temp Controlled">{selectedWarehouse.temperatureControlled ? <Tag color="cyan">Yes</Tag> : <Tag>No</Tag>}</Descriptions.Item>
            <Descriptions.Item label="Capacity">{selectedWarehouse.capacityUnits.toLocaleString()} units</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedWarehouse.status === "Active" ? "green" : "red"}>{selectedWarehouse.status}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
