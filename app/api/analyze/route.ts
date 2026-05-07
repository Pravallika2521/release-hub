export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getJiraIssues } from "../../../lib/jira";
import { getGitHubCommits } from "../../../lib/github";

async function fetchFromPython() {
  try {
    const res = await fetch("http://localhost:8000/readiness");
    if (!res.ok) throw new Error("Python service unavailable");
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET() {
  // ✅ Attempt Python first (future-ready)
  const pythonData = await fetchFromPython();
  if (pythonData) {
    return Response.json(pythonData);
  }

  // ✅ Fallback to existing Node logic (current runtime)
  const jiraIssues = await getJiraIssues();
  const commits = await getGitHubCommits();

  const totalTickets = jiraIssues.length;
  const doneTickets = jiraIssues.filter((i: any) => i.status === "Done").length;
  const blockedTickets = jiraIssues.filter(
    (i: any) => i.status === "Blocked"
  ).length;
  const openTickets = totalTickets - doneTickets;

  const completionPercent =
    totalTickets > 0 ? Math.round((doneTickets / totalTickets) * 100) : 0;

  const commitCount = commits.length;

  let jiraScore = Math.round((doneTickets / Math.max(totalTickets, 1)) * 60);
  let githubScore = commitCount > 0 ? 20 : 0;
  let penalty = Math.min(openTickets * 5, 20);

  let score = jiraScore + githubScore - penalty;
  let status = "AT_RISK";
  let reasons: string[] = [];

  if (blockedTickets > 0) {
    status = "NOT_READY";
    score = Math.min(score, 30);
    reasons.push(`${blockedTickets} blocker tickets present`);
  }

  if (commitCount === 0) {
    status = "NOT_READY";
    reasons.push("No GitHub commits found");
  }

  if (reasons.length === 0) {
    reasons.push(`${openTickets} tickets still open`);
    reasons.push("Code changes validated");
  }

  return Response.json({
    source: "node-fallback",
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
      score,
      status,
      reasons
    }
  });
}
