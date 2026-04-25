import { NextResponse } from "next/server";

// ✅ Use RELATIVE paths (this fixes your Vercel error)
import { getJiraIssues } from "../../../lib/jira";
import { getGitHubCommits } from "../../../lib/github";

export async function GET() {
  try {
    const jiraIssues = await getJiraIssues();
    const commits = await getGitHubCommits();

    // Simple readiness score logic
    const doneCount = jiraIssues.filter(
      (issue: any) => issue.status === "Done"
    ).length;

    const readinessScore = Math.min(100, doneCount * 10);

    return NextResponse.json({
      jiraIssues,
      commits,
      readinessScore
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
