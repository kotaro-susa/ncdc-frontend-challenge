import { useState, useTransition } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import { updateBodySchema } from "@/lib/schemas";
import { updateContentBody } from "@/actions/form-action";
import type { z } from "zod";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 本文編集用フォーム
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: updateBodySchema as z.ZodType,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      body: initialBody,
    },
    async onSubmit(event, { formData }) {
      event.preventDefault();

      startTransition(async () => {
        const result = await updateContentBody(contentId, formData);

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
