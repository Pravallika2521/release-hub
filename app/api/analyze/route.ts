export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getJiraIssues } from "../../../lib/jira";
import { getGitHubCommits } from "../../../lib/github";

export async function GET() {
  const jiraIssues = await getJiraIssues();
  const commits = await getGitHubCommits();

  /* ---------------- JIRA METRICS ---------------- */

  const totalIssues = jiraIssues.length;
  const doneIssues = jiraIssues.filter(
    (i: any) => i.status === "Done"
  ).length;

  const openIssues = totalIssues - doneIssues;

  // Treat "Blocked" as hard blockers if present
  const blockerIssues = jiraIssues.filter(
    (i: any) =>
      i.status === "Blocked" ||
      i.status === "Blocker"
  ).length;

  const completionRatio =
    totalIssues === 0 ? 0 : doneIssues / totalIssues;

  /* ---------------- GITHUB METRICS ---------------- */

  const totalCommits = commits.length;

  /* ---------------- READINESS GATES ---------------- */

  let readinessScore = 0;
  const failedGates: string[] = [];
  const advisoryRisks: string[] = [];

  /* ✅ Mandatory Gate 1: No blocker tickets */
  if (blockerIssues > 0) {
    failedGates.push(
      `${blockerIssues} blocker Jira ticket(s) open`
    );
  }

  /* ✅ Mandatory Gate 2: Code activity exists */
  if (totalCommits === 0) {
    failedGates.push(
      "No GitHub commits found for this release"
    );
  }

  /* ---------------- SCORING (only if mandatory gates pass) ---------------- */

  if (failedGates.length === 0) {
    // Jira completion contributes up to 60 points
    readinessScore += Math.round(completionRatio * 60);

    // Code activity sanity (up to 20 points)
    if (totalCommits >= doneIssues) {
      readinessScore += 20;
    } else {
      advisoryRisks.push(
        "Code changes may not fully reflect Jira completion"
      );
      readinessScore += 10;
    }

    // Penalize for open issues (up to -20)
    readinessScore -= Math.min(openIssues * 5, 20);
  }

  /* ---------------- FINAL CLASSIFICATION ---------------- */

  let readinessStatus: "READY" | "AT_RISK" | "NOT_READY";

  if (failedGates.length > 0) {
    readinessStatus = "NOT_READY";
    readinessScore = Math.min(readinessScore, 30);
  } else if (readinessScore >= 70) {
    readinessStatus = "READY";
  } else {
    readinessStatus = "AT_RISK";
  }

  /* ---------------- RESPONSE ---------------- */

  return new Response(
    JSON.stringify({
      readinessScore,
      readinessStatus,

      metrics: {
        jira: {
          totalIssues,
          doneIssues,
          openIssues,
          blockerIssues,
          completionRatio: Number(
            (completionRatio * 100).toFixed(1)
          )
        },
        github: {
          totalCommits
        }
      },

      failedGates,
      advisoryRisks,

      jiraIssues,
      commits
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );
}
