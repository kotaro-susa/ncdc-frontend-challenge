const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const customFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const fullUrl = `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, options);

  const body =
    [204, 205, 304].includes(response.status) ? null : await response.text();

  const data = body ? JSON.parse(body) : {};

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
};

export default customFetch;
