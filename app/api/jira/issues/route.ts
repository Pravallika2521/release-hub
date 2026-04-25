export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import axios from "axios";

export async function GET() {
  const response = await axios.get(
    `${process.env.JIRA_BASE_URL}/rest/api/3/search/jql`,
    {
      auth: {
        username: process.env.JIRA_EMAIL!,
        password: process.env.JIRA_API_TOKEN!
      },
      params: {
        jql: `project=${process.env.JIRA_PROJECT_KEY} ORDER BY updated DESC`,
        fields:
          "summary,status,assignee,issuetype,priority,created,updated"
      }
    }
  );

  return Response.json(
    response.data.issues.map((i: any) => ({
      key: i.key,
      summary: i.fields.summary,
      status: i.fields.status.name,
      assignee: i.fields.assignee?.displayName || "Unassigned",
      type: i.fields.issuetype.name,
      priority: i.fields.priority?.name,
      updated: i.fields.updated
    }))
  );
}
