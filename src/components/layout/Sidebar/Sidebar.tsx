"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { sidebarNavData } from "./sidebarNavData";

export default function Sidebar() {
  const [activeId, setActiveId] = useState<string>("1");

  return (
    <SidebarUI
      collapsible="none"
      className="bg-white border-r border-[#F6F8FA]"
    >
      <SidebarHeader className="flex flex-row gap-1.5 p-0 mb-5">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold font-ja">ServiceName</h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {sidebarNavData.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeId === item.id}
                onClick={() => setActiveId(item.id)}
                className={`
                  h-11
                  font-ja text-base
                  ${
                    activeId === item.id
                      ? "bg-[#F5F8FA] text-[#32A8F8] font-bold rounded"
                      : "bg-white text-text-black-80 font-normal hover:bg-gray-50"
                  }
                `}
              >
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarUI>
  );
}
