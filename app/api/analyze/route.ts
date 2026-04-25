import { NextResponse } from "next/server";
import { getJiraIssues } from "../../../lib/jira";
import { getGitHubCommits } from "../../../lib/github";

export async function GET() {
  try {
    const jiraIssues = await getJiraIssues();
    const commits = await getGitHubCommits();

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
      { error: error.message || "Release analysis failed" },
      { status: 500 }
    );
  }
}
``
