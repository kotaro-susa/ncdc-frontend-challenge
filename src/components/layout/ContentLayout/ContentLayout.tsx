"use client";

import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Footer from "@/components/layout/Footer/Footer";
import MainContent from "@/components/layout/MainContent/MainContent";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useContentManagement } from "@/hooks/use-content-management";
import type { Content } from "@/generated/api.schemas";

interface ContentLayoutProps {
  contentList: Content[];
  currentId: number;
  title: string;
  body: string;
}

export default function ContentLayout({
  contentList,
  currentId,
  title,
  body,
}: ContentLayoutProps) {
  const { isEditing, handleEditingChange, handleDelete, handleCreateNew } =
    useContentManagement(contentList, currentId);

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <div className="flex w-full h-full">
        <Sidebar
          contentList={contentList}
          currentId={currentId}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
          isEditing={isEditing}
          onEditingChange={handleEditingChange}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <div className="lg:hidden flex items-center px-4 py-3 bg-white border-b border-bg-light-blue-2">
            <SidebarTrigger className="size-10 hover:bg-gray-100 rounded-md" />
          </div>
          <main className="flex-1 p-7.5 bg-bg-light-blue-1 overflow-hidden lg:mt-7.5 lg:mx-10 mt-4 mx-4 rounded-2xl">
            <MainContent contentId={currentId} title={title} content={body} />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
