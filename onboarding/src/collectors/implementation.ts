// Single responsibility: HOW it is built, at low resolution — folders, descriptors, delivery and quality signals. No code reading.
import type { GitHubMcp } from "../github/GitHubMcp.ts";
import type { Collected, RepoMetadata } from "../types.ts";

export interface Implementation {
  language: string | null; topics: string[];
  fileExtensions: Array<{ ext: string; files: number }>;   // from the folders listed (2 levels), to cross-check `language`
  topLevel: Array<{ name: string; type: string }>;
  mainFolders: Array<{ name: string; entries: string[] }>;
  descriptors: Array<{ file: string; name?: string; description?: string; kind: string }>;
  delivery: { releases: number; latestRelease: { tag: string; date: string } | null; tags: number; branches: number; hasDockerfile: boolean; hasCompose: boolean; workflows: string[] };
  quality: { tests: boolean; contributing: boolean; codeOfConduct: boolean; security: boolean; license: boolean; changelog: boolean; docsFolder: boolean };
}

const MAIN_FOLDERS = ["src", "app", "apps", "lib", "packages", "docs", "web", "frontend", "backend", "api", "server", "client", "mobile", "infra", "tests", "test", "cmd", "internal", "pkg"];
const DESCRIPTORS: Array<[string, string]> = [["package.json", "Node.js / JavaScript"], ["pyproject.toml", "Python"], ["setup.py", "Python"], ["requirements.txt", "Python"], ["pom.xml", "Java (Maven)"], ["build.gradle", "Java/Kotlin (Gradle)"], ["build.gradle.kts", "Kotlin (Gradle)"], ["go.mod", "Go"], ["Cargo.toml", "Rust"], ["CMakeLists.txt", "C/C++"], ["Gemfile", "Ruby"], ["composer.json", "PHP"], ["pubspec.yaml", "Dart/Flutter"], ["Package.swift", "Swift"]];

export async function collectImplementation(gh: GitHubMcp, meta: RepoMetadata): Promise<Collected<Implementation>> {
  const sources = [], gaps = [];
  const root = (await gh.listDirectory(meta.owner, meta.repo, "/")) ?? [];
  sources.push({ what: "root directory", via: "get_file_contents" });
  const names = new Set(root.map((e) => e.name));
  const has = (re: RegExp) => root.some((e) => re.test(e.name));

  const mainFolders = [];
  for (const f of MAIN_FOLDERS.filter((f) => names.has(f)).slice(0, 6)) {
    const entries = (await gh.listDirectory(meta.owner, meta.repo, f)) ?? [];
    mainFolders.push({ name: f, entries: entries.map((e) => e.name + (e.type === "dir" ? "/" : "")).slice(0, 40) });
    sources.push({ what: `folder ${f}/`, via: "get_file_contents" });
  }

  const descriptors = [];
  for (const [file, kind] of DESCRIPTORS.filter(([f]) => names.has(f))) {
    const text = await gh.getFileText(meta.owner, meta.repo, file);
    if (text == null) continue;
    sources.push({ what: file, via: "get_file_contents" });
    descriptors.push({ file, kind, ...describe(file, text) });
  }
  const csproj = root.find((e) => /\.csproj$/.test(e.name));
  if (csproj) descriptors.push({ file: csproj.name, kind: "C# (.NET)" });

  let workflows: string[] = [];
  const wf = await gh.listDirectory(meta.owner, meta.repo, ".github/workflows");
  if (wf) { workflows = wf.map((e) => e.name); sources.push({ what: ".github/workflows", via: "get_file_contents" }); }

  let releases: any[] = [], tags: any[] = [], branches: any[] = [];
  try { releases = await gh.listReleases(meta.owner, meta.repo, 100); sources.push({ what: "releases", via: "list_releases" }); } catch (e) { gaps.push({ what: "releases", reason: String(e).slice(0, 100) }); }
  try { tags = await gh.listTags(meta.owner, meta.repo, 100); } catch {}
  try { branches = await gh.listBranches(meta.owner, meta.repo, 100); } catch {}

  return {
    facts: {
      language: meta.language, topics: meta.topics,
      fileExtensions: extensionMix([...root.map((e) => e.name), ...mainFolders.flatMap((d) => d.entries)]),
      topLevel: root.map((e) => ({ name: e.name, type: e.type })),
      mainFolders, descriptors,
      delivery: {
        releases: releases.length, latestRelease: releases[0] ? { tag: releases[0].tag_name, date: releases[0].published_at } : null,
        tags: tags.length, branches: branches.length, hasDockerfile: has(/^Dockerfile/i), hasCompose: has(/^(docker-)?compose\.ya?ml$/i), workflows,
      },
      quality: {
        tests: has(/^(tests?|__tests__|spec)$/i), contributing: has(/^CONTRIBUTING/i), codeOfConduct: has(/^CODE_OF_CONDUCT/i),
        security: has(/^SECURITY/i), license: has(/^LICENSE|^COPYING/i), changelog: has(/^CHANGELOG|^HISTORY/i), docsFolder: names.has("docs") || names.has("doc"),
      },
    },
    sources, gaps,
  };
}

function extensionMix(names: string[]): Array<{ ext: string; files: number }> {
  const counts = new Map<string, number>();
  for (const n of names) { const m = /\.([a-z0-9]+)$/i.exec(n); if (m && !n.endsWith("/")) counts.set(m[1].toLowerCase(), (counts.get(m[1].toLowerCase()) ?? 0) + 1); }
  return [...counts].map(([ext, files]) => ({ ext, files })).sort((a, b) => b.files - a.files).slice(0, 8);
}

function describe(file: string, text: string): { name?: string; description?: string } {
  try {
    if (file === "package.json" || file === "composer.json") { const j = JSON.parse(text); return { name: j.name, description: j.description }; }
  } catch {}
  const name = text.match(/^\s*name\s*=\s*["']([^"']+)/m)?.[1] ?? text.match(/<name>([^<]+)<\/name>/)?.[1] ?? text.match(/^module\s+(\S+)/m)?.[1];
  const description = text.match(/^\s*description\s*=\s*["']([^"']+)/m)?.[1] ?? text.match(/<description>([^<]+)<\/description>/)?.[1];
  return { name, description };
}
