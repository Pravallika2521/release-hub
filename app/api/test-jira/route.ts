import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/api/3/search/jql`,
      {
        headers: {
          Accept: "application/json"
        },
        auth: {
          username: process.env.JIRA_EMAIL!,
          password: process.env.JIRA_API_TOKEN!
        },
        params: {
          jql: `project=${process.env.JIRA_PROJECT_KEY}`,
          fields: "summary,status",
          maxResults: 5
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (err: any) {
    return NextResponse.json(
      {
        source: "JIRA",
        status: err.response?.status,
        message: err.response?.data || err.message
      },
      { status: 500 }
    );
  }
}
