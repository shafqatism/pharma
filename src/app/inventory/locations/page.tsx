"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, message, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useInventoryStore } from "@/store/inventoryStore";
import { WarehouseLocation } from "@/types/inventory";

const { Title, Text } = Typography;

export default function LocationsPage() {
  const { warehouseLocations, warehouses, addWarehouseLocation, updateWarehouseLocation, deleteWarehouseLocation } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WarehouseLocation | null>(null);
  const [form] = Form.useForm();

  const columns = [
    { title: "Location Code", dataIndex: "locationCode", key: "locationCode", width: 150 },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName", width: 180 },
    { title: "Parent", dataIndex: "parentLocation", key: "parentLocation", width: 150 },
    { title: "Type", dataIndex: "locationType", key: "locationType", width: 100, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: "Storage Type", dataIndex: "storageType", key: "storageType", width: 120 },
    { title: "Temp Range", dataIndex: "temperatureRange", key: "temperatureRange", width: 100 },
    { title: "Status", dataIndex: "status", key: "status", width: 80, render: (s: string) => <Tag color={s === "Active" ? "green" : "red"}>{s}</Tag> },
  ];

  const handleAdd = () => {
    setSelectedLocation(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEdit = (record: WarehouseLocation) => {
    setSelectedLocation(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: WarehouseLocation) => {
    Modal.confirm({
      title: "Delete Location",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.locationCode}?`,
      onOk: () => {
        deleteWarehouseLocation(record.id);
        message.success("Location deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const warehouse = warehouses.find((w) => w.id === values.warehouseId);
    const locationData: WarehouseLocation = {
      id: selectedLocation?.id || `loc${Date.now()}`,
      locationCode: values.locationCode as string,
      warehouseId: values.warehouseId as string,
      warehouseName: warehouse?.warehouseName || "",
      parentLocation: values.parentLocation as string || "",
      locationType: values.locationType as WarehouseLocation["locationType"],
      storageType: values.storageType as string,
      allowedCategories: values.allowedCategories as string[] || [],
      temperatureRange: values.temperatureRange as string || "",
      hazardCompatibility: values.hazardCompatibility as string || "",
      status: values.status as WarehouseLocation["status"] || "Active",
    };

    if (selectedLocation) {
      updateWarehouseLocation(selectedLocation.id, locationData);
      message.success("Location updated");
    } else {
      addWarehouseLocation(locationData);
      message.success("Location added");
    }
    setDrawerOpen(false);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Warehouse Locations</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Manage zones, aisles, racks, shelves, and bins</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Location</Button>
      </div>

      <DataTable
        columns={columns}
        dataSource={warehouseLocations}
        rowKey="id"
        onEdit={handleEdit}
        onDelete={handleDelete}
        exportFileName="warehouse-locations"
        title="Warehouse Locations"
      />

      <Drawer title={selectedLocation ? "Edit Location" : "Add Location"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "Active", locationType: "Zone" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="locationCode" label="Location Code" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
              <Select>
                {warehouses.map((w) => <Select.Option key={w.id} value={w.id}>{w.warehouseName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="parentLocation" label="Parent Location">
              <Select allowClear>
                {warehouseLocations.map((l) => <Select.Option key={l.id} value={l.locationCode}>{l.locationCode}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="locationType" label="Location Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Zone">Zone</Select.Option>
                <Select.Option value="Aisle">Aisle</Select.Option>
                <Select.Option value="Rack">Rack</Select.Option>
                <Select.Option value="Shelf">Shelf</Select.Option>
                <Select.Option value="Bin">Bin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="storageType" label="Storage Type" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="General">General</Select.Option>
                <Select.Option value="Cold Chain">Cold Chain</Select.Option>
                <Select.Option value="Quarantine">Quarantine</Select.Option>
                <Select.Option value="Finished Goods">Finished Goods</Select.Option>
                <Select.Option value="Pallet">Pallet</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="temperatureRange" label="Temperature Range">
              <Input placeholder="e.g., 15-25°C" />
            </Form.Item>
            <Form.Item name="allowedCategories" label="Allowed Categories">
              <Select mode="multiple">
                <Select.Option value="Raw Material">Raw Material</Select.Option>
                <Select.Option value="Finished Goods">Finished Goods</Select.Option>
                <Select.Option value="Packaging">Packaging</Select.Option>
                <Select.Option value="Consumables">Consumables</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="hazardCompatibility" label="Hazard Compatibility">
              <Select>
                <Select.Option value="Non-Hazardous">Non-Hazardous</Select.Option>
                <Select.Option value="Flammable">Flammable</Select.Option>
                <Select.Option value="Corrosive">Corrosive</Select.Option>
                <Select.Option value="All">All</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Location</Button>
        </Form>
      </Drawer>
    </DashboardLayout>
  );
}
