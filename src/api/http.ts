export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  const url = `${import.meta.env.BASE_URL}${clean}`;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}
