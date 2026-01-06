"use client";

import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Switch, Button, Steps, message, Typography } from "antd";
import { useInventoryStore } from "@/store/inventoryStore";
import { InventoryItem } from "@/types/inventory";

const { Text } = Typography;

interface ItemFormProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function ItemForm({ item, onClose }: ItemFormProps) {
  const { addItem, updateItem, items } = useInventoryStore();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [{ title: "Basic Info" }, { title: "Regulatory" }, { title: "Inventory" }, { title: "Financial" }];

  const handleFinish = () => {
    const values = form.getFieldsValue(true);
    const itemData: InventoryItem = {
      id: item?.id || `item${Date.now()}`,
      itemCode: item?.itemCode || `ITM-${String(items.length + 1).padStart(3, "0")}`,
      itemName: values.itemName,
      genericName: values.genericName || "",
      brandName: values.brandName || "",
      category: values.category,
      dosageForm: values.dosageForm,
      strength: values.strength || "",
      primaryUOM: values.primaryUOM,
      secondaryUOM: values.secondaryUOM || "",
      conversionFactor: values.conversionFactor || 1,
      shelfLifeMonths: values.shelfLifeMonths || 24,
      storageCondition: values.storageCondition || "Room Temp",
      hazardClass: values.hazardClass || "",
      drugRegistrationNumber: values.drugRegistrationNumber || "",
      regulatoryAuthority: values.regulatoryAuthority || "",
      controlledDrug: values.controlledDrug || false,
      prescriptionRequired: values.prescriptionRequired || false,
      importRestricted: values.importRestricted || false,
      minStockLevel: values.minStockLevel || 0,
      maxStockLevel: values.maxStockLevel || 0,
      reorderLevel: values.reorderLevel || 0,
      reorderQuantity: values.reorderQuantity || 0,
      safetyStock: values.safetyStock || 0,
      batchTrackingRequired: values.batchTrackingRequired ?? true,
      expiryTrackingRequired: values.expiryTrackingRequired ?? true,
      serialTracking: values.serialTracking || false,
      valuationMethod: values.valuationMethod || "FEFO",
      standardCost: values.standardCost || 0,
      purchaseCost: values.purchaseCost || 0,
      sellingPrice: values.sellingPrice || 0,
      taxCategory: values.taxCategory || "",
      status: values.status || "Active",
      createdAt: item?.createdAt || new Date().toISOString().split("T")[0],
    };

    if (item) {
      updateItem(item.id, itemData);
      message.success("Item updated");
    } else {
      addItem(itemData);
      message.success("Item added");
    }
    onClose();
  };

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch { /* validation failed */ }
  };

  return (
    <div>
      <Steps current={currentStep} items={steps} size="small" style={{ marginBottom: 24 }} />
      <Form form={form} layout="vertical" initialValues={item || { category: "Raw Material", dosageForm: "Tablet", storageCondition: "Room Temp", valuationMethod: "FEFO", status: "Active", batchTrackingRequired: true, expiryTrackingRequired: true }}>
        {currentStep === 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="genericName" label="Generic Name">
                <Input />
              </Form.Item>
              <Form.Item name="brandName" label="Brand Name">
                <Input />
              </Form.Item>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Raw Material">Raw Material</Select.Option>
                  <Select.Option value="Finished Goods">Finished Goods</Select.Option>
                  <Select.Option value="Packaging">Packaging</Select.Option>
                  <Select.Option value="Consumables">Consumables</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="dosageForm" label="Dosage Form" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Tablet">Tablet</Select.Option>
                  <Select.Option value="Capsule">Capsule</Select.Option>
                  <Select.Option value="Syrup">Syrup</Select.Option>
                  <Select.Option value="Injection">Injection</Select.Option>
                  <Select.Option value="API">API</Select.Option>
                  <Select.Option value="Cream">Cream</Select.Option>
                  <Select.Option value="Ointment">Ointment</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="strength" label="Strength">
                <Input />
              </Form.Item>
              <Form.Item name="primaryUOM" label="Primary UOM" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="KG">KG</Select.Option>
                  <Select.Option value="G">G</Select.Option>
                  <Select.Option value="LTR">LTR</Select.Option>
                  <Select.Option value="ML">ML</Select.Option>
                  <Select.Option value="TAB">TAB</Select.Option>
                  <Select.Option value="CAP">CAP</Select.Option>
                  <Select.Option value="VIAL">VIAL</Select.Option>
                  <Select.Option value="BOX">BOX</Select.Option>
                  <Select.Option value="ROLL">ROLL</Select.Option>
                  <Select.Option value="PCS">PCS</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="secondaryUOM" label="Secondary UOM">
                <Input />
              </Form.Item>
              <Form.Item name="conversionFactor" label="Conversion Factor">
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
              <Form.Item name="shelfLifeMonths" label="Shelf Life (Months)">
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
              <Form.Item name="storageCondition" label="Storage Condition" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="Room Temp">Room Temp (15-25°C)</Select.Option>
                  <Select.Option value="Cold">Cold (2-8°C)</Select.Option>
                  <Select.Option value="Frozen">Frozen (-20°C)</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="status" label="Status">
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                  <Select.Option value="Discontinued">Discontinued</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="drugRegistrationNumber" label="Drug Registration Number">
                <Input />
              </Form.Item>
              <Form.Item name="regulatoryAuthority" label="Regulatory Authority">
                <Select allowClear>
                  <Select.Option value="DRAP">DRAP</Select.Option>
                  <Select.Option value="FDA">FDA</Select.Option>
                  <Select.Option value="EMA">EMA</Select.Option>
                  <Select.Option value="WHO">WHO</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="controlledDrug" label="Controlled Drug" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="prescriptionRequired" label="Prescription Required" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="importRestricted" label="Import Restricted" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="hazardClass" label="Hazard Class">
                <Input />
              </Form.Item>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="minStockLevel" label="Minimum Stock Level">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="maxStockLevel" label="Maximum Stock Level">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="reorderLevel" label="Reorder Level">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="reorderQuantity" label="Reorder Quantity">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="safetyStock" label="Safety Stock">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </div>
            <Text strong style={{ fontSize: 13, display: "block", marginBottom: 12, marginTop: 16 }}>Tracking Options</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <Form.Item name="batchTrackingRequired" label="Batch Tracking" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="expiryTrackingRequired" label="Expiry Tracking" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
              <Form.Item name="serialTracking" label="Serial Tracking" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              <Form.Item name="valuationMethod" label="Valuation Method" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="FIFO">FIFO (First In First Out)</Select.Option>
                  <Select.Option value="FEFO">FEFO (First Expiry First Out)</Select.Option>
                  <Select.Option value="Weighted Average">Weighted Average</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="taxCategory" label="Tax Category">
                <Select allowClear>
                  <Select.Option value="GST 0%">GST 0%</Select.Option>
                  <Select.Option value="GST 17%">GST 17%</Select.Option>
                  <Select.Option value="Exempt">Exempt</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="standardCost" label="Standard Cost (PKR)">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="purchaseCost" label="Purchase Cost (PKR)">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
              <Form.Item name="sellingPrice" label="Selling Price (PKR)">
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </div>
          </>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
          {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous</Button>}
          {currentStep < 3 && <Button type="primary" onClick={next} style={{ marginLeft: "auto" }}>Next</Button>}
          {currentStep === 3 && <Button type="primary" onClick={handleFinish} style={{ marginLeft: "auto" }}>Save Item</Button>}
        </div>
      </Form>
    </div>
  );
}
