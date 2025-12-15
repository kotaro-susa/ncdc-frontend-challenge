import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateContentTitle, updateContentBody } from "./form-action";
import { getContent, updateContent } from "./content";
import { HttpError } from "@/lib/api-client";
import type { Content } from "@/generated/api.schemas";

// モック
vi.mock("./content");

// テスト用のContent作成ヘルパー
const createMockContent = (overrides?: Partial<Content>): Content => ({
  id: 1,
  title: "テストタイトル",
  body: "テスト本文",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ...overrides,
});

describe("Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateContentTitle", () => {
    it("正常系: タイトル更新に成功する", async () => {
      const formData = new FormData();
      formData.set("title", "新しいタイトル");

      vi.mocked(getContent).mockResolvedValue(
        createMockContent({ title: "古いタイトル", body: "本文" })
      );
      vi.mocked(updateContent).mockResolvedValue(
        createMockContent({ title: "新しいタイトル", body: "本文" })
      );

      const result = await updateContentTitle(1, formData);

      expect(result.success).toBe(true);
      expect(updateContent).toHaveBeenCalledWith(1, {
        title: "新しいタイトル",
        body: "本文",
      });
    });

    it("異常系: バリデーションエラー", async () => {
      const formData = new FormData();
      formData.set("title", "");

      const result = await updateContentTitle(1, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("タイトルを入力してください");
    });

    it("異常系: 404エラー", async () => {
      const formData = new FormData();
      formData.set("title", "新しいタイトル");

      vi.mocked(getContent).mockRejectedValue(
        new HttpError(404, "Not Found", "/api/content/1")
      );

      const result = await updateContentTitle(1, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("コンテンツが見つかりませんでした");
    });
  });

  describe("updateContentBody", () => {
    it("正常系: 本文更新に成功する", async () => {
      const formData = new FormData();
      formData.set("body", "これは新しい本文です。10文字以上あります。");

      vi.mocked(getContent).mockResolvedValue(
        createMockContent({ title: "タイトル", body: "古い本文" })
      );
      vi.mocked(updateContent).mockResolvedValue(
        createMockContent({
          title: "タイトル",
          body: "これは新しい本文です。10文字以上あります。",
        })
      );

      const result = await updateContentBody(1, formData);

      expect(result.success).toBe(true);
      expect(updateContent).toHaveBeenCalledWith(1, {
        title: "タイトル",
        body: "これは新しい本文です。10文字以上あります。",
      });
    });

    it("異常系: バリデーションエラー", async () => {
      const formData = new FormData();
      formData.set("body", "短い本文");

      const result = await updateContentBody(1, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("詳細は10文字以上で入力してください");
    });

    it("異常系: 404エラー", async () => {
      const formData = new FormData();
      formData.set("body", "これは新しい本文です。10文字以上あります。");

      vi.mocked(getContent).mockRejectedValue(
        new HttpError(404, "Not Found", "/api/content/1")
      );

      const result = await updateContentBody(1, formData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("コンテンツが見つかりませんでした");
    });
  });
});
