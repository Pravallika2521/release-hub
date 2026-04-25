export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import axios from "axios";

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  const res = await axios.get(
    `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${params.key}`,
    {
      auth: {
        username: process.env.JIRA_EMAIL!,
        password: process.env.JIRA_API_TOKEN!
      },
      params: {
        fields:
          "summary,description,status,assignee,subtasks,comment,attachment,created,updated"
      }
    }
  );

  const f = res.data.fields;

  return Response.json({
    key: res.data.key,
    summary: f.summary,
    status: f.status.name,
    assignee: f.assignee?.displayName,
    description: f.description,
    subtasks: f.subtasks,
    comments: f.comment.comments,
    attachments: f.attachment
  });
}
