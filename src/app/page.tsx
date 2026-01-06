"use client";

import { useState } from "react";
import { Row, Col, Card, Statistic, Table, Tag, List, Typography, Progress } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  CalendarOutlined,
  BookOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import SplashScreen from "@/components/common/SplashScreen";
import { useHRMStore } from "@/store/hrmStore";

const { Title, Text } = Typography;

const COLORS = ["#0000FF", "#00875A", "#FF8B00", "#DE350B", "#7c3aed", "#0052CC"];

export default function Dashboard() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if this is the first load in this session (client-side only)
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("splashShown");
    }
    return true;
  });

  const {
    employees,
    candidates,
    leaveRequests,
    attendanceRecords,
    payrollRecords,
    performanceReviews,
    trainings,
  } = useHRMStore();

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("splashShown", "true");
    }
  };

  // Show splash screen on first load
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} duration={2500} />;
  }

  const activeEmployees = employees.filter((e) => e.employmentStatus === "active").length;
  const pendingLeaves = leaveRequests.filter((l) => l.approvalStatus === "pending").length;
  const pendingCandidates = candidates.filter(
    (c) => !["joined", "offer_rejected"].includes(c.pipelineStatus)
  ).length;

  const stats = [
    {
      key: "employees",
      title: "Total Employees",
      value: employees.length,
      prefix: <TeamOutlined />,
      color: "#0000FF",
      suffix: (
        <Text style={{ fontSize: 12, color: "#00875A" }}>
          <ArrowUpOutlined /> {activeEmployees} Active
        </Text>
      ),
    },
    {
      key: "candidates",
      title: "Pending Candidates",
      value: pendingCandidates,
      prefix: <UserAddOutlined />,
      color: "#722ed1",
      suffix: <Text style={{ fontSize: 12, color: "#5E6C84" }}>In pipeline</Text>,
    },
    {
      key: "leaves",
      title: "Pending Leaves",
      value: pendingLeaves,
      prefix: <CalendarOutlined />,
      color: "#FF8B00",
      suffix: <Text style={{ fontSize: 12, color: "#5E6C84" }}>Awaiting approval</Text>,
    },
    {
      key: "trainings",
      title: "Active Trainings",
      value: trainings.filter((t) => t.isActive).length,
      prefix: <BookOutlined />,
      color: "#00875A",
      suffix: (
        <Text style={{ fontSize: 12, color: "#DE350B" }}>
          {trainings.filter((t) => t.isMandatory).length} Mandatory
        </Text>
      ),
    },
  ];

  const departmentData = employees.reduce((acc, emp) => {
    const dept = emp.department || "Unassigned";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deptChartData = Object.entries(departmentData).map(([name, value]) => ({
    name,
    value,
  }));

  const recentLeaveRequests = leaveRequests.slice(-5).reverse();
  const recentCandidates = candidates.slice(-5).reverse();

  const leaveColumns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName" },
    { title: "Type", dataIndex: "leaveType", key: "leaveType" },
    { title: "Days", dataIndex: "totalDays", key: "totalDays" },
    {
      title: "Status",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: "orange",
          approved: "green",
          rejected: "red",
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];


  // Monthly trend data (mock)
  const monthlyTrend = [
    { month: "Aug", employees: 42, hires: 3, exits: 1 },
    { month: "Sep", employees: 44, hires: 4, exits: 2 },
    { month: "Oct", employees: 46, hires: 3, exits: 1 },
    { month: "Nov", employees: 47, hires: 2, exits: 1 },
    { month: "Dec", employees: 48, hires: 2, exits: 1 },
    { month: "Jan", employees: employees.length, hires: 1, exits: 0 },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: "#172B4D", fontWeight: 600 }}>
          Dashboard Overview
        </Title>
        <Text style={{ color: "#5E6C84" }}>Welcome back! Here&apos;s what&apos;s happening today.</Text>
      </div>

      {/* Stats Cards */}
      <StatsCard stats={stats} />

      {/* Charts Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title="Employee Trend"
            className="dashboard-card"
            styles={{ body: { padding: "12px 24px 24px" } }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorEmployees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0000FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0000FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                <XAxis dataKey="month" stroke="#5E6C84" fontSize={12} />
                <YAxis stroke="#5E6C84" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #EBECF0",
                    borderRadius: 8,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="employees"
                  stroke="#0000FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEmployees)"
                  name="Total Employees"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Department Distribution"
            className="dashboard-card"
            styles={{ body: { padding: "12px 24px 24px" } }}
          >
            {deptChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deptChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deptChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #EBECF0",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text type="secondary">No data available</Text>
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              {deptChartData.slice(0, 4).map((item, index) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: COLORS[index % COLORS.length],
                      }}
                    />
                    <Text style={{ fontSize: 13, color: "#5E6C84" }}>{item.name}</Text>
                  </div>
                  <Text style={{ fontSize: 13, fontWeight: 600, color: "#172B4D" }}>
                    {item.value}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>


      {/* Tables Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title="Recent Leave Requests"
            extra={
              <a href="/hrm/leave-requests" style={{ color: "#0000FF", fontWeight: 500 }}>
                View All
              </a>
            }
            className="dashboard-card"
          >
            {recentLeaveRequests.length > 0 ? (
              <Table
                dataSource={recentLeaveRequests}
                columns={leaveColumns}
                pagination={false}
                size="small"
                rowKey="id"
              />
            ) : (
              <div style={{ padding: 40, textAlign: "center" }}>
                <CalendarOutlined style={{ fontSize: 40, color: "#DFE1E6", marginBottom: 16 }} />
                <Text type="secondary" style={{ display: "block" }}>
                  No leave requests yet
                </Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title="Recent Candidates"
            extra={
              <a href="/hrm/candidates" style={{ color: "#0000FF", fontWeight: 500 }}>
                View All
              </a>
            }
            className="dashboard-card"
          >
            {recentCandidates.length > 0 ? (
              <List
                size="small"
                dataSource={recentCandidates}
                renderItem={(item) => (
                  <List.Item style={{ padding: "12px 0" }}>
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            background: "linear-gradient(135deg, #e6e6ff 0%, #ccccff 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0000FF",
                            fontWeight: 600,
                          }}
                        >
                          {item.fullName.charAt(0)}
                        </div>
                      }
                      title={
                        <Text style={{ fontWeight: 500, color: "#172B4D" }}>{item.fullName}</Text>
                      }
                      description={
                        <Text style={{ fontSize: 12, color: "#5E6C84" }}>
                          {item.appliedPosition}
                        </Text>
                      }
                    />
                    <Tag
                      color={
                        item.pipelineStatus === "offer_accepted"
                          ? "green"
                          : item.pipelineStatus === "interview_scheduled"
                          ? "blue"
                          : "default"
                      }
                      style={{ borderRadius: 4 }}
                    >
                      {item.pipelineStatus?.replace(/_/g, " ").toUpperCase()}
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ padding: 40, textAlign: "center" }}>
                <UserAddOutlined style={{ fontSize: 40, color: "#DFE1E6", marginBottom: 16 }} />
                <Text type="secondary" style={{ display: "block" }}>
                  No candidates yet
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Stats Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Attendance Today" className="dashboard-card">
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <CheckCircleOutlined style={{ color: "#00875A" }} />
                  <Text style={{ color: "#5E6C84" }}>Present</Text>
                </div>
                <Title level={3} style={{ margin: 0, color: "#00875A" }}>
                  {attendanceRecords.filter((r) => r.status === "present").length}
                </Title>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <ClockCircleOutlined style={{ color: "#FF8B00" }} />
                  <Text style={{ color: "#5E6C84" }}>On Leave</Text>
                </div>
                <Title level={3} style={{ margin: 0, color: "#FF8B00" }}>
                  {attendanceRecords.filter((r) => r.status === "on_leave").length}
                </Title>
              </div>
            </div>
            <Progress
              percent={Math.round(
                (attendanceRecords.filter((r) => r.status === "present").length /
                  (employees.length || 1)) *
                  100
              )}
              strokeColor={{ from: "#0000FF", to: "#3333ff" }}
              trailColor="#EBECF0"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Payroll Status" className="dashboard-card">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Processed"
                  value={payrollRecords.filter((r) => r.status === "processed" || r.status === "paid").length}
                  valueStyle={{ color: "#00875A", fontWeight: 600 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Pending"
                  value={payrollRecords.filter((r) => r.status === "draft").length}
                  valueStyle={{ color: "#FF8B00", fontWeight: 600 }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 12, color: "#5E6C84" }}>
                Total Disbursed:{" "}
                <Text strong style={{ color: "#172B4D" }}>
                  Rs.{" "}
                  {payrollRecords
                    .filter((r) => r.status === "paid")
                    .reduce((sum, r) => sum + r.netPay, 0)
                    .toLocaleString()}
                </Text>
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Performance Reviews" className="dashboard-card">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Completed"
                  value={performanceReviews.filter((r) => r.status === "completed").length}
                  valueStyle={{ color: "#00875A", fontWeight: 600 }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="In Progress"
                  value={performanceReviews.filter((r) => r.status !== "completed").length}
                  valueStyle={{ color: "#0000FF", fontWeight: 600 }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text style={{ fontSize: 12, color: "#5E6C84" }}>
                Exceptional Performers:{" "}
                <Text strong style={{ color: "#7c3aed" }}>
                  {performanceReviews.filter((r) => r.performanceRating === "exceptional").length}
                </Text>
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
