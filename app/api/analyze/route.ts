import { NextResponse } from "next/server";
import { getJiraIssues } from "@/lib/jira";
import { getGitHubCommits } from "@/lib/github";

export async function GET() {
  const jira = await getJiraIssues();
  const commits = await getGitHubCommits();

  const doneCount = jira.filter(i => i.status === "Done").length;
  const readinessScore = Math.min(100, doneCount * 10);

  return NextResponse.json({
    jira,
    commits,
    readinessScore
  });
}
