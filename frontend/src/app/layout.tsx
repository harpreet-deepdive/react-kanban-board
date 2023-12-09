"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SidebarContext } from "@/shared/context/sidebarContext";
import useSidebar from "@/shared/hooks/useSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expanded, setExpanded } = useSidebar();

  return (
    <html lang="en">
      <SidebarContext.Provider
        value={{
          expanded: expanded,
          setExpanded: setExpanded,
        }}
      >
        <body className={inter.className}>{children}</body>
      </SidebarContext.Provider>
    </html>
  );
}
