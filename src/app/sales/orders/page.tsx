"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, Select, Typography, Modal, Descriptions, Steps, Card, Row, Col, Statistic } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useSalesStore } from "@/store/salesStore";
import { SalesOrder } from "@/types/sales";
import SalesOrderForm from "./SalesOrderForm";

const { Title, Text } = Typography;

export default function SalesOrdersPage() {
  const { salesOrders, deleteSalesOrder, updateOrderStatus, approveSalesOrder } = useSalesStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null);
  const [viewOrder, setViewOrder] = useState<SalesOrder | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredOrders = salesOrders.filter((o) => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchText.toLowerCase()) || o.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (order: SalesOrder) => {
    setEditingOrder(order);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Sales Order",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this order?",
      onOk: () => deleteSalesOrder(id),
    });
  };

  const handleApprove = (order: SalesOrder) => {
    Modal.confirm({
      title: "Approve Sales Order",
      content: `Approve order ${order.orderNumber}?`,
      onOk: () => approveSalesOrder(order.id, "sales", "Current User"),
    });
  };

  const getStatusStep = (status: string) => {
    const steps = ["draft", "submitted", "approved", "picking", "dispatched", "delivered", "invoiced", "closed"];
    return steps.indexOf(status);
  };

  const columns = [
    { title: "Order #", dataIndex: "orderNumber", key: "orderNumber", width: 140 },
    { title: "Date", dataIndex: "orderDate", key: "orderDate", width: 100 },
    { title: "Customer", dataIndex: "customerName", key: "customerName", width: 180 },
    { title: "Channel", dataIndex: "salesChannel", key: "salesChannel", width: 140 },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 90,
      render: (p: string) => <Tag color={p === "urgent" ? "red" : p === "high" ? "orange" : "default"}>{p.toUpperCase()}</Tag>,
    },
    {
      title: "Net Total",
      dataIndex: "netTotal",
      key: "netTotal",
      width: 130,
      render: (v: number) => `PKR ${v.toLocaleString()}`,
    },
    {
      title: "Validations",
      key: "validations",
      width: 120,
      render: (_: unknown, r: SalesOrder) => (
        <Space size={4}>
          <Tag color={r.stockValidated ? "green" : "red"} style={{ fontSize: 10 }}>Stock</Tag>
          <Tag color={r.creditValidated ? "green" : "red"} style={{ fontSize: 10 }}>Credit</Tag>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (s: string) => {
        const colors: Record<string, string> = {
          draft: "default", submitted: "processing", approved: "success", picking: "cyan",
          dispatched: "blue", delivered: "green", invoiced: "purple", closed: "default", cancelled: "red",
        };
        return <Tag color={colors[s]}>{s.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: SalesOrder) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setViewOrder(record)} />
          {record.status === "draft" && (
            <>
              <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
              <Button type="text" icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
            </>
          )}
          {record.status === "submitted" && (
            <Button type="link" size="small" onClick={() => handleApprove(record)}>Approve</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Sales Orders</Title>
            <Text type="secondary">Create and manage sales orders with batch traceability</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingOrder(null); setFormOpen(true); }}>
            New Sales Order
          </Button>
        </div>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search orders..."
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
              { value: "draft", label: "Draft" },
              { value: "submitted", label: "Submitted" },
              { value: "approved", label: "Approved" },
              { value: "picking", label: "Picking" },
              { value: "dispatched", label: "Dispatched" },
              { value: "delivered", label: "Delivered" },
              { value: "invoiced", label: "Invoiced" },
            ]}
          />
        </Space>
      </div>

      <DataTable
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
      />

      {/* Sales Order Form Modal */}
      <SalesOrderForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingOrder(null); }}
        editingOrder={editingOrder}
      />

      {/* View Order Modal */}
      <Modal
        title={`Sales Order - ${viewOrder?.orderNumber}`}
        open={!!viewOrder}
        onCancel={() => setViewOrder(null)}
        footer={null}
        width={900}
      >
        {viewOrder && (
          <>
            {/* Order Status Steps */}
            <Steps
              current={getStatusStep(viewOrder.status)}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: "Draft" },
                { title: "Submitted" },
                { title: "Approved" },
                { title: "Picking" },
                { title: "Dispatched" },
                { title: "Delivered" },
                { title: "Invoiced" },
                { title: "Closed" },
              ]}
            />

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}><Card size="small"><Statistic title="Subtotal" value={viewOrder.subtotal} prefix="PKR" /></Card></Col>
              <Col span={6}><Card size="small"><Statistic title="Discount" value={viewOrder.totalDiscount} prefix="PKR" valueStyle={{ color: "#ff4d4f" }} /></Card></Col>
              <Col span={6}><Card size="small"><Statistic title="Tax" value={viewOrder.taxAmount} prefix="PKR" /></Card></Col>
              <Col span={6}><Card size="small"><Statistic title="Net Total" value={viewOrder.netTotal} prefix="PKR" valueStyle={{ color: "#52c41a" }} /></Card></Col>
            </Row>

            <Descriptions column={3} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Order Date">{viewOrder.orderDate}</Descriptions.Item>
              <Descriptions.Item label="Customer">{viewOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="Channel">{viewOrder.salesChannel}</Descriptions.Item>
              <Descriptions.Item label="Sales Rep">{viewOrder.salesRepName}</Descriptions.Item>
              <Descriptions.Item label="Warehouse">{viewOrder.warehouseName}</Descriptions.Item>
              <Descriptions.Item label="Priority"><Tag color={viewOrder.priority === "urgent" ? "red" : "default"}>{viewOrder.priority}</Tag></Descriptions.Item>
              <Descriptions.Item label="Delivery Date">{viewOrder.requestedDeliveryDate}</Descriptions.Item>
              <Descriptions.Item label="Delivery Address" span={2}>{viewOrder.deliveryAddress}</Descriptions.Item>
            </Descriptions>

            <Card title="Order Items" size="small">
              <Table
                dataSource={viewOrder.items}
                columns={[
                  { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
                  { title: "Item Name", dataIndex: "itemName", key: "itemName" },
                  { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
                  { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
                  { title: "Qty", dataIndex: "orderedQty", key: "orderedQty" },
                  { title: "Unit Price", dataIndex: "unitPrice", key: "unitPrice", render: (v: number) => `PKR ${v}` },
                  { title: "Discount %", dataIndex: "discount", key: "discount" },
                  { title: "Tax", dataIndex: "taxAmount", key: "taxAmount", render: (v: number) => `PKR ${v.toFixed(2)}` },
                  { title: "Total", dataIndex: "lineTotal", key: "lineTotal", render: (v: number) => `PKR ${v.toFixed(2)}` },
                ]}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </Card>

            {/* Approval Info */}
            {viewOrder.salesApproval && (
              <Card title="Approvals" size="small" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="Sales Approval">
                        <Tag color={viewOrder.salesApproval.status === "approved" ? "green" : "orange"}>
                          {viewOrder.salesApproval.status.toUpperCase()}
                        </Tag>
                      </Descriptions.Item>
                      {viewOrder.salesApproval.approvedBy && (
                        <Descriptions.Item label="Approved By">{viewOrder.salesApproval.approvedBy}</Descriptions.Item>
                      )}
                    </Descriptions>
                  </Col>
                  {viewOrder.financeApproval && (
                    <Col span={12}>
                      <Descriptions size="small" column={1}>
                        <Descriptions.Item label="Finance Approval">
                          <Tag color={viewOrder.financeApproval.status === "approved" ? "green" : "orange"}>
                            {viewOrder.financeApproval.status.toUpperCase()}
                          </Tag>
                        </Descriptions.Item>
                        {viewOrder.financeApproval.approvedBy && (
                          <Descriptions.Item label="Approved By">{viewOrder.financeApproval.approvedBy}</Descriptions.Item>
                        )}
                      </Descriptions>
                    </Col>
                  )}
                </Row>
              </Card>
            )}
          </>
        )}
      </Modal>
    </DashboardLayout>
  );
}
