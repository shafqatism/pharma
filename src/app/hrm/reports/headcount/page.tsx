"use client";

import React from "react";
import { Typography, Card, Row, Col, Tag } from "antd";
import { TeamOutlined, UserOutlined, ApartmentOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import ReportTable from "@/components/common/ReportTable";
import { useHRMStore } from "@/store/hrmStore";

const { Title, Text } = Typography;
const COLORS = ["#00BFFF", "#52c41a", "#faad14", "#ff4d4f", "#722ed1", "#13c2c2"];

export default function HeadcountReportPage() {
  const { employees, departments } = useHRMStore();

  const stats = [
    { key: "total", title: "Total Headcount", value: employees.length, prefix: <TeamOutlined />, color: "#00BFFF" },
    { key: "active", title: "Active", value: employees.filter((e) => e.employmentStatus === "active").length, prefix: <UserOutlined />, color: "#52c41a" },
    { key: "departments", title: "Departments", value: departments.length, prefix: <ApartmentOutlined />, color: "#722ed1" },
  ];

  const deptData = departments.map((dept) => ({
    name: dept.name,
    count: employees.filter((e) => e.department === dept.name).length,
    percentage: `${((employees.filter((e) => e.department === dept.name).length / employees.length) * 100).toFixed(1)}%`,
  })).filter((d) => d.count > 0);

  const statusData = [
    { name: "Active", value: employees.filter((e) => e.employmentStatus === "active").length },
    { name: "On Leave", value: employees.filter((e) => e.employmentStatus === "on_leave").length },
    { name: "Suspended", value: employees.filter((e) => e.employmentStatus === "suspended").length },
    { name: "Terminated", value: employees.filter((e) => e.employmentStatus === "terminated").length },
  ].filter((d) => d.value > 0);

  const typeData = [
    { name: "Permanent", value: employees.filter((e) => e.employmentType === "permanent").length },
    { name: "Contract", value: employees.filter((e) => e.employmentType === "contract").length },
    { name: "Intern", value: employees.filter((e) => e.employmentType === "intern").length },
    { name: "Daily Wages", value: employees.filter((e) => e.employmentType === "daily_wages").length },
  ].filter((d) => d.value > 0);

  // Employee list for detailed report
  const employeeReport = employees.map((e) => ({
    key: e.id,
    employeeId: e.employeeId,
    fullName: e.fullName,
    department: e.department,
    designation: e.designation,
    employmentType: e.employmentType,
    dateOfJoining: e.dateOfJoining,
    employmentStatus: e.employmentStatus,
  }));

  const deptColumns = [
    { title: "Department", dataIndex: "name", key: "name" },
    { title: "Headcount", dataIndex: "count", key: "count" },
    { title: "Percentage", dataIndex: "percentage", key: "percentage" },
  ];

  const employeeColumns = [
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId", width: 100 },
    { title: "Name", dataIndex: "fullName", key: "fullName", width: 150 },
    { title: "Department", dataIndex: "department", key: "department", width: 120 },
    { title: "Designation", dataIndex: "designation", key: "designation", width: 150 },
    { title: "Type", dataIndex: "employmentType", key: "employmentType", width: 100, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: "Joining Date", dataIndex: "dateOfJoining", key: "dateOfJoining", width: 100 },
    { title: "Status", dataIndex: "employmentStatus", key: "employmentStatus", width: 90, render: (s: string) => <Tag color={s === "active" ? "green" : "orange"}>{s}</Tag> },
  ];

  return (
    <DashboardLayout>
      <Title level={4} style={{ marginBottom: 24, fontSize: 18 }}>Headcount Report</Title>
      <StatsCard stats={stats} columns={3} />

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Employees by Department" size="small">
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={deptData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00BFFF" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">No data available</Text>
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Employment Status" size="small">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {statusData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 250, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">No data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Department Breakdown" size="small">
            <ReportTable
              columns={deptColumns}
              dataSource={deptData}
              rowKey="name"
              exportFileName="department-headcount"
              title="Department Headcount Report"
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Employment Type Distribution" size="small">
            {typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`} outerRadius={70} fill="#8884d8" dataKey="value">
                    {typeData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Text type="secondary">No data available</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Detailed Employee List" size="small" style={{ marginTop: 16 }}>
        <ReportTable
          columns={employeeColumns}
          dataSource={employeeReport}
          rowKey="key"
          exportFileName="employee-headcount-report"
          title="Employee Headcount Report"
        />
      </Card>
    </DashboardLayout>
  );
}
