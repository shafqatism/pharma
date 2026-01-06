"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Modal, Input, Typography, Empty } from "antd";
import type { InputRef } from "antd";
import { useRouter } from "next/navigation";
import {
  SearchOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  FileTextOutlined,
  ImportOutlined,
  InboxOutlined,
  DatabaseOutlined,
  SwapOutlined,
  ExperimentOutlined,
  MessageOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface SearchItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  category: string;
  keywords: string[];
}

const searchItems: SearchItem[] = [
  // Dashboard
  { key: "dashboard", label: "Dashboard", path: "/", icon: <DashboardOutlined />, category: "Main", keywords: ["home", "main", "overview"] },
  
  // HRM - Employee Management
  { key: "employees", label: "Employee Master", path: "/hrm/employees", icon: <UserOutlined />, category: "HRM", keywords: ["staff", "workers", "personnel"] },
  { key: "departments", label: "Departments", path: "/hrm/departments", icon: <TeamOutlined />, category: "HRM", keywords: ["division", "unit", "section"] },
  { key: "designations", label: "Designations", path: "/hrm/designations", icon: <UserOutlined />, category: "HRM", keywords: ["title", "position", "role"] },
  
  // HRM - Recruitment
  { key: "job-requisitions", label: "Job Requisitions", path: "/hrm/job-requisitions", icon: <SolutionOutlined />, category: "HRM", keywords: ["hiring", "vacancy", "opening"] },
  { key: "candidates", label: "Candidates", path: "/hrm/candidates", icon: <SolutionOutlined />, category: "HRM", keywords: ["applicants", "interviewees"] },
  { key: "onboarding", label: "Onboarding", path: "/hrm/onboarding", icon: <SolutionOutlined />, category: "HRM", keywords: ["induction", "orientation", "new hire"] },
  
  // HRM - Attendance & Leave
  { key: "shifts", label: "Shifts", path: "/hrm/shifts", icon: <CalendarOutlined />, category: "HRM", keywords: ["schedule", "timing", "roster"] },
  { key: "attendance", label: "Attendance", path: "/hrm/attendance", icon: <CalendarOutlined />, category: "HRM", keywords: ["presence", "check-in", "time"] },
  { key: "holidays", label: "Holidays", path: "/hrm/holidays", icon: <CalendarOutlined />, category: "HRM", keywords: ["vacation", "off days", "leave"] },
  { key: "leave-types", label: "Leave Types", path: "/hrm/leave-types", icon: <CalendarOutlined />, category: "HRM", keywords: ["absence", "time off"] },
  { key: "leave-requests", label: "Leave Requests", path: "/hrm/leave-requests", icon: <CalendarOutlined />, category: "HRM", keywords: ["absence", "time off", "application"] },
  
  // HRM - Payroll
  { key: "payroll-groups", label: "Payroll Structure", path: "/hrm/payroll-groups", icon: <DollarOutlined />, category: "HRM", keywords: ["salary", "wages", "compensation"] },
  { key: "payroll-processing", label: "Monthly Payroll", path: "/hrm/payroll-processing", icon: <DollarOutlined />, category: "HRM", keywords: ["salary", "wages", "payment"] },
  { key: "payslips", label: "Payslips", path: "/hrm/payslips", icon: <DollarOutlined />, category: "HRM", keywords: ["salary slip", "pay stub"] },
  
  // HRM - Performance
  { key: "performance-cycles", label: "Performance Cycles", path: "/hrm/performance-cycles", icon: <TrophyOutlined />, category: "HRM", keywords: ["appraisal", "review period"] },
  { key: "kpi-assignments", label: "KPI Assignments", path: "/hrm/kpi-assignments", icon: <TrophyOutlined />, category: "HRM", keywords: ["goals", "targets", "objectives"] },
  { key: "performance-reviews", label: "Performance Reviews", path: "/hrm/performance-reviews", icon: <TrophyOutlined />, category: "HRM", keywords: ["appraisal", "evaluation"] },
  
  // HRM - Training
  { key: "trainings", label: "Training Master", path: "/hrm/trainings", icon: <BookOutlined />, category: "HRM", keywords: ["courses", "learning", "development"] },
  { key: "training-assignments", label: "Training Assignments", path: "/hrm/training-assignments", icon: <BookOutlined />, category: "HRM", keywords: ["courses", "learning"] },
  { key: "compliance", label: "Compliance", path: "/hrm/compliance", icon: <BookOutlined />, category: "HRM", keywords: ["regulations", "rules", "policy"] },
  
  // HRM - Reports
  { key: "headcount", label: "Headcount Report", path: "/hrm/reports/headcount", icon: <BarChartOutlined />, category: "HRM", keywords: ["employee count", "staff report"] },
  
  // Procurement
  { key: "procurement-dashboard", label: "Procurement Dashboard", path: "/procurement", icon: <ShoppingCartOutlined />, category: "Procurement", keywords: ["purchasing", "buying"] },
  { key: "procurement-config", label: "Procurement Configuration", path: "/procurement/config", icon: <SettingOutlined />, category: "Procurement", keywords: ["settings", "setup"] },
  { key: "vendors", label: "Vendor Master", path: "/procurement/vendors", icon: <ShopOutlined />, category: "Procurement", keywords: ["suppliers", "sellers"] },
  { key: "vendor-evaluations", label: "Vendor Evaluations", path: "/procurement/vendor-evaluations", icon: <ShopOutlined />, category: "Procurement", keywords: ["supplier rating", "assessment"] },
  { key: "vendor-ledger", label: "Vendor Ledger", path: "/procurement/vendor-ledger", icon: <ShopOutlined />, category: "Procurement", keywords: ["supplier account", "balance"] },
  { key: "purchase-requisitions", label: "Purchase Requisitions", path: "/procurement/purchase-requisitions", icon: <FileTextOutlined />, category: "Procurement", keywords: ["PR", "request", "indent"] },
  { key: "purchase-orders", label: "Purchase Orders", path: "/procurement/purchase-orders", icon: <FileTextOutlined />, category: "Procurement", keywords: ["PO", "order", "buying"] },
  { key: "grn", label: "Goods Receipt (GRN)", path: "/procurement/grn", icon: <FileTextOutlined />, category: "Procurement", keywords: ["receiving", "inward", "delivery"] },
  { key: "invoices", label: "Supplier Invoices", path: "/procurement/invoices", icon: <DollarOutlined />, category: "Procurement", keywords: ["bills", "vendor invoice"] },
  { key: "payments", label: "Payments", path: "/procurement/payments", icon: <DollarOutlined />, category: "Procurement", keywords: ["pay", "disbursement"] },
  { key: "imports", label: "Import Purchases", path: "/procurement/imports", icon: <ImportOutlined />, category: "Procurement", keywords: ["international", "foreign"] },
  { key: "shipments", label: "Shipment Tracking", path: "/procurement/shipments", icon: <ImportOutlined />, category: "Procurement", keywords: ["delivery", "tracking", "logistics"] },
  { key: "procurement-reports", label: "Procurement Reports", path: "/procurement/reports", icon: <BarChartOutlined />, category: "Procurement", keywords: ["analytics", "statistics"] },
  
  // Inventory
  { key: "inventory-dashboard", label: "Inventory Dashboard", path: "/inventory", icon: <InboxOutlined />, category: "Inventory", keywords: ["stock", "warehouse"] },
  { key: "items", label: "Item Master", path: "/inventory/items", icon: <DatabaseOutlined />, category: "Inventory", keywords: ["products", "materials", "goods"] },
  { key: "batches", label: "Batch Tracking", path: "/inventory/batches", icon: <DatabaseOutlined />, category: "Inventory", keywords: ["lot", "serial", "tracking"] },
  { key: "warehouses", label: "Warehouses", path: "/inventory/warehouses", icon: <ShopOutlined />, category: "Inventory", keywords: ["storage", "godown", "depot"] },
  { key: "locations", label: "Locations", path: "/inventory/locations", icon: <ShopOutlined />, category: "Inventory", keywords: ["bins", "racks", "shelves"] },
  { key: "stock", label: "Stock on Hand", path: "/inventory/stock", icon: <SwapOutlined />, category: "Inventory", keywords: ["inventory", "available", "quantity"] },
  { key: "transfers", label: "Stock Transfers", path: "/inventory/transfers", icon: <SwapOutlined />, category: "Inventory", keywords: ["movement", "relocation"] },
  { key: "adjustments", label: "Stock Adjustments", path: "/inventory/adjustments", icon: <SwapOutlined />, category: "Inventory", keywords: ["correction", "reconciliation"] },
  { key: "expiry", label: "Expiry Management", path: "/inventory/expiry", icon: <CalendarOutlined />, category: "Inventory", keywords: ["shelf life", "expiration", "validity"] },
  { key: "cold-chain", label: "Cold Chain", path: "/inventory/cold-chain", icon: <ExperimentOutlined />, category: "Inventory", keywords: ["temperature", "refrigeration", "cooling"] },
  { key: "inventory-reports", label: "Inventory Reports", path: "/inventory/reports", icon: <BarChartOutlined />, category: "Inventory", keywords: ["analytics", "statistics"] },
  
  // Others
  { key: "messages", label: "Messages", path: "/chat", icon: <MessageOutlined />, category: "Communication", keywords: ["chat", "inbox", "conversation"] },
  { key: "settings", label: "Settings", path: "/settings", icon: <SettingOutlined />, category: "System", keywords: ["configuration", "preferences", "options"] },
];

