"use client";

import React from "react";
import { Card, Row, Col, Typography } from "antd";

const { Text } = Typography;

interface StatItem {
  key: string;
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  color?: string;
  suffix?: React.ReactNode;
}

interface StatsCardProps {
  stats: StatItem[];
  columns?: number;
}

const colorMap: Record<string, { gradient: string; shadow: string }> = {
  "#1890ff": { gradient: "linear-gradient(135deg, #00BFFF 0%, #0090C0 100%)", shadow: "rgba(0, 191, 255, 0.35)" },
  "#0000FF": { gradient: "linear-gradient(135deg, #00BFFF 0%, #0090C0 100%)", shadow: "rgba(0, 191, 255, 0.35)" },
  "#00BFFF": { gradient: "linear-gradient(135deg, #00BFFF 0%, #0090C0 100%)", shadow: "rgba(0, 191, 255, 0.35)" },
  "#6366f1": { gradient: "linear-gradient(135deg, #00BFFF 0%, #0090C0 100%)", shadow: "rgba(0, 191, 255, 0.35)" },
  "#52c41a": { gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", shadow: "rgba(34, 197, 94, 0.35)" },
  "#00875A": { gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", shadow: "rgba(34, 197, 94, 0.35)" },
  "#faad14": { gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", shadow: "rgba(245, 158, 11, 0.35)" },
  "#FF8B00": { gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", shadow: "rgba(245, 158, 11, 0.35)" },
  "#ff4d4f": { gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", shadow: "rgba(239, 68, 68, 0.35)" },
  "#DE350B": { gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", shadow: "rgba(239, 68, 68, 0.35)" },
  "#722ed1": { gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", shadow: "rgba(139, 92, 246, 0.35)" },
};

export default function StatsCard({ stats, columns = 4 }: StatsCardProps) {
  const colSpan = 24 / columns;

  const getColors = (color?: string) => {
    if (color && colorMap[color]) {
      return colorMap[color];
    }
    return { gradient: "linear-gradient(135deg, #00BFFF 0%, #0090C0 100%)", shadow: "rgba(0, 191, 255, 0.35)" };
  };

  return (
    <Row gutter={[12, 12]}>
      {stats.map((stat) => {
        const colors = getColors(stat.color);
        return (
          <Col key={stat.key} xs={24} sm={12} lg={colSpan}>
            <Card
              className="stat-card"
              style={{ borderRadius: 10 }}
              styles={{ body: { padding: 16 } }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#64748b",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {stat.title}
                  </Text>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#1e293b",
                      letterSpacing: "-0.5px",
                      lineHeight: 1.2,
                    }}
                  >
                    {stat.value}
                  </div>
                  {stat.suffix && <div style={{ marginTop: 6 }}>{stat.suffix}</div>}
                </div>
                {stat.prefix && (
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      background: colors.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: 18,
                      boxShadow: `0 4px 12px ${colors.shadow}`,
                    }}
                  >
                    {stat.prefix}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
