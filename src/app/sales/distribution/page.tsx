"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, Select, Typography, Modal, Descriptions, Card, Row, Col, Steps, Upload, message } from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined, TruckOutlined, CheckCircleOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useSalesStore } from "@/store/salesStore";
import { DeliveryNote } from "@/types/sales";

const { Title, Text } = Typography;

export default function DistributionPage() {
  const { deliveryNotes, salesOrders, updateDeliveryStatus } = useSalesStore();
  const [viewNote, setViewNote] = useState<DeliveryNote | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredNotes = deliveryNotes.filter((n) => {
    const matchesSearch = n.deliveryNoteNumber.toLowerCase().includes(searchText.toLowerCase()) || n.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || n.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStep = (status: string) => {
    const steps = ["pending", "dispatched", "in_transit", "delivered"];
    return steps.indexOf(status);
  };

  const handleStatusUpdate = (id: string, status: DeliveryNote["status"]) => {
    updateDeliveryStatus(id, status);
    message.success(`Status updated to ${status}`);
  };

  const columns = [
    { title: "DN #", dataIndex: "deliveryNoteNumber", key: "deliveryNoteNumber", width: 140 },
    { title: "SO #", dataIndex: "salesOrderNumber", key: "salesOrderNumber", width: 140 },
    { title: "Dispatch Date", dataIndex: "dispatchDate", key: "dispatchDate", width: 110 },
    { title: "Customer", dataIndex: "customerName", key: "customerName", width: 180 },
    { title: "Warehouse", dataIndex: "sourceWarehouse", key: "sourceWarehouse", width: 130 },
    {
      title: "Transport",
      dataIndex: "transportMode",
      key: "transportMode",
      width: 110,
      render: (t: string) => <Tag>{t.replace("_", " ").toUpperCase()}</Tag>,
    },
    { title: "Vehicle", dataIndex: "vehicleNumber", key: "vehicleNumber", width: 100 },
    {
      title: "Cold Chain",
      dataIndex: "coldChainRequired",
      key: "coldChainRequired",
      width: 90,
      render: (v: boolean) => <Tag color={v ? "blue" : "default"}>{v ? "Yes" : "No"}</Tag>,
    },
    {
      title: "POD",
      dataIndex: "podUploaded",
      key: "podUploaded",
      width: 70,
      render: (v: boolean) => <Tag color={v ? "green" : "orange"}>{v ? "Yes" : "No"}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: string) => {
        const colors: Record<string, string> = { pending: "default", dispatched: "processing", in_transit: "blue", delivered: "green", failed: "red" };
        return <Tag color={colors[s]}>{s.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_: unknown, record: DeliveryNote) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setViewNote(record)} />
          {record.status === "pending" && (
            <Button type="link" size="small" onClick={() => handleStatusUpdate(record.id, "dispatched")}>Dispatch</Button>
          )}
          {record.status === "dispatched" && (
            <Button type="link" size="small" onClick={() => handleStatusUpdate(record.id, "in_transit")}>In Transit</Button>
          )}
          {record.status === "in_transit" && (
            <Button type="link" size="small" onClick={() => handleStatusUpdate(record.id, "delivered")}>Delivered</Button>
          )}
        </Space>
      ),
    },
  ];

  // Pending orders for dispatch
  const pendingOrders = salesOrders.filter((o) => o.status === "approved" || o.status === "picking");

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Distribution Management</Title>
            <Text type="secondary">Manage dispatches, deliveries, and proof of delivery</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>Create Delivery Note</Button>
        </div>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <TruckOutlined style={{ fontSize: 24, color: "#faad14" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Pending Dispatch</Text>
                  <Title level={4} style={{ margin: 0 }}>{pendingOrders.length}</Title>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <TruckOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>In Transit</Text>
                  <Title level={4} style={{ margin: 0 }}>{deliveryNotes.filter((n) => n.status === "in_transit").length}</Title>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Delivered Today</Text>
                  <Title level={4} style={{ margin: 0 }}>{deliveryNotes.filter((n) => n.status === "delivered").length}</Title>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <UploadOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>POD Pending</Text>
                  <Title level={4} style={{ margin: 0 }}>{deliveryNotes.filter((n) => !n.podUploaded && n.status === "delivered").length}</Title>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search deliveries..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Status"
            allowClear
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "pending", label: "Pending" },
              { value: "dispatched", label: "Dispatched" },
              { value: "in_transit", label: "In Transit" },
              { value: "delivered", label: "Delivered" },
            ]}
          />
        </Space>
      </div>

      <DataTable dataSource={filteredNotes} columns={columns} rowKey="id" />

      {/* View Delivery Note Modal */}
      <Modal
        title={`Delivery Note - ${viewNote?.deliveryNoteNumber}`}
        open={!!viewNote}
        onCancel={() => setViewNote(null)}
        footer={null}
        width={800}
      >
        {viewNote && (
          <>
            <Steps
              current={getStatusStep(viewNote.status)}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: "Pending", icon: <TruckOutlined /> },
                { title: "Dispatched" },
                { title: "In Transit" },
                { title: "Delivered", icon: <CheckCircleOutlined /> },
              ]}
            />

            <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="DN Number">{viewNote.deliveryNoteNumber}</Descriptions.Item>
              <Descriptions.Item label="SO Number">{viewNote.salesOrderNumber}</Descriptions.Item>
              <Descriptions.Item label="Dispatch Date">{viewNote.dispatchDate}</Descriptions.Item>
              <Descriptions.Item label="Customer">{viewNote.customerName}</Descriptions.Item>
              <Descriptions.Item label="Source Warehouse">{viewNote.sourceWarehouse}</Descriptions.Item>
              <Descriptions.Item label="Transport Mode">{viewNote.transportMode.replace("_", " ")}</Descriptions.Item>
              <Descriptions.Item label="Vehicle Number">{viewNote.vehicleNumber || "-"}</Descriptions.Item>
              <Descriptions.Item label="Driver Name">{viewNote.driverName || "-"}</Descriptions.Item>
              <Descriptions.Item label="Cold Chain Required">
                <Tag color={viewNote.coldChainRequired ? "blue" : "default"}>{viewNote.coldChainRequired ? "Yes" : "No"}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="POD Uploaded">
                <Tag color={viewNote.podUploaded ? "green" : "orange"}>{viewNote.podUploaded ? "Yes" : "No"}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Items Dispatched" size="small" style={{ marginBottom: 16 }}>
              <Table
                dataSource={viewNote.items}
                columns={[
                  { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
                  { title: "Item Name", dataIndex: "itemName", key: "itemName" },
                  { title: "Batch Number", dataIndex: "batchNumber", key: "batchNumber" },
                  { title: "Quantity", dataIndex: "quantityDispatched", key: "quantityDispatched" },
                ]}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </Card>

            {viewNote.status === "delivered" && !viewNote.podUploaded && (
              <Card title="Upload Proof of Delivery" size="small">
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload POD Document</Button>
                </Upload>
              </Card>
            )}
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}
