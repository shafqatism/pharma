"use client";

import React from "react";
import { Form, Input, Select, InputNumber, Switch, Button, Steps, message, Divider, Rate } from "antd";
import { useProcurementStore } from "@/store/procurementStore";
import { Vendor } from "@/types/procurement";

interface VendorFormProps {
  vendor: Vendor | null;
  onClose: () => void;
}

export default function VendorForm({ vendor, onClose }: VendorFormProps) {
  const { addVendor, updateVendor, vendors } = useProcurementStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    { title: "Basic Info" },
    { title: "Compliance" },
    { title: "Financial" },
  ];

  const handleFinish = (values: Record<string, unknown>) => {
    const vendorData: Vendor = {
      id: vendor?.id || `v${Date.now()}`,
      vendorId: vendor?.vendorId || `VND-${String(vendors.length + 1).padStart(3, "0")}`,
      legalName: values.legalName as string,
      vendorType: values.vendorType as Vendor["vendorType"],
      businessCategory: values.businessCategory as string,
      registrationNumber: values.registrationNumber as string,
      ntnVatGst: values.ntnVatGst as string,
      country: values.country as string,
      city: values.city as string,
      address: values.address as string,
      contactPerson: values.contactPerson as string,
      contactNumber: values.contactNumber as string,
      email: values.email as string,
      website: values.website as string || "",
      gmpCertified: values.gmpCertified as boolean || false,
      regulatoryLicenseNumber: values.regulatoryLicenseNumber as string || "",
      licenseExpiryDate: values.licenseExpiryDate as string || "",
      qualityRating: values.qualityRating as number || 0,
      auditStatus: values.auditStatus as Vendor["auditStatus"] || "Pending",
      blacklisted: values.blacklisted as boolean || false,
      riskCategory: values.riskCategory as Vendor["riskCategory"] || "Low",
      bankName: values.bankName as string || "",
      accountTitle: values.accountTitle as string || "",
      accountNumber: values.accountNumber as string || "",
      paymentCurrency: values.paymentCurrency as string || "PKR",
      paymentTerms: values.paymentTerms as Vendor["paymentTerms"] || "Net-30",
      creditLimit: values.creditLimit as number || 0,
      taxWithholding: values.taxWithholding as number || 0,
      documents: vendor?.documents || [],
      status: values.status as Vendor["status"] || "Active",
      createdAt: vendor?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (vendor) {
      updateVendor(vendor.id, vendorData);
      message.success("Vendor updated successfully");
    } else {
      addVendor(vendorData);
      message.success("Vendor added successfully");
    }
    onClose();
  };

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch {
      // validation failed
    }
  };

  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <div>
      <Steps current={currentStep} items={steps} size="small" style={{ marginBottom: 24 }} />
      <Form
        form={form}
        layout="vertical"
        initialValues={vendor || { gmpCertified: false, blacklisted: false, status: "Active", paymentTerms: "Net-30", paymentCurrency: "PKR", riskCategory: "Low", auditStatus: "Pending" }}
        onFinish={handleFinish}
      >
        {currentStep === 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="legalName" label="Vendor Legal Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="vendorType" label="Vendor Type" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Raw Material">Raw Material</Select.Option>
                  <Select.Option value="Packaging">Packaging</Select.Option>
                  <Select.Option value="Equipment">Equipment</Select.Option>
                  <Select.Option value="Services">Services</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="businessCategory" label="Business Category" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="registrationNumber" label="Registration Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="ntnVatGst" label="NTN/VAT/GST Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                <Select showSearch>
                  <Select.Option value="Pakistan">Pakistan</Select.Option>
                  <Select.Option value="China">China</Select.Option>
                  <Select.Option value="India">India</Select.Option>
                  <Select.Option value="Germany">Germany</Select.Option>
                  <Select.Option value="USA">USA</Select.Option>
                  <Select.Option value="UK">UK</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="status" label="Status">
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                  <Select.Option value="Suspended">Suspended</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
            <Divider style={{ fontSize: 12 }}><span style={{ fontWeight: 500 }}>Contact Information</span></Divider>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="contactPerson" label="Contact Person" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="website" label="Website">
                <Input />
              </Form.Item>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="gmpCertified" label="GMP Certified" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="blacklisted" label="Blacklisted" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="regulatoryLicenseNumber" label="Regulatory License Number">
                <Input />
              </Form.Item>
              <Form.Item name="licenseExpiryDate" label="License Expiry Date">
                <Input type="date" />
              </Form.Item>
              <Form.Item name="qualityRating" label="Quality Rating">
                <Rate />
              </Form.Item>
              <Form.Item name="auditStatus" label="Audit Status">
                <Select>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Scheduled">Scheduled</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="riskCategory" label="Risk Category">
                <Select>
                  <Select.Option value="Low">Low</Select.Option>
                  <Select.Option value="Medium">Medium</Select.Option>
                  <Select.Option value="High">High</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="bankName" label="Bank Name">
                <Input />
              </Form.Item>
              <Form.Item name="accountTitle" label="Account Title">
                <Input />
              </Form.Item>
              <Form.Item name="accountNumber" label="Account Number / IBAN">
                <Input />
              </Form.Item>
              <Form.Item name="paymentCurrency" label="Currency">
                <Select>
                  <Select.Option value="PKR">PKR</Select.Option>
                  <Select.Option value="USD">USD</Select.Option>
                  <Select.Option value="EUR">EUR</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="paymentTerms" label="Payment Terms">
                <Select>
                  <Select.Option value="Advance">Advance</Select.Option>
                  <Select.Option value="Net-30">Net-30</Select.Option>
                  <Select.Option value="Net-60">Net-60</Select.Option>
                  <Select.Option value="Net-90">Net-90</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="creditLimit" label="Credit Limit">
                <InputNumber style={{ width: "100%" }} formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
              <Form.Item name="taxWithholding" label="Tax Withholding %">
                <InputNumber style={{ width: "100%" }} min={0} max={100} />
              </Form.Item>
            </div>
          </>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          {currentStep > 0 && <Button onClick={prev}>Previous</Button>}
          {currentStep < steps.length - 1 && <Button type="primary" onClick={next} style={{ marginLeft: "auto" }}>Next</Button>}
          {currentStep === steps.length - 1 && <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>Save Vendor</Button>}
        </div>
      </Form>
    </div>
  );
}
