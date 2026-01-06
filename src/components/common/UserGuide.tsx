"use client";

import React, { useState } from "react";
import { Button, Modal, Typography, Collapse, Tag, Divider, Table, Tooltip } from "antd";
import { QuestionCircleOutlined, BookOutlined, InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export interface GuideSection {
  title: string;
  content: string;
  tips?: string[];
}

export interface Abbreviation {
  term: string;
  fullForm: string;
  description?: string;
}

export interface UserGuideProps {
  moduleTitle: string;
  moduleDescription: string;
  sections: GuideSection[];
  abbreviations?: Abbreviation[];
  workflows?: { step: number; title: string; description: string }[];
}

export default function UserGuide({
  moduleTitle,
  moduleDescription,
  sections,
  abbreviations = [],
  workflows = [],
}: UserGuideProps) {
  const [open, setOpen] = useState(false);

  const abbreviationColumns = [
    { title: "Term", dataIndex: "term", key: "term", width: 100, render: (t: string) => <Tag color="blue">{t}</Tag> },
    { title: "Full Form", dataIndex: "fullForm", key: "fullForm", width: 200 },
    { title: "Description", dataIndex: "description", key: "description" },
  ];

  return (
    <>
      <Tooltip title="User Guide" placement="left">
        <Button
          type="default"
          icon={<QuestionCircleOutlined />}
          onClick={() => setOpen(true)}
          size="small"
          style={{ fontSize: 11 }}
        >
          Help
        </Button>
      </Tooltip>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOutlined style={{ color: "#00BFFF", fontSize: 20 }} />
            <span style={{ fontSize: 16 }}>{moduleTitle} - User Guide</span>
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
        styles={{ body: { maxHeight: "75vh", overflowY: "auto", padding: "16px 24px" } }}
      >
        {/* Module Overview */}
        <div style={{ background: "linear-gradient(135deg, #0d1117 0%, #1a2332 100%)", padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <Title level={5} style={{ color: "#00BFFF", margin: 0, fontSize: 14 }}>
            <InfoCircleOutlined /> Overview
          </Title>
          <Paragraph style={{ color: "#e2e8f0", margin: "8px 0 0", fontSize: 12 }}>
            {moduleDescription}
          </Paragraph>
        </div>

        {/* Workflow Steps */}
        {workflows.length > 0 && (
          <>
            <Title level={5} style={{ fontSize: 13, marginBottom: 12 }}>📋 Workflow Steps</Title>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {workflows.map((wf) => (
                <div key={wf.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ 
                    minWidth: 28, height: 28, borderRadius: "50%", 
                    background: "#00BFFF", color: "#fff", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 600
                  }}>
                    {wf.step}
                  </div>
                  <div>
                    <Text strong style={{ fontSize: 12 }}>{wf.title}</Text>
                    <Paragraph style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{wf.description}</Paragraph>
                  </div>
                </div>
              ))}
            </div>
            <Divider style={{ margin: "12px 0" }} />
          </>
        )}

        {/* Detailed Sections */}
        <Title level={5} style={{ fontSize: 13, marginBottom: 12 }}>📖 Detailed Guide</Title>
        <Collapse
          accordion
          size="small"
          items={sections.map((section, idx) => ({
            key: idx,
            label: <Text strong style={{ fontSize: 12 }}>{section.title}</Text>,
            children: (
              <div>
                <Paragraph style={{ fontSize: 11, marginBottom: section.tips?.length ? 12 : 0 }}>
                  {section.content}
                </Paragraph>
                {section.tips && section.tips.length > 0 && (
                  <div style={{ background: "#f0f9ff", padding: 10, borderRadius: 6, borderLeft: "3px solid #00BFFF" }}>
                    <Text strong style={{ fontSize: 11, color: "#00BFFF" }}>💡 Tips:</Text>
                    <ul style={{ margin: "4px 0 0", paddingLeft: 16 }}>
                      {section.tips.map((tip, i) => (
                        <li key={i} style={{ fontSize: 11, color: "#334155" }}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ),
          }))}
          style={{ marginBottom: 16 }}
        />

        {/* Abbreviations */}
        {abbreviations.length > 0 && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <Title level={5} style={{ fontSize: 13, marginBottom: 12 }}>📚 Abbreviations & Terms</Title>
            <Table
              columns={abbreviationColumns}
              dataSource={abbreviations.map((a, i) => ({ ...a, key: i }))}
              pagination={false}
              size="small"
              style={{ fontSize: 11 }}
            />
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 16, padding: 12, background: "#f8fafc", borderRadius: 6, textAlign: "center" }}>
          <Text style={{ fontSize: 10, color: "#94a3b8" }}>
            Need more help? Contact IT Support at support@valorpharma.com
          </Text>
        </div>
      </Modal>
    </>
  );
}
