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

/**
 * コンテンツ一覧を取得するServer Action
 */
export async function getContentList(): Promise<Content[]> {
  try {
    const response = await contentControllerGetAllContentList();

    return response.data;
  } catch (error) {
    console.error("Failed to fetch content list:", error);
    throw new Error("コンテンツ一覧の取得に失敗しました");
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
    console.error(`Failed to fetch content ${id}:`, error);
    throw new Error("コンテンツの取得に失敗しました");
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
    console.error("Failed to create content:", error);
    throw new Error("コンテンツの作成に失敗しました");
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
    console.error(`Failed to update content ${id}:`, error);
    throw new Error("コンテンツの更新に失敗しました");
  }
}

/**
 * コンテンツを削除するServer Action
 */
export async function deleteContent(id: number): Promise<void> {
  try {
    await contentControllerDeleteContent(id);
  } catch (error) {
    console.error(`Failed to delete content ${id}:`, error);
    throw new Error("コンテンツの削除に失敗しました");
  }
}
