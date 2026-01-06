"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, message, Modal, Space, Table, Timeline } from "antd";
import { PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import { useProcurementStore } from "@/store/procurementStore";
import { ShipmentTracking } from "@/types/procurement";

const { Title, Text } = Typography;

export default function ShipmentsPage() {
  const { shipmentTracking, addShipmentTracking, updateShipmentTracking, deleteShipmentTracking, importPurchases } = useProcurementStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentTracking | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "1", title: "Total Shipments", value: shipmentTracking.length, prefix: <span>📦</span>, color: "#00BFFF" },
    { key: "2", title: "In Transit", value: shipmentTracking.filter((s) => s.status === "In Transit").length, prefix: <span>🚢</span>, color: "#faad14" },
    { key: "3", title: "Arrived", value: shipmentTracking.filter((s) => s.status === "Arrived" || s.status === "Cleared").length, prefix: <span>✅</span>, color: "#52c41a" },
    { key: "4", title: "Pending Clearance", value: shipmentTracking.filter((s) => s.clearanceStatus === "Pending" || s.clearanceStatus === "In Progress").length, prefix: <span>📋</span>, color: "#722ed1" },
  ];

  const columns = [
    { title: "Import Ref", dataIndex: "importRefNumber", key: "importRefNumber", width: 120 },
    { title: "Mode", dataIndex: "shipmentMode", key: "shipmentMode", width: 80, render: (m: string) => <Tag color={m === "Air" ? "blue" : m === "Sea" ? "cyan" : "green"}>{m}</Tag> },
    { title: "Container/AWB", dataIndex: "containerNumber", key: "containerNumber", width: 140 },
    { title: "Bill of Lading", dataIndex: "billOfLading", key: "billOfLading", width: 160 },
    { title: "ETA", dataIndex: "estimatedArrival", key: "estimatedArrival", width: 100 },
    { title: "Port of Entry", dataIndex: "portOfEntry", key: "portOfEntry", width: 180 },
    { title: "Clearance", dataIndex: "clearanceStatus", key: "clearanceStatus", width: 100, render: (s: string) => {
      const colors: Record<string, string> = { Pending: "orange", "In Progress": "blue", Cleared: "green", Held: "red" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (s: string) => {
      const colors: Record<string, string> = { "In Transit": "blue", Arrived: "orange", Cleared: "green", Delivered: "cyan" };
      return <Tag color={colors[s]}>{s}</Tag>;
    }},
  ];

  const handleAdd = () => {
    setSelectedShipment(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleView = (record: ShipmentTracking) => {
    setSelectedShipment(record);
    setViewDrawerOpen(true);
  };

  const handleEdit = (record: ShipmentTracking) => {
    setSelectedShipment(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDelete = (record: ShipmentTracking) => {
    Modal.confirm({
      title: "Delete Shipment",
      icon: <ExclamationCircleOutlined />,
      content: `Delete shipment for ${record.importRefNumber}?`,
      onOk: () => {
        deleteShipmentTracking(record.id);
        message.success("Shipment deleted");
      },
    });
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    const shipmentData: ShipmentTracking = {
      id: selectedShipment?.id || `ship${Date.now()}`,
      importRefNumber: values.importRefNumber as string,
      shipmentMode: values.shipmentMode as ShipmentTracking["shipmentMode"],
      containerNumber: values.containerNumber as string || "N/A",
      billOfLading: values.billOfLading as string,
      estimatedArrival: values.estimatedArrival as string,
      actualArrival: values.actualArrival as string,
      portOfEntry: values.portOfEntry as string,
      clearanceStatus: values.clearanceStatus as ShipmentTracking["clearanceStatus"],
      documents: selectedShipment?.documents || [],
      status: values.status as ShipmentTracking["status"],
      createdAt: selectedShipment?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (selectedShipment) {
      updateShipmentTracking(selectedShipment.id, shipmentData);
      message.success("Shipment updated");
    } else {
      addShipmentTracking(shipmentData);
      message.success("Shipment added");
    }
    setDrawerOpen(false);
  };

  const docColumns = [
    { title: "Document Type", dataIndex: "type", key: "type" },
    { title: "File Name", dataIndex: "fileName", key: "fileName" },
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Received" ? "green" : "orange"}>{s}</Tag> },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "Delivered" || status === "Cleared") return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
    if (status === "In Transit" || status === "In Progress") return <LoadingOutlined style={{ color: "#1890ff" }} />;
    return <ClockCircleOutlined style={{ color: "#faad14" }} />;
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 18 }}>Shipment Tracking</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>Track international shipments and customs clearance</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Shipment</Button>
      </div>

      <StatsCard stats={stats} columns={4} />

      <div style={{ marginTop: 16 }}>
        <DataTable
          columns={columns}
          dataSource={shipmentTracking}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="shipment-tracking"
          title="Shipment Tracking"
        />
      </div>

      <Drawer title={selectedShipment ? "Edit Shipment" : "Add Shipment"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: "In Transit", clearanceStatus: "Pending", shipmentMode: "Sea" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="importRefNumber" label="Import Reference" rules={[{ required: true }]}>
              <Select showSearch optionFilterProp="children">
                {importPurchases.map((i) => <Select.Option key={i.id} value={i.importRefNumber}>{i.importRefNumber} - {i.vendorName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="shipmentMode" label="Shipment Mode" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Air">Air</Select.Option>
                <Select.Option value="Sea">Sea</Select.Option>
                <Select.Option value="Road">Road</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="containerNumber" label="Container Number / AWB">
              <Input />
            </Form.Item>
            <Form.Item name="billOfLading" label="Bill of Lading" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="estimatedArrival" label="Estimated Arrival" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="actualArrival" label="Actual Arrival">
              <Input type="date" />
            </Form.Item>
            <Form.Item name="portOfEntry" label="Port of Entry" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Port Qasim, Karachi">Port Qasim, Karachi</Select.Option>
                <Select.Option value="Karachi Port">Karachi Port</Select.Option>
                <Select.Option value="Islamabad International Airport">Islamabad International Airport</Select.Option>
                <Select.Option value="Lahore Airport">Lahore Airport</Select.Option>
                <Select.Option value="Wagah Border">Wagah Border</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="clearanceStatus" label="Clearance Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="In Progress">In Progress</Select.Option>
                <Select.Option value="Cleared">Cleared</Select.Option>
                <Select.Option value="Held">Held</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Shipment Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="In Transit">In Transit</Select.Option>
                <Select.Option value="Arrived">Arrived</Select.Option>
                <Select.Option value="Cleared">Cleared</Select.Option>
                <Select.Option value="Delivered">Delivered</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Shipment</Button>
        </Form>
      </Drawer>

      <Drawer title="Shipment Details" width={700} open={viewDrawerOpen} onClose={() => setViewDrawerOpen(false)}>
        {selectedShipment && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Import Reference">{selectedShipment.importRefNumber}</Descriptions.Item>
              <Descriptions.Item label="Shipment Mode"><Tag color={selectedShipment.shipmentMode === "Air" ? "blue" : "cyan"}>{selectedShipment.shipmentMode}</Tag></Descriptions.Item>
              <Descriptions.Item label="Container/AWB">{selectedShipment.containerNumber}</Descriptions.Item>
              <Descriptions.Item label="Bill of Lading">{selectedShipment.billOfLading}</Descriptions.Item>
              <Descriptions.Item label="Estimated Arrival">{selectedShipment.estimatedArrival}</Descriptions.Item>
              <Descriptions.Item label="Actual Arrival">{selectedShipment.actualArrival || "-"}</Descriptions.Item>
              <Descriptions.Item label="Port of Entry" span={2}>{selectedShipment.portOfEntry}</Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong style={{ fontSize: 13 }}>Tracking Timeline</Text>
              <Timeline style={{ marginTop: 12 }} items={[
                { dot: getStatusIcon("In Transit"), children: <Text style={{ fontSize: 12 }}>Shipment Dispatched</Text> },
                { dot: getStatusIcon(selectedShipment.status === "Arrived" || selectedShipment.status === "Cleared" || selectedShipment.status === "Delivered" ? "Cleared" : "Pending"), children: <Text style={{ fontSize: 12 }}>Arrived at Port</Text> },
                { dot: getStatusIcon(selectedShipment.clearanceStatus), children: <Text style={{ fontSize: 12 }}>Customs Clearance: {selectedShipment.clearanceStatus}</Text> },
                { dot: getStatusIcon(selectedShipment.status === "Delivered" ? "Delivered" : "Pending"), children: <Text style={{ fontSize: 12 }}>Delivered to Warehouse</Text> },
              ]} />
            </div>

            <div>
              <Text strong style={{ fontSize: 13 }}>Documents</Text>
              <Table columns={docColumns} dataSource={selectedShipment.documents} rowKey="type" pagination={false} size="small" style={{ marginTop: 8 }} />
            </div>

            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Clearance Status"><Tag color={selectedShipment.clearanceStatus === "Cleared" ? "green" : "orange"}>{selectedShipment.clearanceStatus}</Tag></Descriptions.Item>
              <Descriptions.Item label="Shipment Status"><Tag color={selectedShipment.status === "Delivered" ? "green" : "blue"}>{selectedShipment.status}</Tag></Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
