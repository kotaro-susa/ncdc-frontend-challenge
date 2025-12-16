import { useState, useTransition } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { z } from "zod";

interface UseContentFieldEditorOptions<Schema extends z.ZodType> {
  contentId: number;
  defaultValue: Record<string, string | null | undefined>;
  schema: Schema;
  updateAction: (
    id: number,
    formData: FormData
  ) => Promise<{ success: boolean; error?: string }>;
  onEditingChange?: (editing: boolean) => void;
}

/**
 * コンテンツフィールド編集のための汎用カスタムフック
 *
 * 責務:
 * - 編集モードの状態管理
 * - フォームバリデーション
 * - 更新Actionの呼び出しと結果ハンドリング
 * - 楽観的UI更新
 */
export function useContentFieldEditor<Schema extends z.ZodType>({
  contentId,
  defaultValue,
  schema,
  updateAction,
  onEditingChange,
}: UseContentFieldEditorOptions<Schema>) {
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useState(defaultValue);
  const router = useRouter();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue,
    async onSubmit(event, { formData }) {
      event.preventDefault();

      // 楽観的更新: フォームデータから新しい値を取得
      const newValue: Record<string, string | null | undefined> = {};
      formData.forEach((value, key) => {
        newValue[key] = value.toString();
      });

      startTransition(async () => {
        // 即座にUIを更新
        setOptimisticValue(newValue);
        onEditingChange?.(false);

        const result = await updateAction(contentId, formData);
        if (result.success) {
          router.refresh();
        } else {
          // エラー時は元の値に戻す
          setOptimisticValue(defaultValue);
          onEditingChange?.(true);
          console.error(result.error);
          toast.error(result.error || "エラーが発生しました");
        }
      });
    },
  });

  return {
    isPending,
    form,
    fields,
    optimisticValue,
  };
}
