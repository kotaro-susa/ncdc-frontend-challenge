import { useState, useTransition } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import { updateTitleSchema } from "@/lib/schemas";
import { updateContentTitle } from "@/actions/form-action";
import type { z } from "zod";

/**
 * タイトル編集のためのカスタムフック
 *
 * 責務:
 * - タイトルの編集状態管理
 * - フォームバリデーション
 * - タイトル更新のServer Action呼び出し
 * - 編集モードの切り替え
 */
export function useTitleEditor(contentId: number, initialTitle: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // タイトル編集用フォーム
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateTitleSchema as z.ZodType,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      title: initialTitle,
    },
    async onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(async () => {
        const result = await updateContentTitle(contentId, formData);

        if (result.success) {
          setIsEditing(false);
          router.refresh();
        } else {
          console.error(result.error);
          // TODO: エラー通知の実装（トースト等）
        }
      });
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return {
    isEditing,
    isPending,
    form,
    fields,
    handlers: {
      onEdit: handleEdit,
      onCancel: handleCancel,
    },
  };
}
