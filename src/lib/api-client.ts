const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

/**
 * カスタムHTTPエラークラス
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public url: string,
    public responseBody?: unknown
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const fullUrl = `${API_BASE_URL}${url}`;

  let response: Response;

  try {
    response = await fetch(fullUrl, options);
  } catch (error) {
    // ネットワークエラー（接続失敗、タイムアウトなど）
    throw new Error(
      `ネットワークエラー: サーバーに接続できませんでした。${error instanceof Error ? error.message : ""}`
    );
  }

  // HTTPステータスコードのチェック
  if (!response.ok) {
    let errorBody: unknown;
    const contentType = response.headers.get("content-type");

    try {
      // エラーレスポンスボディの取得を試みる
      if (contentType?.includes("application/json")) {
        errorBody = await response.json();
      } else {
        errorBody = await response.text();
      }
    } catch {
      // エラーボディの解析に失敗した場合は無視
      errorBody = null;
    }

    throw new HttpError(
      response.status,
      response.statusText,
      fullUrl,
      errorBody
    );
  }

  // 成功レスポンスの処理
  const body =
    [204, 205, 304].includes(response.status) ? null : await response.text();

  let data: unknown;

  if (body) {
    try {
      data = JSON.parse(body);
    } catch (error) {
      throw new Error(
        `レスポンスの解析に失敗しました: ${error instanceof Error ? error.message : "不正なJSON形式"}`
      );
    }
  } else {
    data = {};
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

export default customFetch;
