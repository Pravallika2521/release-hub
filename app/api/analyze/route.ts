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
  } catch (err: any) {
    return NextResponse.json(
      {
        source: err.response?.config?.url?.includes("atlassian")
          ? "JIRA"
          : "GITHUB",
        status: err.response?.status,
        message: err.response?.data || err.message
      },
      { status: 500 }
    );
  }
}
``
