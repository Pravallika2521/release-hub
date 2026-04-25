import axios from "axios";

export async function getJiraIssues() {
  const allIssues: any[] = [];
  let startAt = 0;
  const maxResults = 50;

  while (true) {
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
          jql: `project=${process.env.JIRA_PROJECT_KEY} ORDER BY created DESC`,
          fields: "summary,status",
          startAt,
          maxResults
        }
      }
    );

    const issues = response.data.issues || [];
    allIssues.push(...issues);

    if (response.data.isLast || issues.length < maxResults) {
      break;
    }

    startAt += maxResults;
  }

  return allIssues.map((issue: any) => ({
    key: issue.key,
    summary: issue.fields.summary,
    status: issue.fields.status.name
  }));
}
