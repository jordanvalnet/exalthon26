// Appels à l'API GitHub REST. Le token vient de GITHUB_PAT (bun charge .env tout seul).
const API = "https://api.github.com";

export async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.GITHUB_PAT;
  if (!token) throw new Error("GITHUB_PAT manquant : copier .env.example en .env et y coller le token");
  const res = await fetch(API + path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "exalthon26",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status} sur ${path}`);
  return res.json() as Promise<T>;
}

export async function whoami(): Promise<string> {
  const user = await gh<{ login: string }>("/user");
  return user.login;
}
