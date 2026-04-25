import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    JIRA_BASE_URL: process.env.JIRA_BASE_URL ?? "MISSING",
    JIRA_EMAIL: process.env.JIRA_EMAIL ? "SET" : "MISSING",
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ? "SET" : "MISSING",
    JIRA_PROJECT_KEY: process.env.JIRA_PROJECT_KEY ?? "MISSING",
    GITHUB_TOKEN: process.env.GITHUB_TOKEN ? "SET" : "MISSING",
    GITHUB_OWNER: process.env.GITHUB_OWNER ?? "MISSING",
    GITHUB_REPO: process.env.GITHUB_REPO ?? "MISSING"
  });
}
