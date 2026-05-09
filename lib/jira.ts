export async function getJiraIssues() {
  const baseUrl = process.env.JIRA_BASE_URL!;
  const email = process.env.JIRA_EMAIL!;
  const token = process.env.JIRA_API_TOKEN!;
  const projectKey = process.env.JIRA_PROJECT_KEY!;

  const auth = Buffer.from(`${email}:${token}`).toString("base64");

  const jql = `project = ${projectKey}`;

  const url = `${baseUrl}/rest/api/3/search?jql=${encodeURIComponent(
    jql
  )}&maxResults=100`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Jira issues");
  }

  const data = await response.json();

  return data.issues.map((issue: any) => ({
    key: issue.key,
    status: issue.fields.status.name
  }));
}
