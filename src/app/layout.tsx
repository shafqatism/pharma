"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import theme from "@/theme/themeConfig";
import { useLanguageStore } from "@/store/languageStore";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentLanguage, getDirection } = useLanguageStore();
  const dir = getDirection();

  return (
    <html lang={currentLanguage} dir={dir}>
      <body>
        <AntdRegistry>
          <ConfigProvider theme={theme} direction={dir}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
