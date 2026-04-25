export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getJiraIssues } from "../../../lib/jira";
import { getGitHubCommits } from "../../../lib/github";

export async function GET() {
  const jiraIssues = await getJiraIssues();
  const commits = await getGitHubCommits();

  const doneCount = jiraIssues.filter(
    (i: any) => i.status === "Done"
  ).length;

  const readinessScore = doneCount * 10;

  return new Response(
    JSON.stringify({
      jiraIssues,
      commits,
      readinessScore,
      serverTime: new Date().toISOString() // DEBUG
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0"
      }
    }
  );
}
