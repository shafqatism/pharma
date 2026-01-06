"use client";

import React, { useRef, useCallback, useMemo } from "react";
import { Table, Input, Button, Space, Dropdown, Typography } from "antd";
import type { TableColumnType, InputRef, TableProps } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  SearchOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/exportUtils";

const { Text } = Typography;

interface ReportTableProps<T extends object> {
  columns: TableColumnType<T>[];
  dataSource: T[];
  rowKey: string;
  loading?: boolean;
  exportFileName?: string;
  title?: string;
  pagination?: TableProps<T>["pagination"];
  scroll?: TableProps<T>["scroll"];
  summary?: TableProps<T>["summary"];
}

export default function ReportTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  exportFileName = "report",
  title = "Report",
  pagination = { pageSize: 10, showSizeChanger: true, showTotal: (total, range) => <Text style={{ fontSize: 11, color: "#64748b" }}>{range[0]}-{range[1]} of {total}</Text> },
  scroll,
  summary,
}: ReportTableProps<T>) {
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"]
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = useCallback((dataIndex: string): TableColumnType<T> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: "block", fontSize: 11 }}
          size="small"
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 70, fontSize: 11 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 60, fontSize: 11 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#00BFFF" : "#94a3b8", fontSize: 11 }} />
    ),
    onFilter: (value, record) => {
      const recordValue = (record as Record<string, unknown>)[dataIndex];
      return recordValue
        ? String(recordValue).toLowerCase().includes(String(value).toLowerCase())
        : false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.focus(), 100);
      }
    },
  }), []);

  // Add search to all columns with dataIndex
  const enhancedColumns = useMemo(() => columns.map((col) => {
    if (col.dataIndex && typeof col.dataIndex === "string") {
      return {
        ...col,
        ...getColumnSearchProps(col.dataIndex),
      };
    }
    return col;
  }), [columns, getColumnSearchProps]);

  const handleExport = (type: "csv" | "excel" | "pdf") => {
    const exportData = dataSource.map((item) => {
      const row: Record<string, unknown> = {};
      columns.forEach((col) => {
        if (col.dataIndex && typeof col.dataIndex === "string") {
          row[col.title as string] = (item as Record<string, unknown>)[col.dataIndex];
        }
      });
      return row;
    });

    const pdfColumns = columns
      .filter((col) => col.dataIndex && typeof col.dataIndex === "string")
      .map((col) => ({
        header: col.title as string,
        dataKey: col.title as string,
      }));

    switch (type) {
      case "csv":
        exportToCSV(exportData, exportFileName);
        break;
      case "excel":
        exportToExcel(exportData, exportFileName);
        break;
      case "pdf":
        exportToPDF(exportData, pdfColumns, exportFileName, title);
        break;
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("report-table-print");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #00BFFF; font-size: 18px; margin-bottom: 5px; }
                h2 { color: #333; font-size: 14px; margin-bottom: 20px; font-weight: normal; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; }
                th { background: #00BFFF; color: white; padding: 8px; text-align: left; }
                td { padding: 6px 8px; border-bottom: 1px solid #eee; }
                tr:nth-child(even) { background: #f9f9f9; }
                .header { border-bottom: 2px solid #00BFFF; padding-bottom: 10px; margin-bottom: 20px; }
                .footer { margin-top: 20px; font-size: 10px; color: #666; text-align: center; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>VALOR PHARMACEUTICALS</h1>
                <h2>${title} - Generated: ${new Date().toLocaleDateString()}</h2>
              </div>
              <table>
                <thead>
                  <tr>
                    ${columns.filter(c => c.dataIndex).map(c => `<th>${c.title}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${dataSource.map(item => `
                    <tr>
                      ${columns.filter(c => c.dataIndex).map(c => {
                        const value = (item as Record<string, unknown>)[c.dataIndex as string];
                        return `<td>${value ?? ""}</td>`;
                      }).join("")}
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <div class="footer">
                Confidential - For Internal Use Only | www.valorpharma.com
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const exportMenuItems = [
    { key: "csv", label: "Export CSV", icon: <FileExcelOutlined style={{ fontSize: 12 }} /> },
    { key: "excel", label: "Export Excel", icon: <FileExcelOutlined style={{ fontSize: 12 }} /> },
    { key: "pdf", label: "Export PDF", icon: <FilePdfOutlined style={{ fontSize: 12 }} /> },
    { type: "divider" as const },
    { key: "print", label: "Print Report", icon: <PrinterOutlined style={{ fontSize: 12 }} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
        <Dropdown
          menu={{
            items: exportMenuItems,
            onClick: ({ key }) => {
              if (key === "print") {
                handlePrint();
              } else {
                handleExport(key as "csv" | "excel" | "pdf");
              }
            },
          }}
        >
          <Button icon={<DownloadOutlined style={{ fontSize: 12 }} />} size="small" style={{ fontSize: 11 }}>
            Export / Print
          </Button>
        </Dropdown>
      </div>
      <div id="report-table-print">
        <Table
          columns={enhancedColumns}
          dataSource={dataSource}
          rowKey={rowKey}
          loading={loading}
          pagination={pagination}
          scroll={scroll || { x: "max-content" }}
          size="small"
          style={{ borderRadius: 8, overflow: "hidden" }}
          summary={summary}
        />
      </div>
    </div>
  );
}
