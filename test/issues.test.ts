import { describe, expect, test } from "bun:test";
import { buildIssuesPart } from "../src/collect/issues.ts";

const DAY = 86_400_000;
const now = Date.parse("2026-09-09T12:00:00Z");
const issue = (number: number, comments: number, labels: string[]) => ({
  number, title: `Issue ${number}`, state: "open", author: "a", labels, createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-09-01T00:00:00Z", comments,
});
const pr = (number: number, mergedAt: string | null) => ({
  number, title: `PR ${number}`, status: mergedAt ? ("merged" as const) : ("open" as const), author: "b", createdAt: "2026-08-01T00:00:00Z", mergedAt, url: `https://github.com/o/r/pull/${number}`,
});

describe("buildIssuesPart", () => {
  test("classe, filtre et compte sans réseau", () => {
    const open = [issue(1, 2, ["bug"]), issue(2, 9, ["enhancement", "good first issue"]), issue(3, 5, ["enhancement"])];
    const prs = [pr(10, new Date(now - 3 * DAY).toISOString()), pr(11, new Date(now - 60 * DAY).toISOString()), pr(12, null)];
    const part = buildIssuesPart("https://github.com/o/r", open, prs, [], { open_issues: 3, closed_30d: 1, open_prs: 1 }, now);
    expect(part.issues?.hot?.map((i) => i.number)).toEqual([2, 3, 1]);
    expect(part.issues?.by_label).toEqual({ enhancement: 2, bug: 1, "good first issue": 1 });
    expect(part.issues?.good_first).toEqual([{ number: 2, title: "Issue 2", url: "https://github.com/o/r/issues/2" }]);
    expect(part.pulls?.merged_30d?.map((p) => p.number)).toEqual([10]);
    expect(part.roadmap?.requests?.map((i) => i.number)).toEqual([2, 3]);
    expect(part.roadmap?.themes).toEqual([{ label: "enhancement", count: 2 }]);
  });
});
