"use client";

import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import { useLanguageStore, languages, Language } from "@/store/languageStore";

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, getLanguageInfo } = useLanguageStore();
  const currentLangInfo = getLanguageInfo();

  const menuItems: MenuProps["items"] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 16 }}>{lang.flag}</span>
        <span>{lang.nativeName}</span>
        {lang.code === currentLanguage && (
          <span style={{ marginLeft: "auto", color: "#00BFFF" }}>✓</span>
        )}
      </div>
    ),
    onClick: () => setLanguage(lang.code as Language),
  }));

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          cursor: "pointer",
          padding: "4px 10px",
          borderRadius: 6,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          height: 32,
        }}
      >
        <span style={{ fontSize: 14 }}>{currentLangInfo.flag}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: "#64748b" }}>
          {currentLangInfo.code.toUpperCase()}
        </span>
      </div>
    </Dropdown>
  );
}
