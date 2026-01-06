"use client";

import { useState } from "react";
import { Typography, Button, Card, Tag, Modal, Drawer, message, Form, Select, DatePicker, TimePicker, InputNumber, Row, Col } from "antd";
import { PlusOutlined, CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import StatsCard from "@/components/common/StatsCard";
import UserGuide from "@/components/common/UserGuide";
import { useHRMStore } from "@/store/hrmStore";
import { attendanceGuide } from "@/data/guideData";
import type { AttendanceRecord } from "@/types/hrm";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function AttendancePage() {
  const { attendanceRecords, addAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord, employees } = useHRMStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [form] = Form.useForm();

  const stats = [
    { key: "total", title: "Total Records", value: attendanceRecords.length, prefix: <CalendarOutlined />, color: "#1890ff" },
    { key: "present", title: "Present", value: attendanceRecords.filter((r) => r.status === "present").length, prefix: <CheckCircleOutlined />, color: "#52c41a" },
    { key: "absent", title: "Absent", value: attendanceRecords.filter((r) => r.status === "absent").length, prefix: <CloseCircleOutlined />, color: "#ff4d4f" },
    { key: "late", title: "Late Arrivals", value: attendanceRecords.filter((r) => r.lateArrival > 0).length, prefix: <ClockCircleOutlined />, color: "#faad14" },
  ];

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName", width: 180 },
    { title: "Date", dataIndex: "date", key: "date", width: 120 },
    { title: "Check In", dataIndex: "checkInTime", key: "checkInTime", width: 100 },
    { title: "Check Out", dataIndex: "checkOutTime", key: "checkOutTime", width: 100 },
    { title: "Working Hours", dataIndex: "totalWorkingHours", key: "totalWorkingHours", width: 120, render: (hours: number) => `${hours} hrs` },
    { title: "Late (min)", dataIndex: "lateArrival", key: "lateArrival", width: 100, render: (min: number) => min > 0 ? <Tag color="orange">{min}</Tag> : "-" },
    { title: "Overtime", dataIndex: "overtimeHours", key: "overtimeHours", width: 100, render: (hours: number) => hours > 0 ? <Tag color="blue">{hours} hrs</Tag> : "-" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const colors: Record<string, string> = { present: "green", absent: "red", half_day: "orange", on_leave: "blue", holiday: "purple" };
        return <Tag color={colors[status]}>{status.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
  ];

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: "present", totalWorkingHours: 0, lateArrival: 0, earlyDeparture: 0, overtimeHours: 0 });
    setDrawerOpen(true);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
      checkInTime: record.checkInTime ? dayjs(record.checkInTime, "HH:mm") : null,
      checkOutTime: record.checkOutTime ? dayjs(record.checkOutTime, "HH:mm") : null,
    });
    setDrawerOpen(true);
  };

  const handleDelete = (record: AttendanceRecord) => {
    Modal.confirm({
      title: "Delete Record",
      content: `Are you sure you want to delete this attendance record?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        deleteAttendanceRecord(record.id);
        message.success("Record deleted successfully");
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const employee = employees.find((e) => e.id === values.employeeId);
      const formData = {
        ...values,
        employeeName: employee?.fullName || "",
        date: values.date?.format("YYYY-MM-DD"),
        checkInTime: values.checkInTime?.format("HH:mm"),
        checkOutTime: values.checkOutTime?.format("HH:mm"),
      };
      if (selectedRecord) {
        updateAttendanceRecord(selectedRecord.id, formData);
        message.success("Record updated successfully");
      } else {
        addAttendanceRecord(formData);
        message.success("Record added successfully");
      }
      setDrawerOpen(false);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>Daily Attendance</Title>
          <div style={{ display: "flex", gap: 8 }}>
            <UserGuide {...attendanceGuide} />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Add Record</Button>
          </div>
        </div>
        <StatsCard stats={stats} />
      </div>

      <Card>
        <DataTable columns={columns} dataSource={attendanceRecords} rowKey="id" onEdit={handleEdit} onDelete={handleDelete} exportFileName="attendance" title="Attendance Records" />
      </Card>

      <Drawer title={selectedRecord ? "Edit Attendance" : "Add Attendance"} width={500} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical">
          <Form.Item name="employeeId" label="Employee" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select employee" showSearch optionFilterProp="children">
              {employees.map((emp) => (<Option key={emp.id} value={emp.id}>{emp.fullName} ({emp.employeeId})</Option>))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Required" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="checkInTime" label="Check In Time">
                <TimePicker style={{ width: "100%" }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="checkOutTime" label="Check Out Time">
                <TimePicker style={{ width: "100%" }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="totalWorkingHours" label="Working Hours">
                <InputNumber style={{ width: "100%" }} min={0} max={24} step={0.5} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="overtimeHours" label="Overtime Hours">
                <InputNumber style={{ width: "100%" }} min={0} max={12} step={0.5} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="lateArrival" label="Late Arrival (min)">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="earlyDeparture" label="Early Departure (min)">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Required" }]}>
            <Select placeholder="Select status">
              <Option value="present">Present</Option>
              <Option value="absent">Absent</Option>
              <Option value="half_day">Half Day</Option>
              <Option value="on_leave">On Leave</Option>
              <Option value="holiday">Holiday</Option>
            </Select>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}><Button block onClick={() => setDrawerOpen(false)}>Cancel</Button></Col>
            <Col span={12}><Button type="primary" block onClick={handleSubmit}>Save</Button></Col>
          </Row>
        </Form>
      </Drawer>
    </DashboardLayout>
  );
}
