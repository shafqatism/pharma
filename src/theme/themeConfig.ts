import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    // Primary Colors - Valor Pharmaceuticals Brand (Deep Sky Blue)
    colorPrimary: "#00BFFF",
    colorPrimaryHover: "#00A8E0",
    colorPrimaryActive: "#0090C0",
    colorPrimaryBg: "#E6F9FF",
    colorPrimaryBgHover: "#CCF3FF",
    colorPrimaryBorder: "#66D9FF",
    colorPrimaryBorderHover: "#33CCFF",
    colorPrimaryText: "#00BFFF",
    colorPrimaryTextHover: "#00A8E0",
    colorPrimaryTextActive: "#0090C0",

    // Success Colors
    colorSuccess: "#22c55e",
    colorSuccessBg: "#dcfce7",
    colorSuccessBorder: "#86efac",

    // Warning Colors
    colorWarning: "#f59e0b",
    colorWarningBg: "#fef3c7",
    colorWarningBorder: "#fcd34d",

    // Error Colors
    colorError: "#ef4444",
    colorErrorBg: "#fee2e2",
    colorErrorBorder: "#fca5a5",

    // Info Colors
    colorInfo: "#3b82f6",
    colorInfoBg: "#dbeafe",
    colorInfoBorder: "#93c5fd",

    // Background Colors
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f0f4f8",
    colorBgSpotlight: "#00BFFF",

    // Text Colors
    colorText: "#1e293b",
    colorTextSecondary: "#64748b",
    colorTextTertiary: "#94a3b8",
    colorTextQuaternary: "#cbd5e1",

    // Border
    colorBorder: "#e2e8f0",
    colorBorderSecondary: "#f1f5f9",
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Font - Smaller sizes for compact look
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 12,
    fontSizeSM: 11,
    fontSizeLG: 13,
    fontSizeHeading1: 24,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    fontSizeHeading5: 12,

    // Sizing - Compact
    controlHeight: 32,
    controlHeightLG: 36,
    controlHeightSM: 24,

    // Line Heights
    lineHeight: 1.5,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.4,

    // Padding - Compact
    padding: 12,
    paddingLG: 16,
    paddingSM: 8,
    paddingXS: 4,

    // Margin
    margin: 12,
    marginLG: 16,
    marginSM: 8,
    marginXS: 4,

    // Shadows
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    boxShadowSecondary: "0 2px 8px rgba(0,0,0,0.06)",
  },
  components: {
    Layout: {
      siderBg: "#1e1e2d",
      headerBg: "#ffffff",
      bodyBg: "#f0f4f8",
    },
    Menu: {
      darkItemBg: "transparent",
      darkSubMenuItemBg: "rgba(0,0,0,0.15)",
      darkItemSelectedBg: "linear-gradient(135deg, #00BFFF 0%, #0090C0 100%)",
      darkItemHoverBg: "rgba(255,255,255,0.06)",
      darkItemColor: "rgba(255,255,255,0.7)",
      darkItemSelectedColor: "#ffffff",
      itemMarginInline: 6,
      itemPaddingInline: 12,
      itemBorderRadius: 6,
      subMenuItemBorderRadius: 6,
      itemHeight: 36,
      fontSize: 12,
    },
    Button: {
      primaryShadow: "0 2px 8px rgba(0, 191, 255, 0.25)",
      defaultBorderColor: "#e2e8f0",
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 36,
      controlHeightSM: 24,
      fontSize: 12,
      fontSizeLG: 13,
      fontSizeSM: 11,
    },
    Card: {
      headerBg: "#ffffff",
      borderRadiusLG: 10,
      paddingLG: 16,
      fontSize: 12,
    },
    Table: {
      headerBg: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
      headerColor: "#475569",
      rowHoverBg: "rgba(0, 191, 255, 0.04)",
      borderColor: "#e2e8f0",
      headerBorderRadius: 6,
      cellPaddingBlock: 10,
      cellPaddingInline: 12,
      cellFontSize: 12,
      headerSplitColor: "#e2e8f0",
      fontSize: 12,
    },
    Input: {
      activeBorderColor: "#00BFFF",
      hoverBorderColor: "#66D9FF",
      borderRadius: 6,
      controlHeight: 32,
      fontSize: 12,
    },
    Select: {
      optionSelectedBg: "#E6F9FF",
      borderRadius: 6,
      controlHeight: 32,
      fontSize: 12,
    },
    Statistic: {
      titleFontSize: 11,
      contentFontSize: 22,
    },
    Tag: {
      borderRadiusSM: 4,
      fontSize: 11,
    },
    Modal: {
      borderRadiusLG: 10,
      fontSize: 12,
    },
    Drawer: {
      borderRadiusLG: 0,
      fontSize: 12,
    },
    Dropdown: {
      borderRadiusLG: 8,
      fontSize: 12,
    },
    Form: {
      labelFontSize: 12,
      fontSize: 12,
      itemMarginBottom: 16,
    },
    Tabs: {
      fontSize: 12,
    },
    Steps: {
      fontSize: 12,
    },
    Descriptions: {
      fontSize: 12,
      labelBg: "#f8fafc",
    },
    DatePicker: {
      controlHeight: 32,
      fontSize: 12,
    },
    InputNumber: {
      controlHeight: 32,
      fontSize: 12,
    },
    Pagination: {
      fontSize: 12,
      itemSize: 28,
      itemSizeSM: 24,
    },
    Badge: {
      fontSize: 10,
    },
    Typography: {
      fontSize: 12,
      titleMarginBottom: 8,
      titleMarginTop: 0,
    },
  },
};

export default theme;
