"use client";

import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography } from "antd";
import type { MenuProps } from "antd";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  BellOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  TeamOutlined,
  SolutionOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
  SearchOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  FileTextOutlined,
  ImportOutlined,
  InboxOutlined,
  DatabaseOutlined,
  SwapOutlined,
  ExperimentOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import ChatModule from "@/components/common/ChatModule";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import SearchPopup from "@/components/common/SearchPopup";
import HelpModule from "@/components/common/HelpModule";
import { useLanguageStore } from "@/store/languageStore";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  { key: "/", icon: <DashboardOutlined style={{ fontSize: 14 }} />, label: <Link href="/">Dashboard</Link> },
  {
    key: "hrm",
    icon: <TeamOutlined style={{ fontSize: 14 }} />,
    label: "HRM",
    children: [
      {
        key: "employee-management",
        icon: <UserOutlined style={{ fontSize: 13 }} />,
        label: "Employee Management",
        children: [
          { key: "/hrm/employees", label: <Link href="/hrm/employees">Employee Master</Link> },
          { key: "/hrm/departments", label: <Link href="/hrm/departments">Departments</Link> },
          { key: "/hrm/designations", label: <Link href="/hrm/designations">Designations</Link> },
        ],
      },
      {
        key: "recruitment",
        icon: <SolutionOutlined style={{ fontSize: 13 }} />,
        label: "Recruitment",
        children: [
          { key: "/hrm/job-requisitions", label: <Link href="/hrm/job-requisitions">Job Requisitions</Link> },
          { key: "/hrm/candidates", label: <Link href="/hrm/candidates">Candidates</Link> },
          { key: "/hrm/onboarding", label: <Link href="/hrm/onboarding">Onboarding</Link> },
        ],
      },
      {
        key: "attendance-leave",
        icon: <CalendarOutlined style={{ fontSize: 13 }} />,
        label: "Attendance & Leave",
        children: [
          { key: "/hrm/shifts", label: <Link href="/hrm/shifts">Shifts</Link> },
          { key: "/hrm/attendance", label: <Link href="/hrm/attendance">Attendance</Link> },
          { key: "/hrm/holidays", label: <Link href="/hrm/holidays">Holidays</Link> },
          { key: "/hrm/leave-types", label: <Link href="/hrm/leave-types">Leave Types</Link> },
          { key: "/hrm/leave-requests", label: <Link href="/hrm/leave-requests">Leave Requests</Link> },
        ],
      },
      {
        key: "payroll",
        icon: <DollarOutlined style={{ fontSize: 13 }} />,
        label: "Payroll",
        children: [
          { key: "/hrm/payroll-groups", label: <Link href="/hrm/payroll-groups">Payroll Structure</Link> },
          { key: "/hrm/payroll-processing", label: <Link href="/hrm/payroll-processing">Monthly Payroll</Link> },
          { key: "/hrm/payslips", label: <Link href="/hrm/payslips">Payslips</Link> },
        ],
      },
      {
        key: "performance",
        icon: <TrophyOutlined style={{ fontSize: 13 }} />,
        label: "Performance",
        children: [
          { key: "/hrm/performance-cycles", label: <Link href="/hrm/performance-cycles">Cycles</Link> },
          { key: "/hrm/kpi-assignments", label: <Link href="/hrm/kpi-assignments">KPI Assignments</Link> },
          { key: "/hrm/performance-reviews", label: <Link href="/hrm/performance-reviews">Reviews</Link> },
        ],
      },
      {
        key: "training",
        icon: <BookOutlined style={{ fontSize: 13 }} />,
        label: "Training",
        children: [
          { key: "/hrm/trainings", label: <Link href="/hrm/trainings">Training Master</Link> },
          { key: "/hrm/training-assignments", label: <Link href="/hrm/training-assignments">Assignments</Link> },
          { key: "/hrm/compliance", label: <Link href="/hrm/compliance">Compliance</Link> },
        ],
      },
      {
        key: "hr-reports",
        icon: <BarChartOutlined style={{ fontSize: 13 }} />,
        label: "Reports",
        children: [
          { key: "/hrm/reports/headcount", label: <Link href="/hrm/reports/headcount">Headcount</Link> },
        ],
      },
    ],
  },
  {
    key: "procurement",
    icon: <ShoppingCartOutlined style={{ fontSize: 14 }} />,
    label: "Procurement",
    children: [
      { key: "/procurement", icon: <DashboardOutlined style={{ fontSize: 13 }} />, label: <Link href="/procurement">Dashboard</Link> },
      { key: "/procurement/config", icon: <SettingOutlined style={{ fontSize: 13 }} />, label: <Link href="/procurement/config">Configuration</Link> },
      {
        key: "vendor-mgmt",
        icon: <ShopOutlined style={{ fontSize: 13 }} />,
        label: "Vendor Management",
        children: [
          { key: "/procurement/vendors", label: <Link href="/procurement/vendors">Vendor Master</Link> },
          { key: "/procurement/vendor-evaluations", label: <Link href="/procurement/vendor-evaluations">Evaluations</Link> },
          { key: "/procurement/vendor-ledger", label: <Link href="/procurement/vendor-ledger">Vendor Ledger</Link> },
        ],
      },
      {
        key: "purchasing",
        icon: <FileTextOutlined style={{ fontSize: 13 }} />,
        label: "Purchasing",
        children: [
          { key: "/procurement/purchase-requisitions", label: <Link href="/procurement/purchase-requisitions">Requisitions (PR)</Link> },
          { key: "/procurement/purchase-orders", label: <Link href="/procurement/purchase-orders">Orders (PO)</Link> },
          { key: "/procurement/grn", label: <Link href="/procurement/grn">Goods Receipt (GRN)</Link> },
        ],
      },
      {
        key: "supplier-payments",
        icon: <DollarOutlined style={{ fontSize: 13 }} />,
        label: "Payments",
        children: [
          { key: "/procurement/invoices", label: <Link href="/procurement/invoices">Supplier Invoices</Link> },
          { key: "/procurement/payments", label: <Link href="/procurement/payments">Payments</Link> },
        ],
      },
      {
        key: "import-export",
        icon: <ImportOutlined style={{ fontSize: 13 }} />,
        label: "Import/Export",
        children: [
          { key: "/procurement/imports", label: <Link href="/procurement/imports">Import Purchases</Link> },
          { key: "/procurement/shipments", label: <Link href="/procurement/shipments">Shipment Tracking</Link> },
        ],
      },
      { key: "/procurement/reports", icon: <BarChartOutlined style={{ fontSize: 13 }} />, label: <Link href="/procurement/reports">Reports</Link> },
    ],
  },
  {
    key: "inventory",
    icon: <InboxOutlined style={{ fontSize: 14 }} />,
    label: "Inventory",
    children: [
      { key: "/inventory", icon: <DashboardOutlined style={{ fontSize: 13 }} />, label: <Link href="/inventory">Dashboard</Link> },
      {
        key: "item-master",
        icon: <DatabaseOutlined style={{ fontSize: 13 }} />,
        label: "Item Management",
        children: [
          { key: "/inventory/items", label: <Link href="/inventory/items">Item Master</Link> },
          { key: "/inventory/batches", label: <Link href="/inventory/batches">Batch Tracking</Link> },
        ],
      },
      {
        key: "warehouse-mgmt",
        icon: <ShopOutlined style={{ fontSize: 13 }} />,
        label: "Warehouse",
        children: [
          { key: "/inventory/warehouses", label: <Link href="/inventory/warehouses">Warehouses</Link> },
          { key: "/inventory/locations", label: <Link href="/inventory/locations">Locations</Link> },
        ],
      },
      {
        key: "stock-mgmt",
        icon: <SwapOutlined style={{ fontSize: 13 }} />,
        label: "Stock Management",
        children: [
          { key: "/inventory/stock", label: <Link href="/inventory/stock">Stock on Hand</Link> },
          { key: "/inventory/transfers", label: <Link href="/inventory/transfers">Stock Transfers</Link> },
          { key: "/inventory/adjustments", label: <Link href="/inventory/adjustments">Adjustments</Link> },
        ],
      },
      { key: "/inventory/expiry", icon: <CalendarOutlined style={{ fontSize: 13 }} />, label: <Link href="/inventory/expiry">Expiry Management</Link> },
      { key: "/inventory/cold-chain", icon: <ExperimentOutlined style={{ fontSize: 13 }} />, label: <Link href="/inventory/cold-chain">Cold Chain</Link> },
      { key: "/inventory/reports", icon: <BarChartOutlined style={{ fontSize: 13 }} />, label: <Link href="/inventory/reports">Reports</Link> },
    ],
  },
  { key: "/chat", icon: <MessageOutlined style={{ fontSize: 14 }} />, label: <Link href="/chat">Messages</Link> },
  { key: "/settings", icon: <SettingOutlined style={{ fontSize: 14 }} />, label: <Link href="/settings">Settings</Link> },
];

