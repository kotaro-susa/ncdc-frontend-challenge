import { updateBodySchema } from "@/lib/schemas";
import { updateContentBody } from "@/actions/form-action";
import { useContentFieldEditor } from "./use-content-field-editor";

/**
 * 本文編集のためのカスタムフック
 *
 * 責務:
 * - 本文の編集状態管理
 * - フォームバリデーション
 * - 本文更新のServer Action呼び出し
 * - 編集モードの切り替え
 */
export function useBodyEditor(contentId: number, initialBody: string) {
  return useContentFieldEditor({
    contentId,
    defaultValue: {
      body: initialBody,
    },
    schema: updateBodySchema,
    updateAction: updateContentBody,
  });
}
