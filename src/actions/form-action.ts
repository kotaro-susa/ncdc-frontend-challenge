"use server";

import { updateTitleSchema, updateBodySchema } from "@/lib/schemas";
import { AppError } from "@/lib/errors";
import { getContent, updateContent } from "./content";
import { parseWithZod } from "@conform-to/zod";

/**
 * タイトルのみを更新するServer Action
 */
export async function updateContentTitle(
  id: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const submission = parseWithZod(formData, {
    schema: updateTitleSchema,
  });

  if (submission.status !== "success") {
    // バリデーションエラーの詳細メッセージを取得
    const errors = submission.reply().error;
    const firstErrorMessage = errors?.title?.[0];
    return {
      success: false,
      error: firstErrorMessage || "入力内容に誤りがあります",
    };
  }

  try {
    // 現在のコンテンツを取得
    const currentContent = await getContent(id);

    // タイトルのみ更新
    await updateContent(id, {
      title: submission.value.title.trim(),
      body: currentContent.body || "",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "タイトルの更新に失敗しました" };
  }
}

/**
 * 本文のみを更新するServer Action
 */
export async function updateContentBody(
  id: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const submission = parseWithZod(formData, {
    schema: updateBodySchema,
  });

  if (submission.status !== "success") {
    // バリデーションエラーの詳細メッセージを取得
    const errors = submission.reply().error;
    const firstErrorMessage = errors?.body?.[0];
    return {
      success: false,
      error: firstErrorMessage || "入力内容に誤りがあります",
    };
  }

  try {
    // 現在のコンテンツを取得
    const currentContent = await getContent(id);

    // 本文のみ更新
    await updateContent(id, {
      title: currentContent.title || "",
      body: submission.value.body.trim(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "本文の更新に失敗しました" };
  }
}
