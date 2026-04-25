import axios from "axios";

export async function getJiraIssues() {
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
        jql: `project=${process.env.JIRA_PROJECT_KEY} ORDER BY updated DESC`,
        fields: "summary,status",
        maxResults: 20
      }
    }
  );

  return response.data.issues.map((issue: any) => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name
  }));
}
