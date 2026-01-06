"use client";

import { Row, Col, Card, Statistic, Table, Progress, Typography, Tag } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TruckOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import { useSalesStore } from "@/store/salesStore";

const { Title, Text } = Typography;

export default function SalesDashboard() {
  const { dashboardData, salesOrders, customers } = useSalesStore();

  const orderStatusColumns = [
    { title: "Status", dataIndex: "status", key: "status", render: (s: string) => <Tag color={s === "Invoiced" ? "green" : s === "Dispatched" ? "blue" : "orange"}>{s}</Tag> },
    { title: "Count", dataIndex: "count", key: "count", render: (c: number) => <Text strong>{c}</Text> },
  ];

  const topCustomerColumns = [
    { title: "Customer", dataIndex: "name", key: "name" },
    { title: "Sales Value", dataIndex: "value", key: "value", render: (v: number) => `PKR ${(v / 1000000).toFixed(1)}M` },
  ];

  const topProductColumns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity", render: (q: number) => q.toLocaleString() },
  ];

  const recentOrders = salesOrders.slice(0, 5).map((o) => ({
    key: o.id,
    orderNumber: o.orderNumber,
    customer: o.customerName,
    amount: o.netTotal,
    status: o.status,
    date: o.orderDate,
  }));

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Sales Dashboard</Title>
        <Text type="secondary">Overview of sales performance and key metrics</Text>
      </div>

      {/* KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Sales (MTD)"
            value={`PKR ${(dashboardData.totalSalesMTD / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            trend={{ value: 12.5, isPositive: true }}
            color="#00BFFF"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Sales (YTD)"
            value={`PKR ${(dashboardData.totalSalesYTD / 1000000000).toFixed(2)}B`}
            icon={<RiseOutlined />}
            trend={{ value: 8.3, isPositive: true }}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="Outstanding Receivables"
            value={`PKR ${(dashboardData.outstandingReceivables / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined />}
            trend={{ value: 3.2, isPositive: false }}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard
            title="On-Time Delivery"
            value={`${dashboardData.onTimeDeliveryRate}%`}
            icon={<TruckOutlined />}
            trend={{ value: 2.1, isPositive: true }}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Second Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Active Customers"
              value={customers.filter((c) => c.status === "active").length}
              prefix={<UserOutlined style={{ color: "#00BFFF" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Open Orders"
              value={salesOrders.filter((o) => !["closed", "cancelled", "invoiced"].includes(o.status)).length}
              prefix={<ShoppingCartOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Returns Rate"
              value={dashboardData.returnsPercentage}
              suffix="%"
              prefix={<FallOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircleOutlined style={{ color: "#52c41a", fontSize: 24 }} />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>Order Fulfillment</Text>
                <Progress percent={94} size="small" strokeColor="#52c41a" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tables Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Orders by Status" size="small">
            <Table
              dataSource={dashboardData.ordersByStatus}
              columns={orderStatusColumns}
              pagination={false}
              size="small"
              rowKey="status"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Customers" size="small">
            <Table
              dataSource={dashboardData.topCustomers}
              columns={topCustomerColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Products" size="small">
            <Table
              dataSource={dashboardData.topProducts}
              columns={topProductColumns}
              pagination={false}
              size="small"
              rowKey="name"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Card title="Recent Sales Orders" size="small">
        <Table
          dataSource={recentOrders}
          columns={[
            { title: "Order #", dataIndex: "orderNumber", key: "orderNumber" },
            { title: "Customer", dataIndex: "customer", key: "customer" },
            { title: "Amount", dataIndex: "amount", key: "amount", render: (v: number) => `PKR ${v.toLocaleString()}` },
            { title: "Date", dataIndex: "date", key: "date" },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (s: string) => (
                <Tag color={s === "approved" ? "green" : s === "draft" ? "default" : s === "picking" ? "blue" : "orange"}>
                  {s.toUpperCase()}
                </Tag>
              ),
            },
          ]}
          pagination={false}
          size="small"
        />
      </Card>
    </DashboardLayout>
  );
}
