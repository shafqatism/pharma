"use client";

import { useState } from "react";
import {
  Form, Input, Select, DatePicker, InputNumber, Switch, Button, Steps, Row, Col, Upload, Divider, Space
} from "antd";
import type { DividerProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useHRMStore } from "@/store/hrmStore";
import type { Employee } from "@/types/hrm";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const SectionDivider = ({ children }: { children: string }) => (
  <Divider orientation={"left" as DividerProps["orientation"]}>{children}</Divider>
);

interface EmployeeFormProps {
  employee?: Employee | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const { addEmployee, updateEmployee, departments, designations } = useHRMStore();

  const steps = [
    { title: "Personal Info", description: "Basic details" },
    { title: "Employment", description: "Job details" },
    { title: "Official", description: "Company details" },
    { title: "Bank & Payroll", description: "Salary details" },
    { title: "Documents", description: "Upload files" },
  ];

  const handleNext = async () => {
    try {
      const fieldsToValidate = getFieldsForStep(currentStep);
      await form.validateFields(fieldsToValidate);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
        dateOfJoining: values.dateOfJoining?.format("YYYY-MM-DD"),
        confirmationDate: values.confirmationDate?.format("YYYY-MM-DD"),
        documents: [],
      };

      if (employee) {
        updateEmployee(employee.id, formData);
      } else {
        addEmployee(formData);
      }
      onSuccess();
    } catch (error) {
      console.log("Submit failed:", error);
    }
  };

  const getFieldsForStep = (step: number): string[] => {
    switch (step) {
      case 0:
        return ["fullName", "fatherSpouseName", "cnicPassport", "gender", "dateOfBirth", "contactNumber", "personalEmail"];
      case 1:
        return ["company", "department", "designation", "employmentType", "dateOfJoining", "employmentStatus"];
      case 2:
        return ["companyEmail", "employeeCode", "accessRole"];
      case 3:
        return ["bankName", "accountTitle", "accountNumber", "salaryType", "basicSalary"];
      default:
        return [];
    }
  };

  const initialValues = employee
    ? {
        ...employee,
        dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : null,
        dateOfJoining: employee.dateOfJoining ? dayjs(employee.dateOfJoining) : null,
        confirmationDate: employee.confirmationDate ? dayjs(employee.confirmationDate) : null,
      }
    : { employmentStatus: "active", vehicleAssigned: false };


  return (
    <div>
      <Steps current={currentStep} items={steps} size="small" style={{ marginBottom: 24 }} />

      <Form form={form} layout="vertical" initialValues={initialValues}>
        {/* Step 0: Personal Information */}
        <div style={{ display: currentStep === 0 ? "block" : "none" }}>
          <SectionDivider>Personal Information</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="fatherSpouseName" label="Father/Spouse Name" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter father/spouse name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cnicPassport" label="CNIC/Passport No" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter CNIC or Passport number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true, message: "Required" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maritalStatus" label="Marital Status">
                <Select placeholder="Select status">
                  <Option value="single">Single</Option>
                  <Option value="married">Married</Option>
                  <Option value="divorced">Divorced</Option>
                  <Option value="widowed">Widowed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nationality" label="Nationality">
                <Input placeholder="Enter nationality" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bloodGroup" label="Blood Group">
                <Select placeholder="Select blood group">
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter contact number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="personalEmail" label="Personal Email" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
                <Input placeholder="Enter personal email" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="currentAddress" label="Current Address">
                <TextArea rows={2} placeholder="Enter current address" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="permanentAddress" label="Permanent Address">
                <TextArea rows={2} placeholder="Enter permanent address" />
              </Form.Item>
            </Col>
          </Row>
          <SectionDivider>Emergency Contact</SectionDivider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="emergencyContactName" label="Contact Name">
                <Input placeholder="Emergency contact name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="emergencyContactRelation" label="Relation">
                <Input placeholder="Relation" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="emergencyContactNumber" label="Contact Number">
                <Input placeholder="Emergency contact number" />
              </Form.Item>
            </Col>
          </Row>
        </div>


        {/* Step 1: Employment Details */}
        <div style={{ display: currentStep === 1 ? "block" : "none" }}>
          <SectionDivider>Employment Details</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="company" label="Company/Business Unit" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department" label="Department" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select department">
                  {departments.map((dept) => (
                    <Option key={dept.id} value={dept.name}>{dept.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="designation" label="Designation" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select designation">
                  {designations.map((des) => (
                    <Option key={des.id} value={des.name}>{des.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="jobGrade" label="Job Grade/Level">
                <Input placeholder="Enter job grade" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employmentType" label="Employment Type" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select type">
                  <Option value="permanent">Permanent</Option>
                  <Option value="contract">Contract</Option>
                  <Option value="intern">Intern</Option>
                  <Option value="daily_wages">Daily Wages</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true, message: "Required" }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="confirmationDate" label="Confirmation Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="workLocation" label="Work Location/Plant">
                <Input placeholder="Enter work location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shiftAssignment" label="Shift Assignment">
                <Select placeholder="Select shift">
                  <Option value="morning">Morning Shift</Option>
                  <Option value="evening">Evening Shift</Option>
                  <Option value="night">Night Shift</Option>
                  <Option value="general">General Shift</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="reportingManager" label="Reporting Manager">
                <Input placeholder="Enter reporting manager" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hrManager" label="HR Manager">
                <Input placeholder="Enter HR manager" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employmentStatus" label="Employment Status" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="on_leave">On Leave</Option>
                  <Option value="suspended">Suspended</Option>
                  <Option value="terminated">Terminated</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Step 2: Official Details */}
        <div style={{ display: currentStep === 2 ? "block" : "none" }}>
          <SectionDivider>Official Details</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyEmail" label="Company Email" rules={[{ required: true, type: "email", message: "Valid email required" }]}>
                <Input placeholder="Enter company email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employeeCode" label="Employee Code" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter employee code" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accessRole" label="Access Role/System Role" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select role">
                  <Option value="admin">Admin</Option>
                  <Option value="manager">Manager</Option>
                  <Option value="employee">Employee</Option>
                  <Option value="hr">HR</Option>
                  <Option value="finance">Finance</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="biometricId" label="Biometric ID">
                <Input placeholder="Enter biometric ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="attendanceDeviceId" label="Attendance Device ID">
                <Input placeholder="Enter device ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="officeExtension" label="Office Extension">
                <Input placeholder="Enter office extension" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="vehicleAssigned" label="Vehicle Assigned" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>


        {/* Step 3: Bank & Payroll Details */}
        <div style={{ display: currentStep === 3 ? "block" : "none" }}>
          <SectionDivider>Bank Details</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter bank name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accountTitle" label="Account Title" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter account title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="accountNumber" label="Account Number/IBAN" rules={[{ required: true, message: "Required" }]}>
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="salaryType" label="Salary Type" rules={[{ required: true, message: "Required" }]}>
                <Select placeholder="Select salary type">
                  <Option value="monthly">Monthly</Option>
                  <Option value="daily">Daily</Option>
                  <Option value="hourly">Hourly</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <SectionDivider>Salary Components</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="basicSalary" label="Basic Salary" rules={[{ required: true, message: "Required" }]}>
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter basic salary" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="houseAllowance" label="House Allowance">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter house allowance" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="medicalAllowance" label="Medical Allowance">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter medical allowance" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="transportAllowance" label="Transport Allowance">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter transport allowance" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="otherAllowance" label="Other Allowance">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter other allowance" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="payrollGroup" label="Payroll Group">
                <Input placeholder="Enter payroll group" />
              </Form.Item>
            </Col>
          </Row>
          <SectionDivider>Deductions</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="taxDeduction" label="Tax Deduction">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter tax deduction" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="eobiDeduction" label="EOBI Deduction">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter EOBI deduction" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="providentFund" label="Provident Fund">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter provident fund" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="loanDeduction" label="Loan Deduction">
                <InputNumber style={{ width: "100%" }} min={0} placeholder="Enter loan deduction" formatter={(value) => `Rs. ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Step 4: Documents Upload */}
        <div style={{ display: currentStep === 4 ? "block" : "none" }}>
          <SectionDivider>Documents Upload</SectionDivider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="cnicCopy" label="CNIC Copy">
                <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload CNIC</Button></Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="appointmentLetter" label="Appointment Letter">
                <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload Appointment Letter</Button></Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contractLetter" label="Contract Letter">
                <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload Contract</Button></Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="educationalCertificates" label="Educational Certificates">
                <Upload maxCount={5}><Button icon={<UploadOutlined />}>Upload Certificates</Button></Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="experienceLetters" label="Experience Letters">
                <Upload maxCount={5}><Button icon={<UploadOutlined />}>Upload Experience Letters</Button></Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ndaPolicy" label="NDA/Policy Acknowledgment">
                <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload NDA</Button></Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="medicalFitness" label="Medical Fitness Certificate">
                <Upload maxCount={1}><Button icon={<UploadOutlined />}>Upload Medical Certificate</Button></Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Divider />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Space>
            {currentStep > 0 && <Button onClick={handlePrev}>Previous</Button>}
            {currentStep < steps.length - 1 && <Button type="primary" onClick={handleNext}>Next</Button>}
            {currentStep === steps.length - 1 && <Button type="primary" onClick={handleSubmit}>Submit</Button>}
          </Space>
        </div>
      </Form>
    </div>
  );
}
