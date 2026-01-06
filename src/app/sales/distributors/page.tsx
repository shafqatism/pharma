"use client";

import { Table, Card, Tag, Space, Typography, Progress, Row, Col, Statistic } from "antd";
import { TrophyOutlined, DollarOutlined, AimOutlined, StarOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useSalesStore } from "@/store/salesStore";
import { Distributor } from "@/types/sales";

const { Title, Text } = Typography;

export default function DistributorsPage() {
  const { distributors } = useSalesStore();

  const totalTarget = distributors.reduce((sum, d) => sum + d.salesTarget, 0);
  const totalSales = distributors.reduce((sum, d) => sum + d.currentSales, 0);
  const totalIncentive = distributors.reduce((sum, d) => sum + d.incentiveEarned, 0);
  const avgRating = distributors.reduce((sum, d) => sum + d.performanceRating, 0) / distributors.length;

  const columns = [
    { title: "Distributor", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Territories",
      dataIndex: "assignedTerritory",
      key: "assignedTerritory",
      width: 200,
      render: (t: string[]) => t.map((ter) => <Tag key={ter}>{ter}</Tag>),
    },
    {
      title: "Product Portfolio",
      dataIndex: "productPortfolio",
      key: "productPortfolio",
      width: 180,
      render: (p: string[]) => p.map((prod) => <Tag key={prod} color="blue">{prod}</Tag>),
    },
    {
      title: "Sales Target",
      dataIndex: "salesTarget",
      key: "salesTarget",
      width: 130,
      render: (v: number) => `PKR ${(v / 1000000).toFixed(1)}M`,
    },
    {
      title: "Current Sales",
      dataIndex: "currentSales",
      key: "currentSales",
      width: 130,
      render: (v: number) => `PKR ${(v / 1000000).toFixed(1)}M`,
    },
    {
      title: "Achievement",
      key: "achievement",
      width: 150,
      render: (_: unknown, record: Distributor) => {
        const percent = Math.round((record.currentSales / record.salesTarget) * 100);
        return <Progress percent={percent} size="small" status={percent >= 100 ? "success" : percent >= 80 ? "active" : "exception"} />;
      },
    },
    {
      title: "Incentive Earned",
      dataIndex: "incentiveEarned",
      key: "incentiveEarned",
      width: 130,
      render: (v: number) => <Text type="success">PKR {v.toLocaleString()}</Text>,
    },
    {
      title: "Rating",
      dataIndex: "performanceRating",
      key: "performanceRating",
      width: 100,
      render: (v: number) => (
        <Space>
          <StarOutlined style={{ color: "#faad14" }} />
          <Text strong>{v.toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (s: string) => <Tag color={s === "active" ? "green" : "red"}>{s.toUpperCase()}</Tag>,
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Distributor Performance</Title>
        <Text type="secondary">Track distributor sales targets, achievements, and incentives</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Sales Target"
              value={(totalTarget / 1000000).toFixed(0)}
              suffix="M"
              prefix={<AimOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Sales Achieved"
              value={(totalSales / 1000000).toFixed(0)}
              suffix="M"
              prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Incentives"
              value={totalIncentive.toLocaleString()}
              prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Avg Performance Rating"
              value={avgRating.toFixed(1)}
              suffix="/ 5"
              prefix={<StarOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Distributor List">
        <DataTable dataSource={distributors} columns={columns} rowKey="id" />
      </Card>
    </DashboardLayout>
  );
}