const userMenuItems: MenuProps["items"] = [
  { key: "profile", icon: <UserOutlined />, label: "Profile" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  { type: "divider" },
  { key: "logout", icon: <LogoutOutlined />, label: "Sign Out", danger: true },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}


export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { getDirection } = useLanguageStore();
  const dir = getDirection();

  // Keyboard shortcut for search (Ctrl+K / Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getSelectedKeys = () => [pathname];

  const getOpenKeys = () => {
    if (pathname.startsWith("/hrm")) {
      const keys = ["hrm"];
      if (pathname.includes("employees") || pathname.includes("departments") || pathname.includes("designations")) keys.push("employee-management");
      else if (pathname.includes("job-requisitions") || pathname.includes("candidates") || pathname.includes("onboarding")) keys.push("recruitment");
      else if (pathname.includes("shifts") || pathname.includes("attendance") || pathname.includes("holidays") || pathname.includes("leave")) keys.push("attendance-leave");
      else if (pathname.includes("payroll") || pathname.includes("payslips")) keys.push("payroll");
      else if (pathname.includes("performance") || pathname.includes("kpi")) keys.push("performance");
      else if (pathname.includes("training") || pathname.includes("compliance")) keys.push("training");
      else if (pathname.includes("reports")) keys.push("hr-reports");
      return keys;
    }
    if (pathname.startsWith("/procurement")) {
      const keys = ["procurement"];
      if (pathname.includes("vendors") || pathname.includes("vendor-evaluations") || pathname.includes("vendor-ledger")) keys.push("vendor-mgmt");
      else if (pathname.includes("purchase-requisitions") || pathname.includes("purchase-orders") || pathname.includes("grn")) keys.push("purchasing");
      else if (pathname.includes("invoices") || pathname.includes("payments")) keys.push("supplier-payments");
      else if (pathname.includes("imports") || pathname.includes("shipments")) keys.push("import-export");
      return keys;
    }
    if (pathname.startsWith("/inventory")) {
      const keys = ["inventory"];
      if (pathname.includes("items") || pathname.includes("batches")) keys.push("item-master");
      else if (pathname.includes("warehouses") || pathname.includes("locations")) keys.push("warehouse-mgmt");
      else if (pathname.includes("stock") || pathname.includes("transfers") || pathname.includes("adjustments")) keys.push("stock-mgmt");
      return keys;
    }
    return [];
  };

  return (
    <Layout style={{ minHeight: "100vh", direction: dir }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={64}
        style={{
          overflow: "hidden",
          height: "100vh",
          position: "fixed",
          left: dir === "rtl" ? "auto" : 0,
          right: dir === "rtl" ? 0 : "auto",
          top: 0,
          bottom: 0,
          background: "linear-gradient(180deg, #0d1117 0%, #0a0e14 50%, #060810 100%)",
          borderRight: dir === "rtl" ? "none" : "1px solid rgba(0, 191, 255, 0.1)",
          borderLeft: dir === "rtl" ? "1px solid rgba(0, 191, 255, 0.1)" : "none",
        }}
      >
        {/* Decorative Gradients */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150, background: "radial-gradient(ellipse at top left, rgba(0, 191, 255, 0.08) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 150, height: 150, background: "radial-gradient(ellipse at bottom right, rgba(0, 191, 255, 0.05) 0%, transparent 50%)", pointerEvents: "none" }} />

        {/* Logo Section */}
        <div
          style={{
            height: collapsed ? 56 : 80,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "0" : "12px 16px",
            borderBottom: "1px solid rgba(0, 191, 255, 0.1)",
            position: "relative",
            zIndex: 1,
            background: "rgba(0, 191, 255, 0.02)",
          }}
        >
          {collapsed ? (
            <Image src="/logo-small.svg" alt="Valor" width={36} height={36} style={{ objectFit: "contain" }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image src="/logo-small.svg" alt="Valor" width={40} height={40} style={{ objectFit: "contain" }} />
              <div>
                <Text style={{ color: "#00BFFF", fontSize: 16, fontWeight: 800, display: "block", lineHeight: 1.1, fontStyle: "italic", letterSpacing: 1 }}>VALOR</Text>
                <Text style={{ color: "rgba(0, 191, 255, 0.7)", fontSize: 8, textTransform: "uppercase", letterSpacing: 1.5, display: "block" }}>PHARMACEUTICALS</Text>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <div style={{ height: "calc(100vh - 140px)", overflowY: "auto", overflowX: "hidden", position: "relative", zIndex: 1, padding: "8px 6px" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={getSelectedKeys()}
            defaultOpenKeys={getOpenKeys()}
            items={menuItems}
            style={{ background: "transparent", borderRight: 0, fontSize: 12 }}
          />
        </div>

        {/* User Section */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: collapsed ? "10px 6px" : "10px 12px",
            borderTop: "1px solid rgba(0, 191, 255, 0.1)",
            background: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          }}
        >
          {!collapsed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, background: "rgba(0, 191, 255, 0.05)", border: "1px solid rgba(0, 191, 255, 0.1)", cursor: "pointer" }}>
              <Avatar size={28} style={{ background: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)", fontSize: 11 }}>SA</Avatar>
              <div style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontSize: 11, fontWeight: 600, display: "block" }}>Sara Ahmed</Text>
                <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 10 }}>HR Manager</Text>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Avatar size={28} style={{ background: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)", cursor: "pointer", fontSize: 10 }}>SA</Avatar>
            </div>
          )}
        </div>
      </Sider>


      {/* Main Layout */}
      <Layout style={{ marginLeft: dir === "rtl" ? 0 : (collapsed ? 64 : 240), marginRight: dir === "rtl" ? (collapsed ? 64 : 240) : 0, transition: "all 0.2s ease" }}>
        {/* Header */}
        <Header
          style={{
            padding: "0 20px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            height: 52,
            borderBottom: "1px solid #eef0f2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              {collapsed ? <MenuUnfoldOutlined style={{ fontSize: 14, color: "#64748b" }} /> : <MenuFoldOutlined style={{ fontSize: 14, color: "#64748b" }} />}
            </div>
            <div
              onClick={() => setSearchOpen(true)}
              style={{
                width: 220,
                height: 32,
                borderRadius: 6,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                padding: "0 10px",
                cursor: "pointer",
                gap: 8,
              }}
            >
              <SearchOutlined style={{ color: "#94a3b8", fontSize: 12 }} />
              <Text style={{ color: "#94a3b8", fontSize: 12, flex: 1 }}>Search...</Text>
              <Text style={{ fontSize: 10, color: "#94a3b8", background: "#e2e8f0", padding: "2px 6px", borderRadius: 4 }}>⌘K</Text>
            </div>
          </div>

          <Space size={8}>
            <LanguageSwitcher />
            <div style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)" }}>
              <ChatModule />
            </div>
            <div style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <Badge count={3} size="small" offset={[-2, 2]} color="#00BFFF">
                <BellOutlined style={{ fontSize: 14, color: "#64748b" }} />
              </Badge>
            </div>
            <HelpModule />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "4px 10px 4px 4px", borderRadius: 6, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <Avatar size={26} style={{ background: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)", fontSize: 10 }}>SA</Avatar>
                <div style={{ lineHeight: 1.2 }}>
                  <Text style={{ fontSize: 11, fontWeight: 600, display: "block", color: "#1e293b" }}>Sara Ahmed</Text>
                  <Text style={{ fontSize: 10, color: "#64748b" }}>Admin</Text>
                </div>
              </div>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 16,
            padding: 20,
            background: "#ffffff",
            borderRadius: 10,
            minHeight: 280,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            border: "1px solid #eef0f2",
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Search Popup */}
      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Layout>
  );
}
