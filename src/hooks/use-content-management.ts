import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteContent, createContent } from "@/actions/content";
import type { Content } from "@/generated/api.schemas";

/**
 * コンテンツ管理のためのカスタムフック
 *
 * 責務:
 * - コンテンツの削除処理とリダイレクト
 * - 新規コンテンツの作成と遷移
 * - 編集モードの状態管理
 * - URLクエリパラメータの操作
 */
export function useContentManagement(
  contentList: Content[],
  currentId: number
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";

  /**
   * 編集モードの切り替え
   */
  const handleEditingChange = useCallback(
    (editing: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (editing) {
        params.set("edit", "true");
      } else {
        params.delete("edit");
      }
      router.push(`/${currentId}?${params.toString()}`);
    },
    [currentId, router, searchParams]
  );

  /**
   * コンテンツの削除処理
   *
   * - 現在表示中のコンテンツを削除した場合は適切にリダイレクト
   * - 他のコンテンツを削除した場合はページをリフレッシュ
   */
  const handleDelete = useCallback(
    async (id: number) => {
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
        alert("コンテンツの削除に失敗しました");
      }
    },
    [contentList, currentId, isEditing, router]
  );

  /**
   * 新規コンテンツの作成処理
   *
   * - デフォルトのタイトルと本文で新規作成
   * - 作成後、そのコンテンツのページに遷移
   * - 編集モードを維持
   */
  const handleCreateNew = useCallback(async () => {
    try {
      const newContent = await createContent({
        title: "無題",
        body: "これはダミーデータです",
      });

      // 新規作成したコンテンツのページに遷移（編集モードを維持）
      const params = new URLSearchParams();
      if (isEditing) {
        params.set("edit", "true");
      }
      router.push(`/${newContent.id}?${params.toString()}`);
    } catch (error) {
      console.error("Failed to create content:", error);
      alert("コンテンツの作成に失敗しました");
    }
  }, [isEditing, router]);

  return {
    isEditing,
    handleEditingChange,
    handleDelete,
    handleCreateNew,
  };
}
