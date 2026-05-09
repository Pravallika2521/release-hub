import axios from "axios";

export async function getJiraIssues() {
  // ✅ HARD PROOF that function is executed
  console.error("🔥 getJiraIssues() CALLED");

  const issues: any[] = [];
  let startAt = 0;
  const maxResults = 50;

  const baseUrl = process.env.JIRA_BASE_URL!;
  const email = process.env.JIRA_EMAIL!;
  const token = process.env.JIRA_API_TOKEN!;
  const projectKey = process.env.JIRA_PROJECT_KEY!;

  while (true) {
    const response = await axios.get(
      `${baseUrl}/rest/api/3/search`, // ✅ CORRECT ENDPOINT
      {
        auth: {
          username: email,
          password: token
        },
        headers: {
          Accept: "application/json"
        },
        params: {
          jql: `project = ${projectKey} ORDER BY created DESC`,
          fields: "summary,status,created,updated",
          startAt,
          maxResults
        }
      }
    );

    const batch = response.data.issues ?? [];
    issues.push(...batch);

    if (batch.length < maxResults) break;
    startAt += maxResults;
  }

  return issues.map(issue => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name,
    created: issue.fields.created,
    updated: issue.fields.updated
  }));
}
``
