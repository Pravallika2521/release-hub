import axios from "axios";

export async function getJiraIssues() {
  const issues: any[] = [];
  let startAt = 0;
  const maxResults = 50;

  while (true) {
    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/api/3/search/jql`,
      {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache"
        },
        auth: {
          username: process.env.JIRA_EMAIL!,
          password: process.env.JIRA_API_TOKEN!
        },
        params: {
          jql: `
            project = ${process.env.JIRA_PROJECT_KEY}
            ORDER BY created DESC
          `,
          fields: "summary,status,created,updated",
          startAt,
          maxResults
        }
      }
    );

    const batch = response.data.issues || [];
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
