"use client";

import { useState } from "react";
import { Table, Button, Tag, Space, Input, Select, Typography, Modal, Descriptions, Card, Form, Row, Col, InputNumber, DatePicker } from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined, ExclamationCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/common/DataTable";
import { useSalesStore } from "@/store/salesStore";
import { SalesReturn } from "@/types/sales";

const { Title, Text } = Typography;

export default function SalesReturnsPage() {
  const { salesReturns, processSalesReturn, addSalesReturn, customers } = useSalesStore();
  const [viewReturn, setViewReturn] = useState<SalesReturn | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [form] = Form.useForm();

  const filteredReturns = salesReturns.filter((r) => {
    const matchesSearch = r.returnNumber.toLowerCase().includes(searchText.toLowerCase()) || r.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleQCProcess = (id: string, status: "passed" | "failed") => {
    Modal.confirm({
      title: `Mark QC as ${status.toUpperCase()}?`,
      icon: status === "passed" ? <CheckCircleOutlined style={{ color: "#52c41a" }} /> : <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      content: status === "passed" ? "This will process the return and generate a credit note." : "This will reject the return.",
      onOk: () => processSalesReturn(id, status),
    });
  };

  const columns = [
    { title: "Return #", dataIndex: "returnNumber", key: "returnNumber", width: 140 },
    { title: "Date", dataIndex: "returnDate", key: "returnDate", width: 100 },
    { title: "Customer", dataIndex: "customerName", key: "customerName", width: 180 },
    { title: "Original Invoice", dataIndex: "originalInvoice", key: "originalInvoice", width: 140 },
    {
      title: "Return Type",
      dataIndex: "returnType",
      key: "returnType",
      width: 100,
      render: (t: string) => <Tag color={t === "credit" ? "blue" : "green"}>{t.toUpperCase()}</Tag>,
    },
    {
      title: "Value",
      dataIndex: "totalValue",
      key: "totalValue",
      width: 120,
      render: (v: number) => `PKR ${v.toLocaleString()}`,
    },
    {
      title: "QC Required",
      dataIndex: "qcRequired",
      key: "qcRequired",
      width: 90,
      render: (v: boolean) => <Tag color={v ? "orange" : "default"}>{v ? "Yes" : "No"}</Tag>,
    },
    {
      title: "QC Status",
      dataIndex: "qcStatus",
      key: "qcStatus",
      width: 100,
      render: (s: string) => s ? <Tag color={s === "passed" ? "green" : s === "failed" ? "red" : "orange"}>{s.toUpperCase()}</Tag> : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (s: string) => {
        const colors: Record<string, string> = {
          requested: "default", approved: "processing", qc_pending: "orange", qc_passed: "cyan",
          qc_failed: "red", processed: "green", rejected: "red",
        };
        return <Tag color={colors[s]}>{s.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
    {
      title: "Credit Note",
      dataIndex: "creditNoteNumber",
      key: "creditNoteNumber",
      width: 120,
      render: (v: string) => v || "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_: unknown, record: SalesReturn) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" onClick={() => setViewReturn(record)} />
          {record.status === "qc_pending" && (
            <>
              <Button type="link" size="small" style={{ color: "#52c41a" }} onClick={() => handleQCProcess(record.id, "passed")}>Pass</Button>
              <Button type="link" size="small" danger onClick={() => handleQCProcess(record.id, "failed")}>Fail</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleCreateReturn = (values: unknown) => {
    const customer = customers.find((c) => c.id === values.customerId);
    addSalesReturn({
      customerId: values.customerId,
      customerName: customer?.name || "",
      originalInvoice: values.originalInvoice,
      originalOrder: values.originalOrder,
      returnDate: values.returnDate.format("YYYY-MM-DD"),
      items: [{
        id: `SRI${Date.now()}`,
        itemId: values.itemId,
        itemCode: values.itemCode,
        itemName: values.itemName,
        batchNumber: values.batchNumber,
        expiryDate: values.expiryDate,
        quantityReturned: values.quantity,
        reason: values.reason,
        unitPrice: values.unitPrice,
        lineTotal: values.quantity * values.unitPrice,
      }],
      totalValue: values.quantity * values.unitPrice,
      returnType: values.returnType,
      status: "requested",
      qcRequired: true,
    });
    setFormOpen(false);
    form.resetFields();
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Sales Returns</Title>
            <Text type="secondary">Manage return requests, QC inspection, and credit notes</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormOpen(true)}>
            New Return Request
          </Button>
        </div>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>Pending QC</Text>
              <Title level={4} style={{ margin: 0, color: "#faad14" }}>
                {salesReturns.filter((r) => r.status === "qc_pending").length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>Processed</Text>
              <Title level={4} style={{ margin: 0, color: "#52c41a" }}>
                {salesReturns.filter((r) => r.status === "processed").length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>Total Return Value</Text>
              <Title level={4} style={{ margin: 0 }}>
                PKR {salesReturns.reduce((sum, r) => sum + r.totalValue, 0).toLocaleString()}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary" style={{ fontSize: 12 }}>Credit Notes Issued</Text>
              <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                {salesReturns.filter((r) => r.creditNoteNumber).length}
              </Title>
            </Card>
          </Col>
        </Row>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search returns..."
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
              { value: "requested", label: "Requested" },
              { value: "qc_pending", label: "QC Pending" },
              { value: "processed", label: "Processed" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
        </Space>
      </div>

      <DataTable dataSource={filteredReturns} columns={columns} rowKey="id" />

      {/* View Return Modal */}
      <Modal
        title={`Sales Return - ${viewReturn?.returnNumber}`}
        open={!!viewReturn}
        onCancel={() => setViewReturn(null)}
        footer={null}
        width={800}
      >
        {viewReturn && (
          <>
            <Descriptions column={2} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Return Number">{viewReturn.returnNumber}</Descriptions.Item>
              <Descriptions.Item label="Return Date">{viewReturn.returnDate}</Descriptions.Item>
              <Descriptions.Item label="Customer">{viewReturn.customerName}</Descriptions.Item>
              <Descriptions.Item label="Original Invoice">{viewReturn.originalInvoice}</Descriptions.Item>
              <Descriptions.Item label="Return Type"><Tag color={viewReturn.returnType === "credit" ? "blue" : "green"}>{viewReturn.returnType.toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Total Value">PKR {viewReturn.totalValue.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Status"><Tag>{viewReturn.status.replace("_", " ").toUpperCase()}</Tag></Descriptions.Item>
              <Descriptions.Item label="Credit Note">{viewReturn.creditNoteNumber || "-"}</Descriptions.Item>
            </Descriptions>

            <Card title="Return Items" size="small">
              <Table
                dataSource={viewReturn.items}
                columns={[
                  { title: "Item Code", dataIndex: "itemCode", key: "itemCode" },
                  { title: "Item Name", dataIndex: "itemName", key: "itemName" },
                  { title: "Batch", dataIndex: "batchNumber", key: "batchNumber" },
                  { title: "Expiry", dataIndex: "expiryDate", key: "expiryDate" },
                  { title: "Qty", dataIndex: "quantityReturned", key: "quantityReturned" },
                  { title: "Reason", dataIndex: "reason", key: "reason", render: (r: string) => <Tag>{r.toUpperCase()}</Tag> },
                  { title: "Value", dataIndex: "lineTotal", key: "lineTotal", render: (v: number) => `PKR ${v.toLocaleString()}` },
                ]}
                rowKey="id"
                size="small"
                pagination={false}
              />
            </Card>
          </>
        )}
      </Modal>

      {/* Create Return Modal */}
      <Modal
        title="New Return Request"
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateReturn} size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="customerId" label="Customer" rules={[{ required: true }]}>
                <Select options={customers.map((c) => ({ value: c.id, label: c.name }))} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="returnDate" label="Return Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="originalInvoice" label="Original Invoice #" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="originalOrder" label="Original Order #" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="returnType" label="Return Type" rules={[{ required: true }]}>
                <Select options={[{ value: "credit", label: "Credit Note" }, { value: "replace", label: "Replacement" }]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reason" label="Return Reason" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: "expired", label: "Expired" },
                    { value: "damaged", label: "Damaged" },
                    { value: "recall", label: "Product Recall" },
                    { value: "excess", label: "Excess Stock" },
                    { value: "wrong_item", label: "Wrong Item" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="itemCode" label="Item Code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="batchNumber" label="Batch Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expiryDate" label="Expiry Date" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unitPrice" label="Unit Price" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
