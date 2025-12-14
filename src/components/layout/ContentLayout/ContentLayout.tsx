"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Footer from "@/components/layout/Footer/Footer";
import MainContent from "@/components/layout/MainContent/MainContent";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { deleteContent } from "@/actions/content";
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
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteContent(id);

      // 削除後のリダイレクト処理
      if (id === currentId) {
        // 現在表示中のコンテンツを削除した場合
        const remainingContents = contentList.filter((c) => c.id !== id);
        if (remainingContents.length > 0) {
          router.push(`/${remainingContents[0].id}`);
        } else {
          router.push("/");
        }
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <div className="flex w-full h-full">
        <Sidebar
          contentList={contentList}
          currentId={currentId}
          onDelete={handleDelete}
        />
        <SidebarInset className="flex-1 flex flex-col">
          <main className="flex-1 p-7.5 bg-[#F5F8FA] overflow-hidden mt-7.5 mx-10 rounded-2xl">
            <MainContent title={title} content={body} />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