interface SearchPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchPopup({ open, onClose }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<InputRef>(null);
  const router = useRouter();

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return searchItems;
    const query = searchQuery.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      handleNavigate(filteredItems[selectedIndex].path);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Main: "#00BFFF",
      HRM: "#722ed1",
      Procurement: "#fa8c16",
      Inventory: "#52c41a",
      Communication: "#eb2f96",
      System: "#8c8c8c",
    };
    return colors[category] || "#00BFFF";
  };

  let flatIndex = -1;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={560}
      centered
      styles={{
        body: { padding: 0 },
      }}
    >
      {/* Search Input */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
        <Input
          ref={inputRef}
          placeholder="Search pages, features..."
          prefix={<SearchOutlined style={{ color: "#00BFFF", fontSize: 16 }} />}
          suffix={
            <Text style={{ fontSize: 11, color: "#8c8c8c", background: "#e8e8e8", padding: "2px 6px", borderRadius: 4 }}>
              ESC
            </Text>
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ border: "none", background: "transparent", fontSize: 14, boxShadow: "none" }}
          size="large"
        />
      </div>

      {/* Results */}
      <div style={{ maxHeight: 400, overflowY: "auto", padding: "8px 0" }}>
        {filteredItems.length === 0 ? (
          <Empty description="No results found" style={{ padding: "40px 0" }} />
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <div style={{ padding: "8px 20px 4px", display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: getCategoryColor(category) }} />
                <Text style={{ fontSize: 11, fontWeight: 600, color: "#8c8c8c", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {category}
                </Text>
              </div>
              {items.map((item) => {
                flatIndex++;
                const isSelected = flatIndex === selectedIndex;
                const currentIndex = flatIndex;
                return (
                  <div
                    key={item.key}
                    onClick={() => handleNavigate(item.path)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 20px",
                      cursor: "pointer",
                      background: isSelected ? "rgba(0, 191, 255, 0.08)" : "transparent",
                      borderLeft: isSelected ? "3px solid #00BFFF" : "3px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSelected ? "#00BFFF" : "#f0f0f0",
                        color: isSelected ? "#fff" : "#666",
                        fontSize: 14,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", display: "block" }}>{item.label}</Text>
                      <Text style={{ fontSize: 11, color: "#8c8c8c" }}>{item.path}</Text>
                    </div>
                    {isSelected && <RightOutlined style={{ fontSize: 10, color: "#00BFFF" }} />}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 20px", borderTop: "1px solid #f0f0f0", background: "#fafafa", display: "flex", gap: 16 }}>
        <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
          <span style={{ background: "#e8e8e8", padding: "2px 6px", borderRadius: 4, marginRight: 4 }}>↑↓</span> Navigate
        </Text>
        <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
          <span style={{ background: "#e8e8e8", padding: "2px 6px", borderRadius: 4, marginRight: 4 }}>Enter</span> Open
        </Text>
        <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
          <span style={{ background: "#e8e8e8", padding: "2px 6px", borderRadius: 4, marginRight: 4 }}>Esc</span> Close
        </Text>
      </div>
    </Modal>
  );
}
