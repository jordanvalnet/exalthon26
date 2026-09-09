// Shared shapes. Every collector returns `Collected<T>`: facts + where they came from + what could not be fetched.
export interface Source { what: string; via: string }          // e.g. { what: "README.md", via: "get_file_contents" }
export interface Gap { what: string; reason: string; url?: string }
export interface Collected<T> { facts: T; sources: Source[]; gaps: Gap[] }

export interface RepoRef { owner: string; repo: string }

export interface RepoMetadata extends RepoRef {
  fullName: string; htmlUrl: string; description: string | null; homepage: string | null;
  ownerLogin: string; ownerType: string; ownerUrl: string;
  defaultBranch: string; language: string | null; topics: string[];
  license: { key: string; name: string } | null;
  createdAt: string; pushedAt: string; updatedAt: string;
  stars: number; forks: number; watchers: number; openIssuesAndPrs: number;
  archived: boolean; visibility: string;
  hasWiki: boolean; hasProjects: boolean; hasDiscussions: boolean; hasPages: boolean; hasIssues: boolean;
}

export interface DocSection { file: string; heading: string; level: number; text: string }
export interface DocFile { path: string; text: string }
