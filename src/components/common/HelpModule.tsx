"use client";

import { useState } from "react";
import { Dropdown, Modal, Typography, Collapse, Tag, Divider, Steps } from "antd";
import type { MenuProps } from "antd";
import {
  QuestionCircleOutlined,
  TeamOutlined,
  InboxOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
  BookOutlined,
  ShopOutlined,
  DatabaseOutlined,
  SwapOutlined,
  ExperimentOutlined,
  BulbOutlined,
  OrderedListOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  employeesGuide,
  departmentsGuide,
  attendanceGuide,
  leaveRequestsGuide,
  payrollGuide,
  performanceGuide,
  trainingGuide,
  inventoryItemsGuide,
  batchesGuide,
  warehousesGuide,
  stockTransfersGuide,
  coldChainGuide,
  expiryManagementGuide,
} from "@/data/guideData";
import type { UserGuideProps } from "@/components/common/UserGuide";

const { Text, Title, Paragraph } = Typography;

interface HelpCategory {
  key: string;
  label: string;
  icon: React.ReactNode;
  children: HelpItem[];
}

interface HelpItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  guide: UserGuideProps;
}

const helpCategories: HelpCategory[] = [
  {
    key: "hrm",
    label: "Human Resources",
    icon: <TeamOutlined />,
    children: [
      { key: "employees", label: "Employee Management", icon: <UserOutlined />, guide: employeesGuide },
      { key: "departments", label: "Departments", icon: <TeamOutlined />, guide: departmentsGuide },
      { key: "attendance", label: "Attendance", icon: <CalendarOutlined />, guide: attendanceGuide },
      { key: "leave", label: "Leave Management", icon: <CalendarOutlined />, guide: leaveRequestsGuide },
      { key: "payroll", label: "Payroll", icon: <DollarOutlined />, guide: payrollGuide },
      { key: "performance", label: "Performance", icon: <TrophyOutlined />, guide: performanceGuide },
      { key: "training", label: "Training", icon: <BookOutlined />, guide: trainingGuide },
    ],
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: <InboxOutlined />,
    children: [
      { key: "items", label: "Item Master", icon: <DatabaseOutlined />, guide: inventoryItemsGuide },
      { key: "batches", label: "Batch Management", icon: <DatabaseOutlined />, guide: batchesGuide },
      { key: "warehouses", label: "Warehouses", icon: <ShopOutlined />, guide: warehousesGuide },
      { key: "transfers", label: "Stock Transfers", icon: <SwapOutlined />, guide: stockTransfersGuide },
      { key: "coldchain", label: "Cold Chain", icon: <ExperimentOutlined />, guide: coldChainGuide },
      { key: "expiry", label: "Expiry Management", icon: <CalendarOutlined />, guide: expiryManagementGuide },
    ],
  },
];

