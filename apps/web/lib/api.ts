const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export type Tick = {
  id: string;
  response_time_ms: number;
  status: "Up" | "Down" | "Unknown";
  createdAt: string;
};

export type Website = {
  id: string;
  url: string;
  user_id: string;
  time_added: string;
  ticks: Tick[];
};

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = token;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    if (res.status === 403) message = "Incorrect username or password.";
    if (res.status === 411) message = "A URL is required.";
    if (res.status === 409) message = "That site could not be found.";
    throw new ApiError(res.status, message);
  }

  // Some routes (signup/signin failures) return empty bodies on error,
  // and success bodies are always JSON here.
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}

export const api = {
  signup: (username: string, password: string) =>
    request<{ id: string }>("/user/signup", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  signin: (username: string, password: string) =>
    request<{ jwt: string }>("/user/signin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getWebsites: (token: string) =>
    request<{ websites: Website[] }>("/websites", {}, token),

  getWebsiteStatus: (token: string, websiteId: string) =>
    request<Website>(`/status/${websiteId}`, {}, token),

  addWebsite: (token: string, url: string) =>
    request<{ id: string }>(
      "/website",
      { method: "POST", body: JSON.stringify({ url }) },
      token
    ),
};

export { ApiError };
