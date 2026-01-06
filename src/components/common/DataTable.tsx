"use client";

import React, { useMemo, useRef, useCallback } from "react";
import { Table, Input, Button, Space, Dropdown, Tooltip } from "antd";
import type { TableColumnType, InputRef } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import {
  SearchOutlined,
  DownloadOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { exportToCSV, exportToExcel, exportToPDF } from "@/utils/exportUtils";

interface DataTableProps<T extends object> {
  columns: TableColumnType<T>[];
  dataSource: T[];
  rowKey: string;
  loading?: boolean;
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  exportFileName?: string;
  showExport?: boolean;
  title?: string;
}

export default function DataTable<T extends object>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  onView,
  onEdit,
  onDelete,
  exportFileName = "export",
  showExport = true,
  title,
}: DataTableProps<T>) {
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


  const enhancedColumns = useMemo(() => {
    const cols = columns.map((col) => {
      if (col.dataIndex && typeof col.dataIndex === "string") {
        return {
          ...col,
          ...getColumnSearchProps(col.dataIndex),
        };
      }
      return col;
    });

    if (onView || onEdit || onDelete) {
      cols.push({
        title: "Actions",
        key: "actions",
        width: 100,
        fixed: "right" as const,
        render: (_: unknown, record: T) => (
          <Space size={4}>
            {onView && (
              <Tooltip title="View" placement="top">
                <Button
                  type="text"
                  size="small"
                  icon={<EyeOutlined style={{ fontSize: 13 }} />}
                  onClick={() => onView(record)}
                  style={{ 
                    color: "#00BFFF", 
                    padding: "2px 6px",
                    height: 24,
                    borderRadius: 4,
                  }}
                />
              </Tooltip>
            )}
            {onEdit && (
              <Tooltip title="Edit" placement="top">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined style={{ fontSize: 13 }} />}
                  onClick={() => onEdit(record)}
                  style={{ 
                    color: "#f59e0b", 
                    padding: "2px 6px",
                    height: 24,
                    borderRadius: 4,
                  }}
                />
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete" placement="top">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined style={{ fontSize: 13 }} />}
                  onClick={() => onDelete(record)}
                  style={{ 
                    padding: "2px 6px",
                    height: 24,
                    borderRadius: 4,
                  }}
                />
              </Tooltip>
            )}
          </Space>
        ),
      });
    }

    return cols;
  }, [columns, onView, onEdit, onDelete, getColumnSearchProps]);

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
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title || "Data Export"}</title>
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
              <h2>${title || "Data Export"} - Generated: ${new Date().toLocaleDateString()}</h2>
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
  };

  const exportMenuItems = [
    { key: "csv", label: "Export CSV", icon: <FileExcelOutlined style={{ fontSize: 12 }} /> },
    { key: "excel", label: "Export Excel", icon: <FileExcelOutlined style={{ fontSize: 12 }} /> },
    { key: "pdf", label: "Export PDF", icon: <FilePdfOutlined style={{ fontSize: 12 }} /> },
    { type: "divider" as const },
    { key: "print", label: "Print", icon: <PrinterOutlined style={{ fontSize: 12 }} /> },
  ];

  return (
    <div>
      {showExport && (
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
            <Button 
              icon={<DownloadOutlined style={{ fontSize: 12 }} />} 
              size="small"
              style={{ fontSize: 11 }}
            >
              Export / Print
            </Button>
          </Dropdown>
        </div>
      )}
      <Table
        columns={enhancedColumns}
        dataSource={dataSource}
        rowKey={rowKey}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => (
            <span style={{ fontSize: 11, color: "#64748b" }}>
              {range[0]}-{range[1]} of {total}
            </span>
          ),
          pageSizeOptions: ["10", "20", "50", "100"],
          defaultPageSize: 10,
          size: "small",
        }}
        scroll={{ x: "max-content" }}
        size="small"
        style={{
          borderRadius: 8,
          overflow: "hidden",
        }}
      />
    </div>
  );
}
