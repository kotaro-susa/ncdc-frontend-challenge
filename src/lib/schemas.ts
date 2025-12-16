import { z } from "zod";

/**
 * タイトル更新用のバリデーションスキーマ
 */
export const updateTitleSchema = z.object({
  title: z
    .string({ required_error: "タイトルを入力してください" })
    .min(1, "タイトルを入力してください")
    .max(50, "タイトルは50文字以内で入力してください"),
});

/**
 * コンテンツ本文更新用のバリデーションスキーマ
 */
export const updateBodySchema = z.object({
  body: z
    .string({ required_error: "詳細は10文字以上で入力してください" })
    .min(10, "詳細は10文字以上で入力してください")
    .max(2000, "詳細は2000文字以内で入力してください"),
});

export type UpdateTitleInput = z.infer<typeof updateTitleSchema>;
export type UpdateBodyInput = z.infer<typeof updateBodySchema>;
