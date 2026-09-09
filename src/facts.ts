// Schéma de facts.json (onboard/SCHEMA.md). Tout est optionnel sauf schema, repo, collected.
import { z } from "zod";

const date = z.union([z.iso.datetime(), z.iso.date()]);
const link = { number: z.number().int(), title: z.string(), url: z.url() };

export const Facts = z.object({
  schema: z.literal(1),
  repo: z.object({
    full_name: z.string(),
    url: z.url(),
    description: z.string().nullable(),
    created_at: date,
    pushed_at: date,
    default_branch: z.string(),
    license: z.string().nullable(),
    stars: z.number().int(),
    forks: z.number().int(),
    open_issues: z.number().int(),
    topics: z.array(z.string()).default([]),
    owner_type: z.enum(["org", "user"]),
    archived: z.boolean().default(false),
  }),
  collected: z.object({ at: date, by: z.string(), lenses: z.array(z.string()).min(1) }),
  languages: z.record(z.string(), z.number().int()).optional(),
  tree: z.array(z.object({ path: z.string(), type: z.enum(["dir", "file"]), role: z.string() })).optional(),
  releases: z.array(z.object({ tag: z.string(), date, name: z.string().nullable() })).optional(),
  activity: z
    .object({
      commits_per_week: z.array(z.object({ week: z.string().regex(/^\d{4}-W\d{2}$/), count: z.number().int() })),
      last_commit: date,
      contributors: z.array(z.object({ login: z.string(), commits: z.number().int() })),
      bus_factor: z.number().int(),
    })
    .optional(),
  entrypoints: z.array(z.object({ path: z.string(), why: z.string() })).optional(),
  build: z
    .object({
      install: z.string().optional(),
      run: z.string().optional(),
      test: z.string().optional(),
      ci: z.array(z.object({ name: z.string(), path: z.string(), triggers: z.array(z.string()) })).optional(),
    })
    .optional(),
  tests: z.object({ dir: z.string().nullable(), framework: z.string().nullable(), files: z.number().int() }).optional(),
  issues: z
    .object({
      open: z.number().int(),
      closed_30d: z.number().int().optional(),
      by_label: z.record(z.string(), z.number().int()).optional(),
      good_first: z.array(z.object(link)).optional(),
      hot: z.array(z.object({ ...link, comments: z.number().int() })).optional(),
    })
    .optional(),
  pulls: z
    .object({
      open: z.number().int(),
      awaiting_review: z.number().int().optional(),
      merged_30d: z.array(z.object({ ...link, merged_at: date })).optional(),
    })
    .optional(),
  deps: z
    .object({
      manifest: z.string().nullable(),
      count: z.number().int(),
      runtime: z.array(z.object({ name: z.string(), version: z.string() })),
    })
    .optional(),
  risks: z
    .array(
      z.object({
        kind: z.enum(["license", "bus_factor", "ci", "deps", "security", "activity"]),
        level: z.enum(["low", "mid", "high"]),
        note: z.string(),
      }),
    )
    .optional(),
  business: z
    .object({
      funding: z.boolean().optional(),
      security_policy: z.boolean().optional(),
      codeowners: z.boolean().optional(),
      competitors: z.array(z.object({ full_name: z.string(), stars: z.number().int(), description: z.string().nullable() })).optional(),
      milestones: z.array(z.object({ title: z.string(), open: z.number().int(), closed: z.number().int(), due: date.nullable() })).optional(),
    })
    .optional(),
});

export type Facts = z.infer<typeof Facts>;
