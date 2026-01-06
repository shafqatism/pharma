"use client";

import React, { useState } from "react";
import { Button, Tag, Typography, Drawer, Descriptions, Form, Input, Select, InputNumber, message, Modal, Card, Row, Col, Table, Statistic } from "antd";
import { PlusOutlined, ExclamationCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useInventoryStore } from "@/store/inventoryStore";
import { ColdStorageUnit, TemperatureLog, TemperatureExcursion } from "@/types/inventory";

const { Title, Text } = Typography;

export default function ColdChainPage() {
  const { coldStorageUnits, temperatureLogs, temperatureExcursions, warehouses, addColdStorageUnit, updateColdStorageUnit, deleteColdStorageUnit, updateTemperatureExcursion } = useInventoryStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [excursionDrawerOpen, setExcursionDrawerOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<ColdStorageUnit | null>(null);
  const [selectedExcursion, setSelectedExcursion] = useState<TemperatureExcursion | null>(null);
  const [form] = Form.useForm();
  const [excursionForm] = Form.useForm();

  const openExcursions = temperatureExcursions.filter((e) => e.status === "Open").length;
  const recentLogs = temperatureLogs.slice(-10);

  const unitColumns = [
    { title: "Unit ID", dataIndex: "unitId", key: "unitId", width: 100 },
    { title: "Warehouse", dataIndex: "warehouseName", key: "warehouseName", width: 180 },
    { title: "Temp Range", key: "tempRange", width: 120, render: (_: unknown, r: ColdStorageUnit) => `${r.temperatureMin}°C - ${r.temperatureMax}°C` },
    { title: "Humidity", key: "humidity", width: 120, render: (_: unknown, r: ColdStorageUnit) => `${r.humidityMin}% - ${r.humidityMax}%` },
    { title: "Sensor", dataIndex: "sensorDeviceId", key: "sensorDeviceId", width: 100 },
    { title: "Calibration", dataIndex: "calibrationDate", key: "calibrationDate", width: 100 },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (s: string) => <Tag color={s === "Active" ? "green" : s === "Maintenance" ? "orange" : "red"}>{s}</Tag> },
  ];

  const logColumns = [
    { title: "Unit", dataIndex: "unitName", key: "unitName", width: 100 },
    { title: "Date/Time", dataIndex: "dateTime", key: "dateTime", width: 150 },
    { title: "Temperature", dataIndex: "recordedTemperature", key: "recordedTemperature", width: 100, render: (v: number) => `${v}°C` },
    { title: "Humidity", dataIndex: "recordedHumidity", key: "recordedHumidity", width: 100, render: (v: number) => `${v}%` },
    { title: "Status", dataIndex: "status", key: "status", width: 100, render: (s: string) => <Tag color={s === "Within Range" ? "green" : "red"}>{s}</Tag> },
    { title: "Alert", dataIndex: "alertSent", key: "alertSent", width: 80, render: (v: boolean) => v ? <Tag color="red">Yes</Tag> : <Tag>No</Tag> },
  ];

  const excursionColumns = [
    { title: "Unit", dataIndex: "unitName", key: "unitName", width: 100 },
    { title: "Start", dataIndex: "excursionStartTime", key: "excursionStartTime", width: 150 },
    { title: "End", dataIndex: "excursionEndTime", key: "excursionEndTime", width: 150 },
    { title: "Max Dev", dataIndex: "maxDeviation", key: "maxDeviation", width: 80, render: (v: number) => `+${v}°C` },
    { title: "Root Cause", dataIndex: "rootCause", key: "rootCause", width: 150 },
    { title: "QA Approval", dataIndex: "qaApproval", key: "qaApproval", width: 100, render: (s: string) => <Tag color={s === "Approved" ? "green" : s === "Pending" ? "orange" : "red"}>{s}</Tag> },
    { title: "Status", dataIndex: "status", key: "status", width: 80, render: (s: string) => <Tag color={s === "Closed" ? "green" : "red"}>{s}</Tag> },
  ];

  const handleAddUnit = () => {
    setSelectedUnit(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const handleEditUnit = (record: ColdStorageUnit) => {
    setSelectedUnit(record);
    form.setFieldsValue(record);
    setDrawerOpen(true);
  };

  const handleDeleteUnit = (record: ColdStorageUnit) => {
    Modal.confirm({
      title: "Delete Unit",
      icon: <ExclamationCircleOutlined />,
      content: `Delete ${record.unitId}?`,
      onOk: () => {
        deleteColdStorageUnit(record.id);
        message.success("Unit deleted");
      },
    });
  };

  const handleSubmitUnit = (values: Record<string, unknown>) => {
    const warehouse = warehouses.find((w) => w.id === values.warehouseId);
    const unitData: ColdStorageUnit = {
      id: selectedUnit?.id || `csu${Date.now()}`,
      unitId: values.unitId as string,
      warehouseId: values.warehouseId as string,
      warehouseName: warehouse?.warehouseName || "",
      temperatureMin: values.temperatureMin as number,
      temperatureMax: values.temperatureMax as number,
      humidityMin: values.humidityMin as number,
      humidityMax: values.humidityMax as number,
      sensorDeviceId: values.sensorDeviceId as string,
      calibrationDate: values.calibrationDate as string,
      status: values.status as ColdStorageUnit["status"],
    };

    if (selectedUnit) {
      updateColdStorageUnit(selectedUnit.id, unitData);
      message.success("Unit updated");
    } else {
      addColdStorageUnit(unitData);
      message.success("Unit added");
    }
    setDrawerOpen(false);
  };

  const handleViewExcursion = (record: TemperatureExcursion) => {
    setSelectedExcursion(record);
    excursionForm.setFieldsValue(record);
    setExcursionDrawerOpen(true);
  };

  const handleUpdateExcursion = (values: Record<string, unknown>) => {
    if (selectedExcursion) {
      updateTemperatureExcursion(selectedExcursion.id, values);
      message.success("Excursion updated");
      setExcursionDrawerOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, fontSize: 18 }}>Cold Chain Management</Title>
        <Text type="secondary" style={{ fontSize: 12 }}>Monitor temperature-controlled storage</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Cold Storage Units" value={coldStorageUnits.length} valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Active Units" value={coldStorageUnits.filter((u) => u.status === "Active").length} valueStyle={{ fontSize: 20, color: "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Open Excursions" value={openExcursions} valueStyle={{ fontSize: 20, color: openExcursions > 0 ? "#ff4d4f" : "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic title="Today's Logs" value={temperatureLogs.filter((l) => l.dateTime.includes("2024-12-23")).length} valueStyle={{ fontSize: 20 }} />
          </Card>
        </Col>
      </Row>

      <Card title={<><span style={{ marginRight: 8 }}>❄️</span>Cold Storage Units</>} size="small" extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddUnit}>Add Unit</Button>} style={{ marginBottom: 16 }}>
        <DataTable columns={unitColumns} dataSource={coldStorageUnits} rowKey="id" onEdit={handleEditUnit} onDelete={handleDeleteUnit} showExport={false} />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Temperature Logs" size="small">
            <Table columns={logColumns} dataSource={recentLogs} rowKey="id" pagination={false} size="small" scroll={{ y: 200 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><ThunderboltOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />Temperature Excursions</>} size="small">
            <Table
              columns={excursionColumns}
              dataSource={temperatureExcursions}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ y: 200 }}
              onRow={(record) => ({ onClick: () => handleViewExcursion(record), style: { cursor: "pointer" } })}
            />
          </Card>
        </Col>
      </Row>

      <Drawer title={selectedUnit ? "Edit Cold Storage Unit" : "Add Cold Storage Unit"} width={600} open={drawerOpen} onClose={() => setDrawerOpen(false)} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleSubmitUnit} initialValues={{ status: "Active", temperatureMin: 2, temperatureMax: 8, humidityMin: 35, humidityMax: 65 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            <Form.Item name="unitId" label="Unit ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
              <Select>
                {warehouses.filter((w) => w.temperatureControlled).map((w) => <Select.Option key={w.id} value={w.id}>{w.warehouseName}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="temperatureMin" label="Min Temperature (°C)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="temperatureMax" label="Max Temperature (°C)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="humidityMin" label="Min Humidity (%)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
            <Form.Item name="humidityMax" label="Max Humidity (%)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
            <Form.Item name="sensorDeviceId" label="Sensor Device ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="calibrationDate" label="Calibration Date" rules={[{ required: true }]}>
              <Input type="date" />
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
                <Select.Option value="Maintenance">Maintenance</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block>Save Unit</Button>
        </Form>
      </Drawer>

      <Drawer title="Excursion Details" width={600} open={excursionDrawerOpen} onClose={() => setExcursionDrawerOpen(false)} destroyOnClose>
        {selectedExcursion && (
          <Form form={excursionForm} layout="vertical" onFinish={handleUpdateExcursion}>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Unit">{selectedExcursion.unitName}</Descriptions.Item>
              <Descriptions.Item label="Start">{selectedExcursion.excursionStartTime}</Descriptions.Item>
              <Descriptions.Item label="End">{selectedExcursion.excursionEndTime}</Descriptions.Item>
              <Descriptions.Item label="Max Deviation">+{selectedExcursion.maxDeviation}°C</Descriptions.Item>
            </Descriptions>
            <Form.Item name="rootCause" label="Root Cause">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="correctiveAction" label="Corrective Action">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="productImpactAssessment" label="Product Impact Assessment">
              <Input.TextArea rows={2} />
            </Form.Item>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="qaApproval" label="QA Approval">
                <Select>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Approved">Approved</Select.Option>
                  <Select.Option value="Rejected">Rejected</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Status">
                <Select>
                  <Select.Option value="Open">Open</Select.Option>
                  <Select.Option value="Closed">Closed</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Button type="primary" htmlType="submit" block>Update Excursion</Button>
          </Form>
        )}
      </Drawer>
    </DashboardLayout>
  );
}
