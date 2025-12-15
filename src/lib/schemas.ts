import { z } from "zod";

/**
 * タイトル更新用のバリデーションスキーマ
 */
export const updateTitleSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください"),
});

/**
 * コンテンツ本文更新用のバリデーションスキーマ
 */
export const updateBodySchema = z.object({
  body: z
    .string()
    .min(1, "本文を入力してください")
    .max(10000, "本文は10000文字以内で入力してください"),
});

export type UpdateTitleInput = z.infer<typeof updateTitleSchema>;
export type UpdateBodyInput = z.infer<typeof updateBodySchema>;
