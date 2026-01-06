"use client";

import { useState } from "react";
import {
  Typography, Button, Card, Tag, Modal, Drawer, message, Descriptions, Tabs
} from "antd";
import {
  PlusOutlined, UserOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined
} from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import UserGuide from "@/components/common/UserGuide";
import EmployeeForm from "./EmployeeForm";
import { useHRMStore } from "@/store/hrmStore";
import { generateEmployeePDF } from "@/utils/exportUtils";
import { employeesGuide } from "@/data/guideData";
import type { Employee } from "@/types/hrm";

const { Title } = Typography;

export default function EmployeesPage() {
  const { employees, deleteEmployee } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editMode, setEditMode] = useState(false);

  const stats = [
    {
      key: "total",
      title: "Total Employees",
      value: employees.length,
      prefix: <TeamOutlined />,
      color: "#1890ff",
    },
    {
      key: "active",
      title: "Active",
      value: employees.filter((e) => e.employmentStatus === "active").length,
      prefix: <CheckCircleOutlined />,
      color: "#52c41a",
    },
    {
      key: "on_leave",
      title: "On Leave",
      value: employees.filter((e) => e.employmentStatus === "on_leave").length,
      prefix: <UserOutlined />,
      color: "#faad14",
    },
    {
      key: "terminated",
      title: "Terminated",
      value: employees.filter((e) => e.employmentStatus === "terminated").length,
      prefix: <CloseCircleOutlined />,
      color: "#ff4d4f",
    },
  ];

  const columns = [
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId", width: 120 },
    { title: "Full Name", dataIndex: "fullName", key: "fullName", width: 180 },
    { title: "Department", dataIndex: "department", key: "department", width: 150 },
    { title: "Designation", dataIndex: "designation", key: "designation", width: 150 },
    { title: "Contact", dataIndex: "contactNumber", key: "contactNumber", width: 130 },
    {
      title: "Employment Type",
      dataIndex: "employmentType",
      key: "employmentType",
      width: 130,
      render: (type: string) => {
        const colors: Record<string, string> = {
          permanent: "blue", contract: "orange", intern: "purple", daily_wages: "cyan"
        };
        return <Tag color={colors[type]}>{type.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "employmentStatus",
      key: "employmentStatus",
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: "green", on_leave: "orange", suspended: "red", terminated: "default"
        };
        return <Tag color={colors[status]}>{status.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
    { title: "Joining Date", dataIndex: "dateOfJoining", key: "dateOfJoining", width: 120 },
  ];


  const handleView = (record: Employee) => {
    setSelectedEmployee(record);
    setViewModalOpen(true);
  };

  const handleEdit = (record: Employee) => {
    setSelectedEmployee(record);
    setEditMode(true);
    setDrawerOpen(true);
  };

  const handleDelete = (record: Employee) => {
    Modal.confirm({
      title: "Delete Employee",
      content: `Are you sure you want to delete ${record.fullName}?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteEmployee(record.id);
        message.success("Employee deleted successfully");
      },
    });
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setEditMode(false);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedEmployee(null);
    setEditMode(false);
  };

  const handleFormSuccess = () => {
    handleDrawerClose();
    message.success(editMode ? "Employee updated successfully" : "Employee added successfully");
  };

  const handleDownloadPDF = () => {
    if (selectedEmployee) {
      generateEmployeePDF(selectedEmployee as unknown as Record<string, unknown>);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Employee Management</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <UserGuide {...employeesGuide} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Employee
            </Button>
          </div>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable
          columns={columns}
          dataSource={employees}
          rowKey="id"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          exportFileName="employees"
          title="Employee List"
        />
      </Card>

      <Drawer
        title={editMode ? "Edit Employee" : "Add New Employee"}
        width={800}
        open={drawerOpen}
        onClose={handleDrawerClose}
        destroyOnClose
      >
        <EmployeeForm
          employee={selectedEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleDrawerClose}
        />
      </Drawer>

      <Modal
        title="Employee Details"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={900}
        footer={[
          <Button key="pdf" onClick={handleDownloadPDF}>Download PDF</Button>,
          <Button key="close" type="primary" onClick={() => setViewModalOpen(false)}>Close</Button>,
        ]}
      >
        {selectedEmployee && (
          <Tabs
            items={[
              {
                key: "personal",
                label: "Personal Info",
                children: (
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Employee ID">{selectedEmployee.employeeId}</Descriptions.Item>
                    <Descriptions.Item label="Full Name">{selectedEmployee.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Father/Spouse">{selectedEmployee.fatherSpouseName}</Descriptions.Item>
                    <Descriptions.Item label="CNIC/Passport">{selectedEmployee.cnicPassport}</Descriptions.Item>
                    <Descriptions.Item label="Gender">{selectedEmployee.gender}</Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">{selectedEmployee.dateOfBirth}</Descriptions.Item>
                    <Descriptions.Item label="Marital Status">{selectedEmployee.maritalStatus}</Descriptions.Item>
                    <Descriptions.Item label="Nationality">{selectedEmployee.nationality}</Descriptions.Item>
                    <Descriptions.Item label="Blood Group">{selectedEmployee.bloodGroup}</Descriptions.Item>
                    <Descriptions.Item label="Contact">{selectedEmployee.contactNumber}</Descriptions.Item>
                    <Descriptions.Item label="Email">{selectedEmployee.personalEmail}</Descriptions.Item>
                    <Descriptions.Item label="Emergency Contact">{selectedEmployee.emergencyContactName} ({selectedEmployee.emergencyContactRelation})</Descriptions.Item>
                    <Descriptions.Item label="Current Address" span={2}>{selectedEmployee.currentAddress}</Descriptions.Item>
                    <Descriptions.Item label="Permanent Address" span={2}>{selectedEmployee.permanentAddress}</Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: "employment",
                label: "Employment Details",
                children: (
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Company">{selectedEmployee.company}</Descriptions.Item>
                    <Descriptions.Item label="Department">{selectedEmployee.department}</Descriptions.Item>
                    <Descriptions.Item label="Designation">{selectedEmployee.designation}</Descriptions.Item>
                    <Descriptions.Item label="Job Grade">{selectedEmployee.jobGrade}</Descriptions.Item>
                    <Descriptions.Item label="Employment Type">{selectedEmployee.employmentType}</Descriptions.Item>
                    <Descriptions.Item label="Date of Joining">{selectedEmployee.dateOfJoining}</Descriptions.Item>
                    <Descriptions.Item label="Confirmation Date">{selectedEmployee.confirmationDate || "N/A"}</Descriptions.Item>
                    <Descriptions.Item label="Work Location">{selectedEmployee.workLocation}</Descriptions.Item>
                    <Descriptions.Item label="Shift">{selectedEmployee.shiftAssignment}</Descriptions.Item>
                    <Descriptions.Item label="Reporting Manager">{selectedEmployee.reportingManager}</Descriptions.Item>
                    <Descriptions.Item label="HR Manager">{selectedEmployee.hrManager}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={selectedEmployee.employmentStatus === "active" ? "green" : "red"}>
                        {selectedEmployee.employmentStatus.toUpperCase()}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: "payroll",
                label: "Bank & Payroll",
                children: (
                  <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Bank Name">{selectedEmployee.bankName}</Descriptions.Item>
                    <Descriptions.Item label="Account Title">{selectedEmployee.accountTitle}</Descriptions.Item>
                    <Descriptions.Item label="Account Number">{selectedEmployee.accountNumber}</Descriptions.Item>
                    <Descriptions.Item label="Salary Type">{selectedEmployee.salaryType}</Descriptions.Item>
                    <Descriptions.Item label="Basic Salary">Rs. {selectedEmployee.basicSalary?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="House Allowance">Rs. {selectedEmployee.houseAllowance?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Medical Allowance">Rs. {selectedEmployee.medicalAllowance?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Transport Allowance">Rs. {selectedEmployee.transportAllowance?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Tax Deduction">Rs. {selectedEmployee.taxDeduction?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="EOBI">Rs. {selectedEmployee.eobiDeduction?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Provident Fund">Rs. {selectedEmployee.providentFund?.toLocaleString()}</Descriptions.Item>
                    <Descriptions.Item label="Payroll Group">{selectedEmployee.payrollGroup}</Descriptions.Item>
                  </Descriptions>
                ),
              },
            ]}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
