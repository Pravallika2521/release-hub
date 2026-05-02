export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getJiraIssues } from "../../../lib/jira";
import { getGitHubCommits } from "../../../lib/github";

export async function GET() {
  const jiraIssues = await getJiraIssues();
  const commits = await getGitHubCommits();

  /* ---------------- JIRA METRICS ---------------- */

  const totalTickets = jiraIssues.length;

  const doneTickets = jiraIssues.filter(
    (i: any) => i.status === "Done"
  ).length;

  const blockedTickets = jiraIssues.filter(
    (i: any) =>
      i.status === "Blocked" ||
      i.status === "Blocker"
  ).length;

  const openTickets = totalTickets - doneTickets;

  const completionPercent =
    totalTickets === 0
      ? 0
      : Math.round((doneTickets / totalTickets) * 100);

  /* ---------------- GITHUB METRICS ---------------- */

  const commitCount = commits.length;

  /* ---------------- READINESS GATES ---------------- */

  let readinessStatus: "READY" | "AT_RISK" | "NOT_READY";
  let reasons: string[] = [];

  if (blockedTickets > 0) {
    readinessStatus = "NOT_READY";
    reasons.push(`${blockedTickets} blocker ticket(s) open`);
  } else if (commitCount === 0) {
    readinessStatus = "NOT_READY";
    reasons.push("No GitHub commits found");
  } else {
    readinessStatus = "AT_RISK";
  }

  /* ---------------- SCORE CALCULATION ---------------- */

  let jiraScore = Math.round((doneTickets / Math.max(totalTickets, 1)) * 60);
  let githubScore = commitCount > 0 ? 20 : 0;
  let openPenalty = Math.min(openTickets * 5, 20);

  let readinessScore = jiraScore + githubScore - openPenalty;

  if (blockedTickets > 0) {
    readinessScore = Math.min(readinessScore, 30);
  }

  if (readinessScore >= 70 && blockedTickets === 0) {
    readinessStatus = "READY";
  }

  if (reasons.length === 0) {
    if (openTickets > 0) {
      reasons.push(`${openTickets} tickets still open`);
    }
    reasons.push("Code changes validated via GitHub");
  }

  /* ---------------- RESPONSE ---------------- */

  return new Response(
    JSON.stringify({
      jiraMetrics: {
        totalTickets,
        doneTickets,
        openTickets,
        blockedTickets,
        completionPercent
      },
      githubMetrics: {
        commitCount
      },
      readiness: {
        score: readinessScore,
        status: readinessStatus,
        reasons
      }
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
}
``
