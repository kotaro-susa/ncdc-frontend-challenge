"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Footer from "@/components/layout/Footer/Footer";
import MainContent from "@/components/layout/MainContent/MainContent";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { deleteContent, createContent } from "@/actions/content";
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
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  const handleEditingChange = (editing: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (editing) {
      params.set("edit", "true");
    } else {
      params.delete("edit");
    }
    router.push(`/${currentId}?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteContent(id);

      // 削除後のリダイレクト処理
      if (id === currentId) {
        // 現在表示中のコンテンツを削除した場合
        const currentIndex = contentList.findIndex((c) => c.id === id);
        const remainingContents = contentList.filter((c) => c.id !== id);

        if (remainingContents.length > 0) {
          // 一つ上のコンテンツに移動（現在のインデックスが0なら次のコンテンツ）
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          const nextContent = remainingContents[nextIndex];

          const params = new URLSearchParams();
          if (isEditing) {
            params.set("edit", "true");
          }
          router.push(`/${nextContent.id}?${params.toString()}`);
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

  const handleCreateNew = async () => {
    try {
      const newContent = await createContent({
        title: "無題",
        body: "",
      });

      // 新規作成したコンテンツのページに遷移（編集モードを維持）
      const params = new URLSearchParams();
      if (isEditing) {
        params.set("edit", "true");
      }
      router.push(`/${newContent.id}?${params.toString()}`);
    } catch (error) {
      console.error("Failed to create content:", error);
    }
  };

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
          <main className="flex-1 p-7.5 bg-[#F5F8FA] overflow-hidden mt-7.5 mx-10 rounded-2xl">
            <MainContent contentId={currentId} title={title} content={body} />
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
