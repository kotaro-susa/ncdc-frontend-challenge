import { updateTitleSchema } from "@/lib/schemas";
import { updateContentTitle } from "@/actions/form-action";
import { useContentFieldEditor } from "./use-content-field-editor";

/**
 * タイトル編集のためのカスタムフック
 *
 * 責務:
 * - タイトルの編集状態管理
 * - フォームバリデーション
 * - タイトル更新のServer Action呼び出し
 * - 編集モードの切り替え
 */
export function useTitleEditor(
  contentId: number,
  initialTitle: string,
  onEditingChange?: (editing: boolean) => void
) {
  return useContentFieldEditor({
    contentId,
    defaultValue: {
      title: initialTitle,
    },
    schema: updateTitleSchema,
    updateAction: updateContentTitle,
    onEditingChange,
  });
}
