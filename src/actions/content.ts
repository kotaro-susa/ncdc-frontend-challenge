"use server";

import {
  contentControllerGetAllContentList,
  contentControllerGetContent,
  contentControllerAddContent,
  contentControllerUpdateContent,
  contentControllerDeleteContent,
} from "@/generated/api";
import type {
  Content,
  CreateContentDTO,
  UpdateContentDTO,
} from "@/generated/api.schemas";
import { HttpError } from "@/lib/api-client";
import { AppError, ERROR_CODES } from "@/lib/errors";

/**
 * 共通のエラーハンドリング関数
 */
function handleApiError(error: unknown, defaultMessage: string): never {
  console.error(`API Error: ${defaultMessage}`, error);

  if (error instanceof HttpError) {
    if (error.status === 404) {
      throw new AppError(
        "コンテンツが見つかりませんでした",
        ERROR_CODES.NOT_FOUND,
        404,
        error
      );
    }
    if (error.status === 400 || error.status === 422) {
      throw new AppError(
        "入力内容に誤りがあります",
        ERROR_CODES.VALIDATION_ERROR,
        error.status,
        error
      );
    }
    throw new AppError(
      `${defaultMessage} (Status: ${error.status})`,
      ERROR_CODES.NETWORK,
      error.status,
      error
    );
  }

  if (error instanceof AppError) {
    throw error;
  }

  throw new AppError(defaultMessage, ERROR_CODES.UNEXPECTED, 500, error);
}

/**
 * コンテンツ一覧を取得するServer Action
 */
export async function getContentList(): Promise<Content[]> {
  try {
    const response = await contentControllerGetAllContentList();
    return response.data;
  } catch (error) {
    handleApiError(error, "コンテンツ一覧の取得に失敗しました");
  }
}

/**
 * 個別のコンテンツを取得するServer Action
 */
export async function getContent(id: number): Promise<Content> {
  try {
    const response = await contentControllerGetContent(id);
    return response.data;
  } catch (error) {
    handleApiError(error, "コンテンツの取得に失敗しました");
  }
}

/**
 * コンテンツを作成するServer Action
 */
export async function createContent(data: CreateContentDTO): Promise<Content> {
  try {
    const response = await contentControllerAddContent(data);
    return response.data;
  } catch (error) {
    handleApiError(error, "コンテンツの作成に失敗しました");
  }
}

/**
 * コンテンツを更新するServer Action
 */
export async function updateContent(
  id: number,
  data: UpdateContentDTO
): Promise<Content> {
  try {
    const response = await contentControllerUpdateContent(id, data);
    return response.data;
  } catch (error) {
    handleApiError(error, "コンテンツの更新に失敗しました");
  }
}

/**
 * コンテンツを削除するServer Action
 */
export async function deleteContent(id: number): Promise<void> {
  try {
    await contentControllerDeleteContent(id);
  } catch (error) {
    handleApiError(error, "コンテンツの削除に失敗しました");
  }
}
