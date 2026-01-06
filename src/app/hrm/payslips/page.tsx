"use client";

import React from "react";
import { Typography, Card, Table, Tag, Button, Space } from "antd";
import { FilePdfOutlined, DollarOutlined, FileTextOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/common/StatsCard";
import { useHRMStore } from "@/store/hrmStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Title } = Typography;

export default function PayslipsPage() {
  const { payrollRecords } = useHRMStore();

  const paidRecords = payrollRecords.filter((r) => r.status === "paid");
  const totalPaid = paidRecords.reduce((sum, r) => sum + r.netPay, 0);

  const stats = [
    { key: "total", title: "Total Payslips", value: paidRecords.length, prefix: <FileTextOutlined />, color: "#1890ff" },
    { key: "amount", title: "Total Disbursed", value: `Rs. ${totalPaid.toLocaleString()}`, prefix: <DollarOutlined />, color: "#52c41a" },
  ];

  const generatePayslip = (record: typeof payrollRecords[0]) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text("PAYSLIP", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Employee: ${record.employeeName}`, 20, 40);
    doc.text(`Month: ${record.payrollMonth}`, 20, 50);
    doc.text(`Payable Days: ${record.payableDays}`, 20, 60);

    autoTable(doc, {
      startY: 75,
      head: [["Description", "Amount (Rs.)"]],
      body: [
        ["Gross Salary", record.grossSalary.toLocaleString()],
        ["Allowances", record.totalAllowances.toLocaleString()],
        ["Deductions", `(${record.totalDeductions.toLocaleString()})`],
        ["Net Pay", record.netPay.toLocaleString()],
      ],
      headStyles: { fillColor: [41, 128, 185] },
      footStyles: { fillColor: [41, 128, 185] },
    });

    doc.setFontSize(10);
    doc.text("This is a computer-generated payslip.", 105, 280, { align: "center" });
    
    doc.save(`Payslip_${record.employeeName}_${record.payrollMonth}.pdf`);
  };

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName" },
    { title: "Month", dataIndex: "payrollMonth", key: "payrollMonth" },
    { title: "Gross Salary", dataIndex: "grossSalary", key: "grossSalary", render: (v: number) => `Rs. ${v?.toLocaleString()}` },
    { title: "Deductions", dataIndex: "totalDeductions", key: "totalDeductions", render: (v: number) => `Rs. ${v?.toLocaleString()}` },
    { title: "Net Pay", dataIndex: "netPay", key: "netPay", render: (v: number) => <strong>Rs. {v?.toLocaleString()}</strong> },
    { title: "Status", dataIndex: "status", key: "status", render: (status: string) => <Tag color={status === "paid" ? "green" : "blue"}>{status.toUpperCase()}</Tag> },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: typeof payrollRecords[0]) => (
        <Button type="primary" size="small" icon={<FilePdfOutlined />} onClick={() => generatePayslip(record)}>
          Download
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Payslips</Title>
        <StatsCard stats={stats} columns={2} />
      </div>

      <Card>
        <Table dataSource={payrollRecords} columns={columns} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </DashboardLayout>
  );
}
