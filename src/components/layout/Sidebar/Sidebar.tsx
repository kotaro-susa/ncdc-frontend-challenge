"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import EditButton from "@/components/common/EditButton";
import NewPageButton from "@/components/common/NewPageButton";
import DoneButton from "@/components/common/DoneButton";
import type { Content } from "@/generated/api.schemas";

interface SidebarProps {
  contentList?: Content[];
  currentId?: number;
}

export default function Sidebar({ contentList = [], currentId }: SidebarProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <SidebarUI
      collapsible="none"
      className="w-70 bg-white border-r border-[#F6F8FA] pt-7.5 flex flex-col"
    >
      <SidebarHeader className="flex flex-row gap-1.5 p-0 mb-5 shrink-0 pl-10">
        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold font-ja">ServiceName</h1>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto pl-10">
        <SidebarMenu className="gap-0">
          {contentList.map((content) => (
            <SidebarMenuItem key={content.id} className="relative">
              <Link href={`/${content.id}`} className="block">
                <SidebarMenuButton
                  isActive={currentId === content.id}
                  className={`
                    h-11
                    font-ja text-base
                    cursor-pointer
                    pr-8
                    ${
                      currentId === content.id
                        ? "bg-bg-light-blue-1 text-brand-light-blue font-bold rounded"
                        : "bg-white text-text-black-80 font-normal hover:bg-gray-50"
                    }
                  `}
                >
                  <span>{content.title || "無題"}</span>
                </SidebarMenuButton>
              </Link>
              {isEditing && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // 削除処理
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70"
                >
                  <Image
                    src="/delete.svg"
                    alt="Delete"
                    width={24}
                    height={24}
                  />
                </button>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div
        className={`h-15 flex items-center pr-2.5 bg-[#F6F8FA] border-t border-[#F6F8FA] shrink-0 ${
          isEditing ? "justify-between pl-10" : "justify-end"
        }`}
      >
        {isEditing ? (
          <>
            <NewPageButton
              onClick={() => {
                /* 新規ページ追加処理 */
              }}
            />
            <DoneButton onClick={() => setIsEditing(false)} />
          </>
        ) : (
          <EditButton onClick={() => setIsEditing(true)} />
        )}
      </div>
    </SidebarUI>
  );
}
