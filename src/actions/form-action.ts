"use server";

import { updateTitleSchema, updateBodySchema } from "@/lib/schemas";
import { HttpError } from "@/lib/api-client";
import { getContent, updateContent } from "./content";

/**
 * タイトルのみを更新するServer Action
 */
export async function updateContentTitle(
  id: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  // FormDataをオブジェクトに変換
  const data = {
    title: formData.get("title") as string,
  };

  // Zodでバリデーション
  const validation = updateTitleSchema.safeParse(data);

  if (!validation.success) {
    // バリデーションエラーの最初のメッセージを返す
    const firstError = validation.error.errors[0];
    return { success: false, error: firstError.message };
  }

  try {
    // 現在のコンテンツを取得
    const currentContent = await getContent(id);

    // タイトルのみ更新
    await updateContent(id, {
      title: validation.data.title.trim(),
      body: currentContent.body || "",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return { success: false, error: "コンテンツが見つかりませんでした" };
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
  // FormDataをオブジェクトに変換
  const data = {
    body: formData.get("body"),
  };

  // Zodでバリデーション
  const validation = updateBodySchema.safeParse(data);

  if (!validation.success) {
    // バリデーションエラーの最初のメッセージを返す
    const firstError = validation.error.errors[0];
    return { success: false, error: firstError.message };
  }

  try {
    // 現在のコンテンツを取得
    const currentContent = await getContent(id);

    // 本文のみ更新
    await updateContent(id, {
      title: currentContent.title || "",
      body: validation.data.body.trim(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return { success: false, error: "コンテンツが見つかりませんでした" };
    }
    return { success: false, error: "本文の更新に失敗しました" };
  }
}
