import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    urlBeingCalled: `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/commits`,
    GITHUB_OWNER: process.env.GITHUB_OWNER || "MISSING",
    GITHUB_REPO: process.env.GITHUB_REPO || "MISSING"
  });
}