export default function HelpModule() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<UserGuideProps | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleSelectGuide = (item: HelpItem) => {
    setSelectedGuide(item.guide);
    setSelectedTitle(item.label);
    setModalOpen(true);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "header",
      type: "group",
      label: (
        <div style={{ padding: "4px 0" }}>
          <Text strong style={{ fontSize: 13, color: "#1e293b" }}>Help & Documentation</Text>
        </div>
      ),
    },
    { type: "divider" },
    ...helpCategories.map((category) => ({
      key: category.key,
      icon: category.icon,
      label: category.label,
      children: category.children.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => handleSelectGuide(item),
      })),
    })),
    { type: "divider" },
    {
      key: "shortcuts",
      icon: <InfoCircleOutlined />,
      label: "Keyboard Shortcuts",
      onClick: () => {
        setSelectedGuide({
          moduleTitle: "Keyboard Shortcuts",
          moduleDescription: "Quick keyboard shortcuts to navigate and use the application efficiently.",
          workflows: [
            { step: 1, title: "Ctrl/Cmd + K", description: "Open global search to quickly find any page or feature." },
            { step: 2, title: "Escape", description: "Close any open modal or popup." },
            { step: 3, title: "Arrow Keys", description: "Navigate through search results or menu items." },
            { step: 4, title: "Enter", description: "Select the highlighted item in search or menu." },
          ],
          sections: [],
          abbreviations: [],
        });
        setSelectedTitle("Keyboard Shortcuts");
        setModalOpen(true);
      },
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
        <div
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
          <QuestionCircleOutlined style={{ fontSize: 14, color: "#64748b" }} />
        </div>
      </Dropdown>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg, #00BFFF 0%, #0080FF 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOutlined style={{ color: "#fff", fontSize: 16 }} />
            </div>
            <div>
              <Text strong style={{ fontSize: 16, display: "block" }}>{selectedTitle}</Text>
              <Text style={{ fontSize: 12, color: "#8c8c8c" }}>Help Guide</Text>
            </div>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={700}
        styles={{ body: { maxHeight: "70vh", overflowY: "auto", padding: "16px 24px" } }}
      >
        {selectedGuide && (
          <div>
            {/* Module Description */}
            <div style={{ background: "#f0f9ff", padding: 16, borderRadius: 8, marginBottom: 20, border: "1px solid #bae6fd" }}>
              <Paragraph style={{ margin: 0, color: "#0369a1" }}>{selectedGuide.moduleDescription}</Paragraph>
            </div>

            {/* Workflows */}
            {selectedGuide.workflows && selectedGuide.workflows.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <OrderedListOutlined style={{ color: "#00BFFF" }} />
                  <Title level={5} style={{ margin: 0 }}>Workflow Steps</Title>
                </div>
                <Steps
                  direction="vertical"
                  size="small"
                  current={-1}
                  items={selectedGuide.workflows.map((w) => ({
                    title: <Text strong>{w.title}</Text>,
                    description: <Text style={{ color: "#666" }}>{w.description}</Text>,
                  }))}
                  style={{ paddingLeft: 8 }}
                />
              </div>
            )}

            {/* Sections */}
            {selectedGuide.sections && selectedGuide.sections.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <InfoCircleOutlined style={{ color: "#00BFFF" }} />
                  <Title level={5} style={{ margin: 0 }}>Detailed Information</Title>
                </div>
                <Collapse
                  bordered={false}
                  style={{ background: "#fafafa" }}
                  items={selectedGuide.sections.map((section, idx) => ({
                    key: idx,
                    label: <Text strong>{section.title}</Text>,
                    children: (
                      <div>
                        <Paragraph>{section.content}</Paragraph>
                        {section.tips && section.tips.length > 0 && (
                          <div style={{ background: "#fffbeb", padding: 12, borderRadius: 6, border: "1px solid #fde68a" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                              <BulbOutlined style={{ color: "#d97706" }} />
                              <Text strong style={{ color: "#92400e", fontSize: 12 }}>Tips</Text>
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                              {section.tips.map((tip, i) => (
                                <li key={i} style={{ color: "#78350f", fontSize: 12, marginBottom: 4 }}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ),
                  }))}
                />
              </div>
            )}

            {/* Abbreviations */}
            {selectedGuide.abbreviations && selectedGuide.abbreviations.length > 0 && (
              <div>
                <Divider style={{ margin: "16px 0" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <InfoCircleOutlined style={{ color: "#00BFFF" }} />
                  <Title level={5} style={{ margin: 0 }}>Abbreviations & Terms</Title>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {selectedGuide.abbreviations.map((abbr, idx) => (
                    <Tag
                      key={idx}
                      style={{ padding: "4px 8px", borderRadius: 6, cursor: "help" }}
                      title={`${abbr.fullForm}: ${abbr.description}`}
                    >
                      <Text strong style={{ color: "#00BFFF" }}>{abbr.term}</Text>
                      <Text style={{ color: "#666", marginLeft: 4 }}>- {abbr.fullForm}</Text>
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
